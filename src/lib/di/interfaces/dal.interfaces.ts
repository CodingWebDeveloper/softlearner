import {
  Course,
  Category,
  Tag,
  PreviewResource,
} from "../../database/database.types";
import {
  GetCoursesParams,
  GetCoursesResult,
  BasicCourse,
  GetTagsParams,
  BasicReview,
  GetReviewsParams,
  GetReviewsResult,
  RatingStats,
  Vote,
  VoteType,
  ReviewWithVotes,
  CreateCheckoutSessionInput,
  CheckoutSessionResponse,
} from "@/services/interfaces/service.interfaces";

export interface ICoursesDAL {
  getCourses(params: GetCoursesParams): Promise<GetCoursesResult>;
  getCourseById(id: string): Promise<BasicCourse | null>;
  isEnrolled(userId: string, courseId: string): Promise<boolean>;
}

export interface ICategoriesDAL {
  getCategories(): Promise<Category[]>;
}

export interface ITagsDAL {
  getTags(params?: GetTagsParams): Promise<Tag[]>;
  getTagsByCourseId(courseId: string): Promise<Tag[]>;
  createTag(name: string): Promise<Tag>;
  updateTag(id: string, name: string): Promise<Tag>;
  deleteTag(id: string): Promise<void>;
}

export interface IResourcesDAL {
  getResourcesByCourseId(courseId: string): Promise<PreviewResource[]>;
}

export interface IReviewsDAL {
  getCourseRatingStats(courseId: string): Promise<RatingStats>;
  getCourseReviews(
    params: GetReviewsParams
  ): Promise<Omit<GetReviewsResult, "ratingStats">>;
  getReviewById(id: string): Promise<BasicReview | null>;
}

export interface IVotesDAL {
  upsertVote(
    userId: string,
    reviewId: string,
    voteType: VoteType
  ): Promise<Vote | null>;
  getReviewVotes(reviewId: string, userId?: string): Promise<ReviewWithVotes>;
}

export interface IPaymentsDAL {
  createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CheckoutSessionResponse>;
  getCourseById(courseId: string): Promise<Course | null>;
  checkExistingOrder(
    userId: string,
    courseId: string
  ): Promise<{ id: string } | null>;
  createOrder(order: {
    user_id: string;
    course_id: string;
    total_amount: number;
    currency: string;
    status: string;
  }): Promise<{ id: string }>;
  updateOrderPaymentIntent(
    orderId: string,
    paymentIntentId: string
  ): Promise<void>;
  checkExistingSuccessfulOrder(
    userId: string,
    courseId: string
  ): Promise<boolean>;
}
