'use server';

import { cookies } from 'next/headers';
import { Package, packageTypes, packageOrder } from './types';
import { PricingPackagesResponse } from '../api/pricing-packages/route';
import { getCacheOptions } from '../caching-config';
import { CACHE_TIMES, CACHE_TAGS } from '../cache-constants';

export async function fetchPricingPackagesAction(
  refresh = false
): Promise<Package[]> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Use PricingPackages (PascalCase) to match the backend controller route
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
      },

      ...cacheOptions,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch pricing packages: ${response.status} ${response.statusText}`
      );
    }

    const data: PricingPackagesResponse = await response.json();

    return processPackages(data.data);
  } catch (error) {
    console.error(
      'Error fetching pricing packages:',
      JSON.stringify(error, null, 2)
    );
    return [];
  }
}

function processPackages(packagesData: PackageData[]): Package[] {
  if (
    !packagesData ||
    !Array.isArray(packagesData) ||
    packagesData.length === 0
  ) {
    console.warn('processPackages received invalid or empty data');
    return [];
  }

  const filteredPackages = packagesData.filter((pkg) => {
    if (!pkg) return false;
    const type = (pkg.type || '').toLowerCase();
    return packageTypes.includes(type);
  });

  if (filteredPackages.length === 0) {
    console.warn('No packages matched the expected types after filtering');

    return packagesData.map(createPackageFromData);
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
};

function createPackageFromData(pkg: PackageData | null | undefined): Package {
  if (!pkg) {
    console.warn('Attempted to create package from undefined data');
    return {
      id: Date.now(),
      title: 'Default Package',
      description: 'Default package description',
      icon: 'MUI:StarIcon',
      extraDescription: 'Default package',
      price: 39.99,
      testPeriodDays: 14,
      type: 'starter-plus',
      currency: 'USD',
      multiCurrencyPrices: '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
    };
  }

  const type = (pkg.type || '').toLowerCase() as string;

  // Update valid types to include new package types
  const validType = packageTypes.includes(type) ? type : 'starter-plus';

  let price = pkg.price || 0;
  let multiCurrencyPrices = pkg.multiCurrencyPrices || '';

  // Ensure custom-pro has the correct price
  if (validType === 'custom-pro') {
    price = 129.99;
    multiCurrencyPrices = '{"ZAR": 2199.99, "EUR": 119.99, "GBP": 104.99}';
  }

  return {
    id: pkg.id || Date.now(),
    title: pkg.title || 'Unnamed Package',
    description: pkg.description || 'No description available',
    icon: pkg.icon || 'MUI:StarIcon',
    extraDescription: pkg.extraDescription || '',
    price: price,
    testPeriodDays: pkg.testPeriodDays || 14,
    type: validType,
    currency: pkg.currency || 'USD',
    multiCurrencyPrices:
      multiCurrencyPrices || '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
  };
}

export async function sortPackagesAction(
  packages: Package[]
): Promise<Package[]> {
  return [...packages].sort((a, b) => {
    const orderA = packageOrder[a.type as string] || 999;
    const orderB = packageOrder[b.type as string] || 999;
    return orderA - orderB;
  });
}
