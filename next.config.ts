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
  experimental: {
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
  },
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
