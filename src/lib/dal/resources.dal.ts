import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IResourcesDAL } from "../di/interfaces/dal.interfaces";
import { PreviewResource } from "../database/database.types";
import { BasicResource, CreateResourceParams, SimpleResource } from "@/services/interfaces/service.interfaces";
import { RESOURCE_TYPES } from "../constants/database-constants";

function formatIntervalToDuration(interval: string | null): string | undefined {
  if (!interval) return undefined;

  // PostgreSQL interval is already in HH:MM:SS format
  // Just return it as is, but ensure it's properly formatted
  const match = interval.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (match) {
    return interval;
  }

  // If for some reason it's not in the correct format, try to parse and format it
  const totalSeconds = Math.floor(new Date(interval).getTime() / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export class ResourcesDAL implements IResourcesDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getResourcesByCourseId(courseId: string): Promise<PreviewResource[]> {
    if (!courseId) return [];

    const { data, error } = await this.supabase
      .from("resources")
      .select(
        "id, name, short_summary, type, course_id, order_index, duration, created_at, updated_at"
      )
      .eq("course_id", courseId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Error fetching resources: ${error.message}`);
    }

    if (!data) return [];

    return data.map((resource: PreviewResource) => ({
      ...resource,
      duration: formatIntervalToDuration(resource.duration || null),
    }));
  }

  async getResourceMaterialsByCourseId(
    courseId: string,
    userId?: string
  ): Promise<BasicResource[]> {
    if (!courseId) return [];

    const query = this.supabase
      .from("resources")
      .select(
        `
        *,
        user_resources (
          completed,
          user_id
        )
      `
      )
      .eq("course_id", courseId);

    const { data, error } = await query
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Error fetching basic resources: ${error.message}`);
    }

    if (!data) return [];

    return data.map((resource) => ({
      ...resource,
      duration: formatIntervalToDuration(resource.duration || null),
      completed:
        resource.user_resources?.find(
          (ur: { user_id: string; completed: boolean }) => ur.user_id === userId
        )?.completed ?? false,
    }));
  }

  async getNextResourceToComplete(
    courseId: string,
    userId: string
  ): Promise<string | null> {
    if (!courseId || !userId) {
      throw new Error("Course ID and User ID are required");
    }

    // Get all resources for the course with completion status
    const { data, error } = await this.supabase
      .from("resources")
      .select(
        `
        id,
        order_index,
        user_resources (
          completed,
          user_id
        )
      `
      )
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (error) {
      throw new Error(
        `Error fetching resources for next completion: ${error.message}`
      );
    }

    if (!data || data.length === 0) return null;

    // Find the first resource that is not completed
    const nextResource = data.find((resource) => {
      const isCompleted =
        resource.user_resources?.find(
          (ur: { user_id: string; completed: boolean }) => ur.user_id === userId
        )?.completed ?? false;
      return !isCompleted;
    });

    return nextResource?.id || null;
  }

  async toggleResourceCompletion(
    userId: string,
    resourceId: string
  ): Promise<boolean> {
    if (!userId || !resourceId) {
      throw new Error("User ID and Resource ID are required");
    }

    const { data: existingRecord, error: fetchError } = await this.supabase
      .from("user_resources")
      .select("completed")
      .eq("user_id", userId)
      .eq("resource_id", resourceId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the error code for no rows returned
      throw new Error(
        `Error fetching user resource completion: ${fetchError.message}`
      );
    }

    const newCompletionStatus = !existingRecord?.completed;

    const { data, error } = await this.supabase
      .from("user_resources")
      .upsert(
        {
          user_id: userId,
          resource_id: resourceId,
          completed: newCompletionStatus,
        },
        { onConflict: "user_id,resource_id" }
      )
      .select("completed")
      .single();

    if (error) {
      throw new Error(`Error updating resource completion: ${error.message}`);
    }

    return data?.completed ?? false;
  }

  async getResourceCompletionStatus(
    userId: string,
    resourceId: string
  ): Promise<boolean> {
    if (!userId || !resourceId) {
      throw new Error("User ID and Resource ID are required");
    }

    const { data, error } = await this.supabase
      .from("user_resources")
      .select("completed")
      .eq("user_id", userId)
      .eq("resource_id", resourceId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(
        `Error fetching resource completion status: ${error.message}`
      );
    }

    return data?.completed ?? false;
  }

  async createResource(params: CreateResourceParams): Promise<SimpleResource> {
    const { name, short_summary, type, course_id, url, file, order_index, duration } = params;

    // First create the resource record
    const { data: resource, error: resourceError } = await this.supabase
      .from("resources")
      .insert({
        name,
        short_summary,
        type,
        course_id,
        url: type === RESOURCE_TYPES.VIDEO ? url : "",
        order_index,
        duration,
      })
      .select()
      .single();

    if (resourceError) {
      throw new Error(`Error creating resource: ${resourceError.message}`);
    }

    if (!resource) {
      throw new Error("Failed to create resource");
    }

    // If it's a downloadable file, upload it to storage
    if (type === RESOURCE_TYPES.DOWNLOADABLE_FILE && file) {
      const filePath = `${course_id}/${resource.id}`;

      const { data: uploadedResourceData, error: uploadError } = await this.supabase.storage
        .from("course-resources")
        .upload(filePath, file);

      if (uploadError) {
        // If file upload fails, delete the resource record
        await this.supabase.from("resources").delete().eq("id", resource.id);
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }

      // Update the resource with the file URL
      const { data: updatedResource, error: updateError } = await this.supabase
        .from("resources")
        .update({ url: uploadedResourceData.path })
        .eq("id", resource.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Error updating resource with file URL: ${updateError.message}`);
      }

      return updatedResource as SimpleResource;
    }

    return resource as SimpleResource;
  }
}
