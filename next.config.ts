import dotenv from 'dotenv';
dotenv.config();
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  experimental: {
    optimizeCss: true,
    turbo: {
      resolveAlias: {
        '@components': './src/components',
        '@utils': './src/utils',
        '@lib': './src/lib',
        '@contexts': './src/contexts',
        '@hooks': './src/hooks',
        '@pages': './src/pages',
        '@public': './public',
        '@styles': './src/styles',
        '@types': './src/types',
      },
    },
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000'],
    },
  },
  transpilePackages: ['next-auth'],
  productionBrowserSourceMaps: false,
  images: {
    domains: [
      'example.com',
      'images.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600, // Increase cache TTL to 1 hour
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  poweredByHeader: false,
  compress: true,
  env: {
    NEXT_PUBLIC_KEYCLOAK_URL: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    NEXT_PUBLIC_REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI,
    NEXT_PUBLIC_LOGIN_REDIRECT: process.env.NEXT_PUBLIC_LOGIN_REDIRECT,
    NEXT_PUBLIC_LOGOUT_REDIRECT: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT,
  },
  async headers() {
    const keycloakUrl =
      process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8282';
    return [
      {
        source: '/silent-check-sso.html',
        headers: [
          {
            key: 'X-Frame-Options',
            value: `ALLOW-FROM ${keycloakUrl}`,
          },
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${keycloakUrl} http://localhost:3000 http://localhost:3001 http://localhost:3002; default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' ${keycloakUrl} https://openexchangerates.org;`,
          },
        ],
      },
      {
        source: '/checkout/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network; style-src 'self' 'unsafe-inline'; connect-src 'self' ${keycloakUrl} http://localhost:5107 https://api.stripe.com https://openexchangerates.org; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; img-src 'self' data: https:; font-src 'self' data:;`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
