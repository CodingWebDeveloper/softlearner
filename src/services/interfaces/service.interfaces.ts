import { Category, Tag, PreviewResource } from "@/lib/database/database.types";

type User = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CourseCreator = {
  id: string;
  avatar_url: string | null;
  full_name: string | null;
};

export type VoteType = "Up" | "Down";

export interface Vote {
  id: string;
  user_id: string;
  review_id: string;
  vote_type: VoteType;
  created_at: string;
  updated_at: string;
}

export interface VoteCounts {
  upvotes: number;
  downvotes: number;
}

export interface ReviewWithVotes {
  id: string;
  vote_counts: VoteCounts;
  user_vote?: VoteType;
}

export interface CreateCheckoutSessionInput {
  courseId: string;
  successUrl: string;
  cancelUrl: string;
  userId: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
}

export interface GetTagsParams {
  search?: string;
  limit?: number;
}

export interface BasicCourse {
  id: string;
  name: string;
  description: string;
  video_url: string;
  price: number;
  new_price: number | null;
  thumbnail_image_url: string;
  creator: CourseCreator;
  category: Category;
  rating: number | null;
  ratings_count: number;
  created_at: string;
  updated_at: string;
}

export interface GetCoursesParams {
  page: number;
  pageSize: number;
  search?: string;
  categoryId?: string;
  tags?: string[];
}

export interface GetCoursesResult {
  data: BasicCourse[];
  totalRecords: number;
}

export interface BasicReview {
  id: string;
  content: string;
  rating: number;
  user_id: string;
  course_id: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface GetReviewsParams {
  courseId: string;
  page: number;
  pageSize: number;
  search?: string;
  rating?: number | null;
}

export interface GetReviewsResult {
  reviews: BasicReview[];
  totalRecord: number;
}

export interface RatingStats {
  average: number;
  total: number;
  breakdown: number[]; // Array of 5 numbers representing percentages for 5,4,3,2,1 stars
}

export interface ICategoriesService {
  getCategories(): Promise<Category[]>;
}

export interface ICoursesService {
  getCourses(params: GetCoursesParams): Promise<GetCoursesResult>;
  getCourseById(id: string): Promise<BasicCourse | null>;
  isEnrolled(userId: string, courseId: string): Promise<boolean>;
}

export interface ITagsService {
  getTags(params?: GetTagsParams): Promise<Tag[]>;
  getTagsByCourseId(courseId: string): Promise<Tag[]>;
  createTag(name: string): Promise<Tag>;
  updateTag(id: string, name: string): Promise<Tag>;
  deleteTag(id: string): Promise<void>;
}

export interface IResourcesService {
  getResourcesByCourseId(courseId: string): Promise<PreviewResource[]>;
}

export interface IReviewsService {
  getCourseRatingStats(courseId: string): Promise<RatingStats>;
  getCourseReviews(
    params: GetReviewsParams
  ): Promise<Omit<GetReviewsResult, "ratingStats">>;
  getReviewById(id: string): Promise<BasicReview | null>;
}

export interface IVotesService {
  upsertVote(
    userId: string,
    reviewId: string,
    voteType: VoteType
  ): Promise<Vote | null>;
  getReviewVotes(reviewId: string, userId?: string): Promise<ReviewWithVotes>;
}

export interface IPaymentsService {
  createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CheckoutSessionResponse>;
}
