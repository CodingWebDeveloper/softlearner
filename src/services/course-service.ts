import { createClient } from '@/lib/supabase/client';
import type { Course } from '@/lib/database/database';

export interface GetCoursesParams {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  tags?: string[];
}

export interface GetCoursesResult {
  courses: Course[];
  totalRecord: number;
}

export const getCourses = async (params: GetCoursesParams): Promise<GetCoursesResult> => {
  const supabase = createClient();
  const { page, pageSize, search, category, tags } = params;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('courses')
    .select('*', { count: 'exact' });

  // Apply filters
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags);
  }

  // Apply pagination
  const { data: courses, count, error } = await query
    .range(offset, offset + pageSize - 1)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }

  return {
    courses: courses as Course[],
    totalRecord: count || 0,
  };
}; 