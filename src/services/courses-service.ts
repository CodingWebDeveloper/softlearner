import { createClient } from '@/lib/supabase/client';
import { BasicCourse, GetCoursesParams, GetCoursesResult } from './interfaces/service.interfaces';

export const getCourses = async (params: GetCoursesParams): Promise<GetCoursesResult> => {
  const supabase = createClient();
  const { page, pageSize, search, category, tags } = params;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('courses')
    .select(`
      *,
      creator:users!courses_creator_id_fkey(
        id,
        full_name,
        avatar_url,
        created_at,
        updated_at
      ),
      category:categories!courses_category_id_fkey(
        id,
        name
      )
    `, { count: 'exact' });

  // Apply filters
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq('category_id', category);
  }

  // Filter by tags using course_tags join table
  let courseIds: string[] = [];
  if (tags && tags.length > 0) {
    const { data: tagRows, error: tagError } = await supabase
      .from('course_tags')
      .select('course_id')
      .in('tag_id', tags);

    if (tagError) {
      throw new Error(`Failed to fetch course tags: ${tagError.message}`);
    }
    courseIds = tagRows?.map(row => row.course_id) || [];
  }

  if (tags && tags.length > 0) {
    if (courseIds.length === 0) {
      // No courses match the tags, return empty result
      return {
        courses: [],
        totalRecord: 0,
      };
    }
    query = query.in('id', courseIds);
  }

  // Apply pagination
  const { data: courses, count, error } = await query
    .range(offset, offset + pageSize - 1)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }

  // Transform the data to match BasicCourse interface
  const transformedCourses: BasicCourse[] = (courses || []).map(course => ({
    id: course.id,
    name: course.name,
    description: course.description,
    video_url: course.video_url,
    price: course.price,
    thumbnail_image_url: course.thumbnail_image_url,
    creator: course.creator,
    category: course.category,
    created_at: course.created_at,
    updated_at: course.updated_at,
  }));

  return {
    courses: transformedCourses,
    totalRecord: count || 0,
  };
};

export const getCourseById = async (id: string): Promise<BasicCourse | null> => {
  const supabase = createClient();

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      creator:users!courses_creator_id_fkey(
        id,
        full_name,
        avatar_url,
        created_at,
        updated_at
      ),
      category:categories!courses_category_id_fkey(
        id,
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error || !course) {
    return null;
  }

  const result: BasicCourse = {
    id: course.id,
    name: course.name,
    description: course.description,
    video_url: course.video_url,
    price: course.price,
    thumbnail_image_url: course.thumbnail_image_url,
    creator: course.creator,
    category: course.category,
    created_at: course.created_at,
    updated_at: course.updated_at,
  };

  return result;
}; 