import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { ICoursesDAL, PaginatedResult } from "../di/interfaces/dal.interfaces";
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

type SimpleCourseWithRelations =
  Database["public"]["Tables"]["courses"]["Row"] & {
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

  async createCourse(
    creatorId: string,
    params: CreateCourseParams
  ): Promise<SimpleCourse> {
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
      .select(
        `
        *,
        creator:creator_id(*),
        category:category_id(*)
      `
      )
      .single();

    if (courseError) {
      throw new Error(`Error creating course: ${courseError.message}`);
    }

    if (!courseData) {
      throw new Error("Course was created but no data was returned");
    }

    const course = courseData as unknown as SimpleCourseWithRelations;
    await this.uploadCourseThumbnail(
      creatorId,
      course.id,
      params.thumbnail_image as File
    );

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

  async uploadCourseThumbnail(
    creatorId: string,
    courseId: string,
    file: File
  ): Promise<string> {
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
      throw new Error(
        `Error updating course thumbnail: ${updateError.message}`
      );
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

  async getCourseDataById(id: string): Promise<SimpleCourse | null> {
    const { data, error } = await this.supabase
      .from("courses")
      .select(
        `*,
        creator:creator_id(*),
        category:category_id(*)`
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching course data: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const course = data as unknown as SimpleCourseWithRelations;

    const simpleCourse: SimpleCourse = {
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

    return simpleCourse;
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

  async getCoursesByCreator(
    creatorId: string,
    page: number = 1,
    pageSize: number = 15,
    sortBy?: "name" | "category" | "price" | "created_at" | "updated_at",
    sortDir: "asc" | "desc" = "desc"
  ): Promise<PaginatedResult<SimpleCourse>> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Map sortBy to actual columns; for category we sort by category.name
    const sortColumn =
      sortBy === "category"
        ? "category.name"
        : sortBy === "name" ||
          sortBy === "price" ||
          sortBy === "created_at" ||
          sortBy === "updated_at"
        ? sortBy
        : "created_at";

    let query = this.supabase
      .from("courses")
      .select(
        `*,
        creator:creator_id(*),
        category:category_id(*)`,
        { count: "exact" }
      )
      .eq("creator_id", creatorId)
      .range(from, to);

    // Supabase PostgREST supports ordering by foreign table columns using dot notation
    query = query.order(sortColumn, { ascending: sortDir === "asc" });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error fetching creator courses: ${error.message}`);
    }

    const transformedData = (
      data as unknown as SimpleCourseWithRelations[] | null
    )?.map((course) => {
      const simpleCourse: SimpleCourse = {
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

      return simpleCourse;
    });

    return {
      data: transformedData || [],
      totalRecords: count || 0,
    };
  }

  async updateCourse(
    creatorId: string,
    courseId: string,
    params: CreateCourseParams
  ): Promise<SimpleCourse> {
    // Verify ownership and fetch existing course
    const { data: existing, error: fetchError } = await this.supabase
      .from("courses")
      .select("id, creator_id, thumbnail_image_url")
      .eq("id", courseId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(`Error fetching course: ${fetchError.message}`);
    }

    if (!existing) {
      throw new Error("Course not found");
    }

    if (existing.creator_id !== creatorId) {
      throw new Error("You are not authorized to update this course");
    }

    let newThumbnailPath: string | undefined;

    console.log(params.thumbnail_image);
    // If a new thumbnail is provided, replace it in storage
    if (params.thumbnail_image) {
      const currentPath = existing.thumbnail_image_url || "";

      if (currentPath) {
        await this.supabase.storage
          .from("course-thumbnails")
          .remove([currentPath])
          .catch(console.warn);
      }

      const { data: uploadData, error: uploadError } =
        await this.supabase.storage
          .from("course-thumbnails")
          .upload(courseId, params.thumbnail_image);

      if (uploadError) {
        throw new Error(`Error uploading thumbnail: ${uploadError.message}`);
      }

      newThumbnailPath = uploadData.path;
    }

    // Update the course record
    const { data: updatedData, error: updateError } = await this.supabase
      .from("courses")
      .update({
        name: params.name,
        description: params.description,
        video_url: params.video_url,
        price: params.price,
        new_price: params.new_price || null,
        category_id: params.category_id,
        ...(newThumbnailPath ? { thumbnail_image_url: newThumbnailPath } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", courseId)
      .select(
        `*,
        creator:creator_id(*),
        category:category_id(*)`
      )
      .single();

    if (updateError) {
      // Cleanup newly uploaded thumbnail if DB update failed
      if (newThumbnailPath) {
        await this.supabase.storage
          .from("course-thumbnails")
          .remove([newThumbnailPath])
          .catch(console.warn);
      }
      throw new Error(`Error updating course: ${updateError.message}`);
    }

    const updated = updatedData as unknown as SimpleCourseWithRelations;

    const simpleCourse: SimpleCourse = {
      id: updated.id,
      name: updated.name,
      description: updated.description || "",
      video_url: updated.video_url || "",
      price: updated.price,
      new_price: updated.new_price || null,
      thumbnail_image_url: updated.thumbnail_image_url || "",
      creator: updated.creator as User,
      category: updated.category,
      currency: updated.currency,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    };

    return simpleCourse;
  }

  async deleteCourse(creatorId: string, courseId: string): Promise<void> {
    // Fetch current thumbnail path to clean up after deletion
    const { data: courseData, error: fetchError } = await this.supabase
      .from("courses")
      .select("thumbnail_image_url, creator_id")
      .eq("id", courseId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(
        `Error fetching course before delete: ${fetchError.message}`
      );
    }

    if (!courseData) {
      throw new Error("Course not found");
    }

    if (courseData.creator_id !== creatorId) {
      throw new Error("You are not authorized to delete this course");
    }

    const thumbnailPath = courseData.thumbnail_image_url || "";

    const { error: deleteError } = await this.supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (deleteError) {
      throw new Error(`Error deleting course: ${deleteError.message}`);
    }

    if (thumbnailPath) {
      await this.supabase.storage
        .from("course-thumbnails")
        .remove([thumbnailPath])
        .catch(console.error);
    }
  }

  async getThumbnail(thumbnailPath: string): Promise<Blob> {
    const { data, error } = await this.supabase.storage
      .from("course-thumbnails")
      .download(thumbnailPath);

    if (error) {
      throw new Error(`Error downloading course thumbnail: ${error.message}`);
    }

    if (!data) {
      throw new Error("No thumbnail data received");
    }

    return data;
  }
}
