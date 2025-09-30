import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { IReviewsService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";

const getReviewsInput = z.object({
  courseId: z.string(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(15),
  search: z.string().optional(),
  rating: z.number().optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
  sortBy: z.enum(["change", "created", "rating"]).optional(),
});

const createReviewInput = z.object({
  courseId: z.string(),
  content: z.string().min(10).max(2000),
  rating: z.number().min(1).max(5),
});

export const reviewsRouter = router({
  createReview: protectedProcedure
    .input(createReviewInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const reviewsService = ctx.container.resolve<IReviewsService>(
          DI_TOKENS.REVIEWS_SERVICE
        );
        return await reviewsService.createReview({
          userId: ctx.user.id,
          ...input,
        });
      } catch (error) {
        throw new Error(
          `Failed to create review: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
  getCourseReviews: protectedProcedure
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
  getCourseRatingStats: protectedProcedure
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

  getReviewById: protectedProcedure
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

  // Profile: Get user's reviews (infinite/cursor pagination)
  getUserReviews: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
        direction: z.enum(["forward", "backward"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const pageSize = input.limit ?? 15;
        const page = input.cursor ?? 1; // start from 1

        const reviewsService = ctx.container.resolve<IReviewsService>(
          DI_TOKENS.REVIEWS_SERVICE
        );

        const reviewsData = await reviewsService.getUserReviews(
          ctx.user.id,
          page,
          pageSize
        );

        const totalFetched = page * pageSize;
        const hasMore = totalFetched < reviewsData.totalRecords;

        return {
          ...reviewsData,
          nextCursor: hasMore ? page + 1 : undefined,
        };
      } catch (error) {
        throw new Error(
          `Failed to fetch user reviews: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  // Profile: Update a review (24-hour window enforced server-side)
  updateReview: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        content: z.string().min(10).max(2000),
        rating: z.number().min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const reviewsService = ctx.container.resolve<IReviewsService>(
          DI_TOKENS.REVIEWS_SERVICE
        );
        return await reviewsService.updateReview(ctx.user.id, input.reviewId, {
          content: input.content,
          rating: input.rating,
        });
      } catch (error) {
        throw new Error(
          `Failed to update review: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),

  // Profile: Delete a review
  deleteReview: protectedProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const reviewsService = ctx.container.resolve<IReviewsService>(
          DI_TOKENS.REVIEWS_SERVICE
        );
        await reviewsService.deleteReview(ctx.user.id, input.reviewId);
        return { success: true };
      } catch (error) {
        throw new Error(
          `Failed to delete review: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
});
