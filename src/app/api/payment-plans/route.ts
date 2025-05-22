'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getCacheControlHeaders } from '../../caching-config';
import { CACHE_TIMES } from '../../cache-constants';

export interface PaymentPlan {
  id: number;
  name: string;
  period: string;
  discountPercentage: number;
  discountLabel: string | null;
  description: string;
  isPopular: boolean;
  isDefault: boolean;
  validFrom?: string;
  validTo?: string;
  applicableRegions: string[];
  applicableUserTypes: string[];
}

export interface PaymentPlansResponse {
  plans: PaymentPlan[];
  defaultPlanId: number | null;
  currency: string;
}

const fallbackPaymentPlans: PaymentPlansResponse = {
  plans: [
    {
      id: 0,
      name: 'Monthly',
      period: '1 month',
      discountPercentage: 0,
      discountLabel: null,
      description: 'Pay monthly with full flexibility',
      isPopular: false,
      isDefault: true,
      applicableRegions: ['*'],
      applicableUserTypes: ['*'],
    },
    {
      id: 1,
      name: 'Quarterly',
      period: '3 months',
      discountPercentage: 0.1,
      discountLabel: '10% OFF',
      description: 'Save 10% with quarterly billing',
      isPopular: false,
      isDefault: false,
      applicableRegions: ['*'],
      applicableUserTypes: ['*'],
    },
    {
      id: 2,
      name: 'Semi-Annual',
      period: '6 months',
      discountPercentage: 0.15,
      discountLabel: '15% OFF',
      description: 'Save 15% with semi-annual billing',
      isPopular: true,
      isDefault: false,
      applicableRegions: ['*'],
      applicableUserTypes: ['*'],
    },
    {
      id: 3,
      name: 'Annual',
      period: '12 months',
      discountPercentage: 0.2,
      discountLabel: '20% OFF',
      description: 'Maximum savings with annual billing',
      isPopular: false,
      isDefault: false,
      applicableRegions: ['*'],
      applicableUserTypes: ['*'],
    },
  ],
  defaultPlanId: 0,
  currency: 'USD',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const currency = searchParams.get('currency') || 'USD';
  const region = searchParams.get('region');
  const userType = searchParams.get('userType');
  const forceRefresh = searchParams.get('refresh') === 'true';

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5107';

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const queryParams = new URLSearchParams({
      currency,
      ...(region && { region }),
      ...(userType && { userType }),
    });

    const endpoint = `${baseUrl}/api/paymentplans?${queryParams}`;

    console.log(`Fetching payment plans from: ${endpoint}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': forceRefresh ? 'no-cache' : 'max-age=300',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(
          `Payment plans API returned status ${response.status}, using fallback`
        );
        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPaymentPlans, {
          status: 200,
          headers,
        });
      }

      const data: PaymentPlansResponse = await response.json();

      if (
        !data.plans ||
        !Array.isArray(data.plans) ||
        data.plans.length === 0
      ) {
        console.warn(
          'Invalid payment plans response structure, using fallback'
        );
        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPaymentPlans, {
          status: 200,
          headers,
        });
      }

      console.log(`Successfully fetched ${data.plans.length} payment plans`);
      const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
      return NextResponse.json(data, { status: 200, headers });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Error fetching payment plans:', fetchError);
      const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
      return NextResponse.json(fallbackPaymentPlans, { status: 200, headers });
    }
  } catch (error) {
    console.error('Payment plans API error:', error);
    const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
    return NextResponse.json(fallbackPaymentPlans, { status: 200, headers });
  }
}
