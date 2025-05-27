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

const BACKEND_PROXY_ROUTES = ['/api/currency'];

acceptLanguage.languages(MIDDLEWARE_LANGUAGES.map((lang) => lang.code));

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.toLowerCase().startsWith('/api/')) {
    const lowerCasePath = pathname.toLowerCase();

    for (const proxyRoute of BACKEND_PROXY_ROUTES) {
      if (lowerCasePath.startsWith(proxyRoute.toLowerCase())) {
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5107';
        const targetUrl = new URL(
          pathname + request.nextUrl.search,
          backendUrl
        );

        console.log(
          `Proxying API request from ${pathname} to ${targetUrl.toString()}`
        );
        return NextResponse.rewrite(targetUrl);
      }
    }

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

  const keycloakUrl =
    process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8282';
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network https://checkout.stripe.com https://q.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob: https://images.unsplash.com https://picsum.photos https://via.placeholder.com https://q.stripe.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' " +
      keycloakUrl +
      ' http://localhost:5107 https://api.stripe.com https://checkout.stripe.com https://m.stripe.network https://q.stripe.com wss://ws.stripe.com https://openexchangerates.org',
    "frame-src 'self' " +
      keycloakUrl +
      ' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://q.stripe.com',
    "frame-ancestors 'self' " +
      keycloakUrl +
      ' http://localhost:3000 http://localhost:3001 http://localhost:3002',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "manifest-src 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspDirectives);

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/api/:path*'],
};
