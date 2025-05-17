import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const MOCK_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlBpbnRvIE1hbnVlbCIsImVtYWlsIjoicGludG9AcGlzdmFsdGVjaC5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTkxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export async function GET() {
  try {
    console.log('GET /api/auth-token/mock-token - Request received');

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: MOCK_TOKEN,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',

      maxAge: 60 * 60 * 24,
    });

    console.log('Mock token set in cookie');
    return NextResponse.json({
      token: MOCK_TOKEN,
    });
  } catch (error) {
    console.error('Error setting mock token:', JSON.stringify(error, null, 2));
    return NextResponse.json({ error: 'Failed to set mock token' }, { status: 500 });
  }
}
