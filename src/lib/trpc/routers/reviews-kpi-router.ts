import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { DI_TOKENS } from "@/lib/di/registry";
import { IReviewsKpiService } from "@/services/interfaces/service.interfaces";

const recentReviewsInput = z
  .object({
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(50).optional(),
  })
  .optional();

export const reviewsKpiRouter = router({
  getCreatorRecentReviews: protectedProcedure
    .input(recentReviewsInput)
    .query(async ({ ctx, input }) => {
      const svc = ctx.container.resolve<IReviewsKpiService>(
        DI_TOKENS.REVIEWS_KPI_SERVICE
      );
      const page = input?.page ?? 1;
      const pageSize = input?.pageSize ?? 10;
      return svc.getCreatorRecentReviews(ctx.user.id, page, pageSize);
    }),
  getCreatorAverageRating: protectedProcedure.query(async ({ ctx }) => {
    const svc = ctx.container.resolve<IReviewsKpiService>(
      DI_TOKENS.REVIEWS_KPI_SERVICE
    );
    return svc.getCreatorAverageRating(ctx.user.id);
  }),
});
