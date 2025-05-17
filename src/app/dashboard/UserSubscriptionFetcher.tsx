import { UserSubscriptionData } from './types';
import { getCacheOptions } from '../caching-config';
import { CACHE_TIMES, CACHE_TAGS } from '../cache-constants';

export async function fetchUserSubscriptionData(userId: string): Promise<UserSubscriptionData | null> {
  try {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

    const cacheOptions = await getCacheOptions(CACHE_TIMES.DASHBOARD, [
      CACHE_TAGS.USER_SUBSCRIPTION,
      CACHE_TAGS.DASHBOARD,
      `user-${userId}`,
    ]);

    const response = await fetch(`${BACKEND_API_URL}/api/UserSubscription/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

      ...cacheOptions,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }

      throw new Error(`Failed to fetch user subscription: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user subscription data:', JSON.stringify(error, null, 2));

    return {
      id: 1,
      userId,
      pricingPackageId: 1,
      package: {
        id: 1,
        title: 'Starter',
        type: 'starter',
      },
      startDate: new Date().toISOString(),
      isActive: true,
      enabledFeatures: ['Dashboard', 'Products List', 'Add/Edit Product', 'Sales Reports', 'Inventory Management', 'Customer Management'],
      additionalPackages: [],
    };
  }
}
