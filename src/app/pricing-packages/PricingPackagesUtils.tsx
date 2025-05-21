'use client';

import { Package, packageOrder } from './types';

export async function refreshPricingPackages(): Promise<Package[]> {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `/api/pricing-packages?refresh=true&t=${timestamp}`,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },

        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to refresh pricing packages: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log(
      `[UTILS] Refreshed pricing data at ${new Date().toISOString()}`
    );
    if (data.data && data.data.length > 0) {
      console.log(`[UTILS] Sample refreshed pricing (first item):`, {
        id: data.data[0].id,
        title: data.data[0].title,
        price: data.data[0].price,
        timestamp: new Date().toISOString(),
      });
    }

    return data.data;
  } catch (error) {
    console.error(
      'Error refreshing pricing packages:',
      JSON.stringify(error, null, 2)
    );
    throw error;
  }
}

export async function fetchPricingPackagesClient(
  forceRefresh: boolean = false
): Promise<Package[]> {
  try {
    // Use PricingPackages (PascalCase) to match the backend controller route
    const url = forceRefresh
      ? `/api/PricingPackages?refresh=true&t=${new Date().getTime()}`
      : '/api/PricingPackages';

    const options: RequestInit = forceRefresh
      ? {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
          cache: 'no-store',
        }
      : {};

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch pricing packages: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log(
      `[UTILS] Fetched pricing data at ${new Date().toISOString()} with forceRefresh=${forceRefresh}`
    );
    if (data.data && data.data.length > 0) {
      console.log(`[UTILS] Sample fetched pricing (first item):`, {
        id: data.data[0].id,
        title: data.data[0].title,
        price: data.data[0].price,
        timestamp: new Date().toISOString(),
        url: url,
      });
    }

    return data.data;
  } catch (error) {
    console.error(
      'Error fetching pricing packages:',
      JSON.stringify(error, null, 2)
    );
    throw error;
  }
}

export function sortPackages(packages: Package[]): Package[] {
  return [...packages].sort((a, b) => {
    const orderA = packageOrder[a.type as string] || 999;
    const orderB = packageOrder[b.type as string] || 999;
    return orderA - orderB;
  });
}
