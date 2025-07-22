import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { ICoursesService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";

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

export const coursesRouter = router({
  getCourses: publicProcedure
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

  getCourseById: publicProcedure
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
});
