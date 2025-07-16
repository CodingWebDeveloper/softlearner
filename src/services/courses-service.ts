import { createClient } from '@/lib/supabase/client';
import { BasicCourse, Review } from './interfaces/service.interfaces';

const supabase = createClient();

export async function getCourses({ page = 1, pageSize = 15, search, category, tags }: { 
  page: number; 
  pageSize: number;
  search?: string;
  category?: string;
  tags?: string[];
}) {
  try {
    let query = supabase
      .from('courses')
      .select(`
        *,
        creator:creator_id(*),
        category:category_id(*),
        reviews!course_id(rating)
      `);

    // Apply search filter if provided
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply category filter if provided
    if (category) {
      query = query.eq('category_id', category);
    }

    // Apply tags filter if provided
    if (tags && tags.length > 0) {
      const taggedCourseIds = await supabase
        .from('course_tags')
        .select('course_id')
        .in('tag_id', tags);

      if (taggedCourseIds.data) {
        query = query.in('id', taggedCourseIds.data.map(row => row.course_id));
      }
    }

    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get total count for pagination
    const { count } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    // Get paginated results
    const { data, error } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform the data to calculate rating and ratings_count
    const transformedData = data?.map(course => {
      const ratings = (course.reviews || []) as Review[];
      const ratingsCount = ratings.length;
      const averageRating = ratingsCount > 0 
        ? ratings.reduce((sum: number, review: Review) => sum + (review.rating || 0), 0) / ratingsCount 
        : 0;

      return {
        ...course,
        rating: Number(averageRating.toFixed(1)),
        ratings_count: ratingsCount,
        reviews: undefined // Remove reviews from the final object since we've processed them
      };
    });

    return {
      data: transformedData || [],
      totalRecords: count || 0,
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

export async function getCourseById(courseId: string): Promise<BasicCourse | null> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        creator:creator_id(*),
        category:category_id(*)
      `)
      .eq('id', courseId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}

export async function isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'SUCCEEDED')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // no rows returned
        return false;
      }
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return false;
  }
} 