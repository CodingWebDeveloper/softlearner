import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IReviewsDAL } from "../di/interfaces/dal.interfaces";
import {
  BasicReview,
  CreateReviewParams,
  GetReviewsParams,
  GetReviewsResult,
  RatingStats,
} from "@/services/interfaces/service.interfaces";

const calculateRatingStats = (reviews: { rating: number }[]): RatingStats => {
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
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++;
  });

  // Convert counts to percentages
  const breakdown = ratingCounts
    .map((count) => Math.round((count / reviews.length) * 100))
    .reverse(); // Reverse to get [5,4,3,2,1] order

  return {
    average,
    total: reviews.length,
    breakdown,
  };
};

export class ReviewsDAL implements IReviewsDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCourseRatingStats(courseId: string): Promise<RatingStats> {
    const { data: reviews, error } = await this.supabase
      .from("reviews")
      .select("rating")
      .eq("course_id", courseId);

    if (error) {
      throw new Error(`Error fetching review stats: ${error.message}`);
    }

    return calculateRatingStats(reviews || []);
  }

  async hasUserReviewedCourse(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("reviews")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Error checking existing review: ${error.message}`);
    }

    return Boolean(data);
  }

  async getCourseReviews(
    params: GetReviewsParams
  ): Promise<Omit<GetReviewsResult, "ratingStats">> {
    const { courseId, page, pageSize, search, rating } = params;
    const offset = (page - 1) * pageSize;

    let query = this.supabase
      .from("reviews")
      .select(
        `
        *,
        user:users!reviews_user_id_fkey(
          id,
          full_name,
          avatar_url,
          created_at,
          updated_at
        )
      `,
        { count: "exact" }
      )
      .eq("course_id", courseId);

    if (search) {
      query = query.ilike("content", `%${search}%`);
    }

    if (rating !== undefined && rating !== null) {
      query = query.eq("rating", rating);
    }

    // Apply pagination
    const {
      data: reviews,
      count,
      error,
    } = await query
      .range(offset, offset + pageSize - 1)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching reviews: ${error.message}`);
    }

    // Transform the data to match BasicReview interface
    const transformedReviews: BasicReview[] = (reviews || []).map((review) => ({
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
  }

  async getReviewById(id: string): Promise<BasicReview | null> {
    const { data: review, error } = await this.supabase
      .from("reviews")
      .select(
        `
        *,
        user:users!reviews_user_id_fkey(
          id,
          full_name,
          avatar_url,
          created_at,
          updated_at
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !review) {
      return null;
    }

    return {
      id: review.id,
      content: review.content,
      rating: review.rating,
      user_id: review.user_id,
      course_id: review.course_id,
      user: review.user,
      created_at: review.created_at,
      updated_at: review.updated_at,
    };
  }

  async createReview(params: CreateReviewParams): Promise<BasicReview> {
    // Check if the user already has a review for this course
    const alreadyReviewed = await this.hasUserReviewedCourse(
      params.userId,
      params.courseId
    );

    if (alreadyReviewed) {
      throw new Error("You have already submitted a review for this course.");
    }

    const { data: inserted, error } = await this.supabase
      .from("reviews")
      .insert({
        user_id: params.userId,
        course_id: params.courseId,
        content: params.content,
        rating: params.rating,
      })
      .select(
        `
        *,
        user:users!reviews_user_id_fkey(
          id,
          full_name,
          avatar_url,
          created_at,
          updated_at
        )
      `
      )
      .single();

    if (error || !inserted) {
      throw new Error(
        `Failed to create review: ${error?.message || "Unknown error"}`
      );
    }

    return {
      id: inserted.id,
      content: inserted.content,
      rating: inserted.rating,
      user_id: inserted.user_id,
      course_id: inserted.course_id,
      user: inserted.user,
      created_at: inserted.created_at,
      updated_at: inserted.updated_at,
    };
  }
}
