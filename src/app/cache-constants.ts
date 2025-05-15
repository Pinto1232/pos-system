/**
 * Centralized configuration for Next.js caching strategies
 * This file defines cache durations and tags used throughout the application
 */

// Cache durations (in seconds)
export const CACHE_TIMES = {
  // Static content that rarely changes
  STATIC: 86400, // 24 hours

  // Semi-static content that changes occasionally
  SEMI_STATIC: 3600, // 1 hour

  // Dynamic content that changes frequently but can be cached briefly
  DYNAMIC: 60, // 1 minute

  // User-specific content
  USER: 300, // 5 minutes

  // Dashboard data
  DASHBOARD: 1800, // 30 minutes

  // Pricing packages
  PRICING: 3600, // 1 hour

  // Product catalog
  PRODUCTS: 600, // 10 minutes

  // Add-ons
  ADDONS: 1800, // 30 minutes
};

// Cache tags for targeted revalidation
export const CACHE_TAGS = {
  // Main content areas
  PRICING_PACKAGES: 'pricing-packages',
  DASHBOARD: 'dashboard',
  USER_SUBSCRIPTION: 'user-subscription',
  PRODUCTS: 'products',
  ADDONS: 'addons',

  // User-specific data
  USER_DATA: 'user-data',
  USER_PREFERENCES: 'user-preferences',
  USER_CUSTOMIZATION: 'user-customization',

  // Feature-specific data
  FEATURES: 'features',
  TESTIMONIALS: 'testimonials',
};
