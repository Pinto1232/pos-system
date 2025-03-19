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
  // Enable SWC minifier for faster production 
  swcMinify: true,
  // Disable production source maps if you don't need them
  productionBrowserSourceMaps: false,
  // Webpack configuration to enable persistent caching
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
};

export default nextConfig;
