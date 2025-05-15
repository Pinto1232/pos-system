import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    console.log(
      'POST /api/auth-token/set-token - Request received'
    );

    // Log request headers to help with debugging
    console.log('Request headers:', {
      contentType: request.headers.get(
        'content-type'
      ),
      contentLength: request.headers.get(
        'content-length'
      ),
    });

    // Check if the request has a body
    const contentLength = request.headers.get(
      'content-length'
    );
    if (
      !contentLength ||
      parseInt(contentLength) === 0
    ) {
      console.error(
        'Empty request body received'
      );
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }

    // Check content type
    const contentType = request.headers.get(
      'content-type'
    );
    if (
      !contentType ||
      !contentType.includes('application/json')
    ) {
      console.error(
        `Invalid content type: ${contentType}`
      );
      return NextResponse.json(
        {
          error:
            'Content-Type must be application/json',
        },
        { status: 400 }
      );
    }

    // Get the request text first to validate it
    let requestText;
    try {
      // Clone the request to avoid consuming the body
      const clonedRequest = request.clone();
      requestText = await clonedRequest.text();

      console.log(
        'Request body text:',
        requestText
          ? `${requestText.substring(0, 20)}...`
          : 'Empty'
      );

      if (
        !requestText ||
        requestText.trim() === ''
      ) {
        console.error('Empty request body text');
        return NextResponse.json(
          { error: 'Empty request body' },
          { status: 400 }
        );
      }
    } catch (textError) {
      console.error(
        'Error reading request body as text:',
        textError
      );
      return NextResponse.json(
        { error: 'Failed to read request body' },
        { status: 400 }
      );
    }

    // Parse the JSON safely
    let jsonData;
    try {
      jsonData = JSON.parse(requestText);
    } catch (parseError) {
      console.error(
        'Error parsing JSON:',
        parseError
      );
      console.error(
        'Invalid JSON received:',
        requestText
      );
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { token } = jsonData;
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
