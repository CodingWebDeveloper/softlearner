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

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      const grossAmount = Number(
        ((session.amount_total ?? 0) / 100).toFixed(2),
      );
      let platformFeeAmount = 0;
      let stripeFeeAmount = 0;

      if (paymentIntentId) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId,
            {
              expand: ["latest_charge.balance_transaction"],
            },
          );

          platformFeeAmount = Number(
            (
              ((paymentIntent.application_fee_amount ?? 0) as number) / 100
            ).toFixed(2),
          );

          const latestCharge =
            paymentIntent.latest_charge &&
            typeof paymentIntent.latest_charge !== "string"
              ? paymentIntent.latest_charge
              : null;

          const balanceTransaction = latestCharge?.balance_transaction;
          if (balanceTransaction && typeof balanceTransaction !== "string") {
            stripeFeeAmount = Number((balanceTransaction.fee / 100).toFixed(2));
          }
        } catch (paymentIntentError) {
          console.error(
            "Failed to resolve payment intent financials:",
            paymentIntentError,
          );
        }
      }

      const netAmount = Number(
        (grossAmount - platformFeeAmount - stripeFeeAmount).toFixed(2),
      );

      // Update order status and financial breakdown
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: ORDER_STATUS.SUCCEEDED,
          total_amount: grossAmount,
          platform_fee_amount: platformFeeAmount,
          stripe_fee_amount: stripeFeeAmount,
          net_amount: netAmount,
          ...(paymentIntentId
            ? { stripe_payment_intent_id: paymentIntentId }
            : {}),
        })
        .eq("id", session.metadata.orderId);

      if (updateError) {
        console.error("Failed to update order status:", updateError);

        return NextResponse.json(
          { message: PAYMENT_ERRORS.UPDATE_ORDER_STATUS_FAILED },
          { status: 500 },
        );
      }

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
        .update({ status: ORDER_STATUS.FAILED })
        .eq("id", session.metadata.orderId);

      if (updateError) {
        console.error("Failed to update order status:", updateError);
        return NextResponse.json(
          { message: PAYMENT_ERRORS.UPDATE_ORDER_STATUS_FAILED },
          { status: 500 },
        );
      }

      break;
    }

    case STRIPE_WEBHOOK_EVENTS.ACCOUNT_UPDATED: {
      const account = event.data.object as Stripe.Account;
      const onboardingComplete =
        !!account.charges_enabled && !!account.details_submitted;

      const { error: updateError } = await supabase
        .from("users")
        .update({
          stripe_onboarding_complete: onboardingComplete,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_account_id", account.id);

      if (updateError) {
        console.error(
          "Failed to update Stripe onboarding status:",
          updateError,
        );
        return NextResponse.json(
          { message: "Failed to update onboarding status" },
          { status: 500 },
        );
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
