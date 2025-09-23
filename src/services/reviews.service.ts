import { IReviewsDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  IReviewsService,
  BasicReview,
  GetReviewsParams,
  GetReviewsResult,
  RatingStats,
  CreateReviewParams,
  UpdateReviewInput,
  PaginatedResult,
} from "./interfaces/service.interfaces";

export class ReviewsService implements IReviewsService {
  constructor(private reviewsDAL: IReviewsDAL) {}

  async getCourseRatingStats(courseId: string): Promise<RatingStats> {
    return this.reviewsDAL.getCourseRatingStats(courseId);
  }

  async getCourseReviews(
    params: GetReviewsParams
  ): Promise<Omit<GetReviewsResult, "ratingStats">> {
    return this.reviewsDAL.getCourseReviews(params);
  }

  async getReviewById(id: string): Promise<BasicReview | null> {
    return this.reviewsDAL.getReviewById(id);
  }

  async createReview(input: CreateReviewParams): Promise<BasicReview> {
    return this.reviewsDAL.createReview(input);
  }

  async getUserReviews(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<BasicReview>> {
    return this.reviewsDAL.getUserReviews(userId, page, pageSize);
  }

  async updateReview(
    userId: string,
    reviewId: string,
    input: UpdateReviewInput
  ): Promise<BasicReview> {
    return this.reviewsDAL.updateReview(userId, reviewId, input);
  }

  async deleteReview(userId: string, reviewId: string): Promise<void> {
    return this.reviewsDAL.deleteReview(userId, reviewId);
  }
}
