import { createClient } from '@/lib/supabase/client';
import type { PreviewResource } from '@/lib/database/database';

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
  // Remove url from each resource
  return data as PreviewResource[];
}; 