// app/lib/stripe.ts
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Price IDs - You'll get these from Stripe Dashboard after creating products
export const STRIPE_PRICES = {
  MONTHLY: process.env.STRIPE_MONTHLY_PRICE_ID!, // price_xxx
  ANNUAL: process.env.STRIPE_ANNUAL_PRICE_ID!, // price_xxx
} as const;

// Helper function to format Stripe amounts (they're in cents)
export const formatPrice = (amount: number, currency: string = "usd") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

// Helper to get readable plan name from price ID
export const getPlanFromPriceId = (priceId: string) => {
  switch (priceId) {
    case STRIPE_PRICES.MONTHLY:
      return "monthly";
    case STRIPE_PRICES.ANNUAL:
      return "annual";
    default:
      return "unknown";
  }
};
