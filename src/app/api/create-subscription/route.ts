import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  stripePriceId: string;
  packageType?: string;
  trialDays?: number;
}

interface CreateSubscriptionRequest {
  cartItems: CartItem[];
  userId?: string;
  paymentMethodId?: string;
  startTrial?: boolean;
  currency?: string;
}

function validateRequest(body: CreateSubscriptionRequest) {
  const { cartItems } = body;

  if (!cartItems || cartItems.length === 0) {
    return { error: 'Cart items are required', status: 400 };
  }

  const item = cartItems[0];
  if (!item.stripePriceId) {
    return {
      error: 'Stripe price ID is required for subscription',
      status: 400,
    };
  }

  return null;
}

async function getOrCreateCustomer(userId?: string) {
  if (userId) {
    const existingCustomers = await stripe.customers.list({
      limit: 1,
      metadata: { user_id: userId },
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    return await stripe.customers.create({
      metadata: { user_id: userId },
    });
  }

  return await stripe.customers.create({});
}

function buildSubscriptionParams(
  customer: any,
  item: any,
  userId?: string,
  paymentMethodId?: string,
  startTrial = true
) {
  const params: any = {
    customer: customer.id,
    items: [
      {
        price: item.stripePriceId,
        quantity: item.quantity ?? 1,
      },
    ],
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      package_type: item.packageType ?? '',
      package_name: item.name,
      user_id: userId ?? '',
    },
  };

  if (startTrial && item.trialDays && item.trialDays > 0) {
    params.trial_period_days = item.trialDays;
  }

  if (paymentMethodId) {
    params.default_payment_method = paymentMethodId;
  }

  return params;
}

// Helper function to extract client secret
function extractClientSecret(subscription: any) {
  if (
    subscription.latest_invoice &&
    typeof subscription.latest_invoice === 'object'
  ) {
    const invoice = subscription.latest_invoice;
    if (invoice.payment_intent && typeof invoice.payment_intent === 'object') {
      return invoice.payment_intent.client_secret;
    }
  }
  return null;
}

function handleSubscriptionResponse(
  subscription: any,
  clientSecret: string | null
) {
  if (subscription.status === 'trialing' || subscription.status === 'active') {
    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret: null,
      trialEnd: subscription.trial_end,
      currentPeriodEnd: subscription.current_period_end,
    });
  }

  if (subscription.status === 'incomplete' && clientSecret) {
    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret,
      requiresPayment: true,
    });
  }

  return NextResponse.json({
    subscriptionId: subscription.id,
    status: subscription.status,
    clientSecret,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateSubscriptionRequest = await req.json();
    const { cartItems, userId, paymentMethodId, startTrial = true } = body;

    const validationError = validateRequest(body);
    if (validationError) {
      return NextResponse.json(
        { error: validationError.error },
        { status: validationError.status }
      );
    }

    const item = cartItems[0];
    const customer = await getOrCreateCustomer(userId);
    const subscriptionParams = buildSubscriptionParams(
      customer,
      item,
      userId,
      paymentMethodId,
      startTrial
    );
    const subscription = await stripe.subscriptions.create(subscriptionParams);
    const clientSecret = extractClientSecret(subscription);

    return handleSubscriptionResponse(subscription, clientSecret);
  } catch (error) {
    console.error('Error creating subscription:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'An unknown server error occurred.' },
        { status: 500 }
      );
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['latest_invoice.payment_intent'],
    });

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      trialStart: subscription.trial_start,
      trialEnd: subscription.trial_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at,
      endedAt: subscription.ended_at,
      metadata: subscription.metadata,
    });
  } catch (error) {
    console.error('Error retrieving subscription:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'An unknown server error occurred.' },
        { status: 500 }
      );
    }
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriptionId, action, ...updateParams } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'cancel':
        result = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
        break;

      case 'reactivate':
        result = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
        });
        break;

      case 'cancel_immediately':
        result = await stripe.subscriptions.cancel(subscriptionId);
        break;

      default:
        result = await stripe.subscriptions.update(
          subscriptionId,
          updateParams
        );
    }

    return NextResponse.json({
      id: result.id,
      status: result.status,
      cancelAtPeriodEnd: result.cancel_at_period_end,
      canceledAt: result.canceled_at,
      endedAt: result.ended_at,
    });
  } catch (error) {
    console.error('Error updating subscription:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: 'An unknown server error occurred.' },
        { status: 500 }
      );
    }
  }
}
