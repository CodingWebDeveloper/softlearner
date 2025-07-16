export const PAYMENT_ERRORS = {
  COURSE_NOT_FOUND: 'Course not found',
  ALREADY_PURCHASED: 'You have already purchased this course',
  CREATE_ORDER_FAILED: 'Failed to create order',
  CREATE_CHECKOUT_SESSION_FAILED: 'Failed to create checkout session',
  WEBHOOK_MISSING_METADATA: 'Missing required metadata',
  WEBHOOK_MISSING_ORDER_ID: 'Missing orderId in metadata',
  UPDATE_ORDER_STATUS_FAILED: 'Failed to update order status',
} as const; 