import "server-only";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database/database.types";
import { IStripeConnectDAL } from "../di/interfaces/dal.interfaces";
import { stripe } from "../stripe/stripe";
import { STRIPE_CONNECT_ERRORS } from "../constants/error-messages";
import { TRPCError } from "@trpc/server";
import {
  StripeConnectStatus,
  CreateAccountLinkInput,
} from "@/services/interfaces/service.interfaces";
import { PLATFORM_FEE_PERCENT } from "@/lib/constants/stripe-constants";

export class StripeConnectDAL implements IStripeConnectDAL {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getStripeAccountId(userId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("stripe_account_id")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data?.stripe_account_id ?? null;
  }

  async createConnectAccount(userId: string): Promise<string> {
    const existingAccountId = await this.getStripeAccountId(userId);
    if (existingAccountId) {
      return existingAccountId;
    }

    let account;
    try {
      account = await stripe.accounts.create({ type: "express" });
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: STRIPE_CONNECT_ERRORS.CREATE_ACCOUNT_FAILED,
      });
    }

    const { error } = await this.supabase
      .from("users")
      .update({
        stripe_account_id: account.id,
        stripe_onboarding_complete: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: STRIPE_CONNECT_ERRORS.CREATE_ACCOUNT_FAILED,
      });
    }

    return account.id;
  }

  async createAccountLink(input: CreateAccountLinkInput): Promise<string> {
    const { userId, refreshUrl, returnUrl } = input;
    let accountId = await this.getStripeAccountId(userId);

    if (!accountId) {
      accountId = await this.createConnectAccount(userId);
    }

    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: "account_onboarding",
      });
      return accountLink.url;
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: STRIPE_CONNECT_ERRORS.CREATE_ACCOUNT_LINK_FAILED,
      });
    }
  }

  async getConnectStatus(userId: string): Promise<StripeConnectStatus> {
    const accountId = await this.getStripeAccountId(userId);

    if (!accountId) {
      return { hasAccount: false, onboardingComplete: false };
    }

    try {
      const account = await stripe.accounts.retrieve(accountId);
      const onboardingComplete =
        !!account.charges_enabled && !!account.details_submitted;

      if (onboardingComplete) {
        await this.supabase
          .from("users")
          .update({
            stripe_onboarding_complete: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      }

      return {
        hasAccount: true,
        onboardingComplete,
        accountId,
        chargesEnabled: account.charges_enabled,
        detailsSubmitted: account.details_submitted,
      };
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: STRIPE_CONNECT_ERRORS.ACCOUNT_NOT_FOUND,
      });
    }
  }

  async getDashboardLink(userId: string): Promise<string> {
    const accountId = await this.getStripeAccountId(userId);

    if (!accountId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: STRIPE_CONNECT_ERRORS.ACCOUNT_NOT_FOUND,
      });
    }

    try {
      const loginLink = await stripe.accounts.createLoginLink(accountId);
      return loginLink.url;
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: STRIPE_CONNECT_ERRORS.CREATE_DASHBOARD_LINK_FAILED,
      });
    }
  }

  async updateOnboardingStatusFromWebhook(
    stripeAccountId: string,
    chargesEnabled: boolean,
    detailsSubmitted: boolean,
  ): Promise<void> {
    const onboardingComplete = chargesEnabled && detailsSubmitted;
    const { error } = await this.supabase
      .from("users")
      .update({
        stripe_onboarding_complete: onboardingComplete,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_account_id", stripeAccountId);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: STRIPE_CONNECT_ERRORS.UPDATE_STATUS_FAILED,
      });
    }
  }

  getPlatformFeeAmount(totalAmountInCents: number): number {
    return Math.round(totalAmountInCents * PLATFORM_FEE_PERCENT);
  }
}
