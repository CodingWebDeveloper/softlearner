import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { IPaymentsService } from "@/services/interfaces/service.interfaces";
import { DI_TOKENS } from "@/lib/di/registry";
import { stripe } from "@/lib/stripe/stripe";
import { TRPCError } from "@trpc/server";

export const paymentsRouter = router({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const paymentsService = ctx.container.resolve<IPaymentsService>(
        DI_TOKENS.PAYMENTS_SERVICE,
      );

      return paymentsService.createCheckoutSession({
        ...input,
        userId: ctx.user.id,
      });
    }),

  verifySession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          input.sessionId,
        );

        if (session.payment_status !== "paid") {
          return {
            success: false,
            status: session.payment_status,
          };
        }

        const orderId = session.metadata?.orderId;
        if (!orderId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Order ID not found in session",
          });
        }

        const { data: order, error } = await ctx.supabase
          .from("orders")
          .select("status, course_id")
          .eq("id", orderId)
          .single();

        if (error || !order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }

        return {
          success: true,
          orderStatus: order.status,
          courseId: order.course_id,
          paymentStatus: session.payment_status,
        };
      } catch (error) {
        console.error("Session verification error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify session",
        });
      }
    }),
});
