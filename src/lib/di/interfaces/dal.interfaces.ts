import {
  Category,
  Tag,
  PreviewResource,
  Course,
} from "@/lib/database/database.types";
import {
  Vote,
  VoteType,
  ReviewWithVotes,
  Bookmark,
  GetCoursesParams,
  GetCoursesResult,
  GetReviewsParams,
  GetReviewsResult,
  RatingStats,
  CreateCheckoutSessionInput,
  CheckoutSessionResponse,
  BasicCourse,
  GetTagsParams,
  BasicReview,
  GetPurchasedCoursesResult,
  FullCourse,
  BasicResource,
  BasicTest,
  FullTest,
  TestResult,
  TestSubmission,
  UserDetails,
  UpdateProfile,
  UserRole,
  CreatorApplication,
  CreateCreatorApplicationInput,
  UpdateCreatorApplicationInput,
  GetCreatorApplicationsParams,
  GetCreatorApplicationsResult,
  ApplicationLog,
} from "@/services/interfaces/service.interfaces";

export interface ICoursesDAL {
  getCourses(params: GetCoursesParams): Promise<GetCoursesResult>;
  getCourseById(id: string, userId?: string): Promise<BasicCourse | null>;
  isEnrolled(userId: string, courseId: string): Promise<boolean>;
  getBookmarkedCourses(
    userId: string,
    page?: number,
    pageSize?: number
  ): Promise<GetCoursesResult>;
  getPurchasedCourses(
    userId: string,
    page?: number,
    pageSize?: number
  ): Promise<GetPurchasedCoursesResult>;
  getCourseMaterialsById(
    id: string,
    userId?: string
  ): Promise<FullCourse | null>;
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
  getResourceMaterialsByCourseId(
    courseId: string,
    userId?: string
  ): Promise<BasicResource[]>;
  getNextResourceToComplete(
    courseId: string,
    userId: string
  ): Promise<string | null>;
  toggleResourceCompletion(
    userId: string,
    resourceId: string
  ): Promise<boolean>;
  getResourceCompletionStatus(
    userId: string,
    resourceId: string
  ): Promise<boolean>;
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

export interface IBookmarksDAL {
  createBookmark(userId: string, courseId: string): Promise<Bookmark>;
  deleteBookmark(userId: string, courseId: string): Promise<void>;
}

export interface ITestsDAL {
  getTests(courseId: string): Promise<BasicTest[]>;
  getTestById(id: string): Promise<FullTest | null>;
  getTestResults(courseId: string, userId: string): Promise<TestResult[]>;
  createScore(
    testId: string,
    userId: string,
    submission: TestSubmission
  ): Promise<TestResult>;
}

export interface IUsersDAL {
  getUserDetails(userId: string): Promise<UserDetails | null>;
  getUserDetailsByUsername(username: string): Promise<UserDetails | null>;
  getUserRole(userId: string): Promise<UserRole | null>;
  updateUserDetails(
    userId: string,
    updateData: UpdateProfile
  ): Promise<UserDetails | null>;
  uploadProfileImage(userId: string, file: File): Promise<string>;
  getProfileImageBlob(avatarPath: string): Promise<Blob>;
  removeProfileImage(userId: string): Promise<void>;
  changePassword(userId: string, newPassword: string): Promise<void>;
}

export interface AvatarBlobResult {
  blob: Blob;
  url: string;
}

export interface IAvatarDAL {
  getAvatarBlob(path: string): Promise<AvatarBlobResult | null>;
  uploadAvatar(
    userId: string,
    file: File | Blob
  ): Promise<{ url: string; path: string }>;
  updateAvatar(
    userId: string,
    file: File | Blob,
    currentPath?: string
  ): Promise<{ url: string; path: string }>;
  deleteAvatar(userId: string, path: string): Promise<void>;
}

export interface ICreatorApplicationsDAL {
  createApplication(
    userId: string,
    input: CreateCreatorApplicationInput
  ): Promise<CreatorApplication>;
  getUserApplication(userId: string): Promise<CreatorApplication | null>;
  getApplications(
    params: GetCreatorApplicationsParams
  ): Promise<GetCreatorApplicationsResult>;
  getApplicationById(id: string): Promise<CreatorApplication | null>;
  updateApplicationStatus(
    id: string,
    adminId: string,
    input: UpdateCreatorApplicationInput
  ): Promise<CreatorApplication>;
  logApplicationAction(
    applicationId: string,
    adminId: string,
    action: string,
    notes?: string
  ): Promise<ApplicationLog>;
  getApplicationLogs(applicationId: string): Promise<ApplicationLog[]>;
}
