import { createClient } from './supabase'

// Type definitions based on database.txt schema

// User interface
export interface User {
  id: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Course interface
export interface Course {
  id: string
  name: string
  description?: string
  video_url?: string
  price: number
  thumbnail_image_url?: string
  creator_id?: string
  created_at: string
  updated_at: string
}

// Order interface
export interface Order {
  id: string
  user_id: string
  course_id: string
  status: 'ACTIVE' | 'PENDING' | 'CANCELLED'
  created_at: string
  updated_at: string
}

// Resource interface
export interface Resource {
  id: string
  url: string
  name: string
  course_id: string
  created_at: string
  updated_at: string
}

// Review interface
export interface Review {
  id: string
  content: string
  user_id: string
  course_id: string
  created_at: string
  updated_at: string
}

// Vote interface
export interface Vote {
  id: string
  user_id: string
  review_id: string
  vote_type: 'Up' | 'Down'
  created_at: string
  updated_at: string
}

// Bookmark interface
export interface Bookmark {
  id: string
  user_id: string
  course_id: string
  created_at: string
  updated_at: string
}

// Test interface
export interface Test {
  id: string
  title: string
  description?: string
  course_id: string
  created_at: string
  updated_at: string
}

// Question interface
export interface Question {
  id: string
  text: string
  type: 'single' | 'multiple'
  points: number
  test_id: string
  created_at: string
  updated_at: string
}

// AnswerOption interface
export interface AnswerOption {
  id: string
  question_id: string
  text: string
  is_correct: boolean
  created_at: string
  updated_at: string
}

// UserTest interface
export interface UserTest {
  id: string
  user_id: string
  test_id: string
  score: number
  created_at: string
  updated_at: string
}

// UserAnswer interface
export interface UserAnswer {
  id: string
  user_test_id: string
  question_id: string
  answer_option_id: string
  created_at: string
  updated_at: string
}

// Extended interfaces for related data
export interface CourseWithCreator extends Course {
  creator?: User
}

export interface ReviewWithUser extends Review {
  user?: User
}

export interface QuestionWithOptions extends Question {
  answer_options?: AnswerOption[]
}

export interface TestWithQuestions extends Test {
  questions?: QuestionWithOptions[]
}

export interface UserTestWithDetails extends UserTest {
  test?: Test
  user_answers?: UserAnswer[]
}

// Course progress interface for dashboard
export interface CourseProgress {
  course: Course
  total_resources: number
  completed_resources: number
  progress_percentage: number
  last_accessed: string
  status: 'not_started' | 'in_progress' | 'completed'
  next_resource?: Resource
}

// User operations
export async function getUser(userId: string): Promise<User | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows returned
    throw error
  }
  return data
}

export async function createUser(userId: string, fullName?: string): Promise<User> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .insert([{ id: userId, full_name: fullName }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Course operations
export async function getCourses(): Promise<Course[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getCourse(courseId: string): Promise<Course | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .insert([course])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCourse(courseId: string, updates: Partial<Course>): Promise<Course> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCourse(courseId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId)

  if (error) throw error
}

// Order operations
export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Resource operations
export async function getCourseResources(courseId: string): Promise<Resource[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at')

  if (error) throw error
  return data
}

export async function createResource(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('resources')
    .insert([resource])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteResource(resourceId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId)

  if (error) throw error
}

// Review operations
export async function getCourseReviews(courseId: string): Promise<ReviewWithUser[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:users(full_name)
    `)
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateReview(reviewId: string, content: string): Promise<Review> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .update({ content })
    .eq('id', reviewId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteReview(reviewId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) throw error
}

// Vote operations
export async function getReviewVotes(reviewId: string): Promise<Vote[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('review_id', reviewId)

  if (error) throw error
  return data
}

export async function createVote(vote: Omit<Vote, 'id' | 'created_at' | 'updated_at'>): Promise<Vote> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('votes')
    .upsert([vote], { onConflict: 'user_id,review_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteVote(voteId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('votes')
    .delete()
    .eq('id', voteId)

  if (error) throw error
}

// Bookmark operations
export async function getUserBookmarks(userId: string): Promise<Bookmark[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createBookmark(bookmark: Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>): Promise<Bookmark> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([bookmark])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBookmark(bookmarkId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId)

  if (error) throw error
}

export async function isBookmarked(userId: string, courseId: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return false
    throw error
  }
  return !!data
}

// Test operations
export async function getCourseTests(courseId: string): Promise<Test[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at')

  if (error) throw error
  return data
}

export async function getTest(testId: string): Promise<TestWithQuestions | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tests')
    .select(`
      *,
      questions:questions(
        *,
        answer_options:answer_options(*)
      )
    `)
    .eq('id', testId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createTest(test: Omit<Test, 'id' | 'created_at' | 'updated_at'>): Promise<Test> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tests')
    .insert([test])
    .select()
    .single()

  if (error) throw error
  return data
}

// Question operations
export async function createQuestion(question: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<Question> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('questions')
    .insert([question])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createAnswerOption(answerOption: Omit<AnswerOption, 'id' | 'created_at' | 'updated_at'>): Promise<AnswerOption> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('answer_options')
    .insert([answerOption])
    .select()
    .single()

  if (error) throw error
  return data
}

// UserTest operations
export async function getUserTests(userId: string): Promise<UserTestWithDetails[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_tests')
    .select(`
      *,
      test:tests(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createUserTest(userTest: Omit<UserTest, 'id' | 'created_at' | 'updated_at'>): Promise<UserTest> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_tests')
    .insert([userTest])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUserTestScore(userTestId: string, score: number): Promise<UserTest> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_tests')
    .update({ score })
    .eq('id', userTestId)
    .select()
    .single()

  if (error) throw error
  return data
}

// UserAnswer operations
export async function createUserAnswer(userAnswer: Omit<UserAnswer, 'id' | 'created_at' | 'updated_at'>): Promise<UserAnswer> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_answers')
    .insert([userAnswer])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserTestAnswers(userTestId: string): Promise<UserAnswer[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_answers')
    .select('*')
    .eq('user_test_id', userTestId)

  if (error) throw error
  return data
}

// Utility functions
export async function getUserPurchasedCourses(userId: string): Promise<{ course_id: string; courses: Course }[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      course_id,
      courses(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')

  if (error) throw error
  return data as { course_id: string; courses: Course }[]
}

// File upload operations
export async function uploadFile(file: File, bucket: string = 'avatars'): Promise<string> {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
} 