export const PAYMENT_ERRORS = {
  COURSE_NOT_FOUND: "Course not found",
  ALREADY_PURCHASED: "You have already purchased this course",
  CREATE_ORDER_FAILED: "Failed to create order",
  CREATE_CHECKOUT_SESSION_FAILED: "Failed to create checkout session",
  WEBHOOK_MISSING_METADATA: "Missing required metadata",
  WEBHOOK_MISSING_ORDER_ID: "Missing orderId in metadata",
  UPDATE_ORDER_STATUS_FAILED: "Failed to update order status",
  CREATOR_NOT_ONBOARDED: "Course creator has not completed Stripe onboarding",
};

export const STRIPE_CONNECT_ERRORS = {
  CREATE_ACCOUNT_FAILED: "Failed to create Stripe Connect account",
  CREATE_ACCOUNT_LINK_FAILED: "Failed to create Stripe onboarding link",
  CREATE_DASHBOARD_LINK_FAILED: "Failed to create Stripe dashboard link",
  ACCOUNT_NOT_FOUND: "Stripe Connect account not found",
  UPDATE_STATUS_FAILED: "Failed to update Stripe onboarding status",
  NOT_ONBOARDED: "You must complete Stripe onboarding before creating courses",
};
