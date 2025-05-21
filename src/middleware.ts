import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CACHE_TIMES } from './app/cache-constants';
import acceptLanguage from 'accept-language';

const MIDDLEWARE_LANGUAGES = [
  { code: 'en', region: 'South Africa' },
  { code: 'pt', region: 'Angola' },
  { code: 'es', region: 'Spain' },
  { code: 'fr', region: 'France' },
];

const API_ROUTE_MAPPINGS: Record<string, string> = {
  '/api/pricingpackages': '/api/pricing-packages',
  '/api/auth-token/set-token': '/api/auth-token/set-token',
};

acceptLanguage.languages(MIDDLEWARE_LANGUAGES.map((lang) => lang.code));

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.toLowerCase().startsWith('/api/')) {
    const lowerCasePath = pathname.toLowerCase();
    for (const [pattern, target] of Object.entries(API_ROUTE_MAPPINGS)) {
      if (lowerCasePath.startsWith(pattern.toLowerCase())) {
        const newUrl = new URL(request.url);
        newUrl.pathname = pathname.replace(
          new RegExp(`^${pattern}`, 'i'),
          target
        );

        console.log(
          `Redirecting API request from ${pathname} to ${newUrl.pathname}`
        );
        return NextResponse.rewrite(newUrl);
      }
    }
  }

  const response = NextResponse.next();

  if (
    !pathname.startsWith('/_next/') &&
    !pathname.startsWith('/api/') &&
    !pathname.includes('.')
  ) {
    let language: string = 'en';

    const languageCookie = request.cookies.get('i18next')?.value;
    if (languageCookie) {
      language = languageCookie;
    } else {
      const acceptLang = acceptLanguage.get(
        request.headers.get('Accept-Language')
      );
      if (acceptLang) {
        language = acceptLang;
      }
    }

    if (!MIDDLEWARE_LANGUAGES.some((lang) => lang.code === language)) {
      language = 'en';
    }

    if (!languageCookie || languageCookie !== language) {
      response.cookies.set('i18next', language, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }
  }

  let cacheControl = 'public, max-age=0, s-maxage=0, must-revalidate';

  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/api/:path*'],
};
