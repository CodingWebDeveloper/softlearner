import { createClient } from '@/lib/supabase/client';
import type { BasicSection } from './interfaces/service.interfaces';

export const getSectionsByCourseId = async (courseId: string): Promise<BasicSection[]> => {
  const supabase = createClient();

  const { data: sections, error } = await supabase
    .from('sections')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch sections: ${error.message}`);
  }

  return (sections || []).map((section) => ({
    id: section.id,
    course_id: section.course_id,
    name: section.name,
    order_index: section.order_index,
    created_at: section.created_at,
    updated_at: section.updated_at,
  }));
}; 