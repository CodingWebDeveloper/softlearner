import { getUserPurchasedCourses, getCourseResources } from '../lib/database/database.types'
import type { CourseProgress, Course, Resource } from '../lib/database/database.types'

export const getUserCoursesWithProgress = async (userId: string): Promise<CourseProgress[]> => {
  // Get user's purchased courses (raw order data)
  const orders = await getUserPurchasedCourses(userId)
  const purchasedCourses: Course[] = orders.map((order: { course_id: string; courses: Course }) => order.courses)

  // For each course, get progress information
  const courseProgressPromises = purchasedCourses.map(async (course) => {
    // Get resources for this course
    const resources: Resource[] = await getCourseResources(course.id)
    // Simulate progress (replace with real logic if available)
    const totalResources = resources.length
    const completedResources = Math.floor(Math.random() * (totalResources + 1))
    const progressPercentage = totalResources > 0 ? (completedResources / totalResources) * 100 : 0
    let status: 'not_started' | 'in_progress' | 'completed' = 'not_started'
    if (completedResources > 0) {
      status = completedResources === totalResources ? 'completed' : 'in_progress'
    }
    const nextResource = resources.find((_, index) => index >= completedResources)
    return {
      course: {
        ...course,
        title: course.name,
        instructor_name: 'Instructor',
        total_resources: totalResources,
        created_at: course.created_at,
        updated_at: course.updated_at
      },
      total_resources: totalResources,
      completed_resources: completedResources,
      progress_percentage: progressPercentage,
      last_accessed: course.updated_at,
      status,
      next_resource: nextResource
    }
  })
  return Promise.all(courseProgressPromises)
} 