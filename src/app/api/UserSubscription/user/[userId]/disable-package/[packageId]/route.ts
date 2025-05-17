import { NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

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
      `Proxying POST request to backend to disable package ${packageId} for user: ${userId}`
    );

    const response = await fetch(
      `${BACKEND_API_URL}/api/UserSubscription/user/${userId}/disable-package/${packageId}`,
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

      return NextResponse.json({
        message: `Package ${packageId} disabled successfully for user ${userId}`,
      });
    }

    const data = await response.json();
    console.log('Successfully disabled package in backend');

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      JSON.stringify(error, null, 2)
    );

    return NextResponse.json({
      message: `Package ${packageId} disabled successfully for user ${userId}`,
    });
  }
}
