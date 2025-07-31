import { SupabaseClient } from "@supabase/supabase-js";
import { Course, Database } from "../database/database.types";
import { IPaymentsDAL } from "../di/interfaces/dal.interfaces";
import {
  CreateCheckoutSessionInput,
  CheckoutSessionResponse,
} from "@/services/interfaces/service.interfaces";
import { ORDER_STATUS } from "@/lib/constants/stripe-constants";
import { TRPCError } from "@trpc/server";
import { PAYMENT_ERRORS } from "@/lib/constants/error-messages";
import {
  stripe,
  formatAmountForStripe,
  getActualCoursePrice,
} from "../stripe/stripe";
import { STRIPE_PAYMENT_METHODS } from "@/lib/constants/stripe-constants";

export class PaymentsDAL implements IPaymentsDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCourseById(courseId: string): Promise<Course | null> {
    const { data: course, error } = await this.supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: PAYMENT_ERRORS.COURSE_NOT_FOUND,
      });
    }

    return course;
  }

  async checkExistingSuccessfulOrder(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const { data: existingOrder } = await this.supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("status", ORDER_STATUS.SUCCEEDED)
      .single();

    return !!existingOrder;
  }

  async checkExistingOrder(
    userId: string,
    courseId: string
  ): Promise<{ id: string } | null> {
    const { data: existingOrder } = await this.supabase
      .from("orders")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    return existingOrder;
  }

  async createOrder(order: {
    user_id: string;
    course_id: string;
    total_amount: number;
    currency: string;
    status: string;
  }): Promise<{ id: string }> {
    const { data: newOrder, error } = await this.supabase
      .from("orders")
      .insert(order)
      .select("id")
      .single();

    if (error || !newOrder) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: PAYMENT_ERRORS.CREATE_ORDER_FAILED,
      });
    }

    return newOrder;
  }

  async updateOrderPaymentIntent(
    orderId: string,
    paymentIntentId: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from("orders")
      .update({ stripe_payment_intent_id: paymentIntentId })
      .eq("id", orderId);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: PAYMENT_ERRORS.UPDATE_ORDER_STATUS_FAILED,
      });
    }
  }

  async createCheckoutSession(
    input: CreateCheckoutSessionInput
  ): Promise<CheckoutSessionResponse> {
    const { courseId, successUrl, cancelUrl, userId } = input;

    // Get course details
    const course = await this.getCourseById(courseId);
    if (!course) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: PAYMENT_ERRORS.COURSE_NOT_FOUND,
      });
    }

    // Check if already purchased
    const hasSuccessfulOrder = await this.checkExistingSuccessfulOrder(
      userId,
      courseId
    );
    if (hasSuccessfulOrder) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: PAYMENT_ERRORS.ALREADY_PURCHASED,
      });
    }

    try {
      // Get or create order
      let orderId: string;
      const existingOrder = await this.checkExistingOrder(userId, courseId);

      if (existingOrder) {
        orderId = existingOrder.id;
      } else {
        const actualPrice = getActualCoursePrice(
          course.price,
          course.new_price || null
        );
        const newOrder = await this.createOrder({
          user_id: userId,
          course_id: courseId,
          total_amount: actualPrice,
          currency: course.currency,
          status: ORDER_STATUS.PENDING,
        });
        orderId = newOrder.id;
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: [STRIPE_PAYMENT_METHODS.CARD],
        line_items: [
          {
            price_data: {
              currency: course.currency?.toLowerCase(),
              product_data: {
                name: course.name,
                description: course.description || undefined,
                images: course.thumbnail_image_url
                  ? [course.thumbnail_image_url]
                  : undefined,
              },
              unit_amount: formatAmountForStripe(
                getActualCoursePrice(course.price, course.new_price || null)
              ),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          orderId,
          courseId,
          userId,
        },
      });

      // Update order with payment intent
      if (session.payment_intent) {
        await this.updateOrderPaymentIntent(
          orderId,
          session.payment_intent as string
        );
      }

      return { sessionId: session.id };
    } catch (error) {
      console.error("Checkout session error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: PAYMENT_ERRORS.CREATE_CHECKOUT_SESSION_FAILED,
      });
    }
  }
}
