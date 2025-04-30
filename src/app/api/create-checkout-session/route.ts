import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

interface CartItemType {
  id: string;
  stripePriceId: string | undefined;
  quantity: number;
  name: string;
  price: number;
}

export async function POST(req: Request) {
  const {
    cartItems,
  }: { cartItems: CartItemType[] } =
    await req.json();

  try {
    console.log(
      'Received cart items:',
      JSON.stringify(cartItems, null, 2)
    );

    const lineItems = cartItems.map((item) => {
      if (
        !item.stripePriceId ||
        !item.stripePriceId.startsWith('price_')
      ) {
        console.log(
          `Creating custom price for ${item.name} at $${item.price}`
        );

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name || 'Custom Product',
            },
            unit_amount: Math.round(
              (item.price || 0) * 100
            ),
          },
          quantity: item.quantity || 1,
        };
      } else {
        console.log(
          `Using existing price ID: ${item.stripePriceId}`
        );

        return {
          price: item.stripePriceId,
          quantity: item.quantity || 1,
        };
      }
    });

    console.log(
      'Line items:',
      JSON.stringify(lineItems, null, 2)
    );

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        metadata: {
          cartItems: JSON.stringify(cartItems),
        },
      });

    return NextResponse.json({
      sessionId: session.id,
    });
  } catch (error) {
    console.error(
      'Checkout Session Error:',
      error
    );

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    } else if (
      error &&
      typeof error === 'object' &&
      'message' in error
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          error:
            'An unknown server error occurred.',
        },
        { status: 500 }
      );
    }
  }
}
