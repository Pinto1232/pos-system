import dotenv from 'dotenv';
dotenv.config();
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Enhanced compiler optimizations for Next.js 15
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
    // Enable React Compiler (if available)
    styledComponents: true,
  },

  // Next.js 15 experimental features for performance
  experimental: {
    // Enable Partial Prerendering for better performance
    ppr: true,

    // Optimize CSS
    optimizeCss: true,

    // Enable Turbopack for faster builds
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

    // Server Actions optimizations
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000'],
    },

    // Worker request deduplication (remove if not supported)
    // staticWorkerRequestDeduping: true,

    // Optimize package imports
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'lodash',
      'date-fns',
    ],

    // Enable React 19 features if available
    reactCompiler: process.env.NODE_ENV === 'production',

    // Memory optimizations
    memoryBasedWorkersCount: true,

    // Caching optimizations (commented out if not supported in this Next.js version)
    // incrementalCacheHandlerPath: require.resolve('./src/lib/cache-handler.js'),
  },

  transpilePackages: ['next-auth'],
  productionBrowserSourceMaps: false,

  // Enhanced image optimization
  images: {
    domains: [
      'example.com',
      'images.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimize image loading
    loader: 'default',
    unoptimized: false,
  },

  poweredByHeader: false,
  compress: true,

  // Enhanced environment variables
  env: {
    NEXT_PUBLIC_KEYCLOAK_URL: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    NEXT_PUBLIC_REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI,
    NEXT_PUBLIC_LOGIN_REDIRECT: process.env.NEXT_PUBLIC_LOGIN_REDIRECT,
    NEXT_PUBLIC_LOGOUT_REDIRECT: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT,
  },

  // Enhanced headers for performance and security
  async headers() {
    const keycloakUrl =
      process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8282';

    return [
      // Global performance headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Performance hints
          {
            key: 'Link',
            value: `<${keycloakUrl}>; rel=preconnect; crossorigin`,
          },
        ],
      },

      // Static assets caching
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // API routes caching
      {
        source: '/api/pricing-packages',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400',
          },
        ],
      },

      // Keycloak integration
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

      // Checkout page optimizations
      {
        source: '/checkout/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network; style-src 'self' 'unsafe-inline'; connect-src 'self' ${keycloakUrl} http://localhost:5107 https://api.stripe.com https://openexchangerates.org; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; img-src 'self' data: https:; font-src 'self' data:;`,
          },
          {
            key: 'Link',
            value:
              '<https://js.stripe.com>; rel=preconnect; crossorigin, <https://api.stripe.com>; rel=preconnect; crossorigin',
          },
        ],
      },
    ];
  },

  // Enhanced redirects for performance
  async redirects() {
    return [
      // Redirect old URLs to optimized versions
      {
        source: '/dashboard-old',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },

  // Enhanced rewrites for API optimization
  async rewrites() {
    return [
      // API route optimizations
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { dev }) => {
    // Production optimizations
    if (!dev) {
      // Tree shaking improvements
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Bundle splitting optimization
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunks
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common chunks
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          // MUI specific chunk
          mui: {
            name: 'mui',
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            chunks: 'all',
            priority: 30,
          },
        },
      };
    }

    // Module resolution optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    return config;
  },

  // Output configuration for better performance
  output: 'standalone',

  // Generate build ID for better caching
  generateBuildId: async () => {
    // Use git commit hash or timestamp
    return (
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.BUILD_ID ||
      `build-${Date.now()}`
    );
  },

  // Enhanced logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // Optimize server-side rendering
  serverRuntimeConfig: {
    // Server-only config
  },

  publicRuntimeConfig: {
    // Public config available on both server and client
    staticFolder: '/static',
  },
};

export default nextConfig;
