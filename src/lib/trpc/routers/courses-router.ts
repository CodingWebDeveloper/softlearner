import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { getCourses, getCourseById } from '../../../services/courses-service';

const t = initTRPC.create();

const getCoursesInput = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
  search: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const coursesRouter = t.router({
  getCourses: t.procedure
    .input(getCoursesInput)
    .query(async ({ input }) => {
      try {
        const result = await getCourses(input);
        return result;
      } catch (error) {
        throw new Error(`Failed to fetch courses: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
  getCourseById: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        return await getCourseById(input);
      } catch (error) {
        throw new Error(`Failed to fetch course: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
}); 