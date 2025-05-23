import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

export async function GET(request: NextRequest) {
  try {
    console.log('Proxying GET request to backend for custom package features');

    const authHeader = request.headers.get('authorization');
    console.log('Authorization header present:', !!authHeader);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/PricingPackages/custom/features`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, serving fallback data`
      );

      return NextResponse.json({
        coreFeatures: [],
        addOns: [
          {
            id: 1,
            name: 'Premium Support',
            description:
              '24/7 priority customer support with dedicated account manager',
            price: 49.99,
            currency: 'USD',
            multiCurrencyPrices: {
              USD: 49.99,
              EUR: 44.99,
              GBP: 39.99,
              ZAR: 899.99,
            },
            category: 'Support',
            isActive: true,
            features: [
              '24/7 phone and email support',
              'Dedicated account manager',
              'Priority response times',
              'Advanced troubleshooting',
            ],
            dependencies: ['Internet connection'],
            icon: 'support_icon',
          },
          {
            id: 2,
            name: 'Advanced Analytics',
            description: 'Detailed business analytics and insights',
            price: 15.0,
            currency: 'USD',
            multiCurrencyPrices: {
              USD: 15.0,
              EUR: 13.5,
              GBP: 11.5,
              ZAR: 270.0,
            },
            category: 'Analytics',
            isActive: true,
            features: [
              'Real-time data visualization',
              'Custom report generation',
              'Data export capabilities',
              'Trend analysis',
            ],
            dependencies: ['Internet connection', 'Modern browser'],
            icon: 'analytics_icon',
          },
          {
            id: 3,
            name: 'Multi-Location Management',
            description:
              'Manage multiple store locations from a single dashboard',
            price: 25.0,
            currency: 'USD',
            multiCurrencyPrices: {
              USD: 25.0,
              EUR: 22.5,
              GBP: 19.5,
              ZAR: 450.0,
            },
            category: 'Management',
            isActive: true,
            features: [
              'Centralized location management',
              'Location-specific reporting',
              'Inventory synchronization',
              'Staff management across locations',
            ],
            dependencies: ['Internet connection'],
            icon: 'location_icon',
          },
          {
            id: 4,
            name: 'API Integration Suite',
            description: 'Advanced API access and custom integrations',
            price: 35.0,
            currency: 'USD',
            multiCurrencyPrices: {
              USD: 35.0,
              EUR: 31.5,
              GBP: 27.5,
              ZAR: 630.0,
            },
            category: 'Integration',
            isActive: true,
            features: [
              'RESTful API access',
              'Webhook notifications',
              'Custom integration support',
              'Third-party app connections',
            ],
            dependencies: ['Internet connection', 'Developer access'],
            icon: 'api_icon',
          },
          {
            id: 5,
            name: 'Enhanced Security',
            description: 'Advanced security features and compliance tools',
            price: 20.0,
            currency: 'USD',
            multiCurrencyPrices: {
              USD: 20.0,
              EUR: 18.0,
              GBP: 15.5,
              ZAR: 360.0,
            },
            category: 'Security',
            isActive: true,
            features: [
              'Two-factor authentication',
              'Advanced encryption',
              'Audit logging',
              'Role-based access control',
            ],
            dependencies: ['Internet connection'],
            icon: 'security_icon',
          },
        ],
        usageBasedPricing: [],
      });
    }

    const data = await response.json();
    console.log('Successfully fetched custom package features from backend');
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error fetching custom package features:',
      error instanceof Error ? error.message : String(error)
    );
    console.error('Full error details:', error);

    return NextResponse.json({
      coreFeatures: [],
      addOns: [
        {
          id: 1,
          name: 'Premium Support',
          description:
            '24/7 priority customer support with dedicated account manager',
          price: 49.99,
          currency: 'USD',
          multiCurrencyPrices: {
            USD: 49.99,
            EUR: 44.99,
            GBP: 39.99,
            ZAR: 899.99,
          },
          category: 'Support',
          isActive: true,
          features: [
            '24/7 phone and email support',
            'Dedicated account manager',
            'Priority response times',
            'Advanced troubleshooting',
          ],
          dependencies: ['Internet connection'],
          icon: 'support_icon',
        },
        {
          id: 2,
          name: 'Advanced Analytics',
          description: 'Detailed business analytics and insights',
          price: 15.0,
          currency: 'USD',
          multiCurrencyPrices: {
            USD: 15.0,
            EUR: 13.5,
            GBP: 11.5,
            ZAR: 270.0,
          },
          category: 'Analytics',
          isActive: true,
          features: [
            'Real-time data visualization',
            'Custom report generation',
            'Data export capabilities',
            'Trend analysis',
          ],
          dependencies: ['Internet connection', 'Modern browser'],
          icon: 'analytics_icon',
        },
        {
          id: 3,
          name: 'Multi-Location Management',
          description:
            'Manage multiple store locations from a single dashboard',
          price: 25.0,
          currency: 'USD',
          multiCurrencyPrices: {
            USD: 25.0,
            EUR: 22.5,
            GBP: 19.5,
            ZAR: 450.0,
          },
          category: 'Management',
          isActive: true,
          features: [
            'Centralized location management',
            'Location-specific reporting',
            'Inventory synchronization',
            'Staff management across locations',
          ],
          dependencies: ['Internet connection'],
          icon: 'location_icon',
        },
        {
          id: 4,
          name: 'API Integration Suite',
          description: 'Advanced API access and custom integrations',
          price: 35.0,
          currency: 'USD',
          multiCurrencyPrices: {
            USD: 35.0,
            EUR: 31.5,
            GBP: 27.5,
            ZAR: 630.0,
          },
          category: 'Integration',
          isActive: true,
          features: [
            'RESTful API access',
            'Webhook notifications',
            'Custom integration support',
            'Third-party app connections',
          ],
          dependencies: ['Internet connection', 'Developer access'],
          icon: 'api_icon',
        },
        {
          id: 5,
          name: 'Enhanced Security',
          description: 'Advanced security features and compliance tools',
          price: 20.0,
          currency: 'USD',
          multiCurrencyPrices: {
            USD: 20.0,
            EUR: 18.0,
            GBP: 15.5,
            ZAR: 360.0,
          },
          category: 'Security',
          isActive: true,
          features: [
            'Two-factor authentication',
            'Advanced encryption',
            'Audit logging',
            'Role-based access control',
          ],
          dependencies: ['Internet connection'],
          icon: 'security_icon',
        },
      ],
      usageBasedPricing: [],
    });
  }
}
