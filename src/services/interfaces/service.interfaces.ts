import { Category, User } from "@/lib/database/database.types";

export interface BasicCourse {
  id: string;
  name: string;
  description: string;
  video_url: string;
  price: number;
  new_price: number | null;
  thumbnail_image_url: string;
  creator: User;
  category: Category;
  rating: number | null;
  ratings_count: number;
  created_at: string;
  updated_at: string;
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

export interface RatingStats {
  average: number;
  total: number;
  breakdown: number[]; // Array of 5 numbers representing percentages for 5,4,3,2,1 stars
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

export interface GetCoursesParams {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  tags?: string[];
}

export interface GetCoursesResult {
  courses: BasicCourse[];
  totalRecord: number;
}

export interface BasicSection {
  id: string;
  course_id: string;
  name: string;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  rating: number;
}

export interface CourseWithReviews {
  id: string;
  name: string;
  description: string;
  video_url: string;
  price: number;
  new_price: number | null;
  thumbnail_image_url: string;
  reviews?: Review[];
  creator: User;
  category: Category;
  created_at: string;
  updated_at: string;
}
