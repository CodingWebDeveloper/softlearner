import { z } from "zod";
import { getCourses, getCourseById } from "../../../services/courses-service";
import { router, procedure } from "../server";
import { ORDER_STATUS } from "@/constants/stripe-constants";

const getCoursesInput = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const coursesRouter = router({
  getCourses: procedure.input(getCoursesInput).query(async ({ input }) => {
    try {
      const { data, totalRecords } = await getCourses(input);
      return {
        courses: data,
        totalRecord: totalRecords,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch courses: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }),

  getCourseById: procedure.input(z.string().uuid()).query(async ({ input }) => {
    try {
      const course = await getCourseById(input);
      return course;
    } catch (error) {
      throw new Error(
        `Failed to fetch course: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }),

  isEnrolled: procedure
    .input(z.string().uuid())
    .query(async ({ ctx, input: courseId }) => {
      if (!ctx.user?.id) {
        return false;
      }

      const { data: order, error } = await ctx.supabase
        .from("orders")
        .select("*")
        .eq("user_id", ctx.user.id)
        .eq("course_id", courseId)
        .eq("status", ORDER_STATUS.SUCCEEDED)
        .maybeSingle();

      if (error) {
        console.error("Error checking enrollment:", error);
        return false;
      }

      return !!order;
    }),
});
