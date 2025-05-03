import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'Error clearing token cookie:',
      error
    );
    return NextResponse.json(
      { error: 'Failed to clear token' },
      { status: 500 }
    );
  }
}
