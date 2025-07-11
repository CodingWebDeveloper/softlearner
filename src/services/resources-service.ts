import { createClient } from '@/lib/supabase/client';
import type { PreviewResource } from '@/lib/database/database.types';

function formatIntervalToDuration(interval: string | null): string | undefined {
  if (!interval) return undefined;
  // interval is in ISO 8601 duration format (e.g. 'PT45M', 'PT1H30M') or Postgres interval string (e.g. '00:45:00')
  // Try to parse as HH:MM:SS
  const match = interval.match(/^(\d+):(\d+):(\d+)$/);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    // const seconds = parseInt(match[3], 10); // not used for display
    let result = '';
    if (hours > 0) result += `${hours} hr` + (hours > 1 ? 's ' : ' ');
    if (minutes > 0) result += `${minutes} min`;
    return result.trim();
  }
  // fallback: just return the string
  return interval;
}

export const getResourcesByCourseId = async (courseId: string): Promise<PreviewResource[]> => {
  if (!courseId) return [];

  const supabase = createClient();

  const { data, error } = await supabase
    .from('resources')
    .select('id, name, short_summary, predefined, course_id, section_id, order_index, duration, created_at, updated_at')
    .eq('course_id', courseId)
    .order('created_at', { ascending: true });

  if (error) {
    // Optionally log error
    return [];
  }

  if (!data) return [];
  // Convert duration from interval to string
  return data.map((resource: any) => ({
    ...resource,
    duration: formatIntervalToDuration(resource.duration)
  })) as PreviewResource[];
}; 