import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ?? 'http://localhost:5107';

export async function GET(request: NextRequest) {
  try {
    console.log('Proxying GET request to backend for custom package features');
    console.log('Backend API URL:', BACKEND_API_URL);

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
        `Backend API returned status: ${response.status} ${response.statusText}, serving fallback data`
      );
      console.warn(
        'Response details:',
        await response.text().catch(() => 'Unable to read response')
      );

      return NextResponse.json({
        coreFeatures: [
          {
            id: 1,
            name: 'Point of Sale',
            description: 'Basic POS functionality with sales processing',
            basePrice: 10.0,
            isRequired: true,
            multiCurrencyPrices: {
              USD: 10.0,
              EUR: 9.0,
              GBP: 7.5,
              ZAR: 180.0,
            },
          },
          {
            id: 2,
            name: 'Inventory Management',
            description: 'Track and manage inventory levels',
            basePrice: 5.0,
            isRequired: true,
            multiCurrencyPrices: {
              USD: 5.0,
              EUR: 4.5,
              GBP: 3.75,
              ZAR: 90.0,
            },
          },
          {
            id: 3,
            name: 'Customer Management',
            description: 'Manage customer information and purchase history',
            basePrice: 5.0,
            isRequired: false,
            multiCurrencyPrices: {
              USD: 5.0,
              EUR: 4.5,
              GBP: 3.75,
              ZAR: 90.0,
            },
          },
          {
            id: 4,
            name: 'Reporting',
            description: 'Basic sales and inventory reports',
            basePrice: 5.0,
            isRequired: false,
            multiCurrencyPrices: {
              USD: 5.0,
              EUR: 4.5,
              GBP: 3.75,
              ZAR: 90.0,
            },
          },
          {
            id: 5,
            name: 'Employee Management',
            description: 'Manage employee accounts and permissions',
            basePrice: 7.5,
            isRequired: false,
            multiCurrencyPrices: {
              USD: 7.5,
              EUR: 6.75,
              GBP: 5.65,
              ZAR: 135.0,
            },
          },
          {
            id: 6,
            name: 'Multi-store Support',
            description: 'Support for multiple store locations',
            basePrice: 15.0,
            isRequired: false,
            multiCurrencyPrices: {
              USD: 15.0,
              EUR: 13.5,
              GBP: 11.25,
              ZAR: 270.0,
            },
          },
          {
            id: 7,
            name: 'Loyalty Program',
            description: 'Customer loyalty and rewards program',
            basePrice: 10.0,
            isRequired: false,
            multiCurrencyPrices: {
              USD: 10.0,
              EUR: 9.0,
              GBP: 7.5,
              ZAR: 180.0,
            },
          },
          {
            id: 8,
            name: 'E-commerce Integration',
            description: 'Integration with online store',
            basePrice: 20.0,
            isRequired: false,
            multiCurrencyPrices: {
              USD: 20.0,
              EUR: 18.0,
              GBP: 15.0,
              ZAR: 360.0,
            },
          },
        ],
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
        usageBasedPricing: [
          {
            id: 1,
            featureId: 1,
            name: 'Number of Transactions',
            unit: 'transactions/month',
            minValue: 1000,
            maxValue: 100000,
            pricePerUnit: 0.01,
            defaultValue: 1000,
            multiCurrencyPrices: {
              USD: 0.01,
              EUR: 0.009,
              GBP: 0.0075,
              ZAR: 0.18,
            },
          },
          {
            id: 2,
            featureId: 2,
            name: 'Number of Products',
            unit: 'products',
            minValue: 100,
            maxValue: 10000,
            pricePerUnit: 0.05,
            defaultValue: 100,
            multiCurrencyPrices: {
              USD: 0.05,
              EUR: 0.045,
              GBP: 0.0375,
              ZAR: 0.9,
            },
          },
          {
            id: 3,
            featureId: 3,
            name: 'Number of Users',
            unit: 'users',
            minValue: 1,
            maxValue: 100,
            pricePerUnit: 5.0,
            defaultValue: 1,
            multiCurrencyPrices: {
              USD: 5.0,
              EUR: 4.5,
              GBP: 3.75,
              ZAR: 90.0,
            },
          },
          {
            id: 4,
            featureId: 6,
            name: 'Number of Stores',
            unit: 'stores',
            minValue: 1,
            maxValue: 50,
            pricePerUnit: 10.0,
            defaultValue: 1,
            multiCurrencyPrices: {
              USD: 10.0,
              EUR: 9.0,
              GBP: 7.5,
              ZAR: 180.0,
            },
          },
          {
            id: 5,
            featureId: 7,
            name: 'Number of Loyalty Members',
            unit: 'members',
            minValue: 100,
            maxValue: 10000,
            pricePerUnit: 0.02,
            defaultValue: 100,
            multiCurrencyPrices: {
              USD: 0.02,
              EUR: 0.018,
              GBP: 0.015,
              ZAR: 0.36,
            },
          },
        ],
      });
    }

    const data = await response.json();
    console.log('Successfully fetched custom package features from backend');
    console.log(
      'Usage pricing data length:',
      data.usageBasedPricing?.length ?? 0
    );
    console.log(
      'Usage pricing data:',
      JSON.stringify(data.usageBasedPricing, null, 2)
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error fetching custom package features:',
      error instanceof Error ? error.message : String(error)
    );
    console.error('Full error details:', error);

    return NextResponse.json({
      coreFeatures: [
        {
          id: 1,
          name: 'Point of Sale',
          description: 'Basic POS functionality with sales processing',
          basePrice: 10.0,
          isRequired: true,
          multiCurrencyPrices: {
            USD: 10.0,
            EUR: 9.0,
            GBP: 7.5,
            ZAR: 180.0,
          },
        },
        {
          id: 2,
          name: 'Inventory Management',
          description: 'Track and manage inventory levels',
          basePrice: 5.0,
          isRequired: true,
          multiCurrencyPrices: {
            USD: 5.0,
            EUR: 4.5,
            GBP: 3.75,
            ZAR: 90.0,
          },
        },
        {
          id: 3,
          name: 'Customer Management',
          description: 'Manage customer information and purchase history',
          basePrice: 5.0,
          isRequired: false,
          multiCurrencyPrices: {
            USD: 5.0,
            EUR: 4.5,
            GBP: 3.75,
            ZAR: 90.0,
          },
        },
        {
          id: 4,
          name: 'Reporting',
          description: 'Basic sales and inventory reports',
          basePrice: 5.0,
          isRequired: false,
          multiCurrencyPrices: {
            USD: 5.0,
            EUR: 4.5,
            GBP: 3.75,
            ZAR: 90.0,
          },
        },
        {
          id: 5,
          name: 'Employee Management',
          description: 'Manage employee accounts and permissions',
          basePrice: 7.5,
          isRequired: false,
          multiCurrencyPrices: {
            USD: 7.5,
            EUR: 6.75,
            GBP: 5.65,
            ZAR: 135.0,
          },
        },
        {
          id: 6,
          name: 'Multi-store Support',
          description: 'Support for multiple store locations',
          basePrice: 15.0,
          isRequired: false,
          multiCurrencyPrices: {
            USD: 15.0,
            EUR: 13.5,
            GBP: 11.25,
            ZAR: 270.0,
          },
        },
        {
          id: 7,
          name: 'Loyalty Program',
          description: 'Customer loyalty and rewards program',
          basePrice: 10.0,
          isRequired: false,
          multiCurrencyPrices: {
            USD: 10.0,
            EUR: 9.0,
            GBP: 7.5,
            ZAR: 180.0,
          },
        },
        {
          id: 8,
          name: 'E-commerce Integration',
          description: 'Integration with online store',
          basePrice: 20.0,
          isRequired: false,
          multiCurrencyPrices: {
            USD: 20.0,
            EUR: 18.0,
            GBP: 15.0,
            ZAR: 360.0,
          },
        },
      ],
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
      usageBasedPricing: [
        {
          id: 1,
          featureId: 1,
          name: 'Number of Transactions',
          unit: 'transactions/month',
          minValue: 1000,
          maxValue: 100000,
          pricePerUnit: 0.01,
          defaultValue: 1000,
          multiCurrencyPrices: {
            USD: 0.01,
            EUR: 0.009,
            GBP: 0.0075,
            ZAR: 0.18,
          },
        },
        {
          id: 2,
          featureId: 2,
          name: 'Number of Products',
          unit: 'products',
          minValue: 100,
          maxValue: 10000,
          pricePerUnit: 0.05,
          defaultValue: 100,
          multiCurrencyPrices: {
            USD: 0.05,
            EUR: 0.045,
            GBP: 0.0375,
            ZAR: 0.9,
          },
        },
        {
          id: 3,
          featureId: 3,
          name: 'Number of Users',
          unit: 'users',
          minValue: 1,
          maxValue: 100,
          pricePerUnit: 5.0,
          defaultValue: 1,
          multiCurrencyPrices: {
            USD: 5.0,
            EUR: 4.5,
            GBP: 3.75,
            ZAR: 90.0,
          },
        },
        {
          id: 4,
          featureId: 6,
          name: 'Number of Stores',
          unit: 'stores',
          minValue: 1,
          maxValue: 50,
          pricePerUnit: 10.0,
          defaultValue: 1,
          multiCurrencyPrices: {
            USD: 10.0,
            EUR: 9.0,
            GBP: 7.5,
            ZAR: 180.0,
          },
        },
        {
          id: 5,
          featureId: 7,
          name: 'Number of Loyalty Members',
          unit: 'members',
          minValue: 100,
          maxValue: 10000,
          pricePerUnit: 0.02,
          defaultValue: 100,
          multiCurrencyPrices: {
            USD: 0.02,
            EUR: 0.018,
            GBP: 0.015,
            ZAR: 0.36,
          },
        },
      ],
    });
  }
}
