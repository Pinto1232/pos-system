import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const mockSubscription = {
      package: {
        id: 1,
        title: 'Premium Plus',
        type: 'premium plus',
        price: 149.99,
      },
      features: [],
    };

    return NextResponse.json(mockSubscription);
  } catch (error) {
    console.error('Error in subscription API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const subscription = await request.json();

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
