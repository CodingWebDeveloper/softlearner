import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { IReviewsService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";

const getReviewsInput = z.object({
  courseId: z.string(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
  search: z.string().optional(),
  rating: z.number().optional(),
});

export const reviewsRouter = router({
  getCourseReviews: publicProcedure
    .input(getReviewsInput)
    .query(async ({ ctx, input }) => {
      try {
        const reviewsService = ctx.container.resolve<IReviewsService>(
          DI_TOKENS.REVIEWS_SERVICE
        );
        return await reviewsService.getCourseReviews(input);
      } catch (error) {
        throw new Error(
          `Failed to fetch reviews: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getCourseRatingStats: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const reviewsService = ctx.container.resolve<IReviewsService>(
          DI_TOKENS.REVIEWS_SERVICE
        );
        return await reviewsService.getCourseRatingStats(input);
      } catch (error) {
        throw new Error(
          `Failed to fetch rating stats: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  getReviewById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const reviewsService = ctx.container.resolve<IReviewsService>(
          DI_TOKENS.REVIEWS_SERVICE
        );
        return await reviewsService.getReviewById(input);
      } catch (error) {
        throw new Error(
          `Failed to fetch review: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});
