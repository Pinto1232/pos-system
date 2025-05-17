import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('GET /api/auth-token/get-token - Request received');
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    console.log(
      'Token found in cookie:',
      JSON.stringify(token ? 'Yes' : 'No', null, 2)
    );

    if (!token) {
      console.log('No token found, returning null token response');
      return NextResponse.json({ token: null }, { status: 200 });
    }

    console.log('Token found, returning token response');
    return NextResponse.json({ token });
  } catch (error) {
    console.error(
      'Error getting token cookie:',
      JSON.stringify(error, null, 2)
    );
    return NextResponse.json({ error: 'Failed to get token' }, { status: 500 });
  }
}
