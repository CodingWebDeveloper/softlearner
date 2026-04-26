import { z } from "zod";
import { IStripeConnectService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { router, protectedProcedure } from "../trpc";

export const stripeConnectRouter = router({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const service = ctx.container.resolve<IStripeConnectService>(
        DI_TOKENS.STRIPE_CONNECT_SERVICE,
      );
      return await service.getConnectStatus(ctx.user.id);
    } catch (error) {
      throw new Error(
        `Failed to get Stripe Connect status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }),

  createAccountLink: protectedProcedure
    .input(
      z.object({
        refreshUrl: z.string().url(),
        returnUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const service = ctx.container.resolve<IStripeConnectService>(
          DI_TOKENS.STRIPE_CONNECT_SERVICE,
        );
        const url = await service.createAccountLink({
          userId: ctx.user.id,
          refreshUrl: input.refreshUrl,
          returnUrl: input.returnUrl,
        });
        return { url };
      } catch (error) {
        throw new Error(
          `Failed to create onboarding link: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    }),

  getDashboardLink: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const service = ctx.container.resolve<IStripeConnectService>(
        DI_TOKENS.STRIPE_CONNECT_SERVICE,
      );
      const url = await service.getDashboardLink(ctx.user.id);
      return { url };
    } catch (error) {
      throw new Error(
        `Failed to get Stripe dashboard link: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }),
});
