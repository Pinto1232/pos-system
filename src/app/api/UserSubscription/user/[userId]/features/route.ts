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
    console.log(
      `Proxying GET request to backend for user features: ${userId}`
    );

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/UserSubscription/user/${userId}/features`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, serving mock data`
      );

      // Return mock data for development when backend returns an error
      return NextResponse.json([
        'Dashboard',
        'Products List',
        'Add/Edit Product',
        'Sales Reports',
        'Inventory Management',
        'Customer Management',
      ]);
    }

    const data = await response.json();
    console.log(
      'Successfully fetched user features from backend'
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      error
    );

    // Return mock data for development
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
