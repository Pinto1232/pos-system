'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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

const fetchUserSubscription = async (
  userId: string
): Promise<UserSubscription | null> => {
  try {
    console.log(
      `Fetching subscription for user: ${userId}`
    );
    const response = await fetch(
      `/api/UserSubscription/user/${userId}`
    );

    // The API endpoint now always returns mock data for errors, so we should get valid data
    const data = await response.json();

    if (!response.ok) {
      console.warn(
        `API returned status: ${response.status}, but we got mock data:`,
        data
      );
    } else {
      console.log(
        'Successfully fetched user subscription'
      );
    }

    return data;
  } catch (error) {
    console.error(
      'Error fetching user subscription:',
      error
    );

    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    console.warn(
      'Using fallback subscription data due to API error'
    );
    // Return mock data for development as a fallback
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
};

const fetchUserFeatures = async (
  userId: string
): Promise<string[]> => {
  try {
    console.log(
      `Fetching features for user: ${userId}`
    );
    const response = await fetch(
      `/api/UserSubscription/user/${userId}/features`
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
      throw new Error(
        `Failed to fetch features: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(
      'Successfully fetched user features:',
      data
    );
    return data;
  } catch (error) {
    console.error(
      'Error fetching user features:',
      error
    );

    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    // Return mock data for development with a clear indication it's fallback data
    console.warn(
      'Using fallback feature data due to API error'
    );
    return [
      'Dashboard',
      'Products List',
      'Add/Edit Product',
      'Sales Reports',
      'Inventory Management',
      'Customer Management',
    ];
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

  useEffect(() => {
    const loadFeatures = async () => {
      if (userId && isAuthenticated) {
        try {
          console.log(
            'Loading features for authenticated user:',
            userId
          );
          const features =
            await fetchUserFeatures(userId);
          setAvailableFeatures(features);
          console.log(
            'Features loaded successfully:',
            features
          );
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
        }
      } else {
        console.log(
          'User not authenticated or userId not available, skipping feature loading'
        );
      }
    };

    loadFeatures();
  }, [userId, isAuthenticated, subscription]);

  const hasFeatureAccess = (
    featureName: string
  ): boolean => {
    return availableFeatures.includes(
      featureName
    );
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

      // Refresh subscription data
      refetch();

      // Refresh available features
      const features =
        await fetchUserFeatures(userId);
      setAvailableFeatures(features);
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

      // Refresh subscription data
      refetch();

      // Refresh available features
      const features =
        await fetchUserFeatures(userId);
      setAvailableFeatures(features);
    } catch (error) {
      console.error(
        'Error disabling additional package:',
        error
      );
      throw error;
    }
  };

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
        refreshSubscription: refetch,
      }}
    >
      {children}
    </UserSubscriptionContext.Provider>
  );
};
