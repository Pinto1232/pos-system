import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Add await here
    const cookieStore = await cookies();
    const token =
      cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { token: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error(
      'Error getting token cookie:',
      error
    );
    return NextResponse.json(
      { error: 'Failed to get token' },
      { status: 500 }
    );
  }
}
