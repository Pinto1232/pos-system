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
  const { cartItems }: { cartItems: CartItemType[] } = await req.json();

  try {
    const lineItems = cartItems.map((item) => {
      if (!item.stripePriceId || !item.stripePriceId.startsWith('price_')) {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name || 'Custom Product',
              description: `${item.name} package with all selected features`,
              images: [`${process.env.NEXT_PUBLIC_BASE_URL}/images/product-image.png`],
            },
            unit_amount: Math.round((item.price || 0) * 100),
          },
          quantity: item.quantity || 1,
        };
      } else {
        return {
          price: item.stripePriceId,
          quantity: item.quantity || 1,
        };
      }
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        cartItems: JSON.stringify(cartItems),
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'ZA'],
      },
      phone_number_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
      locale: 'auto',
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
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
