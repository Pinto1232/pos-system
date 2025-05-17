'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '../app/cache-constants';

export async function revalidatePathAction(path: string): Promise<void> {
  console.log(`Revalidating path: ${path}`);
  revalidatePath(path);
}

export async function revalidateTagAction(tag: string): Promise<void> {
  console.log(`Revalidating tag: ${tag}`);
  revalidateTag(tag);
}

export async function revalidatePricingPackagesAction(): Promise<void> {
  console.log('Revalidating pricing packages data');
  revalidateTag(CACHE_TAGS.PRICING_PACKAGES);
  revalidatePath('/pricing-packages');
  revalidatePath('/api/pricing-packages');
}

export async function revalidateDashboardAction(): Promise<void> {
  console.log('Revalidating dashboard data');
  revalidateTag(CACHE_TAGS.DASHBOARD);
  revalidateTag(CACHE_TAGS.USER_SUBSCRIPTION);
  revalidatePath('/dashboard');
}

export async function revalidateUserDataAction(userId: string): Promise<void> {
  console.log(`Revalidating data for user: ${userId}`);
  revalidateTag(`user-${userId}`);
  revalidateTag(CACHE_TAGS.USER_DATA);
  revalidateTag(CACHE_TAGS.USER_SUBSCRIPTION);
  revalidateTag(CACHE_TAGS.USER_PREFERENCES);
  revalidateTag(CACHE_TAGS.USER_CUSTOMIZATION);
}

export async function revalidateAllCacheAction(): Promise<void> {
  console.log('[CACHE] Revalidating all cache data');

  console.log('[CACHE] Specifically revalidating pricing packages tag');
  revalidateTag(CACHE_TAGS.PRICING_PACKAGES);

  Object.values(CACHE_TAGS).forEach((tag) => {
    console.log(`[CACHE] Revalidating tag: ${tag}`);
    revalidateTag(tag);
  });

  revalidateTag('home-page');
  revalidateTag('pricing');
  revalidateTag('packages');

  console.log('[CACHE] Revalidating home page and pricing packages paths');
  revalidatePath('/', 'layout');
  revalidatePath('/', 'page');
  revalidatePath('/pricing-packages', 'layout');
  revalidatePath('/pricing-packages', 'page');

  console.log('[CACHE] Revalidating pricing packages API routes');
  revalidatePath('/api/pricing-packages');
  revalidatePath('/api/PricingPackages');
  revalidatePath('/api/pricingpackages');

  console.log('[CACHE] Revalidating other main paths');
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/products', 'layout');
  revalidatePath('/about', 'layout');
  revalidatePath('/contact', 'layout');
  revalidatePath('/login', 'layout');
  revalidatePath('/register', 'layout');

  revalidatePath('/dashboard', 'page');
  revalidatePath('/products', 'page');

  console.log('[CACHE] Revalidating other API routes');
  revalidatePath('/api/products');
  revalidatePath('/api/categories');
  revalidatePath('/api/users');
  revalidatePath('/api/dashboard');
  revalidatePath('/api/auth');
  revalidatePath('/api/settings');

  console.log('[CACHE] Cache revalidation completed');
}
