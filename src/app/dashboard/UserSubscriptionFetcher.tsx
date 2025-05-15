// Server Component for fetching user subscription data
import { UserSubscriptionData } from './types';
import { getCacheOptions } from '../caching-config';
import { CACHE_TIMES, CACHE_TAGS } from '../cache-constants';

/**
 * Fetches user subscription data from the backend API
 * This is a Server Component that directly fetches data from the backend
 * Uses Next.js Data Cache with optimized caching configuration
 */
export async function fetchUserSubscriptionData(userId: string): Promise<UserSubscriptionData | null> {
  try {
    // Define the backend API URL
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

    // Get cache options
    const cacheOptions = await getCacheOptions(
      CACHE_TIMES.DASHBOARD,
      [CACHE_TAGS.USER_SUBSCRIPTION, CACHE_TAGS.DASHBOARD, `user-${userId}`]
    );

    // Fetch data from the backend API with optimized caching
    const response = await fetch(
      `${BACKEND_API_URL}/api/UserSubscription/user/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Use centralized cache configuration
        ...cacheOptions
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // User not found, return null
        return null;
      }

      // For other errors, throw to be caught by error handling
      throw new Error(`Failed to fetch user subscription: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user subscription data:', error);

    // Return fallback data for development
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
      enabledFeatures: [
        'Dashboard',
        'Products List',
        'Add/Edit Product',
        'Sales Reports',
        'Inventory Management',
        'Customer Management',
      ],
      additionalPackages: [],
    };
  }
}
