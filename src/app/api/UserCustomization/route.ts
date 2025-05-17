import { NextRequest, NextResponse } from 'next/server';
import { CACHE_TIMES } from '@/app/cache-constants';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

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
        description: 'Standard tax rate for most goods and services',
        isDefault: true,
      },
      {
        id: 2,
        name: 'Reduced Rate',
        rate: 7.5,
        description: 'Reduced rate for specific goods and services',
        isDefault: false,
      },
      {
        id: 3,
        name: 'Zero Rate',
        rate: 0,
        description: 'Zero-rated goods and services',
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

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.pathname.split('/').pop() || 'current-user';
    console.log(`Fetching customization for user: ${userId}`);

    const headers = {
      'Cache-Control': `s-maxage=${CACHE_TIMES.USER_CUSTOMIZATION || 60}, stale-while-revalidate`,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${BACKEND_API_URL}/api/UserCustomization/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched user customization from backend');
        return NextResponse.json(data, {
          headers,
        });
      } else {
        console.warn(`Backend API returned status: ${response.status}, using mock data`);
      }
    } catch (fetchError) {
      console.error('Error fetching from backend:', JSON.stringify(fetchError, null, 2));
      console.log('Falling back to mock data');
    }

    return NextResponse.json(mockUserCustomization, { headers });
  } catch (error) {
    console.error('Error in user customization API:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: 'Failed to fetch user customization',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Proxying POST request to backend for user customization update');

    const customizationData = await request.json();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${BACKEND_API_URL}/api/UserCustomization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customizationData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully updated user customization in backend');
        return NextResponse.json(data);
      } else {
        console.warn(`Backend API returned status: ${response.status}, using mock response`);
      }
    } catch (fetchError) {
      console.error('Error connecting to backend:', JSON.stringify(fetchError, null, 2));
      console.log('Falling back to mock response');
    }

    console.log('Using mock response for user customization update');
    return NextResponse.json({
      id: customizationData.id || 1,
      userId: customizationData.userId || 'current-user',
      ...customizationData,
      message: 'User customization updated successfully (mock response)',
    });
  } catch (error) {
    console.error('Error processing user customization update:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: 'Failed to process user customization update',
      },
      { status: 500 }
    );
  }
}
