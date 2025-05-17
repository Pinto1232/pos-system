import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5107';

  try {
    console.log(`Health check: Checking backend at ${apiUrl}/api/Health`);

    const response = await axios.get(`${apiUrl}/api/Health`, {
      timeout: 5000,
    });

    return NextResponse.json({
      status: 'ok',
      backend: {
        status: 'online',
        url: apiUrl,
        details: response.data,
      },
    });
  } catch (error: any) {
    console.error('Health check: Backend health check failed', JSON.stringify(error, null, 2));

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
    );
  }
}
