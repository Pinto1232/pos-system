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
  swcMinify: true,
  compiler: {
    reactRemoveProperties:
      process.env.NODE_ENV === 'production',
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
    minimumCacheTTL: 60,
  },
  poweredByHeader: false,
  compress: true,
  env: {
    NEXT_PUBLIC_KEYCLOAK_URL:
      process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    NEXT_PUBLIC_KEYCLOAK_REALM:
      process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID:
      process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    NEXT_PUBLIC_REDIRECT_URI:
      process.env.NEXT_PUBLIC_REDIRECT_URI,
    NEXT_PUBLIC_LOGIN_REDIRECT:
      process.env.NEXT_PUBLIC_LOGIN_REDIRECT,
    NEXT_PUBLIC_LOGOUT_REDIRECT:
      process.env.NEXT_PUBLIC_LOGOUT_REDIRECT,
  },
};

export default nextConfig;
