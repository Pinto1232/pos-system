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
};

export default nextConfig;
