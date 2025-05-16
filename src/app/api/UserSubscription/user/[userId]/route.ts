import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  const params = await context.params;
  const userId = params.userId;

  try {
    // Check if we should use mock data (from environment variable)
    const useMockData =
      process.env.NEXT_PUBLIC_USE_MOCK_DATA ===
      'true';

    if (!useMockData) {
      console.log(
        `Proxying GET request to backend for user subscription: ${userId}`
      );

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/UserSubscription/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add a timeout to prevent long waits if backend is down
          signal: AbortSignal.timeout(3000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          'Successfully fetched user subscription from backend'
        );
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log(
        'Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)'
      );
    }

    // Return mock data if backend API fails or mock data is enabled
    return NextResponse.json({
      id: 1,
      userId,
      pricingPackageId: 1,
      package: {
        id: 1,
        title: 'Starter',
        type: 'starter',
      },
      startDate: new Date().toISOString(),
      isActive: true,
      enabledFeatures: [
        'Dashboard',
        'Products List',
        'Add/Edit Product',
        'Sales Reports',
        'Inventory Management',
        'Customer Management',
      ],
      additionalPackages: [],
    });
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      error
    );

    // Return mock data for development
    return NextResponse.json({
      id: 1,
      userId,
      pricingPackageId: 1,
      package: {
        id: 1,
        title: 'Starter',
        type: 'starter',
      },
      startDate: new Date().toISOString(),
      isActive: true,
      enabledFeatures: [
        'Dashboard',
        'Products List',
        'Add/Edit Product',
        'Sales Reports',
        'Inventory Management',
        'Customer Management',
      ],
      additionalPackages: [],
    });
  }
}
