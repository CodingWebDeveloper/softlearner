import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IResourcesDAL } from "../di/interfaces/dal.interfaces";
import { PreviewResource } from "../database/database.types";

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
}
