import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    console.log(
      'POST /api/auth-token/set-token - Request received'
    );

    const { token } = await request.json();
    console.log(
      'Token received:',
      token
        ? 'Yes (not showing for security)'
        : 'No'
    );

    if (!token) {
      console.log('No token provided in request');
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure:
        process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      // Expire in 24 hours
      maxAge: 60 * 60 * 24,
    });

    console.log('Token cookie set successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'Error setting token cookie:',
      error
    );
    return NextResponse.json(
      { error: 'Failed to set token' },
      { status: 500 }
    );
  }
}
