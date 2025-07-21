import { IReviewsDAL } from "@/lib/di/interfaces/dal.interfaces";
import {
  IReviewsService,
  BasicReview,
  GetReviewsParams,
  GetReviewsResult,
  RatingStats,
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
}
