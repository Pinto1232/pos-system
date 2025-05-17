'use server';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getCacheOptions, getCacheControlHeaders } from '../../caching-config';
import { CACHE_TIMES, CACHE_TAGS } from '../../cache-constants';
import { safeJsonParse, extractJsonObjects } from '@/utils/jsonUtils';

export type PricingPackagesResponse = {
  totalItems: number;
  data: Array<{
    id: number | string;
    title: string;
    description: string;
    icon: string;
    extraDescription: string;
    price: number;
    testPeriodDays: number;
    type: string;
    currency: string;
    multiCurrencyPrices: string;
  }>;
  pageSize: number;
  pageNumber: number;
};

const fallbackPackages: PricingPackagesResponse = {
  totalItems: 5,
  data: [
    {
      id: 1,
      title: 'Starter Plus',
      description:
        'Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting;Customer database;Simple analytics',
      icon: 'MUI:StarIcon',
      extraDescription:
        'Perfect for small businesses looking for essential features',
      price: 39.99,
      testPeriodDays: 14,
      type: 'starter-plus',
      currency: 'USD',
      multiCurrencyPrices: '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
    },
    {
      id: 2,
      title: 'Growth Pro',
      description:
        'Everything in Growth;Advanced inventory forecasting;Enhanced customer loyalty program;Marketing automation tools;Staff performance tracking;Customizable dashboards;Mobile app access',
      icon: 'MUI:TrendingUpIcon',
      extraDescription:
        'Ideal for growing businesses that need advanced features',
      price: 79.99,
      testPeriodDays: 14,
      type: 'growth-pro',
      currency: 'USD',
      multiCurrencyPrices: '{"ZAR": 1399.99, "EUR": 72.99, "GBP": 63.99}',
    },
    {
      id: 3,
      title: 'Custom Pro',
      description:
        'Tailor-made solutions for your unique business needs;Perfect for businesses requiring customized POS features;Build your own feature set;Pay only for what you need;Flexible scaling options;Industry-specific solutions;Personalized onboarding',
      icon: 'MUI:BuildIcon',
      extraDescription:
        'The ultimate flexibility with professional customization services',
      price: 129.99,
      testPeriodDays: 30,
      type: 'custom-pro',
      currency: 'USD',
      multiCurrencyPrices: '{"ZAR": 2199.99, "EUR": 119.99, "GBP": 104.99}',
    },
    {
      id: 4,
      title: 'Enterprise Elite',
      description:
        'Complete enterprise solution;Multi-location support;Advanced analytics;Priority support;Custom integrations;Dedicated account manager;Staff training;Enterprise-grade security',
      icon: 'MUI:BusinessIcon',
      extraDescription:
        'Comprehensive solution for large businesses with multiple locations',
      price: 199.99,
      testPeriodDays: 30,
      type: 'enterprise-elite',
      currency: 'USD',
      multiCurrencyPrices: '{"ZAR": 3499.99, "EUR": 184.99, "GBP": 159.99}',
    },
    {
      id: 5,
      title: 'Premium Plus',
      description:
        'All-inclusive POS package with premium features;Best for businesses looking for top-tier POS solutions;Advanced AI-powered analytics;Predictive inventory management;Omnichannel integration;VIP support;Quarterly business reviews;Custom reporting',
      icon: 'MUI:DiamondIcon',
      extraDescription:
        'The ultimate POS experience with cutting-edge features and premium support',
      price: 349.99,
      testPeriodDays: 30,
      type: 'premium-plus',
      currency: 'USD',
      multiCurrencyPrices: '{"ZAR": 5999.99, "EUR": 319.99, "GBP": 279.99}',
    },
  ],
  pageSize: 10,
  pageNumber: 1,
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageNumber = Number(searchParams.get('pageNumber') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '10');
  const forceRefresh = searchParams.get('refresh') === 'true';

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value || '';

  try {
    if (forceRefresh) {
      revalidatePath('/api/pricing-packages');
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5107';

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const endpoint = `${baseUrl}/api/pricingpackages?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    console.log(`Using backend API URL: ${baseUrl}`);
    console.log(`Fetching pricing packages from: ${endpoint}`);

    console.log(`Environment variables:
      NEXT_PUBLIC_BACKEND_API_URL: ${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'not set'}
      NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'not set'}
    `);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    let data;

    try {
      if (typeof window !== 'undefined') {
        console.log(
          `Network status: ${navigator.onLine ? 'Online' : 'Offline'}`
        );
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },

        ...getCacheOptions(CACHE_TIMES.PRICING, [CACHE_TAGS.PRICING_PACKAGES]),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`Response status: ${response.status} ${response.statusText}`);
      console.log(
        `Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`
      );
      console.log(`Content-Type: ${response.headers.get('content-type')}`);

      if (!response.ok) {
        console.warn(
          `API response not OK: ${response.status} ${response.statusText}`
        );

        console.error(`Backend API error details:
          - Status: ${response.status}
          - Status Text: ${response.statusText}
          - URL: ${endpoint}
          - Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}
        `);

        if (response.status === 404) {
          console.error(`
            404 Not Found Error: The endpoint ${endpoint} does not exist on the backend server.
            Please check:
            1. The backend server is running at ${baseUrl}
            2. The API route 'pricingpackages' exists (check case sensitivity)
            3. The backend API is properly configured
          `);
        }

        const headers = await getCacheControlHeaders(
          CACHE_TIMES.PRICING,
          CACHE_TIMES.PRICING * 10,
          forceRefresh
        );
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers,
        });
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn(`API response is not JSON: ${contentType}`);
        const headers = await getCacheControlHeaders(
          CACHE_TIMES.PRICING,
          CACHE_TIMES.PRICING * 10,
          forceRefresh
        );
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers,
        });
      }

      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        console.warn('API response is empty');
        const headers = await getCacheControlHeaders(
          CACHE_TIMES.PRICING,
          CACHE_TIMES.PRICING * 10,
          forceRefresh
        );
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers,
        });
      }

      console.group('API Response Analysis');
      console.log(
        'Raw response first 100 chars:',
        responseText.substring(0, 100) + '...'
      );

      const isPricingPackagesResponse = (
        obj: unknown
      ): obj is PricingPackagesResponse => {
        if (!obj || typeof obj !== 'object') return false;

        const candidate = obj as Record<string, unknown>;

        return (
          'data' in candidate &&
          Array.isArray(candidate.data) &&
          candidate.data.length > 0 &&
          'totalItems' in candidate &&
          typeof candidate.totalItems === 'number'
        );
      };

      const isAuthError = (
        obj: unknown
      ): obj is {
        error: string;
        message: string;
      } => {
        return (
          obj !== null &&
          typeof obj === 'object' &&
          'error' in obj &&
          typeof (obj as Record<string, unknown>).error === 'string' &&
          (obj as Record<string, unknown>).error === 'Authentication failed'
        );
      };

      const extractedObjects = extractJsonObjects(responseText);
      console.log(`Found ${extractedObjects.length} JSON objects:`);

      extractedObjects.forEach((obj, index) => {
        console.group(`JSON Object #${index + 1}`);
        console.log(JSON.stringify(obj, null, 2));
        console.groupEnd();
      });

      const authErrors = extractedObjects.filter(isAuthError);
      if (authErrors.length > 0) {
        console.group('Authentication Errors');
        authErrors.forEach((error, index) => {
          console.log(`Error #${index + 1}:`, JSON.stringify(error, null, 2));
        });
        console.groupEnd();
        console.warn(
          'Authentication errors found in response, but continuing processing'
        );
      }

      const pricingData = extractedObjects.find(isPricingPackagesResponse);
      if (pricingData) {
        console.group('Valid Pricing Data');
        console.log(
          'Total Items:',
          JSON.stringify(pricingData.totalItems, null, 2)
        );
        console.log(
          'Data Length:',
          JSON.stringify(pricingData.data.length, null, 2)
        );
        console.log(
          'First Item:',
          JSON.stringify(pricingData.data[0], null, 2)
        );
        console.groupEnd();
      }

      console.groupEnd();

      if (pricingData) {
        data = pricingData as PricingPackagesResponse;
        console.log('Using extracted pricing data object');
      } else {
        console.log(
          'No valid pricing data found in extracted objects, trying safeJsonParse'
        );
        data = safeJsonParse(
          responseText,
          isPricingPackagesResponse,
          fallbackPackages
        ) as PricingPackagesResponse;
      }

      if (!isPricingPackagesResponse(data)) {
        console.error(
          'Parsed data does not match expected PricingPackagesResponse structure'
        );
        console.error('Parsed data:', JSON.stringify(data, null, 2));
        console.error(
          'Response text (first 200 chars):',
          responseText.substring(0, 200) + '...'
        );

        const headers = await getCacheControlHeaders(
          CACHE_TIMES.PRICING,
          CACHE_TIMES.PRICING * 10,
          forceRefresh
        );

        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers,
        });
      }

      console.log('Successfully parsed pricing packages data:', {
        totalItems: data.totalItems,
        dataLength: data.data.length,
        firstItem: data.data[0]
          ? {
              id: data.data[0].id,
              title: data.data[0].title,
            }
          : 'No items',
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error(
        'Error during fetch operation:',
        JSON.stringify(fetchError, null, 2)
      );
      const headers = await getCacheControlHeaders(
        CACHE_TIMES.PRICING,
        CACHE_TIMES.PRICING * 10,
        forceRefresh
      );
      return NextResponse.json(fallbackPackages, {
        status: 200,
        headers,
      });
    }

    if (
      !data ||
      !data.data ||
      !Array.isArray(data.data) ||
      data.data.length === 0
    ) {
      console.warn('API returned invalid or empty data structure');
      const headers = await getCacheControlHeaders(
        CACHE_TIMES.PRICING,
        CACHE_TIMES.PRICING * 10,
        forceRefresh
      );
      return NextResponse.json(fallbackPackages, {
        status: 200,
        headers,
      });
    }

    const headers = await getCacheControlHeaders(
      CACHE_TIMES.PRICING,
      CACHE_TIMES.PRICING * 10,
      forceRefresh
    );

    console.log(
      `[API] Returning pricing data with ${forceRefresh ? 'NO-CACHE' : 'STANDARD'} headers`
    );
    console.log(`[API] Cache headers:`, JSON.stringify(headers, null, 2));
    console.log(
      `[API] Sample pricing data (first item):`,
      data.data && data.data.length > 0
        ? {
            id: data.data[0].id,
            title: data.data[0].title,
            price: data.data[0].price,
            timestamp: new Date().toISOString(),
          }
        : 'No data'
    );

    return NextResponse.json(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(
      'Error fetching pricing packages:',
      JSON.stringify(error, null, 2)
    );

    const headers = await getCacheControlHeaders(
      CACHE_TIMES.PRICING,
      CACHE_TIMES.PRICING * 10,
      forceRefresh
    );
    return NextResponse.json(fallbackPackages, {
      status: 200,
      headers,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    revalidatePath('/api/pricing-packages');

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error('Error during revalidation:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
