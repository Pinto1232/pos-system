import { NextResponse } from 'next/server';

// Define the AddOn interface
interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  multiCurrencyPrices: string;
  category: string;
  isActive: boolean;
  features: string;
  dependencies: string;
  icon: string;
}

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Fallback data in case the backend is not available
const fallbackAddOns = [
  {
    id: 1,
    name: 'Advanced Analytics',
    description: 'Detailed business analytics and insights',
    price: 15.00,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      'USD': 15.00,
      'EUR': 13.50,
      'GBP': 11.50,
      'ZAR': 270.00
    }),
    category: 'Analytics',
    isActive: true,
    features: JSON.stringify([
      'Real-time data visualization',
      'Custom report generation',
      'Data export capabilities',
      'Trend analysis'
    ]),
    dependencies: JSON.stringify([
      'Internet connection',
      'Modern browser'
    ]),
    icon: 'analytics_icon'
  },
  {
    id: 2,
    name: 'API Access',
    description: 'Access to API for custom integrations',
    price: 25.00,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      'USD': 25.00,
      'EUR': 22.50,
      'GBP': 19.50,
      'ZAR': 450.00
    }),
    category: 'Integration',
    isActive: true,
    features: JSON.stringify([
      'RESTful API endpoints',
      'Webhook notifications',
      'Custom integration options',
      'API documentation'
    ]),
    dependencies: JSON.stringify([
      'Developer knowledge',
      'API key management'
    ]),
    icon: 'api_icon'
  },
  {
    id: 3,
    name: 'Custom Branding',
    description: 'White-label solution with your branding',
    price: 20.00,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      'USD': 20.00,
      'EUR': 18.00,
      'GBP': 15.50,
      'ZAR': 360.00
    }),
    category: 'Customization',
    isActive: true,
    features: JSON.stringify([
      'Logo customization',
      'Color scheme adjustment',
      'Custom domain support',
      'Email template branding'
    ]),
    dependencies: JSON.stringify([
      'Brand assets',
      'Logo in SVG format'
    ]),
    icon: 'branding_icon'
  },
  {
    id: 4,
    name: '24/7 Support',
    description: 'Round-the-clock customer support',
    price: 30.00,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      'USD': 30.00,
      'EUR': 27.00,
      'GBP': 23.50,
      'ZAR': 540.00
    }),
    category: 'Support',
    isActive: true,
    features: JSON.stringify([
      'Priority email support',
      'Live chat assistance',
      'Phone support',
      'Dedicated account manager'
    ]),
    dependencies: JSON.stringify([
      'Valid support contract',
      'User account'
    ]),
    icon: 'support_icon'
  },
  {
    id: 5,
    name: 'Data Migration',
    description: 'Assistance with data migration from other systems',
    price: 50.00,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      'USD': 50.00,
      'EUR': 45.00,
      'GBP': 39.00,
      'ZAR': 900.00
    }),
    category: 'Data',
    isActive: true,
    features: JSON.stringify([
      'Data mapping assistance',
      'Migration planning',
      'Data validation',
      'Post-migration support'
    ]),
    dependencies: JSON.stringify([
      'Source data access',
      'Data export capabilities from source system'
    ]),
    icon: 'migration_icon'
  }
];

export async function GET(request: Request) {
  try {
    console.log('Proxying GET request to backend for add-ons');
    console.log(`Backend API URL: ${BACKEND_API_URL}/api/AddOns`);

    // Get query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const isActive = url.searchParams.get('isActive');
    const pageNumber = url.searchParams.get('pageNumber') || '1';
    const pageSize = url.searchParams.get('pageSize') || '50';

    // Build query string
    let queryString = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (category) queryString += `&category=${category}`;
    if (isActive) queryString += `&isActive=${isActive}`;

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/AddOns${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add Cache-Control header to prevent browser caching
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        // Add cache: 'no-store' to prevent Next.js caching
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, serving fallback data`
      );

      // Log information about the fallback data being used
      console.log('===== USING FALLBACK ADD-ONS DATA =====');
      console.log('Number of fallback add-ons:', fallbackAddOns.length);

      // Log the first few fallback add-ons in detail
      fallbackAddOns.slice(0, 3).forEach((addOn, index) => {
        console.log(`Fallback AddOn #${index + 1} (ID: ${addOn.id}):`);
        console.log('  Name:', addOn.name);
        console.log('  Description:', addOn.description);
        console.log('  Price:', addOn.price);
        console.log('  Currency:', addOn.currency);
        console.log('  MultiCurrencyPrices:', addOn.multiCurrencyPrices);
        console.log('  Category:', addOn.category);
        console.log('  IsActive:', addOn.isActive);
        console.log('  Features:', addOn.features);
        console.log('  Dependencies:', addOn.dependencies);
        console.log('  Icon:', addOn.icon);
      });

      if (fallbackAddOns.length > 3) {
        console.log(`... and ${fallbackAddOns.length - 3} more fallback add-ons`);
      }
      console.log('=======================================');

      return NextResponse.json({
        totalItems: fallbackAddOns.length,
        data: fallbackAddOns
      });
    }

    const data = await response.json();
    console.log('Successfully fetched add-ons from backend');

    // Log detailed information about the AddOns data received from the backend
    console.log('===== ADD-ONS API RESPONSE DATA =====');
    console.log('Total items:', data.totalItems);
    console.log('Response structure:', Object.keys(data));

    if (data.data && Array.isArray(data.data)) {
      console.log('Number of add-ons received:', data.data.length);

      // Log the first few add-ons in detail
      data.data.slice(0, 3).forEach((addOn: AddOn, index: number) => {
        console.log(`AddOn #${index + 1} (ID: ${addOn.id}):`);
        console.log('  Name:', addOn.name);
        console.log('  Description:', addOn.description);
        console.log('  Price:', addOn.price);
        console.log('  Currency:', addOn.currency);
        console.log('  MultiCurrencyPrices:', addOn.multiCurrencyPrices);
        console.log('  Category:', addOn.category);
        console.log('  IsActive:', addOn.isActive);
        console.log('  Features:', addOn.features);
        console.log('  Dependencies:', addOn.dependencies);
        console.log('  Icon:', addOn.icon);
        console.log('  Properties:', Object.keys(addOn));
      });

      if (data.data.length > 3) {
        console.log(`... and ${data.data.length - 3} more add-ons`);
      }
    }
    console.log('=====================================');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching add-ons:', error);

    // Log information about the fallback data being used due to error
    console.log('===== USING FALLBACK ADD-ONS DATA DUE TO ERROR =====');
    console.log('Error details:', error);
    console.log('Number of fallback add-ons:', fallbackAddOns.length);

    // Log the first few fallback add-ons in detail
    fallbackAddOns.slice(0, 3).forEach((addOn, index) => {
      console.log(`Fallback AddOn #${index + 1} (ID: ${addOn.id}):`);
      console.log('  Name:', addOn.name);
      console.log('  Description:', addOn.description);
      console.log('  Price:', addOn.price);
      console.log('  Currency:', addOn.currency);
      console.log('  MultiCurrencyPrices:', addOn.multiCurrencyPrices);
      console.log('  Category:', addOn.category);
      console.log('  IsActive:', addOn.isActive);
      console.log('  Features:', addOn.features);
      console.log('  Dependencies:', addOn.dependencies);
      console.log('  Icon:', addOn.icon);
    });

    if (fallbackAddOns.length > 3) {
      console.log(`... and ${fallbackAddOns.length - 3} more fallback add-ons`);
    }
    console.log('=================================================');

    return NextResponse.json({
      totalItems: fallbackAddOns.length,
      data: fallbackAddOns
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Proxying POST request to backend for creating add-on', body);

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/AddOns`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, returning error`
      );
      return NextResponse.json(
        { error: 'Failed to create add-on' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Successfully created add-on in backend');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating add-on:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
