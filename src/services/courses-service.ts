import { createClient } from '@/lib/supabase/client';
import { BasicCourse, GetCoursesParams, GetCoursesResult, Review, CourseWithReviews } from './interfaces/service.interfaces';

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
      ),
      reviews(rating)
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

  const transformedCourses: BasicCourse[] = (courses || []).map((course: CourseWithReviews) => {
    // Calculate average rating
    const ratings = course.reviews?.map((review: Review) => review.rating) || [];
    const averageRating = ratings.length > 0
      ? Number((ratings.reduce((acc: number, curr: number) => acc + curr, 0) / ratings.length).toFixed(1))
      : null;

    return {
      id: course.id,
      name: course.name,
      description: course.description,
      video_url: course.video_url,
      new_price: course.new_price,
      price: course.price,
      thumbnail_image_url: course.thumbnail_image_url,
      creator: course.creator,
      category: course.category,
      rating: averageRating,
      ratings_count: ratings.length,
      created_at: course.created_at,
      updated_at: course.updated_at,
    };
  });

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
      ),
      reviews(rating)
    `)
    .eq('id', id)
    .single();

  if (error || !course) {
    return null;
  }

  const courseWithReviews = course as CourseWithReviews;
  
  // Calculate average rating
  const ratings = courseWithReviews.reviews?.map((review: Review) => review.rating) || [];
  const averageRating = ratings.length > 0
    ? Number((ratings.reduce((acc: number, curr: number) => acc + curr, 0) / ratings.length).toFixed(1))
    : null;

  const result: BasicCourse = {
    id: courseWithReviews.id,
    name: courseWithReviews.name,
    description: courseWithReviews.description,
    video_url: courseWithReviews.video_url,
    price: courseWithReviews.price,
    new_price: courseWithReviews.new_price,
    thumbnail_image_url: courseWithReviews.thumbnail_image_url,
    creator: courseWithReviews.creator,
    category: courseWithReviews.category,
    rating: averageRating,
    ratings_count: ratings.length,
    created_at: courseWithReviews.created_at,
    updated_at: courseWithReviews.updated_at,
  };

  return result;
}; 