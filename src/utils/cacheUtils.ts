import { QueryClient } from '@tanstack/react-query';
import { addOnKeys } from '@/hooks/useAddOns';
import { CACHE_TAGS } from '@/app/cache-constants';

export const invalidateAddOnsQueries = (queryClient: QueryClient): void => {
  console.log('Invalidating all AddOns queries');
  queryClient.invalidateQueries({
    queryKey: addOnKeys.all,
  });
};

export const invalidateAddOnQuery = (
  queryClient: QueryClient,
  id: number
): void => {
  console.log(`Invalidating AddOn query for ID: ${id}`);
  queryClient.invalidateQueries({
    queryKey: addOnKeys.detail(id),
  });
};

export const invalidateAddOnListQueries = (
  queryClient: QueryClient,
  filters?: Record<string, unknown>
): void => {
  if (filters) {
    console.log(
      `Invalidating AddOn list queries with filters: ${JSON.stringify(filters)}`
    );
    queryClient.invalidateQueries({
      queryKey: addOnKeys.list(filters),
    });
  } else {
    console.log('Invalidating all AddOn list queries');
    queryClient.invalidateQueries({
      queryKey: addOnKeys.lists(),
    });
  }
};

export const invalidateAddOnCategoriesQueries = (
  queryClient: QueryClient
): void => {
  console.log('Invalidating AddOn categories queries');
  queryClient.invalidateQueries({
    queryKey: addOnKeys.categories(),
  });
};

export const refetchAddOnsQueries = async (
  queryClient: QueryClient
): Promise<void> => {
  console.log('Forcing refetch of all AddOns queries');
  await queryClient.refetchQueries({
    queryKey: addOnKeys.all,
  });
};

export const resetEntireCache = async (
  queryClient: QueryClient
): Promise<void> => {
  console.log('[CACHE] Resetting entire cache and refetching active queries');

  console.log(
    '[CACHE] Specifically invalidating pricing packages before full clear'
  );
  queryClient.invalidateQueries({
    queryKey: ['pricingPackages'],
    refetchType: 'all',
  });

  queryClient.invalidateQueries({
    queryKey: [CACHE_TAGS.PRICING_PACKAGES],
    refetchType: 'all',
  });

  try {
    console.log('[CACHE] Forcing refetch of pricing packages data');
    await fetch('/api/pricing-packages?refresh=true', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error(
      '[CACHE] Error fetching pricing packages:',
      JSON.stringify(error, null, 2)
    );
  }

  console.log('[CACHE] Clearing entire React Query cache');
  queryClient.clear();

  if (typeof window !== 'undefined') {
    const cacheKeys = [
      'userCustomization',
      'dashboardData',
      'productsList',
      'categoriesList',
      'recentTransactions',
      'userPreferences',
      'pricingPackages',
      'pricingPackagesData',
    ];

    cacheKeys.forEach((key) => {
      try {
        console.log(`[CACHE] Removing ${key} from localStorage`);
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(
          `[CACHE] Failed to remove ${key} from localStorage:`,
          JSON.stringify(error, null, 2)
        );
      }
    });

    console.log(
      '[CACHE] Attempting to clear browser cache for pricing packages'
    );
    try {
      const timestamp = new Date().getTime();
      const urls = [
        `/api/pricing-packages?t=${timestamp}`,
        `/api/pricing-packages?refresh=true&t=${timestamp}`,
      ];

      urls.forEach(async (url) => {
        await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        });
      });
    } catch (error) {
      console.warn(
        '[CACHE] Error clearing browser cache:',
        JSON.stringify(error, null, 2)
      );
    }
  }

  console.log('[CACHE] Refetching all active queries');
  await queryClient.refetchQueries();
};

export const invalidateCacheTags = (
  queryClient: QueryClient,
  tags: string[] = []
): void => {
  console.log('Invalidating cache tags:', JSON.stringify(tags, null, 2));

  if (!tags || !Array.isArray(tags)) {
    console.warn(
      'Invalid tags provided to invalidateCacheTags:',
      JSON.stringify(tags, null, 2)
    );
    return;
  }

  tags.forEach((tag) => {
    queryClient.invalidateQueries({
      queryKey: [tag],
    });
  });
};

export const prefetchCommonData = async (
  queryClient: QueryClient
): Promise<void> => {
  console.log('Prefetching common data');

  const prefetchPromises = [
    fetch('/api/pricing-packages').then((res) => res.json()),
  ];

  try {
    const [pricingPackages] = await Promise.all(prefetchPromises);

    if (pricingPackages) {
      queryClient.setQueryData([CACHE_TAGS.PRICING_PACKAGES], pricingPackages);
    } else {
      console.warn('Received undefined pricing packages data during prefetch');
    }
  } catch (error) {
    console.error(
      'Error prefetching common data:',
      JSON.stringify(error, null, 2)
    );
  }
};

export const setupCacheListeners = (queryClient: QueryClient): (() => void) => {
  const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
    if (process.env.NODE_ENV === 'development') {
      if (event.type === 'added') {
        console.log(
          'Query added to cache:',
          JSON.stringify(event.query.queryKey, null, 2)
        );
      } else if (event.type === 'removed') {
        console.log(
          'Query removed from cache:',
          JSON.stringify(event.query.queryKey, null, 2)
        );
      } else if (event.type === 'updated') {
        console.log(
          'Query updated in cache:',
          JSON.stringify(event.query.queryKey, null, 2)
        );
      }
    }
  });

  return unsubscribe;
};

export const createFetchOptions = async (
  cacheTags: string[] | null | undefined = [],
  revalidate: number = 60
): Promise<RequestInit> => {
  const safeCacheTags = Array.isArray(cacheTags) ? cacheTags : [];

  return {
    next: {
      revalidate,
      tags: safeCacheTags,
    },
  } as RequestInit;
};

export const isDataStale = (
  timestamp: number,
  maxAge: number = 60000
): boolean => {
  return Date.now() - timestamp > maxAge;
};

export const refreshCommonPageCaches = async (
  queryClient: QueryClient
): Promise<void> => {
  console.log('[CACHE] Refreshing home page and common page caches');

  const commonQueryKeys = [
    ['products'],
    ['categories'],
    ['featured-products'],
    ['pricing-packages'],
    ['testimonials'],
    ['features'],
    [CACHE_TAGS.PRICING_PACKAGES],
    [CACHE_TAGS.PRODUCTS],
    [CACHE_TAGS.FEATURES],
    [CACHE_TAGS.TESTIMONIALS],
  ];

  console.log('[CACHE] Specifically invalidating pricing packages cache');
  queryClient.invalidateQueries({
    queryKey: ['pricingPackages'],
    refetchType: 'all',
  });

  queryClient.invalidateQueries({
    queryKey: [CACHE_TAGS.PRICING_PACKAGES],
    refetchType: 'all',
  });

  commonQueryKeys.forEach((key) => {
    console.log(`[CACHE] Invalidating query key: ${key.join('/')}`);
    queryClient.invalidateQueries({
      queryKey: key,
    });
  });

  try {
    console.log('[CACHE] Forcing refetch of pricing packages data');
    await fetch('/api/pricing-packages?refresh=true', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error(
      '[CACHE] Error fetching pricing packages:',
      JSON.stringify(error, null, 2)
    );
  }

  console.log('[CACHE] Refetching active queries');
  await queryClient.refetchQueries({
    type: 'active',
  });

  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    console.log(`[CACHE] Current path: ${path}`);
    if (path === '/' || path === '/products' || path === '/pricing-packages') {
      console.log(
        '[CACHE] On home or pricing page, forcing refetch of all common data'
      );
      await queryClient.refetchQueries({
        queryKey: commonQueryKeys.flat(),
      });

      if (path === '/') {
        console.log(
          '[CACHE] On home page, specifically refetching pricing packages'
        );
        await queryClient.refetchQueries({
          queryKey: ['pricingPackages'],
          type: 'all',
        });
      }
    }
  }
};

export const safeGet = <T>(obj: unknown, path: string, defaultValue: T): T => {
  if (obj === undefined || obj === null) return defaultValue;

  try {
    const parts = path.split('.');

    let result: unknown = obj;

    for (const part of parts) {
      if (
        result === undefined ||
        result === null ||
        typeof result !== 'object'
      ) {
        return defaultValue;
      }

      result = (result as Record<string, unknown>)[part];
    }

    return result === undefined || result === null
      ? defaultValue
      : (result as T);
  } catch (error) {
    console.warn(
      `Error accessing path ${path}:`,
      JSON.stringify(error, null, 2)
    );
    return defaultValue;
  }
};
