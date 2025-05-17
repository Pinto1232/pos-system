import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

interface CartItemType {
  id: string | number;
  stripePriceId?: string;
  quantity: number;
  name: string;
  price: number;
}

export async function POST(req: Request) {
  console.log('API: create-payment-intent called');

  try {
    const body = await req.json();
    console.log('API: Request body:', JSON.stringify(body, null, 2));

    const { cartItems }: { cartItems: CartItemType[] } = body;
    console.log('API: Cart items:', JSON.stringify(cartItems, null, 2));

    if (!cartItems || cartItems.length === 0) {
      console.error('API: Cart is empty');
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    console.log('API: Cart has items, proceeding with payment intent creation');

    const amount = cartItems.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        cartItems: JSON.stringify(
          cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        {
          error: 'An unknown server error occurred.',
        },
        { status: 500 }
      );
    }
  }
}
