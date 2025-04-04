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
    turbo: {},
  },
  transpilePackages: ['next-auth'],
  swcMinify: true,
  productionBrowserSourceMaps: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    return config;
  },
  images: {
    domains: ['example.com', 'images.unsplash.com', 'picsum.photos'],
  },
};

export default nextConfig;
