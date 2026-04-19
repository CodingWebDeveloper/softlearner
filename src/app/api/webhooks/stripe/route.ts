import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import Stripe from "stripe";
import { createWebhookClient } from "@/lib/supabase/server";
import { PAYMENT_ERRORS } from "@/lib/constants/error-messages";
import {
  STRIPE_WEBHOOK_EVENTS,
  ORDER_STATUS,
} from "@/lib/constants/stripe-constants";

// Create Supabase client for server-side operations
const supabase = createWebhookClient();

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Webhook signature verification failed:", errorMessage);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Handle the event
  switch (event.type) {
    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED: {
      const session = event.data.object as Stripe.Checkout.Session;

      if (
        !session.metadata?.orderId ||
        !session.metadata?.courseId ||
        !session.metadata?.userId
      ) {
        console.error("Missing required metadata in session");

        return NextResponse.json(
          { message: PAYMENT_ERRORS.WEBHOOK_MISSING_METADATA },
          { status: 400 },
        );
      }

      // Check if order is already processed (idempotency)
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("status")
        .eq("id", session.metadata.orderId)
        .single();

      if (existingOrder?.status === ORDER_STATUS.SUCCEEDED) {
        console.log(
          `Order ${session.metadata.orderId} already processed, skipping`,
        );
        return NextResponse.json({ received: true, skipped: true });
      }

      // Update order status to SUCCEEDED
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: ORDER_STATUS.SUCCEEDED,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.metadata.orderId);

      if (updateError) {
        console.error("Failed to update order status:", updateError);

        return NextResponse.json(
          { message: PAYMENT_ERRORS.UPDATE_ORDER_STATUS_FAILED },
          { status: 500 },
        );
      }

      console.log(
        `✅ Order ${session.metadata.orderId} marked as SUCCEEDED for user ${session.metadata.userId}`,
      );

      break;
    }

    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_EXPIRED: {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.metadata?.orderId) {
        console.error("Missing orderId in session metadata");
        return NextResponse.json(
          { message: PAYMENT_ERRORS.WEBHOOK_MISSING_ORDER_ID },
          { status: 400 },
        );
      }

      // Update order status to FAILED
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: ORDER_STATUS.FAILED,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.metadata.orderId);

      if (updateError) {
        console.error("Failed to update order status:", updateError);
        return NextResponse.json(
          { message: PAYMENT_ERRORS.UPDATE_ORDER_STATUS_FAILED },
          { status: 500 },
        );
      }

      console.log(`⏰ Order ${session.metadata.orderId} expired`);

      break;
    }

    case STRIPE_WEBHOOK_EVENTS.PAYMENT_INTENT_SUCCEEDED: {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `✅ PaymentIntent ${paymentIntent.id} succeeded for amount ${paymentIntent.amount}`,
      );
      break;
    }

    case STRIPE_WEBHOOK_EVENTS.PAYMENT_INTENT_FAILED: {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Find order by payment intent ID and mark as failed
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("stripe_payment_intent_id", paymentIntent.id)
        .single();

      if (order) {
        await supabase
          .from("orders")
          .update({
            status: ORDER_STATUS.FAILED,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        console.log(
          `❌ Payment failed for order ${order.id}: ${paymentIntent.last_payment_error?.message || "Unknown error"}`,
        );
      }

      break;
    }

    case STRIPE_WEBHOOK_EVENTS.CHARGE_REFUNDED: {
      const charge = event.data.object as Stripe.Charge;

      // Find order by payment intent ID and mark as refunded
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("stripe_payment_intent_id", charge.payment_intent as string)
        .single();

      if (order) {
        await supabase
          .from("orders")
          .update({
            status: ORDER_STATUS.REFUNDED,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        console.log(
          `💰 Refund processed for order ${order.id}, amount: ${charge.amount_refunded}`,
        );
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
