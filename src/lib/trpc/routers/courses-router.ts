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

export const coursesRouter = router({
  createCourse: protectedProcedure
    .input(z.instanceof(FormData))
    .mutation(async ({ ctx, input }) => {
      try {
        const coursesService = ctx.container.resolve<ICoursesService>(
          DI_TOKENS.COURSES_SERVICE
        );

        const formData = input  ;
        const courseData = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          video_url: formData.get("video_url") as string,
          price: Number(formData.get("price")),
          new_price: formData.get("new_price") ? Number(formData.get("new_price")) : null,
          category_id: formData.get("category_id") as string,
          thumbnail_image: formData.get("thumbnail_image") as File || undefined
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
        if (courseData.new_price !== null && (isNaN(courseData.new_price) || courseData.new_price < 0)) {
          throw new Error("New price must be a valid number");
        }
        if (!courseData.category_id) {
          throw new Error("Category ID is required");
        }

        return await coursesService.createCourse(ctx.user.id, courseData);
      } catch (error) {
        throw new Error(
          `Failed to create course: ${
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
});
