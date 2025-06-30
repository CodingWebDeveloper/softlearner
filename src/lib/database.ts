import { createClient } from './supabase'

// Type definitions
interface UserProfile {
  id: string
  full_name?: string
  avatar_url?: string
  updated_at?: string
}

interface ProfileUpdates {
  full_name?: string
  avatar_url?: string
}

interface QueryParams {
  [key: string]: string | number | boolean
}

// Course and Progress types
interface Course {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  instructor_name: string
  total_resources: number
  created_at: string
  updated_at: string
}

interface Resource {
  id: string
  course_id: string
  title: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  duration?: number // in minutes
  order_index: number
  created_at: string
}

interface UserProgress {
  id: string
  user_id: string
  course_id: string
  resource_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  completed_at?: string
  last_accessed: string
}

export interface CourseProgress {
  course: Course
  total_resources: number
  completed_resources: number
  progress_percentage: number
  last_accessed: string
  status: 'not_started' | 'in_progress' | 'completed'
  next_resource?: Resource
}



// User profile operations
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: ProfileUpdates): Promise<UserProfile> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createUserProfile(userId: string, profile: ProfileUpdates): Promise<UserProfile> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...profile }])
    .select()
    .single()

  if (error) throw error
  return data
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

// Generic database operations
export async function fetchData<T = Record<string, unknown>>(table: string, query?: QueryParams): Promise<T[]> {
  const supabase = createClient()
  let queryBuilder = supabase.from(table).select('*')

  if (query) {
    Object.keys(query).forEach(key => {
      queryBuilder = queryBuilder.eq(key, query[key])
    })
  }

  const { data, error } = await queryBuilder

  if (error) throw error
  return data
}

export async function insertData<T = Record<string, unknown>>(table: string, data: T): Promise<T[]> {
  const supabase = createClient()
  const { data: result, error } = await supabase
    .from(table)
    .insert([data])
    .select()

  if (error) throw error
  return result
}

export async function updateData<T = Record<string, unknown>>(table: string, id: string, updates: Partial<T>): Promise<T[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

export async function deleteData(table: string, id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Course and Progress operations
export async function getUserCourses(userId: string): Promise<CourseProgress[]> {
  const supabase = createClient()
  
  // Get all courses the user has access to
  const { data: userCourses, error: userCoursesError } = await supabase
    .from('user_courses')
    .select(`
      course_id,
      courses (
        id,
        title,
        description,
        thumbnail_url,
        instructor_name,
        total_resources,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', userId)

  if (userCoursesError) throw userCoursesError

  // Get progress for each course
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const courseProgressPromises = userCourses.map(async (userCourse: any) => {
    const course = userCourse.courses as Course
    
    // Get all resources for this course
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .eq('course_id', course.id)
      .order('order_index')

    if (resourcesError) throw resourcesError

    // Get user progress for this course
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', course.id)

    if (progressError) throw progressError

    // Calculate progress
    const totalResources = resources.length
    const completedResources = progress.filter((p: UserProgress) => p.status === 'completed').length
    const progressPercentage = totalResources > 0 ? (completedResources / totalResources) * 100 : 0

    // Determine status
    let status: 'not_started' | 'in_progress' | 'completed' = 'not_started'
    if (completedResources > 0) {
      status = completedResources === totalResources ? 'completed' : 'in_progress'
    }

    // Find last accessed resource
    const lastAccessed = progress.length > 0 
      ? progress.reduce((latest: UserProgress, current: UserProgress) => 
          new Date(current.last_accessed) > new Date(latest.last_accessed) ? current : latest
        ).last_accessed
      : course.created_at

    // Find next resource to continue
    const nextResource = resources.find((resource: Resource) => {
      const resourceProgress = progress.find((p: UserProgress) => p.resource_id === resource.id)
      return !resourceProgress || resourceProgress.status !== 'completed'
    })

    return {
      course,
      total_resources: totalResources,
      completed_resources: completedResources,
      progress_percentage: progressPercentage,
      last_accessed: lastAccessed,
      status,
      next_resource: nextResource
    }
  })

  return Promise.all(courseProgressPromises)
}

export async function updateResourceProgress(
  userId: string, 
  courseId: string, 
  resourceId: string, 
  status: 'not_started' | 'in_progress' | 'completed'
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      resource_id: resourceId,
      status,
      last_accessed: new Date().toISOString(),
      completed_at: status === 'completed' ? new Date().toISOString() : null
    })

  if (error) throw error
}

export async function getCourseResources(courseId: string): Promise<Resource[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index')

  if (error) throw error
  return data
}

// Mock data for testing (remove this when database is set up)
export function getMockCourses(): CourseProgress[] {
  return [
    {
      course: {
        id: "1",
        title: "React Fundamentals",
        description: "Learn the basics of React including components, props, state, and hooks.",
        instructor_name: "Sarah Johnson",
        total_resources: 12,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z"
      },
      total_resources: 12,
      completed_resources: 8,
      progress_percentage: 66.67,
      last_accessed: "2024-01-20T14:30:00Z",
      status: "in_progress",
      next_resource: {
        id: "9",
        course_id: "1",
        title: "Custom Hooks",
        type: "video",
        duration: 25,
        order_index: 9,
        created_at: "2024-01-15T10:00:00Z"
      }
    },
    {
      course: {
        id: "2",
        title: "Advanced TypeScript",
        description: "Master TypeScript with advanced patterns, generics, and type safety.",
        instructor_name: "Mike Chen",
        total_resources: 15,
        created_at: "2024-01-10T09:00:00Z",
        updated_at: "2024-01-10T09:00:00Z"
      },
      total_resources: 15,
      completed_resources: 15,
      progress_percentage: 100,
      last_accessed: "2024-01-18T16:45:00Z",
      status: "completed"
    },
    {
      course: {
        id: "3",
        title: "Next.js App Router",
        description: "Build modern web applications with Next.js 13+ App Router and Server Components.",
        instructor_name: "Alex Rodriguez",
        total_resources: 18,
        created_at: "2024-01-05T11:00:00Z",
        updated_at: "2024-01-05T11:00:00Z"
      },
      total_resources: 18,
      completed_resources: 3,
      progress_percentage: 16.67,
      last_accessed: "2024-01-22T10:15:00Z",
      status: "in_progress",
      next_resource: {
        id: "4",
        course_id: "3",
        title: "Server Components Deep Dive",
        type: "video",
        duration: 35,
        order_index: 4,
        created_at: "2024-01-05T11:00:00Z"
      }
    }
  ];
} 