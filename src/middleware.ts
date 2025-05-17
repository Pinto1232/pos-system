import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CACHE_TIMES } from './app/cache-constants';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const response = NextResponse.next();

  let cacheControl = 'public, max-age=0, s-maxage=0, must-revalidate';

  if (pathname.startsWith('/_next/static/') || pathname.startsWith('/static/') || pathname.includes('.')) {
    cacheControl = `public, max-age=31536000, s-maxage=86400, stale-while-revalidate=86400`;
  } else if (pathname.startsWith('/api/pricing-packages')) {
    cacheControl = `public, max-age=60, s-maxage=${CACHE_TIMES.PRICING}, stale-while-revalidate=${CACHE_TIMES.PRICING * 10}`;
  } else if (pathname.startsWith('/dashboard') || pathname.includes('/user/')) {
    cacheControl = `private, max-age=0, s-maxage=0, must-revalidate`;
  } else if (pathname === '/' || pathname === '/pricing-packages') {
    cacheControl = `public, max-age=60, s-maxage=${CACHE_TIMES.SEMI_STATIC}, stale-while-revalidate=${CACHE_TIMES.SEMI_STATIC * 10}`;
  }

  response.headers.set('Cache-Control', cacheControl);

  if (cacheControl.includes('s-maxage')) {
    response.headers.set('Surrogate-Control', cacheControl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
