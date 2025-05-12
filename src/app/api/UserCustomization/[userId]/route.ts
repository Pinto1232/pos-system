import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5000';

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;

  try {
    console.log(
      `Proxying GET request to backend for user: ${userId}`
    );

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/UserCustomization/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}`
      );
      return NextResponse.json(
        {
          error:
            'Failed to fetch user customization from backend',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(
      'Successfully fetched user customization from backend'
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      error
    );
    return NextResponse.json(
      {
        error:
          'Failed to connect to backend service',
      },
      { status: 500 }
    );
  }
}
