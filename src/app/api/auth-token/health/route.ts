import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('GET /api/auth-token/health - Health check request received');

    return NextResponse.json({
      status: 'ok',
      message: 'Auth token API is working correctly',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in health check:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
