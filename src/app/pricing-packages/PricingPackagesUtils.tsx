'use client';

// Import types from the shared types file
import { Package, packageOrder } from './types';

// Client-side function to refresh pricing packages data
export async function refreshPricingPackages(): Promise<
  Package[]
> {
  try {
    // Add timestamp to ensure we bypass all caches
    const timestamp = new Date().getTime();
    const response = await fetch(
      `/api/pricing-packages?refresh=true&t=${timestamp}`,
      {
        // Add cache control headers to prevent browser caching
        headers: {
          'Cache-Control':
            'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        // Skip cache validation
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to refresh pricing packages: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Log the refreshed pricing data
    console.log(
      `[UTILS] Refreshed pricing data at ${new Date().toISOString()}`
    );
    if (data.data && data.data.length > 0) {
      console.log(
        `[UTILS] Sample refreshed pricing (first item):`,
        {
          id: data.data[0].id,
          title: data.data[0].title,
          price: data.data[0].price,
          timestamp: new Date().toISOString(),
        }
      );
    }

    return data.data;
  } catch (error) {
    console.error(
      'Error refreshing pricing packages:',
      error
    );
    throw error;
  }
}

// Client-side function to fetch pricing packages without server-only APIs
export async function fetchPricingPackagesClient(
  forceRefresh: boolean = false
): Promise<Package[]> {
  try {
    // If forceRefresh is true, add timestamp and cache control headers
    const url = forceRefresh
      ? `/api/pricing-packages?refresh=true&t=${new Date().getTime()}`
      : '/api/pricing-packages';

    const options: RequestInit = forceRefresh
      ? {
          headers: {
            'Cache-Control':
              'no-cache, no-store, must-revalidate',
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

    // Log the fetched pricing data
    console.log(
      `[UTILS] Fetched pricing data at ${new Date().toISOString()} with forceRefresh=${forceRefresh}`
    );
    if (data.data && data.data.length > 0) {
      console.log(
        `[UTILS] Sample fetched pricing (first item):`,
        {
          id: data.data[0].id,
          title: data.data[0].title,
          price: data.data[0].price,
          timestamp: new Date().toISOString(),
          url: url,
        }
      );
    }

    return data.data;
  } catch (error) {
    console.error(
      'Error fetching pricing packages:',
      error
    );
    throw error;
  }
}

// Function to sort packages in the correct order (client-side version)
export function sortPackages(
  packages: Package[]
): Package[] {
  return [...packages].sort((a, b) => {
    const orderA =
      packageOrder[a.type as string] || 999;
    const orderB =
      packageOrder[b.type as string] || 999;
    return orderA - orderB;
  });
}
