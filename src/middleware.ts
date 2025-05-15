import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CACHE_TIMES } from './app/cache-constants';

/**
 * Middleware to add cache-control headers to responses
 * This helps with CDN caching and browser caching
 */
export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const pathname = request.nextUrl.pathname;

  // Create a response object to modify
  const response = NextResponse.next();

  // Set default cache control headers
  let cacheControl = 'public, max-age=0, s-maxage=0, must-revalidate';

  // Static assets should be cached for longer
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // Files with extensions (images, fonts, etc.)
  ) {
    // Cache static assets for 1 year, revalidate after 1 day
    cacheControl = `public, max-age=31536000, s-maxage=86400, stale-while-revalidate=86400`;
  }
  // API routes with specific caching needs
  else if (pathname.startsWith('/api/pricing-packages')) {
    cacheControl = `public, max-age=60, s-maxage=${CACHE_TIMES.PRICING}, stale-while-revalidate=${CACHE_TIMES.PRICING * 10}`;
  }
  // Dashboard and user-specific data
  else if (pathname.startsWith('/dashboard') || pathname.includes('/user/')) {
    cacheControl = `private, max-age=0, s-maxage=0, must-revalidate`;
  }
  // Public pages that can be cached
  else if (pathname === '/' || pathname === '/pricing-packages') {
    cacheControl = `public, max-age=60, s-maxage=${CACHE_TIMES.SEMI_STATIC}, stale-while-revalidate=${CACHE_TIMES.SEMI_STATIC * 10}`;
  }

  // Set the cache control header
  response.headers.set('Cache-Control', cacheControl);

  // Add Surrogate-Control header for CDNs that support it
  if (cacheControl.includes('s-maxage')) {
    response.headers.set('Surrogate-Control', cacheControl);
  }

  return response;
}

/**
 * Configure which paths should be processed by the middleware
 */
export const config = {
  // Match all request paths except for:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
