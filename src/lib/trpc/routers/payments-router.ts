import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../server';
import { stripe, formatAmountForStripe, getActualCoursePrice } from '../../stripe/stripe';
import { PAYMENT_ERRORS } from '@/constants/error-messages';
import { STRIPE_PAYMENT_METHODS, ORDER_STATUS } from '@/constants/stripe-constants';
import { createPaymentClient } from '../../supabase/server';

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
      const { courseId, successUrl, cancelUrl } = input;
      const userId = ctx.user.id; // Now we know user exists because of protectedProcedure

      // Get course details from database
      const { data: course, error: courseError } = await ctx.supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError || !course) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: PAYMENT_ERRORS.COURSE_NOT_FOUND,
        });
      }

      // Check if user already purchased this course
      const { data: existingOrder, error: orderError } = await ctx.supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('status', ORDER_STATUS.SUCCEEDED)
        .single();

      if (existingOrder) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: PAYMENT_ERRORS.ALREADY_PURCHASED,
        });
      }

      const actualPrice = getActualCoursePrice(course.price, course.new_price);

      try {
        // Use payment client for order operations
        const paymentClient = createPaymentClient();
        // Check if order already exists
        const { data: tempOrder, error: orderError } = await paymentClient
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .maybeSingle();

        let orderId = tempOrder?.id as string;

        console.log("tempOrder", tempOrder);
        if (tempOrder === null || tempOrder === undefined) {
          // Create a new order record
          const { data: order, error: createOrderError } = await paymentClient
            .from('orders')
            .insert({
              user_id: userId,
              course_id: courseId,
              total_amount: actualPrice,
              currency: course.currency,
              status: ORDER_STATUS.PENDING
            })
            .select()
            .maybeSingle();

          if (createOrderError || !order) {
            console.error('Create order error:', createOrderError);
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: PAYMENT_ERRORS.CREATE_ORDER_FAILED,
            });
          }

          orderId = order.id;
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: [STRIPE_PAYMENT_METHODS.CARD],
          line_items: [
            {
              price_data: {
                currency: course.currency.toLowerCase(),
                product_data: {
                  name: course.name,
                  description: course.description || undefined,
                  images: course.thumbnail_image_url ? [course.thumbnail_image_url] : undefined,
                },
                unit_amount: formatAmountForStripe(actualPrice),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl,
          metadata: {
            orderId: orderId,
            courseId: courseId,
            userId: userId,
          },
        });

        // Update order with Stripe payment intent ID using payment client
        await paymentClient
          .from('orders')
          .update({ stripe_payment_intent_id: session.payment_intent as string })
          .eq('id', orderId);

        return { sessionId: session.id };
      } catch (error) {
        console.error('Checkout session error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: PAYMENT_ERRORS.CREATE_CHECKOUT_SESSION_FAILED,
        });
      }
    }),
}); 