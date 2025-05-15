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
  console.log('Revalidating all cache data');

  // Revalidate main content areas
  Object.values(CACHE_TAGS).forEach((tag) => {
    revalidateTag(tag);
  });

  // Revalidate main paths
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/pricing-packages');
  revalidatePath('/api/pricing-packages');
}
