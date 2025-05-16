'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import useKeycloakUser from '@/hooks/useKeycloakUser';

export interface UserSubscription {
  id: number;
  userId: string;
  pricingPackageId: number;
  package?: {
    id: number;
    title: string;
    type: string;
  };
  startDate: string;
  endDate?: string;
  isActive: boolean;
  enabledFeatures: string[];
  additionalPackages: number[];
}

interface UserSubscriptionContextType {
  subscription: UserSubscription | null;
  isLoading: boolean;
  error: Error | null;
  availableFeatures: string[];
  hasFeatureAccess: (
    featureName: string
  ) => boolean;
  enableAdditionalPackage: (
    packageId: number
  ) => Promise<void>;
  disableAdditionalPackage: (
    packageId: number
  ) => Promise<void>;
  refreshSubscription: () => void;
}

const UserSubscriptionContext = createContext<
  UserSubscriptionContextType | undefined
>(undefined);

export const useUserSubscription = () => {
  const context = useContext(
    UserSubscriptionContext
  );
  if (context === undefined) {
    throw new Error(
      'useUserSubscription must be used within a UserSubscriptionProvider'
    );
  }
  return context;
};

// Cache for user subscriptions to prevent redundant API calls
const userSubscriptionCache = new Map<
  string,
  {
    subscription: UserSubscription | null;
    timestamp: number;
  }
>();
const SUBSCRIPTION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const fetchUserSubscription = async (
  userId: string
): Promise<UserSubscription | null> => {
  // Check cache first
  const now = Date.now();
  const cachedData =
    userSubscriptionCache.get(userId);
  if (
    cachedData &&
    now - cachedData.timestamp <
      SUBSCRIPTION_CACHE_TTL
  ) {
    console.log(`Using cached subscription for user: ${userId}`);
    return cachedData.subscription;
  }

  try {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Fetching subscription for user: ${userId}`
      );
    }

    // Check if we should use mock data directly (from environment variable)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    if (useMockData) {
      console.log('Using mock subscription data directly due to NEXT_PUBLIC_USE_MOCK_DATA=true');
      const mockSubscription = {
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

      // Cache the mock data
      userSubscriptionCache.set(userId, {
        subscription: mockSubscription,
        timestamp: now,
      });

      return mockSubscription;
    }

    console.log(`Making API request to: /api/UserSubscription/user/${userId}`);
    const response = await fetch(
      `/api/UserSubscription/user/${userId}`,
      {
        // Add cache control headers to prevent browser caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(
          () => 'No error details available'
        );
      console.error(
        `API Error (${response.status}): ${response.statusText}`,
        errorText
      );

      // For 404 errors, we'll use fallback data instead of throwing
      if (response.status === 404) {
        console.warn('API endpoint not found (404), using fallback data');
        throw new Error('API endpoint not found');
      }
    }

    // The API endpoint now always returns mock data for errors, so we should get valid data
    const data = await response.json();
    console.log('Successfully fetched user subscription:', data);

    // Cache the result
    userSubscriptionCache.set(userId, {
      subscription: data,
      timestamp: now,
    });

    return data;
  } catch (error) {
    console.error('Error fetching user subscription:', error);

    // Create fallback subscription data
    const fallbackSubscription = {
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

    console.log('Using fallback subscription due to error:', fallbackSubscription);

    // Cache the fallback data too to prevent repeated failures
    userSubscriptionCache.set(userId, {
      subscription: fallbackSubscription,
      timestamp: now,
    });

    return fallbackSubscription;
  }
};

// Cache for user features to prevent redundant API calls
const userFeaturesCache = new Map<
  string,
  { features: string[]; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const fetchUserFeatures = async (
  userId: string
): Promise<string[]> => {
  // Check cache first
  const now = Date.now();
  const cachedData =
    userFeaturesCache.get(userId);
  if (
    cachedData &&
    now - cachedData.timestamp < CACHE_TTL
  ) {
    console.log(`Using cached features for user: ${userId}`);
    return cachedData.features;
  }

  try {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Fetching features for user: ${userId}`
      );
    }

    // Check if we should use mock data directly (from environment variable)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    if (useMockData) {
      console.log('Using mock data directly due to NEXT_PUBLIC_USE_MOCK_DATA=true');
      const mockFeatures = [
        'Dashboard',
        'Products List',
        'Add/Edit Product',
        'Sales Reports',
        'Inventory Management',
        'Customer Management',
      ];

      // Cache the mock data
      userFeaturesCache.set(userId, {
        features: mockFeatures,
        timestamp: now,
      });

      return mockFeatures;
    }

    // Try to fetch from API
    console.log(`Making API request to: /api/UserSubscription/user/${userId}/features`);
    const response = await fetch(
      `/api/UserSubscription/user/${userId}/features`,
      {
        // Add cache control headers to prevent browser caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(
          () => 'No error details available'
        );
      console.error(
        `API Error (${response.status}): ${response.statusText}`,
        errorText
      );

      // For 404 errors, we'll use fallback data instead of throwing
      if (response.status === 404) {
        console.warn('API endpoint not found (404), using fallback data');
        throw new Error('API endpoint not found');
      } else {
        throw new Error(
          `Failed to fetch features: ${response.statusText}`
        );
      }
    }

    const data = await response.json();
    console.log('Successfully fetched user features:', data);

    // Cache the result
    userFeaturesCache.set(userId, {
      features: data,
      timestamp: now,
    });

    return data;
  } catch (error) {
    console.error('Error fetching user features:', error);

    // Return mock data for development with a clear indication it's fallback data
    const fallbackFeatures = [
      'Dashboard',
      'Products List',
      'Add/Edit Product',
      'Sales Reports',
      'Inventory Management',
      'Customer Management',
    ];

    console.log('Using fallback features due to error:', fallbackFeatures);

    // Cache the fallback data too to prevent repeated failures
    userFeaturesCache.set(userId, {
      features: fallbackFeatures,
      timestamp: now,
    });

    return fallbackFeatures;
  }
};

export const UserSubscriptionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { userId, isAuthenticated } =
    useKeycloakUser();
  const [
    availableFeatures,
    setAvailableFeatures,
  ] = useState<string[]>([]);

  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useQuery<UserSubscription | null, Error>({
    queryKey: ['userSubscription', userId],
    queryFn: () => fetchUserSubscription(userId),
    enabled: !!userId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use a ref to track if features have been loaded to prevent unnecessary API calls
  const featuresLoadedRef = React.useRef(false);

  useEffect(() => {
    // Skip if features have already been loaded or if user is not authenticated
    if (
      featuresLoadedRef.current ||
      !userId ||
      !isAuthenticated
    ) {
      if (!userId || !isAuthenticated) {
        console.log(
          'User not authenticated or userId not available, skipping feature loading'
        );
      }
      return;
    }

    const loadFeatures = async () => {
      try {
        const features =
          await fetchUserFeatures(userId);
        setAvailableFeatures(features);
        // Mark features as loaded
        featuresLoadedRef.current = true;
      } catch (error) {
        console.error(
          'Failed to load user features:',
          error
        );

        // Set default features to ensure UI doesn't break
        const defaultFeatures = [
          'Dashboard',
          'Products List',
          'Add/Edit Product',
        ];
        console.warn(
          'Setting default features due to error:',
          defaultFeatures
        );
        setAvailableFeatures(defaultFeatures);
        // Still mark as loaded to prevent continuous retries
        featuresLoadedRef.current = true;
      }
    };

    loadFeatures();
  }, [userId, isAuthenticated]);

  const hasFeatureAccess = (
    featureName: string
  ): boolean => {
    return availableFeatures.includes(
      featureName
    );
  };

  // Helper function to update features without duplicating code
  const updateFeaturesAfterPackageChange = async (
    userId: string
  ) => {
    try {
      // Reset the featuresLoadedRef to allow reloading features
      featuresLoadedRef.current = false;

      // Refresh subscription data first
      await refetch();

      // Then update features in a controlled way
      const features =
        await fetchUserFeatures(userId);
      setAvailableFeatures(features);

      // Mark as loaded again
      featuresLoadedRef.current = true;
    } catch (error) {
      console.error(
        'Error updating features:',
        error
      );
      // Don't throw here to prevent UI breaks
    }
  };

  const enableAdditionalPackage = async (
    packageId: number
  ): Promise<void> => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/UserSubscription/user/${userId}/enable-package/${packageId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to enable package: ${response.statusText}`
        );
      }

      // Update features and subscription in a controlled way
      await updateFeaturesAfterPackageChange(
        userId
      );
    } catch (error) {
      console.error(
        'Error enabling additional package:',
        error
      );
      throw error;
    }
  };

  const disableAdditionalPackage = async (
    packageId: number
  ): Promise<void> => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/UserSubscription/user/${userId}/disable-package/${packageId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to disable package: ${response.statusText}`
        );
      }

      // Update features and subscription in a controlled way
      await updateFeaturesAfterPackageChange(
        userId
      );
    } catch (error) {
      console.error(
        'Error disabling additional package:',
        error
      );
      throw error;
    }
  };

  // Create a proper refresh function that clears caches
  const refreshSubscription =
    useCallback(async () => {
      if (userId) {
        // Clear caches to force fresh data
        userSubscriptionCache.delete(userId);
        userFeaturesCache.delete(userId);

        // Reset the features loaded flag
        featuresLoadedRef.current = false;

        // Trigger a refetch
        await refetch();

        // Reload features
        try {
          const features =
            await fetchUserFeatures(userId);
          setAvailableFeatures(features);
          featuresLoadedRef.current = true;
        } catch (error) {
          console.error(
            'Error refreshing features:',
            error
          );
        }
      }
    }, [userId, refetch]);

  return (
    <UserSubscriptionContext.Provider
      value={{
        subscription: subscription || null,
        isLoading,
        error,
        availableFeatures,
        hasFeatureAccess,
        enableAdditionalPackage,
        disableAdditionalPackage,
        refreshSubscription,
      }}
    >
      {children}
    </UserSubscriptionContext.Provider>
  );
};
