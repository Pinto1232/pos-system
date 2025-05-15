'use server';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getCacheOptions, getCacheControlHeaders } from '../../caching-config';
import { CACHE_TIMES, CACHE_TAGS } from '../../cache-constants';

// Define the response type
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

// Fallback data to use when API returns empty results
const fallbackPackages: PricingPackagesResponse = {
  totalItems: 5,
  data: [
    {
      id: 1,
      title: "Starter Plus",
      description: "Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting;Customer database;Simple analytics",
      icon: "MUI:StarIcon",
      extraDescription: "Perfect for small businesses looking for essential features",
      price: 39.99,
      testPeriodDays: 14,
      type: "starter-plus",
      currency: "USD",
      multiCurrencyPrices: "{\"ZAR\": 699.99, \"EUR\": 36.99, \"GBP\": 31.99}"
    },
    {
      id: 2,
      title: "Growth Pro",
      description: "Everything in Growth;Advanced inventory forecasting;Enhanced customer loyalty program;Marketing automation tools;Staff performance tracking;Customizable dashboards;Mobile app access",
      icon: "MUI:TrendingUpIcon",
      extraDescription: "Ideal for growing businesses that need advanced features",
      price: 79.99,
      testPeriodDays: 14,
      type: "growth-pro",
      currency: "USD",
      multiCurrencyPrices: "{\"ZAR\": 1399.99, \"EUR\": 72.99, \"GBP\": 63.99}"
    },
    {
      id: 3,
      title: "Custom Pro",
      description: "Tailor-made solutions for your unique business needs;Perfect for businesses requiring customized POS features;Build your own feature set;Pay only for what you need;Flexible scaling options;Industry-specific solutions;Personalized onboarding",
      icon: "MUI:BuildIcon",
      extraDescription: "The ultimate flexibility with professional customization services",
      price: 129.99,
      testPeriodDays: 30,
      type: "custom-pro",
      currency: "USD",
      multiCurrencyPrices: "{\"ZAR\": 2199.99, \"EUR\": 119.99, \"GBP\": 104.99}"
    },
    {
      id: 4,
      title: "Enterprise Elite",
      description: "Complete enterprise solution;Multi-location support;Advanced analytics;Priority support;Custom integrations;Dedicated account manager;Staff training;Enterprise-grade security",
      icon: "MUI:BusinessIcon",
      extraDescription: "Comprehensive solution for large businesses with multiple locations",
      price: 199.99,
      testPeriodDays: 30,
      type: "enterprise-elite",
      currency: "USD",
      multiCurrencyPrices: "{\"ZAR\": 3499.99, \"EUR\": 184.99, \"GBP\": 159.99}"
    },
    {
      id: 5,
      title: "Premium Plus",
      description: "All-inclusive POS package with premium features;Best for businesses looking for top-tier POS solutions;Advanced AI-powered analytics;Predictive inventory management;Omnichannel integration;VIP support;Quarterly business reviews;Custom reporting",
      icon: "MUI:DiamondIcon",
      extraDescription: "The ultimate POS experience with cutting-edge features and premium support",
      price: 349.99,
      testPeriodDays: 30,
      type: "premium-plus",
      currency: "USD",
      multiCurrencyPrices: "{\"ZAR\": 5999.99, \"EUR\": 319.99, \"GBP\": 279.99}"
    }
  ],
  pageSize: 10,
  pageNumber: 1
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageNumber = Number(searchParams.get('pageNumber') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '10');
  const forceRefresh = searchParams.get('refresh') === 'true';

  // Get auth token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value || '';

  try {
    // If force refresh is requested, revalidate the path
    if (forceRefresh) {
      revalidatePath('/api/pricing-packages');
    }

    // Attempt to fetch from the backend API
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5107';

    // Ensure the API URL doesn't have a trailing slash
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // Construct the endpoint URL with the correct case (lowercase 'pricingpackages' with no hyphen)
    // This should match the actual backend route which is case-sensitive
    const endpoint = `${baseUrl}/api/pricingpackages?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    console.log(`Using backend API URL: ${baseUrl}`);
    console.log(`Fetching pricing packages from: ${endpoint}`);

    // Log additional debugging information
    console.log(`Environment variables:
      NEXT_PUBLIC_BACKEND_API_URL: ${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'not set'}
      NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'not set'}
    `);

    // Add timeout to prevent long-running requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    let data;

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        // Use centralized cache configuration
        ...getCacheOptions(
          CACHE_TIMES.PRICING,
          [CACHE_TAGS.PRICING_PACKAGES]
        ),
        signal: controller.signal
      });

      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`API response not OK: ${response.status} ${response.statusText}`);

        // Log more detailed error information
        console.error(`Backend API error details:
          - Status: ${response.status}
          - Status Text: ${response.statusText}
          - URL: ${endpoint}
          - Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}
        `);

        // If it's a 404 error, log a specific message about the endpoint
        if (response.status === 404) {
          console.error(`
            404 Not Found Error: The endpoint ${endpoint} does not exist on the backend server.
            Please check:
            1. The backend server is running at ${baseUrl}
            2. The API route 'pricingpackages' exists (check case sensitivity)
            3. The backend API is properly configured
          `);
        }

        // Return fallback data with proper cache headers
        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers
        });
      }

      // Check if the response has content before trying to parse it
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn(`API response is not JSON: ${contentType}`);
        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers
        });
      }

      // Get the response text first to validate it's not empty
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        console.warn('API response is empty');
        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers
        });
      }

      // Parse the JSON safely
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.error('Response text:', responseText.substring(0, 200) + '...');
        const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
        return NextResponse.json(fallbackPackages, {
          status: 200,
          headers
        });
      }
    } catch (fetchError) {
      // Clear the timeout if there was a fetch error
      clearTimeout(timeoutId);
      console.error('Error during fetch operation:', fetchError);
      const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
      return NextResponse.json(fallbackPackages, {
        status: 200,
        headers
      });
    }

    // Validate the response data
    if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.warn('API returned invalid or empty data structure');
      const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
      return NextResponse.json(fallbackPackages, {
        status: 200,
        headers
      });
    }

    // Return the data with proper cache headers
    const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
    return NextResponse.json(data, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching pricing packages:', error);

    // Return fallback data with proper cache headers
    const headers = await getCacheControlHeaders(CACHE_TIMES.PRICING);
    return NextResponse.json(fallbackPackages, {
      status: 200,
      headers
    });
  }
}

// Revalidation API endpoint
export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();

    // Check for a valid secret to prevent unauthorized revalidations
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate the pricing packages data
    revalidatePath('/api/pricing-packages');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json({
      message: 'Error revalidating',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
