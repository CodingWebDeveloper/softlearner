import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ICoursesDAL } from "../di/interfaces/dal.interfaces";
import {
  GetCoursesParams,
  GetCoursesResult,
  BasicCourse,
  CourseCreator,
  CreateCourseParams,
  SimpleCourse,
  User,
} from "@/services/interfaces/service.interfaces";
import { ORDER_STATUS } from "@/lib/constants/stripe-constants";
import { FullCourse } from "@/services/interfaces/service.interfaces";

type CourseWithRelations = Database["public"]["Tables"]["courses"]["Row"] & {
  creator: CourseCreator;
  category: Database["public"]["Tables"]["categories"]["Row"];
  reviews: { rating: number }[] | null;
  bookmarks?: { id: string }[] | null;
};

type SimpleCourseWithRelations = Database["public"]["Tables"]["courses"]["Row"] & {
  creator: User;
  category: Database["public"]["Tables"]["categories"]["Row"];
};

type BookmarkWithCourse = Database["public"]["Tables"]["bookmarks"]["Row"] & {
  course: CourseWithRelations;
};

type PurchasedCourseResource = {
  id: string;
  completed: boolean;
};

type PurchasedCourse = {
  id: string;
  name: string;
  creator: CourseCreator;
  resources: PurchasedCourseResource[];
  orderCreatedAt: string;
};

type GetPurchasedCoursesResult = {
  data: PurchasedCourse[];
  totalRecords: number;
};

type OrderWithCourse = Database["public"]["Tables"]["orders"]["Row"] & {
  course: {
    id: string;
    name: string;
    creator: CourseCreator;
    resources: Array<{
      id: string;
      user_resources: Array<{
        user_id: string;
        completed: boolean;
      }> | null;
    }>;
  };
};

export class CoursesDAL implements ICoursesDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async createCourse(creatorId: string, params: CreateCourseParams): Promise<SimpleCourse> {
    // Create course record first
    const { data: courseData, error: courseError } = await this.supabase
      .from("courses")
      .insert({
        name: params.name,
        description: params.description,
        video_url: params.video_url,
        price: params.price,
        new_price: params.new_price || null,
        category_id: params.category_id,
        creator_id: creatorId,
        thumbnail_image_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        creator:creator_id(*),
        category:category_id(*)
      `)
      .single();

    if (courseError) {
      throw new Error(`Error creating course: ${courseError.message}`);
    }

    if (!courseData) {
      throw new Error("Course was created but no data was returned");
    }

    const course = courseData as unknown as SimpleCourseWithRelations;
    await this.uploadCourseThumbnail(creatorId, course.id, params.thumbnail_image as File);

    const basicCourse: SimpleCourse = {
      id: course.id,
      name: course.name,
      description: course.description || "",
      video_url: course.video_url || "",
      price: course.price,
      new_price: course.new_price || null,
      thumbnail_image_url: course.thumbnail_image_url || "",
      creator: course.creator as User,  
      category: course.category,
      currency: course.currency,
      created_at: course.created_at,
      updated_at: course.updated_at,
    };

    return basicCourse;
  }

  async uploadCourseThumbnail(creatorId: string, courseId: string, file: File): Promise<string> {
    // Upload the thumbnail
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from("course-thumbnails")
      .upload(courseId, file);

    if (uploadError) {
      throw new Error(`Error uploading thumbnail: ${uploadError.message}`);
    }

    // Update the course with the new thumbnail path
    const { error: updateError } = await this.supabase
      .from("courses")
      .update({
        thumbnail_image_url: uploadData.path,
        updated_at: new Date().toISOString(),
      })
      .eq("id", courseId);

    if (updateError) {
      // If course update fails, clean up the uploaded file
      await this.supabase.storage
        .from("course-thumbnails")
        .remove([uploadData.path])
        .catch(console.error);
      throw new Error(`Error updating course thumbnail: ${updateError.message}`);
    }

    return uploadData.path;
  }

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

  async getBookmarkedCourses(
    userId: string,
    page: number = 1,
    pageSize: number = 15
  ): Promise<GetCoursesResult> {
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Query courses through bookmarks join
    const { data, error, count } = await this.supabase
      .from("bookmarks")
      .select(
        `
        id,
        user_id,
        course_id,
        created_at,
        course:course_id(
          *,
          creator:creator_id(*),
          category:category_id(*),
          reviews!course_id(rating)
        )
      `,
        { count: "exact" }
      )
      .eq("user_id", userId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching bookmarked courses: ${error.message}`);
    }

    // Transform the data to match the BasicCourse structure
    const transformedData =
      (data as unknown as BookmarkWithCourse[] | null)?.map((bookmark) => {
        const course = bookmark.course;
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
          created_at: course.created_at,
          updated_at: course.updated_at,
          isBookmarked: true,
        };

        return basicCourse;
      }) || [];

    return {
      data: transformedData,
      totalRecords: count || 0,
    };
  }

  async getPurchasedCourses(
    userId: string,
    page: number = 1,
    pageSize: number = 15
  ): Promise<GetPurchasedCoursesResult> {
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.supabase
      .from("orders")
      .select(
        `
        created_at,
        course:course_id (
          id,
          name,
          creator:creator_id (*),
          resources (
            id,
            user_resources (
              completed,
              user_id
            )
          )
        )
        `,
        { count: "exact" }
      )
      .eq("user_id", userId)
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching purchased courses: ${error.message}`);
    }

    const transformedData =
      (data as unknown as OrderWithCourse[])?.map((order) => {
        const course = order.course;

        return {
          id: course.id,
          name: course.name,
          creator: course.creator,
          resources: course.resources.map((resource) => ({
            id: resource.id,
            completed:
              resource.user_resources?.some(
                (ur) => ur.user_id === userId && ur.completed
              ) ?? false,
          })),
          orderCreatedAt: order.created_at,
        };
      }) || [];

    return {
      data: transformedData,
      totalRecords: count || 0,
    };
  }

  async getCourseMaterialsById(
    id: string,
    userId?: string
  ): Promise<FullCourse | null> {
    let query = this.supabase
      .from("courses")
      .select(
        `
       *,
        creator:creator_id(*),
        category:category_id(*),
        bookmarks!course_id(id)
      `
      )
      .eq("id", id);

    if (userId) {
      query = query.eq("bookmarks.user_id", userId);
    }

    const { data, error } = await query.single();

    if (error) {
      throw new Error(`Error fetching course materials: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    // Type assertion to unknown first, then to the expected type
    const course = data as unknown as {
      id: string;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
      creator: CourseCreator;
      category: Database["public"]["Tables"]["categories"]["Row"];
      bookmarks: { id: string }[] | null;
      video_url: string;
    };

    const courseData: FullCourse = {
      id: course.id,
      name: course.name,
      description: course.description || "",
      creator: course.creator,
      category: course.category,
      created_at: course.created_at,
      updated_at: course.updated_at,
      isBookmarked: (course.bookmarks?.length ?? 0) > 0,
      video_url: course.video_url || "",
    };

    return courseData;
  }
}
