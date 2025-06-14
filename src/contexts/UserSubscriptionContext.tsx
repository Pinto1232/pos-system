'use client';

import React, { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sidebarItems } from '../Seetings/settings';

interface PackageDetail {
  id: number;
  title: string;
  type: string;
  price?: number;
}

interface Subscription {
  package: PackageDetail;
  features?: string[];
}

type PackageLevel = 'Basic' | 'PremiumPlus';

interface UserSubscriptionContextType {
  subscription: Subscription | null;
  hasFeatureAccess: (featureName: string) => boolean;
  updateSubscription: (newSubscription: Subscription) => void;
  getCurrentPackageLevel: () => PackageLevel | null;
  refreshSubscription: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const UserSubscriptionContext =
  createContext<UserSubscriptionContextType | null>(null);

const getPackagePrice = (packageType: string): number => {
  switch (packageType.toLowerCase()) {
    case 'premium plus':
      return 149.99;
    case 'basic':
      return 29.99;
    default:
      return 0;
  }
};

const meetsRequiredLevel = (
  currentLevel: PackageLevel,
  requiredLevel: PackageLevel
): boolean => {
  const levels: PackageLevel[] = ['Basic', 'PremiumPlus'];
  const currentIdx = levels.indexOf(currentLevel);
  const requiredIdx = levels.indexOf(requiredLevel);
  return currentIdx >= requiredIdx;
};

const getRequiredLevel = (price: number): PackageLevel => {
  if (price >= 149.99) return 'PremiumPlus';
  return 'Basic';
};

export const UserSubscriptionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  const {
    data: subscriptionData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Subscription | null>({
    queryKey: ['userSubscription'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/subscription');
        if (!response.ok) {
          throw new Error('Failed to fetch subscription');
        }
        const data = await response.json();
        return data;
      } catch (err) {
        setError(err as Error);
        return null;
      }
    },
  });

  const subscription = subscriptionData ?? null;

  const getCurrentPackageLevel = (): PackageLevel | null => {
    if (!subscription) return null;
    const packageType = subscription.package.type.toLowerCase();
    return packageType === 'premium plus' ? 'PremiumPlus' : 'Basic';
  };
  const hasFeatureAccess = (featureName: string): boolean => {
    if (isLoading) return false;

    if (!subscription) {
      const findFeatureRequirements = () => {
        for (const item of sidebarItems) {
          if (item.label === featureName) {
            return !item.requiredPackage;
          }
          if (item.subItems) {
            const subItem = item.subItems.find(
              (sub) => sub.label === featureName
            );
            if (subItem) {
              return !subItem.requiredPackage && !item.requiredPackage;
            }
          }
        }
        return false;
      };
      return findFeatureRequirements();
    }

    const currentLevel = getCurrentPackageLevel();
    if (!currentLevel) return false;
    if (currentLevel === 'PremiumPlus') {
      return true;
    }

    if (subscription.features && subscription.features.includes(featureName)) {
      return true;
    }

    const findFeatureRequirements = () => {
      for (const item of sidebarItems) {
        if (item.label === featureName) {
          if (!item.requiredPackage) return true;
          const requiredLevel = getRequiredLevel(item.requiredPackage.minPrice);
          return meetsRequiredLevel(currentLevel, requiredLevel);
        }

        if (item.subItems) {
          const subItem = item.subItems.find(
            (sub) => sub.label === featureName
          );
          if (subItem) {
            if (item.requiredPackage) {
              const parentRequiredLevel = getRequiredLevel(
                item.requiredPackage.minPrice
              );
              if (!meetsRequiredLevel(currentLevel, parentRequiredLevel))
                return false;
            }

            if (!subItem.requiredPackage) return true;
            const requiredLevel = getRequiredLevel(
              subItem.requiredPackage.minPrice
            );
            return meetsRequiredLevel(currentLevel, requiredLevel);
          }
        }
      }
      return false;
    };

    return findFeatureRequirements();
  };

  const updateSubscription = async (newSubscription: Subscription) => {
    try {
      if (!newSubscription.package.type) {
        throw new Error('Package type is required');
      }

      const subscriptionWithPrice = {
        ...newSubscription,
        package: {
          ...newSubscription.package,
          price:
            newSubscription.package.price ||
            getPackagePrice(newSubscription.package.type),
        },
      };

      const response = await fetch('/api/subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionWithPrice),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      localStorage.setItem(
        'userSubscription',
        JSON.stringify(subscriptionWithPrice)
      );

      window.location.reload();
    } catch (err) {
      setError(err as Error);
    }
  };

  const refreshSubscription = async () => {
    try {
      await refetch();
    } catch (err) {
      setError(err as Error);
    }
  };

  return (
    <UserSubscriptionContext.Provider
      value={{
        subscription,
        hasFeatureAccess,
        updateSubscription,
        getCurrentPackageLevel,
        refreshSubscription,
        isLoading,
        error: error || queryError || null,
      }}
    >
      {children}
    </UserSubscriptionContext.Provider>
  );
};

export const useUserSubscription = () => {
  const context = useContext(UserSubscriptionContext);
  if (!context) {
    throw new Error(
      'useUserSubscription must be used within a UserSubscriptionProvider'
    );
  }
  return context;
};
