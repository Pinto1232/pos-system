import { NextRequest } from 'next/server';
import { CACHE_TIMES, CACHE_TAGS } from './cache-constants';

export interface CacheOptions {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
  cache?: RequestCache;
  headers?: HeadersInit;
}

export interface CacheStrategy {
  maxAge: number;
  staleWhileRevalidate: number;
  sMaxAge: number;
  tags: string[];
  revalidate: number;
}

export const CACHE_STRATEGIES = {
  STATIC: {
    maxAge: CACHE_TIMES.STATIC,
    staleWhileRevalidate: CACHE_TIMES.STATIC * 2,
    sMaxAge: CACHE_TIMES.STATIC * 3,
    tags: ['static'],
    revalidate: CACHE_TIMES.STATIC,
  },
  SEMI_STATIC: {
    maxAge: CACHE_TIMES.SEMI_STATIC,
    staleWhileRevalidate: CACHE_TIMES.SEMI_STATIC * 2,
    sMaxAge: CACHE_TIMES.SEMI_STATIC * 3,
    tags: ['semi-static'],
    revalidate: CACHE_TIMES.SEMI_STATIC,
  },
  DYNAMIC: {
    maxAge: CACHE_TIMES.DYNAMIC,
    staleWhileRevalidate: CACHE_TIMES.DYNAMIC * 2,
    sMaxAge: CACHE_TIMES.DYNAMIC * 3,
    tags: ['dynamic'],
    revalidate: CACHE_TIMES.DYNAMIC,
  },
  USER_SPECIFIC: {
    maxAge: CACHE_TIMES.USER,
    staleWhileRevalidate: CACHE_TIMES.USER * 2,
    sMaxAge: 0,
    tags: ['user-specific'],
    revalidate: CACHE_TIMES.USER,
  },
  PRICING: {
    maxAge: CACHE_TIMES.PRICING,
    staleWhileRevalidate: CACHE_TIMES.PRICING * 2,
    sMaxAge: CACHE_TIMES.PRICING * 3,
    tags: [CACHE_TAGS.PRICING_PACKAGES],
    revalidate: CACHE_TIMES.PRICING,
  },
  DASHBOARD: {
    maxAge: CACHE_TIMES.DASHBOARD,
    staleWhileRevalidate: CACHE_TIMES.DASHBOARD * 2,
    sMaxAge: 0,
    tags: [CACHE_TAGS.DASHBOARD],
    revalidate: CACHE_TIMES.DASHBOARD,
  },
} as const;

export async function getCacheOptions(
  revalidateTime: number,
  tags: string[] = [],
  strategy: 'static' | 'dynamic' | 'user-specific' = 'dynamic'
): Promise<CacheOptions> {
  const baseStrategy =
    CACHE_STRATEGIES[strategy.toUpperCase() as keyof typeof CACHE_STRATEGIES] ||
    CACHE_STRATEGIES.DYNAMIC;

  const cacheControl =
    strategy === 'user-specific'
      ? `private, max-age=${revalidateTime}, stale-while-revalidate=${revalidateTime * 2}`
      : `public, max-age=${revalidateTime}, s-maxage=${revalidateTime * 2}, stale-while-revalidate=${revalidateTime * 3}`;

  return {
    next: {
      revalidate: revalidateTime,
      tags: [...tags, ...baseStrategy.tags],
    },
    cache: strategy === 'user-specific' ? 'no-store' : 'force-cache',
    headers: {
      'Cache-Control': cacheControl,
      'CDN-Cache-Control': `public, max-age=${revalidateTime * 2}`,
      'Vercel-CDN-Cache-Control': `public, max-age=${revalidateTime * 3}`,
    },
  };
}

export async function getSmartCacheOptions(
  request?: NextRequest,
  contentType:
    | 'static'
    | 'semi-static'
    | 'dynamic'
    | 'user-specific' = 'dynamic',
  customTags: string[] = []
): Promise<CacheOptions> {
  const strategy =
    CACHE_STRATEGIES[
      contentType
        .toUpperCase()
        .replace('-', '_') as keyof typeof CACHE_STRATEGIES
    ];

  const isAuthenticated =
    request?.cookies.has('accessToken') ||
    request?.headers.get('authorization');

  const adjustedStrategy =
    isAuthenticated && contentType !== 'static'
      ? { ...strategy, sMaxAge: 0 }
      : strategy;

  const cacheControl =
    adjustedStrategy.sMaxAge > 0
      ? `public, max-age=${adjustedStrategy.maxAge}, s-maxage=${adjustedStrategy.sMaxAge}, stale-while-revalidate=${adjustedStrategy.staleWhileRevalidate}`
      : `private, max-age=${adjustedStrategy.maxAge}, stale-while-revalidate=${adjustedStrategy.staleWhileRevalidate}`;

  return {
    next: {
      revalidate: adjustedStrategy.revalidate,
      tags: [...adjustedStrategy.tags, ...customTags],
    },
    cache: adjustedStrategy.sMaxAge > 0 ? 'force-cache' : 'no-store',
    headers: {
      'Cache-Control': cacheControl,
      'CDN-Cache-Control':
        adjustedStrategy.sMaxAge > 0
          ? `public, max-age=${adjustedStrategy.sMaxAge}`
          : 'no-cache',
      'Vercel-CDN-Cache-Control':
        adjustedStrategy.sMaxAge > 0
          ? `public, max-age=${adjustedStrategy.sMaxAge * 2}`
          : 'no-cache',
      Vary: isAuthenticated ? 'Authorization, Cookie' : 'Accept-Encoding',
    },
  };
}

export async function warmCache(urls: string[], options?: RequestInit) {
  const results = await Promise.allSettled(
    urls.map((url) =>
      fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          'Cache-Control': 'no-cache',
          'X-Cache-Warm': 'true',
        },
      })
    )
  );

  const failed = results.filter((result) => result.status === 'rejected');
  if (failed.length > 0) {
    console.warn(`Cache warming failed for ${failed.length} URLs:`, failed);
  }

  return {
    total: urls.length,
    success: results.length - failed.length,
    failed: failed.length,
  };
}

export function generateCacheKey(
  prefix: string,
  params: Record<string, string | number | boolean>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join('|');

  return `${prefix}:${sortedParams}`;
}

export function withCacheHeaders(
  response: Response,
  strategy: keyof typeof CACHE_STRATEGIES,
  customHeaders: HeadersInit = {}
): Response {
  const cacheStrategy = CACHE_STRATEGIES[strategy];

  const headers = new Headers(response.headers);

  if (cacheStrategy.sMaxAge > 0) {
    headers.set(
      'Cache-Control',
      `public, max-age=${cacheStrategy.maxAge}, s-maxage=${cacheStrategy.sMaxAge}, stale-while-revalidate=${cacheStrategy.staleWhileRevalidate}`
    );
    headers.set(
      'CDN-Cache-Control',
      `public, max-age=${cacheStrategy.sMaxAge}`
    );
  } else {
    headers.set(
      'Cache-Control',
      `private, max-age=${cacheStrategy.maxAge}, stale-while-revalidate=${cacheStrategy.staleWhileRevalidate}`
    );
  }

  Object.entries(customHeaders).forEach(([key, value]) => {
    headers.set(key, String(value));
  });

  headers.set('Cache-Tag', cacheStrategy.tags.join(','));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function getCacheHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  details: Record<string, string | number | boolean>;
}> {
  try {
    const testUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const startTime = Date.now();

    const response = await fetch(`${testUrl}/api/health`, {
      cache: 'force-cache',
      next: { revalidate: 60 },
    });

    const responseTime = Date.now() - startTime;

    const cacheStatus = response.headers.get('x-cache') || 'unknown';
    const age = response.headers.get('age') || '0';

    return {
      status:
        responseTime < 500
          ? 'healthy'
          : responseTime < 1000
            ? 'degraded'
            : 'unhealthy',
      details: {
        responseTime,
        cacheStatus,
        age: parseInt(age),
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
