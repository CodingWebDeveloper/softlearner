import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IResourcesDAL } from "../di/interfaces/dal.interfaces";
import { PreviewResource } from "../database/database.types";
import { BasicResource, CreateResourceParams, SimpleResource, UpdateResourceParams } from "@/services/interfaces/service.interfaces";
import { RESOURCE_TYPES } from "../constants/database-constants";

function formatIntervalToDuration(interval: string | null): string | undefined {
  if (!interval) return undefined;

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

  async getAllResourcesByCourseId(courseId: string): Promise<SimpleResource[]> {
    if (!courseId) return [];

    const { data, error } = await this.supabase
      .from("resources")
      .select(
        "id, name, short_summary, type, course_id, order_index, duration, created_at, updated_at, url"
      )
      .eq("course_id", courseId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Error fetching resources: ${error.message}`);
    }

    if (!data) return [];

    return data as SimpleResource[];
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

    if (type === RESOURCE_TYPES.DOWNLOADABLE_FILE && file) {
      const filePath = `${course_id}/${resource.id}`;

      const { data: uploadedResourceData, error: uploadError } = await this.supabase.storage
        .from("course-resources")
        .upload(filePath, file);

      if (uploadError) {
        await this.supabase.from("resources").delete().eq("id", resource.id);
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }

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

  async updateResource(
    resourceId: string,
    updates: UpdateResourceParams
  ): Promise<SimpleResource> {
    // Get the current resource
    const { data: currentResource, error: fetchError } = await this.supabase
      .from("resources")
      .select("*")
      .eq("id", resourceId)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching resource: ${fetchError.message}`);
    }

    if (!currentResource) {
      throw new Error("Resource not found");
    }

    const filePath = `${currentResource.course_id}/${resourceId}`;
    let finalUrl = currentResource.url;

    if (currentResource.type === RESOURCE_TYPES.DOWNLOADABLE_FILE && updates.type === RESOURCE_TYPES.VIDEO) {
      if (currentResource.url) {
        await this.supabase.storage
          .from("course-resources")
          .remove([currentResource.url]);
      }
      finalUrl = updates.url || "";
    } else if (currentResource.type === RESOURCE_TYPES.VIDEO && updates.type === RESOURCE_TYPES.DOWNLOADABLE_FILE) {
      if (updates.file) {
        const { data: uploadedResourceData, error: uploadError } = await this.supabase.storage
          .from("course-resources")
          .upload(filePath, updates.file);

        if (uploadError) {
          throw new Error(`Error uploading file: ${uploadError.message}`);
        }

        finalUrl = uploadedResourceData.path;
      } else {
        throw new Error("File is required when changing from video to file type");
      }
    } else if (currentResource.type === RESOURCE_TYPES.DOWNLOADABLE_FILE && updates.type === RESOURCE_TYPES.DOWNLOADABLE_FILE) {
      if (updates.file) {
        if (currentResource.url) {
          await this.supabase.storage
            .from("course-resources")
            .remove([currentResource.url]);
        }

        const { data: uploadedResourceData, error: uploadError } = await this.supabase.storage
          .from("course-resources")
          .upload(filePath, updates.file);

        if (uploadError) {
          throw new Error(`Error uploading new file: ${uploadError.message}`);
        }

        finalUrl = uploadedResourceData.path;
      }
    } else if (currentResource.type === RESOURCE_TYPES.VIDEO && updates.type === RESOURCE_TYPES.VIDEO) {
      if (updates.url !== undefined) {
        finalUrl = updates.url;
      }
    }

    const updateData = {
      name: updates.name,
      short_summary: updates.short_summary,
      type: updates.type,
      duration: updates.duration,
      url: finalUrl,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedResource, error: updateError } = await this.supabase
      .from("resources")
      .update(updateData)
      .eq("id", resourceId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Error updating resource: ${updateError.message}`);
    }

    if (!updatedResource) {
      throw new Error("Failed to update resource");
    }

    return updatedResource as SimpleResource;
  }

  async updateResourcesOrder(
    courseId: string,
    orderUpdates: { id: string; order_index: number }[]
  ): Promise<SimpleResource[]> {
    try {
      const data: SimpleResource[] = [];
      for (const { id, order_index } of orderUpdates) {
        const { error, data: updatedResource } = await this.supabase
          .from("resources")
          .update({
            order_index,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("course_id", courseId)
          .select()
          .single();
    
        if (error) {
          console.error("Failed to update resource:", id, error);
          throw new Error(`Failed to update resource ${id}: ${error.message}`);
        }

        if (!updatedResource) {
          throw new Error(`Failed to update resource ${id}: No data returned`);
        }

        data.push(updatedResource as SimpleResource);
      }

      return data as SimpleResource[];
    } catch (error) {
      throw new Error(
        `Failed to update resources order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteResource(resourceId: string): Promise<void> {
    // Get the resource to check type and get file path
    const { data: resource, error: fetchError } = await this.supabase
      .from("resources")
      .select("*")
      .eq("id", resourceId)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching resource: ${fetchError.message}`);
    }

    if (!resource) {
      throw new Error("Resource not found");
    }

    // If it's a downloadable file, delete the file first
    if (resource.type === RESOURCE_TYPES.DOWNLOADABLE_FILE && resource.url) {
      await this.supabase.storage
        .from("course-resources")
        .remove([resource.url]);
    }

    // Delete the resource record
    const { error: deleteError } = await this.supabase
      .from("resources")
      .delete()
      .eq("id", resourceId);

    if (deleteError) {
      throw new Error(`Error deleting resource: ${deleteError.message}`);
    }
  }

  async downloadResourceFile(resourceId: string): Promise<Blob> {
    // Get the resource to check type and get file path
    const { data: resource, error: fetchError } = await this.supabase
      .from("resources")
      .select("*")
      .eq("id", resourceId)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching resource: ${fetchError.message}`);
    }

    if (!resource) {
      throw new Error("Resource not found");
    }

    if (resource.type !== RESOURCE_TYPES.DOWNLOADABLE_FILE) {
      throw new Error("Resource is not a downloadable file");
    }

    if (!resource.url) {
      throw new Error("Resource file URL is missing");
    }

    // Download the file
    const { data, error: downloadError } = await this.supabase.storage
      .from("course-resources")
      .download(resource.url);

    if (downloadError) {
      throw new Error(`Error downloading file: ${downloadError.message}`);
    }

    if (!data) {
      throw new Error("File not found");
    }

    return data;
  }

  async getUserCompletedResourcesByYear(
    userId: string,
    year: number
  ): Promise<{ id: string; completed_at: string }[]> {
    if (!userId || !year) {
      throw new Error("User ID and year are required");
    }

    const start = new Date(Date.UTC(year, 0, 1)).toISOString();
    const endExclusive = new Date(Date.UTC(year + 1, 0, 1)).toISOString();

    const { data, error } = await this.supabase
      .from("user_resources")
      .select("resource_id, completed_at")
      .eq("user_id", userId)
      .eq("completed", true)
      .gte("completed_at", start)
      .lt("completed_at", endExclusive);

    if (error) {
      throw new Error(`Error fetching user activity: ${error.message}`);
    }

    const rows = (data || []) as Array<{ resource_id: string; completed_at: string | null }>;
    return rows
      .filter((r) => !!r.completed_at)
      .map((r) => ({ id: r.resource_id, completed_at: r.completed_at as string }));
  }
}