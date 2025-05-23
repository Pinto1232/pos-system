import { NextResponse } from 'next/server';

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

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

const fallbackAddOns = [
  {
    id: 1,
    name: 'Advanced Analytics',
    description: 'Detailed business analytics and insights',
    price: 15.0,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      USD: 15.0,
      EUR: 13.5,
      GBP: 11.5,
      ZAR: 270.0,
    }),
    category: 'Analytics',
    isActive: true,
    features: JSON.stringify([
      'Real-time data visualization',
      'Custom report generation',
      'Data export capabilities',
      'Trend analysis',
    ]),
    dependencies: JSON.stringify(['Internet connection', 'Modern browser']),
    icon: 'analytics_icon',
  },
  {
    id: 2,
    name: 'API Access',
    description: 'Access to API for custom integrations',
    price: 25.0,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      USD: 25.0,
      EUR: 22.5,
      GBP: 19.5,
      ZAR: 450.0,
    }),
    category: 'Integration',
    isActive: true,
    features: JSON.stringify([
      'RESTful API endpoints',
      'Webhook notifications',
      'Custom integration options',
      'API documentation',
    ]),
    dependencies: JSON.stringify(['Developer knowledge', 'API key management']),
    icon: 'api_icon',
  },
  {
    id: 3,
    name: 'Custom Branding',
    description: 'White-label solution with your branding',
    price: 20.0,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      USD: 20.0,
      EUR: 18.0,
      GBP: 15.5,
      ZAR: 360.0,
    }),
    category: 'Customization',
    isActive: true,
    features: JSON.stringify([
      'Logo customization',
      'Color scheme adjustment',
      'Custom domain support',
      'Email template branding',
    ]),
    dependencies: JSON.stringify(['Brand assets', 'Logo in SVG format']),
    icon: 'branding_icon',
  },
  {
    id: 4,
    name: '24/7 Support',
    description: 'Round-the-clock customer support',
    price: 30.0,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      USD: 30.0,
      EUR: 27.0,
      GBP: 23.5,
      ZAR: 540.0,
    }),
    category: 'Support',
    isActive: true,
    features: JSON.stringify([
      'Priority email support',
      'Live chat assistance',
      'Phone support',
      'Dedicated account manager',
    ]),
    dependencies: JSON.stringify(['Valid support contract', 'User account']),
    icon: 'support_icon',
  },
  {
    id: 5,
    name: 'Data Migration',
    description: 'Assistance with data migration from other systems',
    price: 50.0,
    currency: 'USD',
    multiCurrencyPrices: JSON.stringify({
      USD: 50.0,
      EUR: 45.0,
      GBP: 39.0,
      ZAR: 900.0,
    }),
    category: 'Data',
    isActive: true,
    features: JSON.stringify([
      'Data mapping assistance',
      'Migration planning',
      'Data validation',
      'Post-migration support',
    ]),
    dependencies: JSON.stringify([
      'Source data access',
      'Data export capabilities from source system',
    ]),
    icon: 'migration_icon',
  },
];

export async function GET(request: Request) {
  try {
    console.log('Proxying GET request to backend for add-ons');
    console.log(`Backend API URL: ${BACKEND_API_URL}/api/AddOns`);

    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const isActive = url.searchParams.get('isActive');
    const pageNumber = url.searchParams.get('pageNumber') || '1';
    const pageSize = url.searchParams.get('pageSize') || '50';

    let queryString = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (category) queryString += `&category=${category}`;
    if (isActive) queryString += `&isActive=${isActive}`;

    const response = await fetch(
      `${BACKEND_API_URL}/api/AddOns${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },

        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, serving fallback data`
      );

      console.log('===== USING FALLBACK ADD-ONS DATA =====');
      console.log(
        'Number of fallback add-ons:',
        JSON.stringify(fallbackAddOns.length, null, 2)
      );

      fallbackAddOns.slice(0, 3).forEach((addOn, index) => {
        console.log(`Fallback AddOn #${index + 1} (ID: ${addOn.id}):`);
        console.log('  Name:', JSON.stringify(addOn.name, null, 2));
        console.log(
          '  Description:',
          JSON.stringify(addOn.description, null, 2)
        );
        console.log('  Price:', JSON.stringify(addOn.price, null, 2));
        console.log('  Currency:', JSON.stringify(addOn.currency, null, 2));
        console.log(
          '  MultiCurrencyPrices:',
          JSON.stringify(addOn.multiCurrencyPrices, null, 2)
        );
        console.log('  Category:', JSON.stringify(addOn.category, null, 2));
        console.log('  IsActive:', JSON.stringify(addOn.isActive, null, 2));
        console.log('  Features:', JSON.stringify(addOn.features, null, 2));
        console.log(
          '  Dependencies:',
          JSON.stringify(addOn.dependencies, null, 2)
        );
        console.log('  Icon:', JSON.stringify(addOn.icon, null, 2));
      });

      if (fallbackAddOns.length > 3) {
        console.log(
          `... and ${fallbackAddOns.length - 3} more fallback add-ons`
        );
      }
      console.log('=======================================');

      return NextResponse.json({
        totalItems: fallbackAddOns.length,
        data: fallbackAddOns,
      });
    }

    const data = await response.json();
    console.log('Successfully fetched add-ons from backend');

    console.log('===== ADD-ONS API RESPONSE DATA =====');
    console.log('Total items:', JSON.stringify(data.totalItems, null, 2));
    console.log(
      'Response structure:',
      JSON.stringify(Object.keys(data), null, 2)
    );

    if (data.data && Array.isArray(data.data)) {
      console.log(
        'Number of add-ons received:',
        JSON.stringify(data.data.length, null, 2)
      );

      data.data.slice(0, 3).forEach((addOn: AddOn, index: number) => {
        console.log(`AddOn #${index + 1} (ID: ${addOn.id}):`);
        console.log('  Name:', JSON.stringify(addOn.name, null, 2));
        console.log(
          '  Description:',
          JSON.stringify(addOn.description, null, 2)
        );
        console.log('  Price:', JSON.stringify(addOn.price, null, 2));
        console.log('  Currency:', JSON.stringify(addOn.currency, null, 2));
        console.log(
          '  MultiCurrencyPrices:',
          JSON.stringify(addOn.multiCurrencyPrices, null, 2)
        );
        console.log('  Category:', JSON.stringify(addOn.category, null, 2));
        console.log('  IsActive:', JSON.stringify(addOn.isActive, null, 2));
        console.log('  Features:', JSON.stringify(addOn.features, null, 2));
        console.log(
          '  Dependencies:',
          JSON.stringify(addOn.dependencies, null, 2)
        );
        console.log('  Icon:', JSON.stringify(addOn.icon, null, 2));
        console.log(
          '  Properties:',
          JSON.stringify(Object.keys(addOn), null, 2)
        );
      });

      if (data.data.length > 3) {
        console.log(`... and ${data.data.length - 3} more add-ons`);
      }
    }
    console.log('=====================================');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching add-ons:', JSON.stringify(error, null, 2));

    console.log('===== USING FALLBACK ADD-ONS DATA DUE TO ERROR =====');
    console.log('Error details:', JSON.stringify(error, null, 2));
    console.log(
      'Number of fallback add-ons:',
      JSON.stringify(fallbackAddOns.length, null, 2)
    );

    fallbackAddOns.slice(0, 3).forEach((addOn, index) => {
      console.log(`Fallback AddOn #${index + 1} (ID: ${addOn.id}):`);
      console.log('  Name:', JSON.stringify(addOn.name, null, 2));
      console.log('  Description:', JSON.stringify(addOn.description, null, 2));
      console.log('  Price:', JSON.stringify(addOn.price, null, 2));
      console.log('  Currency:', JSON.stringify(addOn.currency, null, 2));
      console.log(
        '  MultiCurrencyPrices:',
        JSON.stringify(addOn.multiCurrencyPrices, null, 2)
      );
      console.log('  Category:', JSON.stringify(addOn.category, null, 2));
      console.log('  IsActive:', JSON.stringify(addOn.isActive, null, 2));
      console.log('  Features:', JSON.stringify(addOn.features, null, 2));
      console.log(
        '  Dependencies:',
        JSON.stringify(addOn.dependencies, null, 2)
      );
      console.log('  Icon:', JSON.stringify(addOn.icon, null, 2));
    });

    if (fallbackAddOns.length > 3) {
      console.log(`... and ${fallbackAddOns.length - 3} more fallback add-ons`);
    }
    console.log('=================================================');

    return NextResponse.json({
      totalItems: fallbackAddOns.length,
      data: fallbackAddOns,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(
      'Proxying POST request to backend for creating add-on',
      JSON.stringify(body, null, 2)
    );

    const response = await fetch(`${BACKEND_API_URL}/api/AddOns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

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
    console.error('Error creating add-on:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
