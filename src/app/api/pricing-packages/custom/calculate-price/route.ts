import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

export async function POST(request: NextRequest) {
  try {
    console.log(
      'Proxying POST request to backend for custom package price calculation'
    );

    const body = await request.json();
    console.log(
      'Price calculation request body:',
      JSON.stringify(body, null, 2)
    );

    const authHeader = request.headers.get('authorization');
    console.log('Authorization header present:', !!authHeader);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/PricingPackages/custom/calculate-price`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, calculating fallback price`
      );

      const basePrice = body.basePrice || 49.99;
      let totalPrice = basePrice;

      if (body.selectedFeatures && body.selectedFeatures.length > 0) {
        totalPrice += body.selectedFeatures.length * 10;
      }

      if (body.selectedAddOns && body.selectedAddOns.length > 0) {
        totalPrice += body.selectedAddOns.length * 15;
      }

      if (body.usageLimits) {
        const totalUsage = Object.values(body.usageLimits).reduce(
          (sum: number, value: unknown) => sum + (Number(value) || 0),
          0
        );
        totalPrice += totalUsage * 5;
      }

      return NextResponse.json({
        basePrice,
        totalPrice,
      });
    }

    const data = await response.json();
    console.log('Successfully calculated custom package price from backend');
    console.log('Price calculation response:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error calculating custom package price:',
      error instanceof Error ? error.message : String(error)
    );
    console.error('Full error details:', error);

    const basePrice = 49.99;
    return NextResponse.json({
      basePrice,
      totalPrice: basePrice,
    });
  }
}
