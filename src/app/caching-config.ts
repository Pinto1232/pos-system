'use server';

// Import constants from separate file (without 'use server' directive)
import {
  CACHE_TIMES,
  CACHE_TAGS,
} from './cache-constants';

// We can't re-export constants directly with 'use server'
// Instead, create async functions to access them

/**
 * Get cache times configuration
 * @returns Cache times object
 */
export async function getCacheTimes() {
  return CACHE_TIMES;
}

/**
 * Get cache tags configuration
 * @returns Cache tags object
 */
export async function getCacheTags() {
  return CACHE_TAGS;
}

/**
 * Helper function to get fetch options with appropriate caching
 * @param duration Cache duration in seconds
 * @param tags Cache tags for revalidation
 * @returns Fetch options object with Next.js cache configuration
 */
export async function getCacheOptions(
  duration: number,
  tags: string[] = []
) {
  return {
    next: {
      revalidate: duration,
      tags: tags,
    },
  };
}

/**
 * Helper function to get cache control headers
 * @param maxAge Max age in seconds
 * @param staleWhileRevalidate Stale while revalidate duration in seconds
 * @param forceNoCache Force no-cache headers (for refresh requests)
 * @returns Cache-Control header value
 */
export async function getCacheControlHeaders(
  maxAge: number,
  staleWhileRevalidate: number = maxAge * 10,
  forceNoCache: boolean = false
): Promise<Record<string, string>> {
  if (forceNoCache) {
    return {
      'Cache-Control':
        'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };
  }

  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    Pragma: 'public', // Adding this to ensure consistent return type
    Expires: 'max-age=' + maxAge, // Adding this to ensure consistent return type
  };
}
