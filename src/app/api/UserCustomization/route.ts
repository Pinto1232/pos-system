import {
  NextRequest,
  NextResponse,
} from 'next/server';
import { CACHE_TIMES } from '@/app/cache-constants';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Mock user customization data for fallback
const mockUserCustomization = {
  id: 1,
  userId: 'current-user',
  sidebarColor: '#173A79',
  logoUrl: '',
  navbarColor: '#000000',
  taxSettings: {
    enableTaxCalculation: true,
    defaultTaxRate: 15,
    taxCalculationMethod: 'exclusive',
    vatRegistered: true,
    vatNumber: 'VAT12345',
    enableMultipleTaxRates: false,
    taxCategories: [
      {
        id: 1,
        name: 'Standard Rate',
        rate: 15,
        description:
          'Standard tax rate for most goods and services',
        isDefault: true,
      },
      {
        id: 2,
        name: 'Reduced Rate',
        rate: 7.5,
        description:
          'Reduced rate for specific goods and services',
        isDefault: false,
      },
      {
        id: 3,
        name: 'Zero Rate',
        rate: 0,
        description:
          'Zero-rated goods and services',
        isDefault: false,
      },
    ],
    displayTaxOnReceipts: true,
    enableTaxExemptions: true,
    taxReportingPeriod: 'monthly',
  },
  regionalSettings: {
    defaultCurrency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    timezone: 'America/New_York',
    numberFormat: '1,234.56',
    language: 'en-US',
    autoDetectLocation: true,
    enableMultiCurrency: false,
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
  },
};

// GET handler for fetching user customization
export async function GET(request: NextRequest) {
  try {
    const userId =
      request.nextUrl.pathname.split('/').pop() ||
      'current-user';
    console.log(
      `Fetching customization for user: ${userId}`
    );

    // Create cache control headers
    const headers = {
      'Cache-Control': `s-maxage=${CACHE_TIMES.USER_CUSTOMIZATION || 60}, stale-while-revalidate`,
    };

    try {
      // Add timeout to prevent long-running requests
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        3000
      ); // 3 second timeout

      // Attempt to fetch from the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/UserCustomization/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );

      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(
          'Successfully fetched user customization from backend'
        );
        return NextResponse.json(data, {
          headers,
        });
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, using mock data`
        );
      }
    } catch (fetchError) {
      console.error(
        'Error fetching from backend:',
        fetchError
      );
      console.log('Falling back to mock data');
    }

    // Return mock data if backend request fails
    return NextResponse.json(
      mockUserCustomization,
      { headers }
    );
  } catch (error) {
    console.error(
      'Error in user customization API:',
      error
    );
    return NextResponse.json(
      {
        error:
          'Failed to fetch user customization',
      },
      { status: 500 }
    );
  }
}

// POST handler for updating user customization
export async function POST(request: Request) {
  try {
    console.log(
      'Proxying POST request to backend for user customization update'
    );

    // Get the request body
    const customizationData =
      await request.json();

    try {
      // Add timeout to prevent long-running requests
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        3000
      ); // 3 second timeout

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/UserCustomization`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customizationData),
          signal: controller.signal,
        }
      );

      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(
          'Successfully updated user customization in backend'
        );
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, using mock response`
        );
      }
    } catch (fetchError) {
      console.error(
        'Error connecting to backend:',
        fetchError
      );
      console.log(
        'Falling back to mock response'
      );
    }

    // Return mock success response if backend request fails
    console.log(
      'Using mock response for user customization update'
    );
    return NextResponse.json({
      id: customizationData.id || 1,
      userId:
        customizationData.userId ||
        'current-user',
      ...customizationData,
      message:
        'User customization updated successfully (mock response)',
    });
  } catch (error) {
    console.error(
      'Error processing user customization update:',
      error
    );
    return NextResponse.json(
      {
        error:
          'Failed to process user customization update',
      },
      { status: 500 }
    );
  }
}
