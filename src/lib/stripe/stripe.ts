import 'server-only';
import { Stripe } from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// This is your test secret API key.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Stripe client promise for client-side
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Helper to format price for Stripe (converts to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper to get the actual price of a course (considering new_price if available)
export const getActualCoursePrice = (price: number, newPrice: number | null): number => {
  return newPrice !== null ? newPrice : price;
};