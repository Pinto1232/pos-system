import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Default tax settings
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
      description:
        'Standard VAT rate for most goods and services',
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
  enableTaxExemptions: false,
  taxReportingPeriod: 'monthly',
};

// Default regional settings
const DEFAULT_REGIONAL_SETTINGS = {
  defaultCurrency: 'ZAR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  timezone: 'Africa/Johannesburg',
  numberFormat: '#,###.##',
  language: 'en-ZA',
  autoDetectLocation: true,
  enableMultiCurrency: true,
  supportedCurrencies: [
    'ZAR',
    'USD',
    'EUR',
    'GBP',
  ],
};

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;

  try {
    console.log(
      `Proxying GET request to backend for user: ${userId}`
    );

    // Forward the request to the backend API
    const response = await fetch(
      `${BACKEND_API_URL}/api/UserCustomization/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `Backend API returned status: ${response.status}, serving mock data`
      );

      // Return mock data if backend API fails
      return NextResponse.json({
        id: 1,
        userId: userId,
        sidebarColor: '#173A79',
        logoUrl: '/Pisval_Logo.jpg',
        navbarColor: '#000000',
        taxSettings: DEFAULT_TAX_SETTINGS,
        regionalSettings:
          DEFAULT_REGIONAL_SETTINGS,
      });
    }

    const data = await response.json();
    console.log(
      'Successfully fetched user customization from backend'
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      error
    );

    // Return mock data in case of error
    console.log(
      'Returning mock data due to error'
    );
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
