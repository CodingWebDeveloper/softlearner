import { NextResponse } from "next/server";
import Stripe from "stripe";
import { SupabaseClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe/stripe";
import { PAYMENT_ERRORS, STRIPE_CONNECT_ERRORS } from "@/lib/constants/error-messages";
import { ORDER_STATUS } from "@/lib/constants/stripe-constants";

export type HandlerResult = NextResponse | null;

type PaymentIntentFinancials = {
  platformFeeAmount: number;
  stripeFeeAmount: number;
};

async function resolvePaymentIntentFinancials(
  paymentIntentId: string,
): Promise<PaymentIntentFinancials> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["latest_charge.balance_transaction"],
    });

    const platformFeeAmount = Number(
      (((paymentIntent.application_fee_amount ?? 0) as number) / 100).toFixed(2),
    );

    const latestCharge =
      paymentIntent.latest_charge && typeof paymentIntent.latest_charge !== "string"
        ? paymentIntent.latest_charge
        : null;

    const balanceTransaction = latestCharge?.balance_transaction;
    const stripeFeeAmount =
      balanceTransaction && typeof balanceTransaction !== "string"
        ? Number((balanceTransaction.fee / 100).toFixed(2))
        : 0;

    return { platformFeeAmount, stripeFeeAmount };
  } catch (err) {
    console.error("Failed to resolve payment intent financials:", err);
    return { platformFeeAmount: 0, stripeFeeAmount: 0 };
  }
}

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: SupabaseClient,
): Promise<HandlerResult> {
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

  const grossAmount = Number(((session.amount_total ?? 0) / 100).toFixed(2));

  const { platformFeeAmount, stripeFeeAmount } = paymentIntentId
    ? await resolvePaymentIntentFinancials(paymentIntentId)
    : { platformFeeAmount: 0, stripeFeeAmount: 0 };

  const netAmount = Number((grossAmount - platformFeeAmount - stripeFeeAmount).toFixed(2));

  const { error } = await supabase
    .from("orders")
    .update({
      status: ORDER_STATUS.SUCCEEDED,
      total_amount: grossAmount,
      platform_fee_amount: platformFeeAmount,
      stripe_fee_amount: stripeFeeAmount,
      net_amount: netAmount,
      ...(paymentIntentId ? { stripe_payment_intent_id: paymentIntentId } : {}),
    })
    .eq("id", session.metadata.orderId);

  if (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { message: PAYMENT_ERRORS.UPDATE_ORDER_STATUS_FAILED },
      { status: 500 },
    );
  }

  return null;
}

export async function handleCheckoutExpired(
  session: Stripe.Checkout.Session,
  supabase: SupabaseClient,
): Promise<HandlerResult> {
  if (!session.metadata?.orderId) {
    console.error("Missing orderId in session metadata");
    return NextResponse.json(
      { message: PAYMENT_ERRORS.WEBHOOK_MISSING_ORDER_ID },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: ORDER_STATUS.FAILED })
    .eq("id", session.metadata.orderId);

  if (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { message: PAYMENT_ERRORS.UPDATE_ORDER_STATUS_FAILED },
      { status: 500 },
    );
  }

  return null;
}

export async function handleAccountUpdated(
  account: Stripe.Account,
  supabase: SupabaseClient,
): Promise<HandlerResult> {
  const onboardingComplete = !!account.charges_enabled && !!account.details_submitted;

  const { error } = await supabase
    .from("users")
    .update({
      stripe_onboarding_complete: onboardingComplete,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_account_id", account.id);

  if (error) {
    console.error("Failed to update Stripe onboarding status:", error);
    return NextResponse.json(
      { message: STRIPE_CONNECT_ERRORS.UPDATE_STATUS_FAILED },
      { status: 500 },
    );
  }

  return null;
}
