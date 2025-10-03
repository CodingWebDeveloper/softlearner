import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IReviewsDAL, PaginatedResult } from "../di/interfaces/dal.interfaces";
import {
  BasicReview,
  CreateReviewParams,
  GetReviewsParams,
  GetReviewsResult,
  RatingStats,
  UpdateReviewInput,
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
    const { courseId, page, pageSize, search, rating, sortDir, sortBy } = params;
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

    // Apply pagination and ordering based on sortBy
    const ascending = sortDir === "asc";
    let orderedQuery = query.range(offset, offset + pageSize - 1);

    const effectiveSortBy = sortBy || "change"; // default to change date
    if (effectiveSortBy === "rating") {
      orderedQuery = orderedQuery.order("rating", { ascending });
    } else if (effectiveSortBy === "created") {
      orderedQuery = orderedQuery.order("created_at", { ascending });
    } else {
      // change date: updated_at first (nulls handled), then created_at
      orderedQuery = orderedQuery
        .order("updated_at", { ascending, nullsFirst: ascending })
        .order("created_at", { ascending });
    }

    const { data: reviews, count, error } = await orderedQuery;

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

  async updateReview(
    userId: string,
    reviewId: string,
    input: UpdateReviewInput
  ): Promise<BasicReview> {
    // Verify ownership and 24-hour edit window
    const { data: existing, error: fetchError } = await this.supabase
      .from("reviews")
      .select("id, user_id, created_at")
      .eq("id", reviewId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`Error fetching review: ${fetchError.message}`);
    }

    if (!existing) {
      throw new Error("Review not found");
    }

    const createdAt = new Date(existing.created_at).getTime();
    const now = Date.now();
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;

    if (now - createdAt > twentyFourHoursMs) {
      throw new Error("Reviews can only be edited within 24 hours of posting");
    }

    const { data: updated, error: updateError } = await this.supabase
      .from("reviews")
      .update({
        content: input.content,
        rating: input.rating,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
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

    if (updateError || !updated) {
      throw new Error(
        `Error updating review: ${updateError?.message || "Unknown error"}`
      );
    }

    return {
      id: updated.id,
      content: updated.content,
      rating: updated.rating,
      user_id: updated.user_id,
      course_id: updated.course_id,
      user: updated.user,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    };
  }

  async getUserReviews(
    userId: string,
    page: number = 1,
    pageSize: number = 15
  ): Promise<PaginatedResult<BasicReview>> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.supabase
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
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Error fetching user reviews: ${error.message}`);
    }

    const transformed: BasicReview[] = (data || []).map((r) => ({
      id: r.id,
      content: r.content,
      rating: r.rating,
      user_id: r.user_id,
      course_id: r.course_id,
      user: r.user,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));

    return {
      data: transformed,
      totalRecords: count || 0,
    };
  }

  async deleteReview(userId: string, reviewId: string): Promise<void> {
    // Verify ownership
    const { data: existing, error: fetchError } = await this.supabase
      .from("reviews")
      .select("id, user_id")
      .eq("id", reviewId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`Error fetching review: ${fetchError.message}`);
    }

    if (!existing) {
      throw new Error("Review not found");
    }

    const { error: deleteError } = await this.supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (deleteError) {
      throw new Error(`Error deleting review: ${deleteError.message}`);
    }
  }
}
