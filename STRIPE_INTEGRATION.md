# Stripe Integration Guide

## Overview

This document describes the complete Stripe payment integration for SoftLearner, including setup, flows, and troubleshooting.

## Architecture

### Components

1. **Server-Side Stripe** (`src/lib/stripe/stripe.ts`)
   - Stripe SDK initialization
   - Helper functions for price formatting
   - Server-only operations

2. **Client-Side Stripe** (`src/lib/stripe/stripe-client.ts`)
   - Stripe.js loading for browser
   - Checkout redirect handling

3. **Payment DAL** (`src/lib/dal/payments.dal.ts`)
   - Order creation and management
   - Checkout session creation
   - Course purchase validation

4. **Webhook Handler** (`src/app/api/webhooks/stripe/route.ts`)
   - Webhook signature verification
   - Payment event processing
   - Order status updates

5. **Payment Router** (`src/lib/trpc/routers/payments-router.ts`)
   - tRPC endpoints for payments
   - Session verification

## Payment Flow

### 1. User Initiates Purchase

```
User clicks "Buy Now" → BuyNowButton component
  ↓
Calls trpc.payments.createCheckoutSession
  ↓
Creates/retrieves order in database (status: PENDING)
  ↓
Creates Stripe Checkout Session
  ↓
Redirects user to Stripe Checkout
```

### 2. User Completes Payment

```
User enters payment details on Stripe
  ↓
Stripe processes payment
  ↓
Redirects to success URL with session_id
```

### 3. Webhook Processing (Async)

```
Stripe sends webhook event
  ↓
Webhook handler verifies signature
  ↓
Processes event based on type:
  - checkout.session.completed → Order status: SUCCEEDED
  - checkout.session.expired → Order status: FAILED
  - payment_intent.succeeded → Log success
  - payment_intent.payment_failed → Order status: FAILED
  - charge.refunded → Order status: REFUNDED
```

### 4. User Sees Success Page

```
Success URL loads with session_id parameter
  ↓
Frontend calls trpc.payments.verifySession
  ↓
Returns order status and course access
  ↓
User can access course materials
```

## Setup Instructions

### 1. Environment Variables

Add to `.env.local`:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Webhook Secret (get from https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Stripe Dashboard Configuration

#### Create Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

#### Test Mode vs Production

- Use test keys (`sk_test_...` and `pk_test_...`) for development
- Use live keys (`sk_live_...` and `pk_live_...`) for production
- Create separate webhook endpoints for test and live modes

### 3. Database Schema

The `orders` table must have:

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to users)
- course_id (uuid, foreign key to courses)
- total_amount (numeric)
- currency (text)
- status (text) -- PENDING, SUCCEEDED, FAILED, REFUNDED
- stripe_payment_intent_id (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

## Key Features

### ✅ Implemented

1. **Checkout Session Creation**
   - Validates course exists
   - Checks if user already purchased
   - Creates or retrieves pending order
   - Generates Stripe checkout session

2. **Webhook Security**
   - Signature verification
   - Idempotency checks (prevents duplicate processing)
   - Proper error handling

3. **Order Status Management**
   - PENDING: Order created, payment not completed
   - SUCCEEDED: Payment successful, user enrolled
   - FAILED: Payment failed or session expired
   - REFUNDED: Payment refunded

4. **Payment Verification**
   - `verifySession` endpoint to check payment status
   - Returns order status and course access

5. **Event Handling**
   - Checkout completion
   - Session expiration
   - Payment success/failure
   - Refunds

### 🔄 Enrollment Logic

Currently, enrollment is determined by checking if a user has a `SUCCEEDED` order for a course:

```typescript
// From courses.dal.ts
async isEnrolled(userId: string, courseId: string): Promise<boolean> {
  const { data: order } = await this.supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("status", ORDER_STATUS.SUCCEEDED)
    .maybeSingle();

  return !!order;
}
```

**Note**: If you want a separate `user_courses` table for enrollment, you'll need to:
1. Create the table
2. Add enrollment record creation in the webhook handler after successful payment
3. Update `isEnrolled` to check the new table

## Testing

### Local Testing with Stripe CLI

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Use test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires authentication: `4000 0025 0000 3155`

### Test Scenarios

1. **Successful Purchase**
   - User clicks "Buy Now"
   - Completes payment with test card
   - Webhook updates order to SUCCEEDED
   - User can access course

2. **Failed Payment**
   - User clicks "Buy Now"
   - Uses declined test card
   - Webhook updates order to FAILED
   - User sees error message

3. **Expired Session**
   - User clicks "Buy Now"
   - Doesn't complete payment within 24 hours
   - Webhook updates order to FAILED

4. **Duplicate Purchase Prevention**
   - User with existing SUCCEEDED order
   - Attempts to purchase again
   - Gets error: "Already purchased"

5. **Webhook Retry**
   - Webhook processes same event twice
   - Idempotency check prevents duplicate updates

## Error Handling

### Common Issues

1. **"Webhook signature verification failed"**
   - Check `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure webhook endpoint URL is correct
   - Verify webhook is active in Stripe dashboard

2. **"Order not found"**
   - Check order was created before checkout
   - Verify metadata is passed correctly to Stripe

3. **"Already purchased"**
   - User has existing SUCCEEDED order
   - This is expected behavior

4. **Payment stuck in PENDING**
   - Webhook may not have fired
   - Check Stripe dashboard for webhook delivery status
   - Manually trigger webhook from dashboard

## Security Best Practices

1. ✅ Never expose `STRIPE_SECRET_KEY` in client-side code
2. ✅ Always verify webhook signatures
3. ✅ Use idempotency checks for webhook handlers
4. ✅ Validate user authentication before creating checkout sessions
5. ✅ Check if user already purchased before creating new order
6. ✅ Use HTTPS in production for webhook endpoint
7. ✅ Store minimal payment data (use Stripe as source of truth)

## Monitoring

### Stripe Dashboard

- View all payments: https://dashboard.stripe.com/payments
- View webhooks: https://dashboard.stripe.com/webhooks
- View logs: https://dashboard.stripe.com/logs

### Application Logs

Webhook handler logs all events:
- ✅ Successful order updates
- ⏰ Expired sessions
- ❌ Failed payments
- 💰 Refunds processed

## Future Enhancements

### Recommended Additions

1. **Email Notifications**
   - Send receipt after successful payment
   - Notify on failed payment
   - Refund confirmation

2. **Admin Dashboard**
   - View all orders
   - Process refunds
   - View payment analytics

3. **Subscription Support**
   - Monthly/yearly subscriptions
   - Subscription management
   - Trial periods

4. **Coupon/Discount Codes**
   - Create discount codes
   - Apply at checkout
   - Track usage

5. **Multiple Payment Methods**
   - Add PayPal, Apple Pay, Google Pay
   - Bank transfers
   - Buy now, pay later

6. **Invoice Generation**
   - Generate PDF invoices
   - Send via email
   - Download from dashboard

## Support

For Stripe-specific issues:
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

For integration issues:
- Check webhook logs in Stripe dashboard
- Review application logs
- Test with Stripe CLI locally
