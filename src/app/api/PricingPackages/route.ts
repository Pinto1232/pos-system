'use server';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getCacheOptions, getCacheControlHeaders } from '../../caching-config';
import { CACHE_TIMES, CACHE_TAGS } from '../../cache-constants';

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
      title: 'Starter',
      description:
        'Basic POS features;Inventory management;Sales reporting;Customer database;Email support;Cloud backup;Regular updates',
      icon: 'MUI:StarIcon',
      extraDescription: 'Perfect for small businesses just getting started',
      price: 29.99,
      testPeriodDays: 14,
      type: 'starter',
      currency: 'USD',
      multiCurrencyPrices: '{"ZAR": 499.99, "EUR": 27.99, "GBP": 23.99}',
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
      title: 'Enterprise',
      description:
        'Everything in Premium;Dedicated account manager;Custom development;White-label solution;Unlimited users;Advanced security features;Data migration assistance',
      icon: 'MUI:BusinessIcon',
      extraDescription: 'For large businesses with complex requirements',
      price: 199.99,
      testPeriodDays: 30,
      type: 'enterprise',
      currency: 'USD',
      multiCurrencyPrices: '{"ZAR": 3499.99, "EUR": 179.99, "GBP": 159.99}',
    },
    {
      id: 4,
      title: 'Custom',
      description:
        'Tailored POS solution;Choose only what you need;Pay for what you use;Flexible configuration;Scalable as you grow;Custom integrations;Personalized support',
      icon: 'MUI:SettingsIcon',
      extraDescription: 'Build your own package with exactly what you need',
      price: 0,
      testPeriodDays: 30,
      type: 'custom',
      currency: 'USD',
      multiCurrencyPrices: '{}',
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
    // If force refresh is requested, revalidate the path
    if (forceRefresh) {
      revalidatePath('/api/pricingpackages');
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5107';

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const endpoint = `${baseUrl}/api/pricingpackages?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    console.log(`Using backend API URL: ${baseUrl}`);
    console.log(`Fetching pricing packages from: ${endpoint}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    let data;

    try {
      const response = await fetch(endpoint, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },

        ...getCacheOptions(CACHE_TIMES.PRICING, [CACHE_TAGS.PRICING_PACKAGES]),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`API returned status ${response.status}`);

        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers,
        });
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn(`API response is not JSON: ${contentType}`);
        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers,
        });
      }

      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        console.warn('API response is empty');
        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers,
        });
      }

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          'Error parsing JSON response:',
          JSON.stringify(parseError, null, 2)
        );
        console.error('Response text:', responseText.substring(0, 200) + '...');
        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers,
        });
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error(
        'Error during fetch operation:',
        JSON.stringify(fetchError, null, 2)
      );
      const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
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
      const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
      return NextResponse.json(fallbackPackages, {
        status: 200,
        headers,
      });
    }

    const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
    return NextResponse.json(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(
      'Error fetching pricing packages:',
      JSON.stringify(error, null, 2)
    );

    const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
    return NextResponse.json(fallbackPackages, {
      status: 200,
      headers,
    });
  }
}
