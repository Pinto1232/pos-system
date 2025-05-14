import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// No mock data - we'll always get data from the backend

export async function GET() {
  try {
    console.log(
      'Proxying GET request to backend for pricing packages'
    );
    console.log(`Backend API URL: ${BACKEND_API_URL}/api/PricingPackages`);

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/PricingPackages`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache: 'no-store' to prevent caching issues
        cache: 'no-store',
      }
    );

    console.log(`Backend API response status: ${response.status}`);

    if (!response.ok) {
      console.warn(
        `Backend API returned error status: ${response.status}`
      );

      // Return error response
      return new NextResponse(
        JSON.stringify({
          error: 'Failed to fetch pricing packages',
          message: `Backend API returned status: ${response.status}`,
          backendUrl: `${BACKEND_API_URL}/api/PricingPackages`,
        }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();
    console.log(
      'Successfully fetched pricing packages from backend'
    );

    // Log the data structure to help with debugging
    console.log('Data structure:', {
      hasData: !!data,
      hasDataProperty: data && 'data' in data,
      isDataArray: data && data.data && Array.isArray(data.data),
      dataLength: data && data.data && Array.isArray(data.data) ? data.data.length : 'N/A',
      firstItem: data && data.data && Array.isArray(data.data) && data.data.length > 0 ?
        { id: data.data[0].id, type: data.data[0].type } : 'N/A'
    });

    // Ensure we return valid data
    if (!data) {
      console.warn('Backend API returned null or undefined data');
      return new NextResponse(
        JSON.stringify({
          error: 'No pricing packages available',
          message: 'Backend API returned null or undefined data',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!data.data) {
      console.warn('Backend API returned data without a "data" property');
      return new NextResponse(
        JSON.stringify({
          error: 'No pricing packages available',
          message: 'Backend API returned data without a "data" property',
          receivedData: JSON.stringify(data).substring(0, 100) + '...',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!Array.isArray(data.data)) {
      console.warn('Backend API returned data.data that is not an array');
      return new NextResponse(
        JSON.stringify({
          error: 'No pricing packages available',
          message: 'Backend API returned data.data that is not an array',
          dataType: typeof data.data,
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (data.data.length === 0) {
      console.warn('Backend API returned empty data array');
      return new NextResponse(
        JSON.stringify({
          error: 'No pricing packages available',
          message: 'Backend API returned empty data array',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      error
    );

    // Return error response with more details
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to fetch pricing packages',
        message: 'Internal server error',
        errorDetails: error instanceof Error ? error.message : String(error),
        backendUrl: `${BACKEND_API_URL}/api/PricingPackages`,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
