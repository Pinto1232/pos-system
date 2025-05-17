'use server';

import { CACHE_TIMES, CACHE_TAGS } from './cache-constants';

export async function getCacheTimes() {
  return CACHE_TIMES;
}

export async function getCacheTags() {
  return CACHE_TAGS;
}

export async function getCacheOptions(duration: number, tags: string[] = []) {
  return {
    next: {
      revalidate: duration,
      tags: tags,
    },
  };
}

export async function getCacheControlHeaders(
  maxAge: number,
  staleWhileRevalidate: number = maxAge * 10,
  forceNoCache: boolean = false
): Promise<Record<string, string>> {
  if (forceNoCache) {
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };
  }

  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    Pragma: 'public',
    Expires: 'max-age=' + maxAge,
  };
}
