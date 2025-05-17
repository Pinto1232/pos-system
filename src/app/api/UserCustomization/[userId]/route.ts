import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

const DEFAULT_TAX_SETTINGS = {
  enableTaxCalculation: true,
  defaultTaxRate: 15.0,
  taxCalculationMethod: 'exclusive',
  vatRegistered: true,
  vatNumber: 'VAT2023456789',
  enableMultipleTaxRates: false,
  taxCategories: [
    {
      id: 1,
      name: 'Standard Rate',
      rate: 15.0,
      description: 'Standard VAT rate for most goods and services',
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
  enableTaxExemptions: false,
  taxReportingPeriod: 'monthly',
};

const DEFAULT_REGIONAL_SETTINGS = {
  defaultCurrency: 'ZAR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  timezone: 'Africa/Johannesburg',
  numberFormat: '#,###.##',
  language: 'en-ZA',
  autoDetectLocation: true,
  enableMultiCurrency: true,
  supportedCurrencies: ['ZAR', 'USD', 'EUR', 'GBP'],
};

export async function GET(request: Request, context: { params: { userId: string } }) {
  const params = await Promise.resolve(context.params);
  const { userId } = params;

  try {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(`Proxying GET request to backend for user: ${userId}`);

      const response = await fetch(`${BACKEND_API_URL}/api/UserCustomization/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched user customization from backend');
        return NextResponse.json(data);
      } else {
        console.warn(`Backend API returned status: ${response.status}, serving mock data`);
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    return NextResponse.json({
      id: 1,
      userId: userId,
      sidebarColor: '#173A79',
      logoUrl: '/Pisval_Logo.jpg',
      navbarColor: '#000000',
      taxSettings: DEFAULT_TAX_SETTINGS,
      regionalSettings: DEFAULT_REGIONAL_SETTINGS,
    });
  } catch (error) {
    console.error('Error proxying request to backend:', JSON.stringify(error, null, 2));

    console.log('Returning mock data due to error');
    return NextResponse.json({
      id: 1,
      userId: userId,
      sidebarColor: '#173A79',
      logoUrl: '/Pisval_Logo.jpg',
      navbarColor: '#000000',
      taxSettings: DEFAULT_TAX_SETTINGS,
      regionalSettings: DEFAULT_REGIONAL_SETTINGS,
    });
  }
}
