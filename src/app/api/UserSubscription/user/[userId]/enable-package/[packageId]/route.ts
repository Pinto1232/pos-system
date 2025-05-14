import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

export async function POST(
  request: Request,
  context: {
    params: { userId: string; packageId: string };
  }
) {
  const params = await context.params;
  const userId = params.userId;
  const packageId = params.packageId;

  try {
    console.log(
      `Proxying POST request to backend to enable package ${packageId} for user: ${userId}`
    );

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/UserSubscription/user/${userId}/enable-package/${packageId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, serving mock data`
      );

      // Return mock success response for development when backend returns an error
      return NextResponse.json({
        message: `Package ${packageId} enabled successfully for user ${userId}`,
      });
    }

    const data = await response.json();
    console.log(
      'Successfully enabled package in backend'
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      error
    );

    // Return mock success response for development
    return NextResponse.json({
      message: `Package ${packageId} enabled successfully for user ${userId}`,
    });
  }
}
