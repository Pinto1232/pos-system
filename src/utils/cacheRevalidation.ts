'use server';

import {
  revalidatePath,
  revalidateTag,
} from 'next/cache';
import { CACHE_TAGS } from '../app/cache-constants';

/**
 * Utility functions for revalidating Next.js cache
 * These functions can be used in server actions to revalidate specific parts of the application
 */

/**
 * Revalidate a specific path in the application
 * @param path The path to revalidate
 */
export async function revalidatePathAction(
  path: string
): Promise<void> {
  console.log(`Revalidating path: ${path}`);
  revalidatePath(path);
}

/**
 * Revalidate a specific cache tag
 * @param tag The cache tag to revalidate
 */
export async function revalidateTagAction(
  tag: string
): Promise<void> {
  console.log(`Revalidating tag: ${tag}`);
  revalidateTag(tag);
}

/**
 * Revalidate pricing packages data
 */
export async function revalidatePricingPackagesAction(): Promise<void> {
  console.log(
    'Revalidating pricing packages data'
  );
  revalidateTag(CACHE_TAGS.PRICING_PACKAGES);
  revalidatePath('/pricing-packages');
  revalidatePath('/api/pricing-packages');
}

/**
 * Revalidate dashboard data
 */
export async function revalidateDashboardAction(): Promise<void> {
  console.log('Revalidating dashboard data');
  revalidateTag(CACHE_TAGS.DASHBOARD);
  revalidateTag(CACHE_TAGS.USER_SUBSCRIPTION);
  revalidatePath('/dashboard');
}

/**
 * Revalidate user-specific data
 * @param userId The user ID
 */
export async function revalidateUserDataAction(
  userId: string
): Promise<void> {
  console.log(
    `Revalidating data for user: ${userId}`
  );
  revalidateTag(`user-${userId}`);
  revalidateTag(CACHE_TAGS.USER_DATA);
  revalidateTag(CACHE_TAGS.USER_SUBSCRIPTION);
  revalidateTag(CACHE_TAGS.USER_PREFERENCES);
  revalidateTag(CACHE_TAGS.USER_CUSTOMIZATION);
}

/**
 * Revalidate all cache data
 * This should be used sparingly, as it invalidates all cached data
 */
export async function revalidateAllCacheAction(): Promise<void> {
  console.log(
    '[CACHE] Revalidating all cache data'
  );

  // Specifically target pricing packages first
  console.log(
    '[CACHE] Specifically revalidating pricing packages tag'
  );
  revalidateTag(CACHE_TAGS.PRICING_PACKAGES);

  // Revalidate main content areas
  Object.values(CACHE_TAGS).forEach((tag) => {
    console.log(
      `[CACHE] Revalidating tag: ${tag}`
    );
    revalidateTag(tag);
  });

  // Add custom tags for the home page and pricing
  revalidateTag('home-page');
  revalidateTag('pricing');
  revalidateTag('packages');

  // Revalidate home page and pricing packages with highest priority
  console.log(
    '[CACHE] Revalidating home page and pricing packages paths'
  );
  revalidatePath('/', 'layout'); // Home page with layout
  revalidatePath('/', 'page'); // Home page content
  revalidatePath('/pricing-packages', 'layout');
  revalidatePath('/pricing-packages', 'page');

  // Revalidate API routes for pricing packages with highest priority
  console.log(
    '[CACHE] Revalidating pricing packages API routes'
  );
  revalidatePath('/api/pricing-packages');
  revalidatePath('/api/PricingPackages');
  revalidatePath('/api/pricingpackages');

  // Revalidate other main paths with 'layout' type to ensure the entire page is refreshed
  console.log(
    '[CACHE] Revalidating other main paths'
  );
  revalidatePath('/dashboard', 'layout'); // Dashboard with layout
  revalidatePath('/products', 'layout');
  revalidatePath('/about', 'layout');
  revalidatePath('/contact', 'layout');
  revalidatePath('/login', 'layout');
  revalidatePath('/register', 'layout');

  // Also revalidate other paths with 'page' type to ensure the page content is refreshed
  revalidatePath('/dashboard', 'page'); // Dashboard content
  revalidatePath('/products', 'page');

  // Revalidate other API routes
  console.log(
    '[CACHE] Revalidating other API routes'
  );
  revalidatePath('/api/products');
  revalidatePath('/api/categories');
  revalidatePath('/api/users');
  revalidatePath('/api/dashboard');
  revalidatePath('/api/auth');
  revalidatePath('/api/settings');

  console.log(
    '[CACHE] Cache revalidation completed'
  );
}
