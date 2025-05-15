import { QueryClient } from '@tanstack/react-query';
import { addOnKeys } from '@/hooks/useAddOns';
import { CACHE_TAGS } from '@/app/cache-constants';

/**
 * Utility functions for managing cache in the application
 * These functions work with both React Query client-side cache
 * and Next.js server-side cache
 */

/**
 * Invalidates all AddOns-related queries in the cache
 * @param queryClient The React Query client instance
 */
export const invalidateAddOnsQueries = (
  queryClient: QueryClient
): void => {
  console.log('Invalidating all AddOns queries');
  queryClient.invalidateQueries({
    queryKey: addOnKeys.all,
  });
};

/**
 * Invalidates a specific AddOn query by ID
 * @param queryClient The React Query client instance
 * @param id The ID of the AddOn to invalidate
 */
export const invalidateAddOnQuery = (
  queryClient: QueryClient,
  id: number
): void => {
  console.log(
    `Invalidating AddOn query for ID: ${id}`
  );
  queryClient.invalidateQueries({
    queryKey: addOnKeys.detail(id),
  });
};

/**
 * Invalidates AddOn list queries with optional filters
 * @param queryClient The React Query client instance
 * @param filters Optional filters to target specific list queries
 */
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
    console.log(
      'Invalidating all AddOn list queries'
    );
    queryClient.invalidateQueries({
      queryKey: addOnKeys.lists(),
    });
  }
};

/**
 * Invalidates AddOn categories queries
 * @param queryClient The React Query client instance
 */
export const invalidateAddOnCategoriesQueries = (
  queryClient: QueryClient
): void => {
  console.log(
    'Invalidating AddOn categories queries'
  );
  queryClient.invalidateQueries({
    queryKey: addOnKeys.categories(),
  });
};

/**
 * Forces a refetch of all AddOns-related queries
 * @param queryClient The React Query client instance
 */
export const refetchAddOnsQueries = async (
  queryClient: QueryClient
): Promise<void> => {
  console.log(
    'Forcing refetch of all AddOns queries'
  );
  await queryClient.refetchQueries({
    queryKey: addOnKeys.all,
  });
};

/**
 * Clears the entire cache and forces a refetch of active queries
 * Use this as a last resort when you need to completely reset the cache state
 * @param queryClient The React Query client instance
 */
export const resetEntireCache = async (
  queryClient: QueryClient
): Promise<void> => {
  console.log(
    'Resetting entire cache and refetching active queries'
  );
  queryClient.clear();
  await queryClient.refetchQueries();
};

/**
 * Invalidate specific cache tags in React Query
 * @param queryClient The React Query client
 * @param tags Array of cache tags to invalidate
 */
export const invalidateCacheTags = (
  queryClient: QueryClient,
  tags: string[] = [] // Provide default empty array
): void => {
  console.log('Invalidating cache tags:', tags);

  // Add safety check
  if (!tags || !Array.isArray(tags)) {
    console.warn(
      'Invalid tags provided to invalidateCacheTags:',
      tags
    );
    return;
  }

  tags.forEach((tag) => {
    queryClient.invalidateQueries({
      queryKey: [tag],
    });
  });
};

/**
 * Prefetch data for common routes to improve navigation experience
 * @param queryClient The React Query client
 */
export const prefetchCommonData = async (
  queryClient: QueryClient
): Promise<void> => {
  console.log('Prefetching common data');

  // Example of prefetching data for common routes
  // This would be customized based on your application's needs
  const prefetchPromises = [
    // Prefetch pricing packages
    fetch('/api/pricing-packages').then((res) =>
      res.json()
    ),

    // Add other common data prefetching here
  ];

  try {
    const [pricingPackages] = await Promise.all(
      prefetchPromises
    );

    // Add safety check before storing in cache
    if (pricingPackages) {
      queryClient.setQueryData(
        [CACHE_TAGS.PRICING_PACKAGES],
        pricingPackages
      );
    } else {
      console.warn(
        'Received undefined pricing packages data during prefetch'
      );
    }
  } catch (error) {
    console.error(
      'Error prefetching common data:',
      error
    );
  }
};

/**
 * Set up cache event listeners
 * This can be used to monitor cache operations and perform actions
 * @param queryClient The React Query client
 */
export const setupCacheListeners = (
  queryClient: QueryClient
): (() => void) => {
  // Listen for query cache changes
  const unsubscribe = queryClient
    .getQueryCache()
    .subscribe((event) => {
      if (
        process.env.NODE_ENV === 'development'
      ) {
        if (event.type === 'added') {
          console.log(
            'Query added to cache:',
            event.query.queryKey
          );
        } else if (event.type === 'removed') {
          console.log(
            'Query removed from cache:',
            event.query.queryKey
          );
        } else if (event.type === 'updated') {
          console.log(
            'Query updated in cache:',
            event.query.queryKey
          );
        }
      }
    });

  return unsubscribe;
};

/**
 * Create optimized fetch options for data fetching
 * @param cacheTags Array of cache tags to associate with the request
 * @param revalidate Time in seconds to revalidate the data
 */
export const createFetchOptions = async (
  cacheTags: string[] | null | undefined = [],
  revalidate: number = 60
): Promise<RequestInit> => {
  // If we're using the async getCacheOptions from caching-config.ts
  // we would need to await it here, but for client-side usage
  // we'll create the options directly

  // Ensure cacheTags is always a valid array
  const safeCacheTags = Array.isArray(cacheTags)
    ? cacheTags
    : [];

  return {
    next: {
      revalidate,
      tags: safeCacheTags,
    },
  } as RequestInit;
};

/**
 * Check if data is stale and needs refreshing
 * @param timestamp The timestamp when the data was last fetched
 * @param maxAge Maximum age in milliseconds before data is considered stale
 */
export const isDataStale = (
  timestamp: number,
  maxAge: number = 60000 // Default to 1 minute
): boolean => {
  return Date.now() - timestamp > maxAge;
};

/**
 * Safely access properties of potentially undefined objects
 * @param obj The object to access
 * @param path The path to the property (e.g., 'user.profile.name')
 * @param defaultValue The default value to return if the path doesn't exist
 */
export const safeGet = <T>(
  obj: unknown,
  path: string,
  defaultValue: T
): T => {
  if (obj === undefined || obj === null)
    return defaultValue;

  try {
    const parts = path.split('.');
    // We need to use unknown here as we're traversing an object with unknown structure
    let result: unknown = obj;

    for (const part of parts) {
      if (
        result === undefined ||
        result === null ||
        typeof result !== 'object'
      ) {
        return defaultValue;
      }
      // Use type assertion to access property with string index
      result = (
        result as Record<string, unknown>
      )[part];
    }

    return result === undefined || result === null
      ? defaultValue
      : (result as T);
  } catch (error) {
    console.warn(
      `Error accessing path ${path}:`,
      error
    );
    return defaultValue;
  }
};
