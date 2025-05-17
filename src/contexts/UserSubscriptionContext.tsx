'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  hasFeatureAccess: (featureName: string) => boolean;
  enableAdditionalPackage: (packageId: number) => Promise<void>;
  disableAdditionalPackage: (packageId: number) => Promise<void>;
  refreshSubscription: () => void;
}

const UserSubscriptionContext = createContext<UserSubscriptionContextType | undefined>(undefined);

export const useUserSubscription = () => {
  const context = useContext(UserSubscriptionContext);
  if (context === undefined) {
    throw new Error('useUserSubscription must be used within a UserSubscriptionProvider');
  }
  return context;
};

const userSubscriptionCache = new Map<
  string,
  {
    subscription: UserSubscription | null;
    timestamp: number;
  }
>();
const SUBSCRIPTION_CACHE_TTL = 5 * 60 * 1000;

const fetchUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  const now = Date.now();
  const cachedData = userSubscriptionCache.get(userId);
  if (cachedData && now - cachedData.timestamp < SUBSCRIPTION_CACHE_TTL) {
    console.log(`Using cached subscription for user: ${userId}`);
    return cachedData.subscription;
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Fetching subscription for user: ${userId}`);
    }

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
        enabledFeatures: ['Dashboard', 'Products List', 'Add/Edit Product', 'Sales Reports', 'Inventory Management', 'Customer Management'],
        additionalPackages: [],
      };

      userSubscriptionCache.set(userId, {
        subscription: mockSubscription,
        timestamp: now,
      });

      return mockSubscription;
    }

    console.log(`Making API request to: /api/UserSubscription/user/${userId}`);
    const response = await fetch(`/api/UserSubscription/user/${userId}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      console.error(`API Error (${response.status}): ${response.statusText}`, JSON.stringify(errorText, null, 2));

      if (response.status === 404) {
        console.warn('API endpoint not found (404), using fallback data');
        throw new Error('API endpoint not found');
      }
    }

    const data = await response.json();
    console.log('Successfully fetched user subscription:', JSON.stringify(data, null, 2));

    userSubscriptionCache.set(userId, {
      subscription: data,
      timestamp: now,
    });

    return data;
  } catch (error) {
    console.error('Error fetching user subscription:', JSON.stringify(error, null, 2));

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
      enabledFeatures: ['Dashboard', 'Products List', 'Add/Edit Product', 'Sales Reports', 'Inventory Management', 'Customer Management'],
      additionalPackages: [],
    };

    console.log('Using fallback subscription due to error:', JSON.stringify(fallbackSubscription, null, 2));

    userSubscriptionCache.set(userId, {
      subscription: fallbackSubscription,
      timestamp: now,
    });

    return fallbackSubscription;
  }
};

const userFeaturesCache = new Map<string, { features: string[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

const fetchUserFeatures = async (userId: string): Promise<string[]> => {
  const now = Date.now();
  const cachedData = userFeaturesCache.get(userId);
  if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
    console.log(`Using cached features for user: ${userId}`);
    return cachedData.features;
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Fetching features for user: ${userId}`);
    }

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

      userFeaturesCache.set(userId, {
        features: mockFeatures,
        timestamp: now,
      });

      return mockFeatures;
    }

    console.log(`Making API request to: /api/UserSubscription/user/${userId}/features`);
    const response = await fetch(`/api/UserSubscription/user/${userId}/features`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      console.error(`API Error (${response.status}): ${response.statusText}`, JSON.stringify(errorText, null, 2));

      if (response.status === 404) {
        console.warn('API endpoint not found (404), using fallback data');
        throw new Error('API endpoint not found');
      } else {
        throw new Error(`Failed to fetch features: ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('Successfully fetched user features:', JSON.stringify(data, null, 2));

    userFeaturesCache.set(userId, {
      features: data,
      timestamp: now,
    });

    return data;
  } catch (error) {
    console.error('Error fetching user features:', JSON.stringify(error, null, 2));

    const fallbackFeatures = [
      'Dashboard',
      'Products List',
      'Add/Edit Product',
      'Sales Reports',
      'Inventory Management',
      'Customer Management',
    ];

    console.log('Using fallback features due to error:', JSON.stringify(fallbackFeatures, null, 2));

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
  const { userId, isAuthenticated } = useKeycloakUser();
  const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);

  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useQuery<UserSubscription | null, Error>({
    queryKey: ['userSubscription', userId],
    queryFn: () => fetchUserSubscription(userId),
    enabled: !!userId && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const featuresLoadedRef = React.useRef(false);

  useEffect(() => {
    if (featuresLoadedRef.current || !userId || !isAuthenticated) {
      if (!userId || !isAuthenticated) {
        console.log('User not authenticated or userId not available, skipping feature loading');
      }
      return;
    }

    const loadFeatures = async () => {
      try {
        const features = await fetchUserFeatures(userId);
        setAvailableFeatures(features);

        featuresLoadedRef.current = true;
      } catch (error) {
        console.error('Failed to load user features:', JSON.stringify(error, null, 2));

        const defaultFeatures = ['Dashboard', 'Products List', 'Add/Edit Product'];
        console.warn('Setting default features due to error:', JSON.stringify(defaultFeatures, null, 2));
        setAvailableFeatures(defaultFeatures);

        featuresLoadedRef.current = true;
      }
    };

    loadFeatures();
  }, [userId, isAuthenticated]);

  const hasFeatureAccess = (featureName: string): boolean => {
    return availableFeatures.includes(featureName);
  };

  const updateFeaturesAfterPackageChange = async (userId: string) => {
    try {
      featuresLoadedRef.current = false;

      await refetch();

      const features = await fetchUserFeatures(userId);
      setAvailableFeatures(features);

      featuresLoadedRef.current = true;
    } catch (error) {
      console.error('Error updating features:', JSON.stringify(error, null, 2));
    }
  };

  const enableAdditionalPackage = async (packageId: number): Promise<void> => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/UserSubscription/user/${userId}/enable-package/${packageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to enable package: ${response.statusText}`);
      }

      await updateFeaturesAfterPackageChange(userId);
    } catch (error) {
      console.error('Error enabling additional package:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const disableAdditionalPackage = async (packageId: number): Promise<void> => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/UserSubscription/user/${userId}/disable-package/${packageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to disable package: ${response.statusText}`);
      }

      await updateFeaturesAfterPackageChange(userId);
    } catch (error) {
      console.error('Error disabling additional package:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const refreshSubscription = useCallback(async () => {
    if (userId) {
      userSubscriptionCache.delete(userId);
      userFeaturesCache.delete(userId);

      featuresLoadedRef.current = false;

      await refetch();

      try {
        const features = await fetchUserFeatures(userId);
        setAvailableFeatures(features);
        featuresLoadedRef.current = true;
      } catch (error) {
        console.error('Error refreshing features:', JSON.stringify(error, null, 2));
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
