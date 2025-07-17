import { createClient } from '@/lib/supabase/client';
import { BasicReview, GetReviewsParams, GetReviewsResult, RatingStats } from './interfaces/service.interfaces';

const calculateRatingStats = (reviews: any[]): RatingStats => {
  if (!reviews.length) {
    return {
      average: 0,
      total: 0,
      breakdown: [0, 0, 0, 0, 0],
    };
  }

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = Number((totalRating / reviews.length).toFixed(1));

  // Calculate breakdown
  const ratingCounts = Array(5).fill(0);
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });

  // Convert counts to percentages
  const breakdown = ratingCounts.map(count => 
    Math.round((count / reviews.length) * 100)
  ).reverse(); // Reverse to get [5,4,3,2,1] order

  return {
    average,
    total: reviews.length,
    breakdown,
  };
};

export const getCourseRatingStats = async (courseId: string): Promise<RatingStats> => {
  const supabase = createClient();

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('course_id', courseId);

  if (error) {
    throw new Error(`Failed to fetch review stats: ${error.message}`);
  }

  return calculateRatingStats(reviews || []);
};

export const getCourseReviews = async (params: GetReviewsParams): Promise<Omit<GetReviewsResult, 'ratingStats'>> => {
  const supabase = createClient();
  const { courseId, page, pageSize, search, rating } = params;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('reviews')
    .select(`
      *,
      user:users!reviews_user_id_fkey(
        id,
        full_name,
        avatar_url,
        created_at,
        updated_at
      )
    `, { count: 'exact' })
    .eq('course_id', courseId);

  if (search) {
    query = query.ilike('content', `%${search}%`);
  }

  if (rating !== undefined && rating !== null) {
    query = query.eq('rating', rating);
  }

  // Apply pagination
  const { data: reviews, count, error } = await query
    .range(offset, offset + pageSize - 1)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }

  // Transform the data to match BasicReview interface
  const transformedReviews: BasicReview[] = (reviews || []).map(review => ({
    id: review.id,
    content: review.content,
    rating: review.rating,
    user_id: review.user_id,
    course_id: review.course_id,
    user: review.user,
    created_at: review.created_at,
    updated_at: review.updated_at,
  }));

  return {
    reviews: transformedReviews,
    totalRecord: count || 0,
  };
};

export const getReviewById = async (id: string): Promise<BasicReview | null> => {
  const supabase = createClient();

  const { data: review, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:users!reviews_user_id_fkey(
        id,
        full_name,
        avatar_url,
        created_at,
        updated_at
      )
    `)
    .eq('id', id)
    .single();

  if (error || !review) {
    return null;
  }

  const result: BasicReview = {
    id: review.id,
    content: review.content,
    rating: review.rating,
    user_id: review.user_id,
    course_id: review.course_id,
    user: review.user,
    created_at: review.created_at,
    updated_at: review.updated_at,
  };

  return result;
}; 