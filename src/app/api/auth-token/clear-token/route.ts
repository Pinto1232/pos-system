import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    console.log('POST /api/auth-token/clear-token - Request received');

    const cookieStore = await cookies();
    cookieStore.delete('auth_token');

    console.log('Token cookie cleared successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'Error clearing token cookie:',
      JSON.stringify(error, null, 2)
    );
    return NextResponse.json(
      { error: 'Failed to clear token' },
      { status: 500 }
    );
  }
}
