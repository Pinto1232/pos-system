import { NextResponse } from 'next/server';

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

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    console.log(`Proxying GET request to backend for add-on with ID: ${id}`);

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/AddOns/${id}`,
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

      // Find the add-on in the fallback data
      const fallbackAddOn = fallbackAddOns.find(
        (addOn) => addOn.id === parseInt(id)
      );

      if (!fallbackAddOn) {
        return NextResponse.json(
          { error: 'Add-on not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(fallbackAddOn);
    }

    const data = await response.json();
    console.log(`Successfully fetched add-on with ID ${id} from backend`);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching add-on with ID ${id}:`, error);

    // Find the add-on in the fallback data
    const fallbackAddOn = fallbackAddOns.find(
      (addOn) => addOn.id === parseInt(id)
    );

    if (!fallbackAddOn) {
      return NextResponse.json(
        { error: 'Add-on not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(fallbackAddOn);
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    const body = await request.json();
    console.log(`Proxying PUT request to backend for updating add-on with ID: ${id}`, body);

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/AddOns/${id}`,
      {
        method: 'PUT',
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
        { error: 'Failed to update add-on' },
        { status: response.status }
      );
    }

    console.log(`Successfully updated add-on with ID ${id} in backend`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error updating add-on with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    console.log(`Proxying DELETE request to backend for add-on with ID: ${id}`);

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/AddOns/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, returning error`
      );
      return NextResponse.json(
        { error: 'Failed to delete add-on' },
        { status: response.status }
      );
    }

    console.log(`Successfully deleted add-on with ID ${id} from backend`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting add-on with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
