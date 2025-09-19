import { z } from "zod";
import { ICoursesService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { router, protectedProcedure } from "../trpc";

const getCoursesInput = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const getBookmarkedCoursesInput = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
});

const getPurchasedCoursesInput = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
});

const getCreatorCoursesInput = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
  sortBy: z
    .enum(["name", "category", "price", "created_at", "updated_at"])
    .optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
});

// Helper function to extract and validate course data from FormData
const extractAndValidateCourseData = (formData: FormData) => {
  const courseData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    video_url: formData.get("video_url") as string,
    price: Number(formData.get("price")),
    new_price: formData.get("new_price")
      ? Number(formData.get("new_price"))
      : null,
    category_id: formData.get("category_id") as string,
    thumbnail_image: (formData.get("thumbnail_image") as File) || undefined,
  };

  // Validate the extracted data
  if (!courseData.name || courseData.name.length === 0) {
    throw new Error("Name is required");
  }
  if (!courseData.description || courseData.description.length === 0) {
    throw new Error("Description is required");
  }
  if (!courseData.video_url || !courseData.video_url.startsWith("http")) {
    throw new Error("Valid video URL is required");
  }
  if (isNaN(courseData.price) || courseData.price < 0) {
    throw new Error("Valid price is required");
  }
  if (
    courseData.new_price !== null &&
    (isNaN(courseData.new_price) || courseData.new_price < 0)
  ) {
    throw new Error("New price must be a valid number");
  }
  if (!courseData.category_id) {
    throw new Error("Category ID is required");
  }

  return courseData;
};

export const coursesRouter = router({
  createCourse: protectedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        const courseData = extractAndValidateCourseData(input);
        return await coursesService.createCourse(ctx.user.id, courseData);
      } catch (error) {
        throw new Error(
          `Failed to create course: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  updateCourse: protectedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        const courseId = input.get("id") as string;
        if (!courseId) {
          throw new Error("Course id is required");
        }

        const courseData = extractAndValidateCourseData(input);
        return await coursesService.updateCourse(
          ctx.user.id,
          courseId,
          courseData
        );
      } catch (error) {
        throw new Error(
          `Failed to update course: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getCourses: protectedProcedure
    .input(getCoursesInput)
    .query(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        return await coursesService.getCourses({
          ...input,
          userId: ctx.user?.id,
        });
      } catch (error) {
        throw new Error(
          `Failed to fetch courses: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getCourseById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        return await coursesService.getCourseById(input);
      } catch (error) {
        throw new Error(
          `Failed to fetch course: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getCourseDataById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        return await coursesService.getCourseDataById(input);
      } catch (error) {
        throw new Error(
          `Failed to fetch course data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getCourseMaterialsById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        const course = await coursesService.getCourseMaterialsById(
          input,
          ctx.user.id
        );

        if (!course) {
          throw new Error("Course not found");
        }

        return course;
      } catch (error) {
        throw new Error(
          `Failed to fetch course materials: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  isEnrolled: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: courseId }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        return await coursesService.isEnrolled(ctx.user.id, courseId);
      } catch (error) {
        throw new Error(
          `Failed to check enrollment: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getBookmarkedCourses: protectedProcedure
    .input(getBookmarkedCoursesInput)
    .query(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        return await coursesService.getBookmarkedCourses(
          ctx.user.id,
          input.page,
          input.pageSize
        );
      } catch (error) {
        throw new Error(
          `Failed to fetch bookmarked courses: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getPurchasedCourses: protectedProcedure
    .input(getPurchasedCoursesInput)
    .query(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        return await coursesService.getPurchasedCourses(
          ctx.user.id,
          input.page,
          input.pageSize
        );
      } catch (error) {
        throw new Error(
          `Failed to fetch purchased courses: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getCreatorCourses: protectedProcedure
    .input(getCreatorCoursesInput)
    .query(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        return await coursesService.getCoursesByCreator(
          ctx.user.id,
          input.page,
          input.pageSize,
          input.sortBy,
          input.sortDir
        );
      } catch (error) {
        throw new Error(
          `Failed to fetch creator courses: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  deleteCourse: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        await coursesService.deleteCourse(ctx.user.id, input.id);
        return { success: true };
      } catch (error) {
        throw new Error(
          `Failed to delete course: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getThumbnail: protectedProcedure
    .input(z.object({ path: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        const blob = await coursesService.getThumbnail(input.path);
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return { base64 };
      } catch (error) {
        throw new Error(
          `Failed to download thumbnail: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  togglePublishStatus: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        isPublished: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        await coursesService.togglePublishStatus(
          ctx.user.id,
          input.courseId,
          input.isPublished
        );

        return {
          success: true,
          isPublished: input.isPublished,
          message: input.isPublished
            ? "Course published successfully"
            : "Course unpublished successfully",
        };
      } catch (error) {
        throw new Error(
          `Failed to update course publish status: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getCourseCreationProgressStatus: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: courseId }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        return await coursesService.getCourseCreationProgressStatus(courseId);
      } catch (error) {
        throw new Error(
          `Failed to fetch course progress status: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});
