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

export interface StripeCheckoutSession extends Stripe.Checkout.Session {
  customField?: string;
}
