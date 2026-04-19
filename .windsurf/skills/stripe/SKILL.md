---
name: stripe
description: Stripe payment integration assistant for SoftLearner platform
---

# Stripe Integration Assistant

## Core Principles

1. **Security First**
   - Never expose `STRIPE_SECRET_KEY` in client-side code
   - Always verify webhook signatures
   - Use server-only imports for sensitive operations
   - Separate client and server Stripe code

2. **Modern APIs**
   - Use Checkout Sessions (not legacy Charges API)
   - Use Payment Intents for custom flows
   - Implement webhook handlers for all critical events

3. **Reliability**
   - Add idempotency checks in webhooks
   - Handle webhook retries gracefully
   - Implement proper error handling and logging

## Architecture

### Server-Side (`src/lib/stripe/stripe.ts`)
- Stripe SDK initialization with secret key
- Helper functions (formatAmountForStripe, getActualCoursePrice)
- Server-only operations

### Client-Side (`src/lib/stripe/stripe-client.ts`)
- Stripe.js loading for browser
- Checkout redirect handling
- Uses publishable key only

### Payment Flow
1. User initiates purchase → Create checkout session
2. Redirect to Stripe Checkout
3. User completes payment
4. Webhook processes event → Update order status
5. User redirected to success page → Verify session

## Key Components

### Checkout Session Creation
```typescript
// In payments.dal.ts
- Validate course exists
- Check if already purchased
- Create/retrieve order (status: PENDING)
- Create Stripe checkout session with metadata
- Return session ID for redirect
```

### Webhook Handler (`src/app/api/webhooks/stripe/route.ts`)
```typescript
Events handled:
- checkout.session.completed → SUCCEEDED
- checkout.session.expired → FAILED
- payment_intent.succeeded → Log
- payment_intent.payment_failed → FAILED
- charge.refunded → REFUNDED

Features:
- Signature verification
- Idempotency checks
- Proper error responses
```

### Payment Verification
```typescript
// In payments-router.ts
verifySession endpoint:
- Retrieve Stripe session
- Check payment_status === "paid"
- Return order status and course access
```

## Environment Variables Required

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Testing

Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

## Common Issues

1. **Server-only import errors**: Keep Stripe SDK in server files only
2. **Webhook verification fails**: Check STRIPE_WEBHOOK_SECRET
3. **Duplicate processing**: Implement idempotency checks
4. **Order stuck in PENDING**: Check webhook delivery in Stripe dashboard

## Reference

See `STRIPE_INTEGRATION.md` for complete documentation.