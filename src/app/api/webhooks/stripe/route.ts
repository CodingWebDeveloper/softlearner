import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import Stripe from "stripe";
import { createWebhookClient } from "@/lib/supabase/server";
import { STRIPE_WEBHOOK_EVENTS } from "@/lib/constants/stripe-constants";
import {
  handleCheckoutCompleted,
  handleCheckoutExpired,
  handleAccountUpdated,
} from "@/lib/stripe/webhook-handlers";

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

  switch (event.type) {
    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED: {
      const result = await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
        supabase,
      );
      if (result) return result;
      break;
    }
    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_EXPIRED: {
      const result = await handleCheckoutExpired(
        event.data.object as Stripe.Checkout.Session,
        supabase,
      );
      if (result) return result;
      break;
    }
    case STRIPE_WEBHOOK_EVENTS.ACCOUNT_UPDATED: {
      const result = await handleAccountUpdated(
        event.data.object as Stripe.Account,
        supabase,
      );
      if (result) return result;
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
