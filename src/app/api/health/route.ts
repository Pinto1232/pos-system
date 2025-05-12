import { NextResponse } from 'next/server';
import axios from 'axios';

/**
 * Health check API route that proxies to the backend health endpoint
 * This provides a consistent way for the frontend to check backend health
 */
export async function GET() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5107';

  try {
    console.log(
      `Health check: Checking backend at ${apiUrl}/api/Health`
    );

    // Try to reach the backend health endpoint
    const response = await axios.get(
      `${apiUrl}/api/Health`,
      {
        timeout: 5000, // 5 second timeout
      }
    );

    // Return the backend's response
    return NextResponse.json({
      status: 'ok',
      backend: {
        status: 'online',
        url: apiUrl,
        details: response.data,
      },
    });
  } catch (error: any) {
    console.error(
      'Health check: Backend health check failed',
      error
    );

    // Return error response
    return NextResponse.json(
      {
        status: 'error',
        backend: {
          status: 'offline',
          url: apiUrl,
          error: error.message,
        },
      },
      { status: 200 }
    ); // Still return 200 so frontend can handle gracefully
  }
}
