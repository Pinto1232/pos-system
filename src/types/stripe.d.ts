// src/types/stripe.d.ts
import { Stripe } from 'stripe';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    }
  }
}

// Remove empty interface or add meaningful extensions
export interface StripeCheckoutSession
  extends Stripe.Checkout.Session {
  customField?: string;
}
