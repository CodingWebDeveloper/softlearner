import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { IPaymentsService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";

export const paymentsRouter = router({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const paymentsService = ctx.container.resolve<IPaymentsService>(
        DI_TOKENS.PAYMENTS_SERVICE
      );

      return paymentsService.createCheckoutSession({
        ...input,
        userId: ctx.user.id,
      });
    }),
});
