import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { getCourseReviews, getReviewById, getCourseRatingStats } from '../../../services/reviews-service';

const t = initTRPC.create();

const getReviewsInput = z.object({
  courseId: z.string(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
  search: z.string().optional(),
});

export const reviewsRouter = t.router({
  getCourseReviews: t.procedure
    .input(getReviewsInput)
    .query(async ({ input }) => {
      try {
        const result = await getCourseReviews(input);
        return result;
      } catch (error) {
        throw new Error(`Failed to fetch reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  getCourseRatingStats: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        return await getCourseRatingStats(input);
      } catch (error) {
        throw new Error(`Failed to fetch rating stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  getReviewById: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        return await getReviewById(input);
      } catch (error) {
        throw new Error(`Failed to fetch review: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
}); 