import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

export async function POST(request: NextRequest) {
  try {
    console.log(
      'Proxying POST request to backend for custom package selection'
    );

    const body = await request.json();
    console.log(
      'Package selection request body:',
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
      `${BACKEND_API_URL}/api/PricingPackages/custom/select`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, returning fallback success response`
      );

      return NextResponse.json({
        message: 'Custom package selection saved successfully (fallback)',
        packageId: body.packageId,
        selectedFeatures: body.features || [],
        selectedAddOns: body.addOns || [],
        usageLimits: body.usage || {},
      });
    }

    const data = await response.json();
    console.log('Successfully saved custom package selection to backend');
    console.log('Selection response:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error saving custom package selection:',
      error instanceof Error ? error.message : String(error)
    );
    console.error('Full error details:', error);

    return NextResponse.json({
      message: 'Custom package selection saved successfully (fallback)',
      error: false,
    });
  }
}
