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
  UpdateReviewInput,
  GetPurchasedCoursesResult,
  FullCourse,
  BasicResource,
  BasicTest,
  CreateTestInput,
  FullQuestion,
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
  CreateCourseParams,
  SimpleCourse,
  CreateResourceParams,
  UpdateResourceParams,
  SimpleResource,
  QuestionsInput,
  CourseProgressStatus,
  CreateReviewParams,
} from "@/services/interfaces/service.interfaces";

export interface PaginatedResult<T> {
  data: T[];
  totalRecords: number;
}

export interface ICoursesDAL {
  createCourse(
    creatorId: string,
    params: CreateCourseParams
  ): Promise<SimpleCourse>;
  uploadCourseThumbnail(
    creatorId: string,
    courseId: string,
    file: File
  ): Promise<string>;
  getCourses(params: GetCoursesParams): Promise<GetCoursesResult>;
  getCourseById(id: string, userId?: string): Promise<BasicCourse | null>;
  getCourseDataById(id: string): Promise<SimpleCourse | null>;
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
  getCoursesByCreator(
    creatorId: string,
    page?: number,
    pageSize?: number,
    sortBy?: "name" | "category" | "price" | "created_at" | "updated_at",
    sortDir?: "asc" | "desc"
  ): Promise<PaginatedResult<SimpleCourse>>;
  updateCourse(
    creatorId: string,
    courseId: string,
    params: CreateCourseParams
  ): Promise<SimpleCourse>;
  deleteCourse(creatorId: string, courseId: string): Promise<void>;
  getThumbnail(thumbnailPath: string): Promise<Blob>;
  togglePublishStatus(
    creatorId: string,
    courseId: string,
    isPublished: boolean
  ): Promise<void>;
  getCourseCreationProgressStatus(
    courseId: string
  ): Promise<CourseProgressStatus>;
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
  createTagsByCourse(courseId: string, tagIds: string[]): Promise<void>;
}

export interface IResourcesDAL {
  getResourcesByCourseId(courseId: string): Promise<PreviewResource[]>;
  getAllResourcesByCourseId(courseId: string): Promise<SimpleResource[]>;
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
  createResource(params: CreateResourceParams): Promise<SimpleResource>;
  updateResource(
    resourceId: string,
    params: UpdateResourceParams
  ): Promise<SimpleResource>;
  updateResourcesOrder(
    courseId: string,
    orderUpdates: { id: string; order_index: number }[]
  ): Promise<SimpleResource[]>;
  downloadResourceFile(resourceId: string): Promise<Blob>;
  deleteResource(resourceId: string): Promise<void>;
}

export interface IReviewsDAL {
  getCourseRatingStats(courseId: string): Promise<RatingStats>;
  getCourseReviews(
    params: GetReviewsParams
  ): Promise<Omit<GetReviewsResult, "ratingStats">>;
  getReviewById(id: string): Promise<BasicReview | null>;
  createReview(params: CreateReviewParams): Promise<BasicReview>;
  hasUserReviewedCourse(userId: string, courseId: string): Promise<boolean>;
  getUserReviews(
    userId: string,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResult<BasicReview>>;
  updateReview(
    userId: string,
    reviewId: string,
    input: UpdateReviewInput
  ): Promise<BasicReview>;
  deleteReview(userId: string, reviewId: string): Promise<void>;
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
  getTestQuestions(testId: string): Promise<FullQuestion[]>;
  getTestResults(courseId: string, userId: string): Promise<TestResult[]>;
  createTest(courseId: string, data: CreateTestInput): Promise<BasicTest>;
  saveQuestions(data: QuestionsInput): Promise<FullTest>;
  updateTest(id: string, data: CreateTestInput): Promise<BasicTest>;
  createScore(
    testId: string,
    userId: string,
    submission: TestSubmission
  ): Promise<TestResult>;
  deleteTest(id: string): Promise<void>;
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
