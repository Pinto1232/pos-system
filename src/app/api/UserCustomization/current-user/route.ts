import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

interface JwtPayload {
  sub: string;
  name?: string;
  email?: string;
  preferred_username?: string;
}

export async function GET(request: Request) {
  try {
    console.log(
      'Processing current-user customization request'
    );

    // Get the auth token from cookies
    const cookieStore = cookies();
    const token =
      cookieStore.get('auth_token')?.value ||
      cookieStore.get('keycloak_token')?.value;

    let userId = 'current-user'; // Default fallback

    // If we have a token, extract the user ID
    if (token) {
      try {
        const decoded =
          jwtDecode<JwtPayload>(token);
        if (decoded.sub) {
          userId = decoded.sub;
          console.log(
            `Extracted user ID from token: ${userId}`
          );
        }
      } catch (tokenError) {
        console.error(
          'Error decoding token:',
          tokenError
        );
      }
    } else {
      console.log(
        'No authentication token found, using default user ID'
      );
    }

    // Forward the request to the backend API
    try {
      console.log(
        `Proxying GET request to backend for user: ${userId}`
      );
      const response = await fetch(
        `${BACKEND_API_URL}/api/UserCustomization/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn(
          `Backend API returned status: ${response.status}, falling back to mock data`
        );

        // Redirect to mock data endpoint
        return NextResponse.redirect(
          new URL(
            '/api/UserCustomization/mock-data',
            request.url
          )
        );
      }

      const data = await response.json();
      console.log(
        'Successfully fetched user customization from backend'
      );

      return NextResponse.json(data);
    } catch (error) {
      console.error(
        'Error proxying request to backend:',
        error
      );

      // Redirect to mock data endpoint
      return NextResponse.redirect(
        new URL(
          '/api/UserCustomization/mock-data',
          request.url
        )
      );
    }
  } catch (error) {
    console.error(
      'Error in current-user route:',
      error
    );
    return NextResponse.json(
      {
        error: 'Failed to process request',
      },
      { status: 500 }
    );
  }
}
