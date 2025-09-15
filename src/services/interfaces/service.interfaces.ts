import { Category, Tag, PreviewResource } from "@/lib/database/database.types";
import { ResourceType } from "@/lib/constants/database-constants";
export interface SimpleResource {
  id: string;
  name: string;
  url: string;
  short_summary?: string;
  type: ResourceType;
  order_index: number;
  duration?: string;
  created_at: string;
  updated_at: string;
}

export interface BasicResource {
  id: string;
  name: string;
  url: string;
  short_summary?: string;
  type: ResourceType;
  course_id: string;
  order_index?: number;
  duration?: string;
  completed?: boolean;
}

export type User = {
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

export type UserRole = "student" | "creator" | "admin";

export type QuestionType = "single" | "multiple";

export type Status = "NEW" | "UPDATED" | "DELETED" | "INITIAL";

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

export interface CreateCourseParams {
  name: string;
  description: string;
  video_url: string;
  price: number;
  new_price?: number | null;
  category_id: string;
  thumbnail_image?: File;
}

export interface SimpleCourse {
  id: string;
  name: string;
  description: string;
  video_url: string;
  price: number;
  new_price: number | null;
  currency: string;
  category: Category;
  creator: User;
  thumbnail_image_url: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
  isBookmarked: boolean;
}

export interface FullCourse {
  id: string;
  name: string;
  description: string;
  creator: CourseCreator;
  category: Category;
  created_at: string;
  updated_at: string;
  isBookmarked: boolean;
  video_url: string;
}

export interface GetCoursesParams {
  page: number;
  pageSize: number;
  search?: string;
  categoryId?: string;
  tags?: string[];
  userId?: string;
}

export interface GetCoursesResult {
  data: BasicCourse[];
  totalRecords: number;
}

export interface PaginatedResult<T> {
  data: T[];
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
  createCourse(
    creatorId: string,
    params: CreateCourseParams
  ): Promise<SimpleCourse>;
  getCourses(params: GetCoursesParams): Promise<GetCoursesResult>;
  getCourseById(id: string): Promise<BasicCourse | null>;
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
  getCourseDataById(id: string): Promise<SimpleCourse | null>;
  getThumbnail(thumbnailPath: string): Promise<Blob>;
}

export interface ITagsService {
  getTags(params?: GetTagsParams): Promise<Tag[]>;
  getTagsByCourseId(courseId: string): Promise<Tag[]>;
  createTag(name: string): Promise<Tag>;
  updateTag(id: string, name: string): Promise<Tag>;
  deleteTag(id: string): Promise<void>;
  createTagsByCourse(courseId: string, tagIds: string[]): Promise<void>;
}

export interface CreateResourceParams {
  name: string;
  short_summary?: string;
  type: ResourceType;
  course_id: string;
  url?: string;
  file?: File;
  order_index?: number;
  duration?: string;
}

export interface UpdateResourceParams {
  name: string;
  short_summary: string;
  type: ResourceType;
  url?: string;
  file?: File;
  duration: string;
}

export interface IResourcesService {
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

export interface IBookmarksService {
  createBookmark(userId: string, courseId: string): Promise<Bookmark>;
  deleteBookmark(userId: string, courseId: string): Promise<void>;
}

export interface Bookmark {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

export type PurchasedCourseResource = {
  id: string;
  completed: boolean;
};

export type PurchasedCourse = {
  id: string;
  name: string;
  creator: CourseCreator;
  resources: PurchasedCourseResource[];
  orderCreatedAt: string;
};

export type GetPurchasedCoursesResult = {
  data: PurchasedCourse[];
  totalRecords: number;
};

export interface CreateTestInput {
  title: string;
  description: string;
}

export interface BasicTest {
  id: string;
  title: string;
  description: string | null;
  questionsCount: number;
  created_at: string;
  updated_at: string;
}

export interface BasicAnswerOption {
  id: string;
  text: string;
}

export interface BasicAnswerOption {
  id: string;
  text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

export interface BasicQuestion {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  options: BasicAnswerOption[];
  created_at: string;
  updated_at: string;
}

export interface FullQuestion {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  test_id: string;
  options: BasicAnswerOption[];
  created_at: string;
  updated_at: string;
}

export interface FullTest extends Omit<BasicTest, "questionsCount"> {
  questions: BasicQuestion[];
}

export interface TestResult {
  testId: string;
  score: number;
  maxScore: number;
}

export type TestSubmission = {
  [questionId: string]: string[]; // Array of selected answer option IDs for each question
};

export interface TestWithProgress extends BasicTest {
  progress: number;
}

export interface QuestionsInput {
  testId: string;
  questions: QuestionInput[];
}

export interface QuestionInput {
  id?: string;
  text: string;
  type: "single" | "multiple";
  points: number;
  status: Status;
  options: OptionInput[];
}

export interface OptionInput {
  id?: string;
  text: string;
  isCorrect: boolean;
  status: Status;
}

export interface ITestsService {
  getTests(courseId: string): Promise<BasicTest[]>;
  getTestById(id: string): Promise<FullTest | null>;
  getTestQuestions(testId: string): Promise<FullQuestion[]>;
  getTestResults(courseId: string, userId: string): Promise<TestResult[]>;
  createTest(courseId: string, data: CreateTestInput): Promise<BasicTest>;
  updateTest(id: string, data: CreateTestInput): Promise<BasicTest>;
  saveQuestions(data: QuestionsInput): Promise<FullTest>;
  createScore(
    testId: string,
    userId: string,
    submission: TestSubmission
  ): Promise<TestResult>;
  getTestMaterials(
    courseId: string,
    userId: string
  ): Promise<TestWithProgress[]>;
}

export interface IUsersService {
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

export interface UserDetails {
  id: string;
  full_name: string;
  avatar_url: string;
  username: string;
  bio: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
}

export interface BasicUserInfo {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface UpdateProfile {
  full_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
}

// Creator Application Interfaces
export interface CreatorApplication {
  id: string;
  user: BasicUserInfo;
  bio: string;
  content_type: string;
  portfolio_links: string[];
  experience_level: "beginner" | "intermediate" | "advanced" | "expert";
  motivation: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCreatorApplicationInput {
  bio: string;
  content_type: string;
  portfolio_links: string[];
  experience_level: "beginner" | "intermediate" | "advanced" | "expert";
  motivation: string;
}

export interface UpdateCreatorApplicationInput {
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
}

export interface GetCreatorApplicationsParams {
  page: number;
  pageSize: number;
  status?: "pending" | "approved" | "rejected";
  search?: string;
}

export interface GetCreatorApplicationsResult {
  data: CreatorApplication[];
  totalRecords: number;
}

export interface ApplicationLog {
  id: string;
  application_id: string;
  admin_id: string;
  action: string;
  notes?: string;
  created_at: string;
}

export interface ICreatorApplicationsService {
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
