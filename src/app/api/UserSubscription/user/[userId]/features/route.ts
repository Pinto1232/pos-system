import { NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  const params = await context.params;
  const userId = params.userId;

  try {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(
        `Proxying GET request to backend for user features: ${userId}`
      );

      const response = await fetch(
        `${BACKEND_API_URL}/api/UserSubscription/user/${userId}/features`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },

          signal: AbortSignal.timeout(3000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched user features from backend');
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    return NextResponse.json([
      'Dashboard',
      'Products List',
      'Add/Edit Product',
      'Sales Reports',
      'Inventory Management',
      'Customer Management',
    ]);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      JSON.stringify(error, null, 2)
    );

    return NextResponse.json([
      'Dashboard',
      'Products List',
      'Add/Edit Product',
      'Sales Reports',
      'Inventory Management',
      'Customer Management',
    ]);
  }
}
