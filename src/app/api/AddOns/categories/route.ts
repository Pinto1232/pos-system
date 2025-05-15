import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Fallback data in case the backend is not available
const fallbackCategories = [
  'Analytics',
  'Integration',
  'Customization',
  'Support',
  'Data',
];

export async function GET() {
  try {
    console.log(
      'Proxying GET request to backend for add-on categories'
    );

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/AddOns/categories`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add Cache-Control header to prevent browser caching
          'Cache-Control':
            'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        // Add cache: 'no-store' to prevent Next.js caching
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, serving fallback data`
      );
      return NextResponse.json(
        fallbackCategories
      );
    }

    const data = await response.json();
    console.log(
      'Successfully fetched add-on categories from backend'
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error fetching add-on categories:',
      error
    );
    return NextResponse.json(fallbackCategories);
  }
}
