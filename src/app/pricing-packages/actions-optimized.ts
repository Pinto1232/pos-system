'use server';

import { cookies } from 'next/headers';
import { Package, packageTypes, packageOrder } from './types';
import { PricingPackagesResponse } from '../api/pricing-packages/route';
import { getCacheOptions } from '../caching-config';
import { CACHE_TIMES, CACHE_TAGS } from '../cache-constants';
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function fetchPricingPackagesAction(
  refresh = false
): Promise<Package[]> {
  if (refresh) {
    revalidateTag(CACHE_TAGS.PRICING_PACKAGES);
  }

  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const apiUrl = `${baseUrl}/api/PricingPackages?pageNumber=1&pageSize=10${refresh ? '&refresh=true' : ''}`;

    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const cacheOptions = await getCacheOptions(CACHE_TIMES.PRICING, [
      CACHE_TAGS.PRICING_PACKAGES,
    ]);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        'Cache-Control': `max-age=${CACHE_TIMES.PRICING}, s-maxage=${CACHE_TIMES.PRICING * 2}`,
      },
      ...cacheOptions,

      next: {
        revalidate: CACHE_TIMES.PRICING,
        tags: [CACHE_TAGS.PRICING_PACKAGES],
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(
        `Failed to fetch pricing packages: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const data: PricingPackagesResponse = await response.json();

    if (!data || !data.data) {
      console.warn('Invalid response structure from pricing API');
      return [];
    }

    return processPackages(data.data);
  } catch (error) {
    console.error('Error fetching pricing packages:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    try {
      return await getCachedFallbackPackages();
    } catch (fallbackError) {
      console.error('Fallback packages also failed:', fallbackError);
      return getDefaultPackages();
    }
  }
}

const getCachedFallbackPackages = unstable_cache(
  async () => {
    return getDefaultPackages();
  },
  ['pricing-packages-fallback'],
  {
    revalidate: CACHE_TIMES.STATIC,
    tags: ['pricing-fallback'],
  }
);

function processPackages(packagesData: PackageData[]): Package[] {
  if (
    !packagesData ||
    !Array.isArray(packagesData) ||
    packagesData.length === 0
  ) {
    console.warn('processPackages received invalid or empty data:', {
      dataType: typeof packagesData,
      isArray: Array.isArray(packagesData),
      length: packagesData?.length,
    });
    return getDefaultPackages();
  }

  const filteredPackages = packagesData.filter((pkg) => {
    if (!pkg) return false;

    const hasRequiredFields = pkg.id && pkg.title && pkg.price !== undefined;
    if (!hasRequiredFields) {
      console.warn('Package missing required fields:', pkg);
      return false;
    }

    const type = (pkg.type || '').toLowerCase();
    return packageTypes.includes(type);
  });

  if (filteredPackages.length === 0) {
    console.warn('No packages matched the expected types after filtering');

    const processedAll = packagesData
      .filter((pkg) => pkg && pkg.id && pkg.title)
      .map(createPackageFromData);

    return processedAll.length > 0 ? processedAll : getDefaultPackages();
  }

  return filteredPackages.map(createPackageFromData);
}

type PackageData = {
  id?: number | string;
  title?: string;
  description?: string;
  icon?: string;
  extraDescription?: string;
  price?: number;
  testPeriodDays?: number;
  type?: string;
  currency?: string;
  multiCurrencyPrices?: string;
  features?: string[];
  isPopular?: boolean;
  isCustom?: boolean;
};

function createPackageFromData(pkg: PackageData | null | undefined): Package {
  if (!pkg) {
    console.warn('Attempted to create package from undefined data');
    return getDefaultPackage();
  }

  if (!pkg.id || !pkg.title) {
    console.warn('Package missing critical fields:', {
      id: pkg.id,
      title: pkg.title,
    });
    return getDefaultPackage();
  }

  const type = (pkg.type || '').toLowerCase() as string;
  const validType = packageTypes.includes(type) ? type : 'starter-plus';

  const price = typeof pkg.price === 'number' && pkg.price >= 0 ? pkg.price : 0;

  let multiCurrencyPrices = pkg.multiCurrencyPrices || '';
  try {
    // Validate JSON structure
    if (multiCurrencyPrices) {
      JSON.parse(multiCurrencyPrices);
    } else {
      multiCurrencyPrices = JSON.stringify({
        ZAR: Math.round(price * 18.5), // Approximate ZAR conversion
        EUR: Math.round(price * 0.92 * 100) / 100, // Approximate EUR conversion
        GBP: Math.round(price * 0.79 * 100) / 100, // Approximate GBP conversion
      });
    }
  } catch (error) {
    console.warn('Invalid multiCurrencyPrices JSON, using default:', error);
    multiCurrencyPrices = '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}';
  }

  return {
    id: pkg.id,
    title: pkg.title,
    description: pkg.description || 'No description available',
    icon: pkg.icon || 'MUI:StarIcon',
    extraDescription: pkg.extraDescription || '',
    price: price,
    testPeriodDays: pkg.testPeriodDays || 14,
    type: validType,
    currency: pkg.currency || 'USD',
    multiCurrencyPrices: multiCurrencyPrices,
  };
}

export const sortPackagesAction = unstable_cache(
  async (packages: Package[]): Promise<Package[]> => {
    if (!Array.isArray(packages)) {
      console.error('sortPackagesAction received non-array:', typeof packages);
      return [];
    }

    return [...packages].sort((a, b) => {
      const orderA = packageOrder[a.type as string] || 999;
      const orderB = packageOrder[b.type as string] || 999;

      if (orderA === orderB) {
        return a.price - b.price;
      }

      return orderA - orderB;
    });
  },
  ['sorted-packages'],
  {
    revalidate: CACHE_TIMES.PRICING,
    tags: [CACHE_TAGS.PRICING_PACKAGES],
  }
);

export async function revalidatePricingAction() {
  'use server';

  try {
    revalidateTag(CACHE_TAGS.PRICING_PACKAGES);
    revalidateTag('pricing-packages-sorted');
    revalidateTag('pricing-packages-fallback');

    return { success: true, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Error revalidating pricing data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function getDefaultPackages(): Package[] {
  return [
    getDefaultPackage(),
    {
      ...getDefaultPackage(),
      id: Date.now() + 1,
      title: 'Professional Package',
      type: 'professional',
      price: 79.99,
      description: 'Professional features for growing businesses',
    },
    {
      ...getDefaultPackage(),
      id: Date.now() + 2,
      title: 'Enterprise Package',
      type: 'enterprise',
      price: 149.99,
      description: 'Enterprise-grade features for large businesses',
    },
  ];
}

function getDefaultPackage(): Package {
  return {
    id: Date.now(),
    title: 'Starter Plus Package',
    description: 'Perfect for small businesses getting started',
    icon: 'MUI:StarIcon',
    extraDescription: 'Includes essential features to get you started',
    price: 39.99,
    testPeriodDays: 14,
    type: 'starter-plus',
    currency: 'USD',
    multiCurrencyPrices: '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
  };
}
