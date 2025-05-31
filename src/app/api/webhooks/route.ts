import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    console.log(`Received webhook event: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created': {
        await handleSubscriptionCreated(event.data.object);
        break;
      }

      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(event.data.object);
        break;
      }

      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(event.data.object);
        break;
      }

      case 'customer.subscription.trial_will_end': {
        await handleTrialWillEnd(event.data.object);
        break;
      }

      case 'invoice.payment_succeeded': {
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      }

      case 'invoice.payment_failed': {
        await handleInvoicePaymentFailed(event.data.object);
        break;
      }

      case 'invoice.upcoming': {
        await handleUpcomingInvoice(event.data.object);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Payment succeeded:', JSON.stringify(session, null, 2));
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', JSON.stringify(paymentIntent, null, 2));
        break;
      }

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', JSON.stringify(err, null, 2));
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/subscription-created`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          metadata: subscription.metadata,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to sync subscription creation with backend');
    }
  } catch (error) {
    console.error('Error syncing subscription creation:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription.id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/subscription-updated`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          trialStart: subscription.trial_start,
          trialEnd: subscription.trial_end,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to sync subscription update with backend');
    }
  } catch (error) {
    console.error('Error syncing subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription.id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/subscription-deleted`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          canceledAt: subscription.canceled_at,
          endedAt: subscription.ended_at,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to sync subscription deletion with backend');
    }
  } catch (error) {
    console.error('Error syncing subscription deletion:', error);
  }
}

async function handleTrialWillEnd(subscription: any) {
  console.log('Trial will end for subscription:', subscription.id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/trial-will-end`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          trialEnd: subscription.trial_end,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to handle trial will end notification');
    }
  } catch (error) {
    console.error('Error handling trial will end:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('Invoice payment succeeded:', invoice.id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/invoice-payment-succeeded`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
          customerId: invoice.customer,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          paidAt: invoice.status_transitions?.paid_at,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to sync invoice payment success with backend');
    }
  } catch (error) {
    console.error('Error syncing invoice payment success:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  console.log('Invoice payment failed:', invoice.id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/invoice-payment-failed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
          customerId: invoice.customer,
          amount: invoice.amount_due,
          currency: invoice.currency,
          attemptCount: invoice.attempt_count,
          nextPaymentAttempt: invoice.next_payment_attempt,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to sync invoice payment failure with backend');
    }
  } catch (error) {
    console.error('Error syncing invoice payment failure:', error);
  }
}

async function handleUpcomingInvoice(invoice: any) {
  console.log('Upcoming invoice:', invoice.id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/upcoming-invoice`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
          customerId: invoice.customer,
          amount: invoice.amount_due,
          currency: invoice.currency,
          dueDate: invoice.due_date,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to handle upcoming invoice notification');
    }
  } catch (error) {
    console.error('Error handling upcoming invoice:', error);
  }
}
