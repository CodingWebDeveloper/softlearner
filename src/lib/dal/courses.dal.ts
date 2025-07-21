import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ICoursesDAL } from "../di/interfaces/dal.interfaces";
import {
  GetCoursesParams,
  GetCoursesResult,
  BasicCourse,
  CourseCreator,
} from "@/services/interfaces/service.interfaces";
import { ORDER_STATUS } from "@/constants/stripe-constants";

type CourseWithRelations = Database["public"]["Tables"]["courses"]["Row"] & {
  creator: CourseCreator;
  category: Database["public"]["Tables"]["categories"]["Row"];
  reviews: { rating: number }[] | null;
  bookmarks?: { id: string }[] | null;
};

export class CoursesDAL implements ICoursesDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCourses(params: GetCoursesParams): Promise<GetCoursesResult> {
    const {
      page = 1,
      pageSize = 15,
      search,
      categoryId,
      tags,
      userId,
    } = params;

    let query = this.supabase.from("courses").select(
      `*, 
        creator:creator_id(*), 
        category:category_id(*), 
        reviews!course_id(rating),
        bookmarks!course_id(id)`,
      { count: "exact" }
    );

    if (userId) {
      query = query.eq("bookmarks.user_id", userId);
    }

    // Apply search filter if provided
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Apply category filter if provided
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    // Apply tags filter if provided
    if (tags && tags.length > 0) {
      const taggedCourseIds = await this.supabase
        .from("course_tags")
        .select("course_id")
        .in("tag_id", tags);

      if (taggedCourseIds.data) {
        query = query.in(
          "id",
          taggedCourseIds.data.map((row) => row.course_id)
        );
      }
    }

    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get paginated results
    const { data, error, count } = await query
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching courses: ${error.message}`);
    }

    // Transform the data to calculate rating and ratings_count
    const transformedData = (data as CourseWithRelations[] | null)?.map(
      (course) => {
        const ratings = course.reviews || [];
        const ratingsCount = ratings.length;
        const averageRating =
          ratingsCount > 0
            ? ratings.reduce((sum, review) => sum + (review.rating || 0), 0) /
              ratingsCount
            : 0;

        const basicCourse: BasicCourse = {
          id: course.id,
          name: course.name,
          description: course.description || "",
          video_url: course.video_url || "",
          price: course.price,
          new_price: course.new_price || null,
          thumbnail_image_url: course.thumbnail_image_url || "",
          creator: course.creator,
          category: course.category,
          rating: Number(averageRating.toFixed(1)),
          ratings_count: ratingsCount,
          created_at: course.created_at,
          updated_at: course.updated_at,
          isBookmarked: (course.bookmarks?.length ?? 0) > 0,
        };

        return basicCourse;
      }
    );

    return {
      data: transformedData || [],
      totalRecords: count || 0,
    };
  }

  async getCourseById(
    id: string,
    userId?: string
  ): Promise<BasicCourse | null> {
    const query = this.supabase
      .from("courses")
      .select(
        `
        *,
        creator:creator_id(*),
        category:category_id(*),
        reviews!course_id(rating),
        bookmarks!course_id(id)
      `
      )
      .eq("id", id);

    if (userId) {
      query.eq("bookmarks.user_id", userId);
    }

    const { data, error } = await query.single();

    if (error) {
      throw new Error(`Error fetching course: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const course = data as CourseWithRelations;
    const ratings = course.reviews || [];
    const ratingsCount = ratings.length;
    const averageRating =
      ratingsCount > 0
        ? ratings.reduce((sum, review) => sum + (review.rating || 0), 0) /
          ratingsCount
        : 0;

    const basicCourse: BasicCourse = {
      id: course.id,
      name: course.name,
      description: course.description || "",
      video_url: course.video_url || "",
      price: course.price,
      new_price: course.new_price || null,
      thumbnail_image_url: course.thumbnail_image_url || "",
      creator: course.creator,
      category: course.category,
      rating: Number(averageRating.toFixed(1)),
      ratings_count: ratingsCount,
      created_at: course.created_at,
      updated_at: course.updated_at,
      isBookmarked: (course.bookmarks?.length ?? 0) > 0,
    };

    return basicCourse;
  }

  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const { data: order, error } = await this.supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .maybeSingle();

    if (error) {
      throw new Error(`Error checking enrollment: ${error.message}`);
    }

    return !!order;
  }
}
