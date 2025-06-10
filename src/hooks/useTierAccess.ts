import { useQuery } from '@tanstack/react-query';
import { UserSubscriptionData } from '@/app/dashboard/types';

export const TIER_TO_PACKAGE_MAPPING = {
  1: { minPrice: 0, name: 'Free', tierName: 'Starter Plus' },
  2: { minPrice: 29.99, name: 'Basic', tierName: 'Growth Pro' },
  3: { minPrice: 49.99, name: 'Professional', tierName: 'Custom Pro' },
  4: { minPrice: 99.99, name: 'Enterprise', tierName: 'Enterprise Elite' },
  5: { minPrice: 149.99, name: 'Premium Plus', tierName: 'Premium Plus' },
} as const;

export interface TierFeature {
  name: string;
  requiredTierLevel: number;
  requiredTierName: string;
  description?: string;
}

export const TIER_FEATURES: Record<string, TierFeature> = {
  'Advanced Analytics': {
    name: 'Advanced Analytics',
    requiredTierLevel: 2,
    requiredTierName: 'Growth Pro',
    description:
      'Access detailed business insights and advanced reporting features.',
  },
  'Multi-Location Support': {
    name: 'Multi-Location Support',
    requiredTierLevel: 2,
    requiredTierName: 'Growth Pro',
    description: 'Manage multiple store locations from a single dashboard.',
  },
  'Custom Integrations': {
    name: 'Custom Integrations',
    requiredTierLevel: 3,
    requiredTierName: 'Custom Pro',
    description:
      'Connect with third-party services and build custom workflows.',
  },
  'API Access': {
    name: 'API Access',
    requiredTierLevel: 3,
    requiredTierName: 'Custom Pro',
    description: 'Full API access for custom integrations and development.',
  },
  'Enterprise Features': {
    name: 'Enterprise Features',
    requiredTierLevel: 4,
    requiredTierName: 'Enterprise Elite',
    description: 'Access enterprise-level features and dedicated support.',
  },
  'White Label Options': {
    name: 'White Label Options',
    requiredTierLevel: 4,
    requiredTierName: 'Enterprise Elite',
    description: 'Customize the platform with your own branding.',
  },
  'AI-Powered Insights': {
    name: 'AI-Powered Insights',
    requiredTierLevel: 5,
    requiredTierName: 'Premium Plus',
    description: 'Leverage artificial intelligence for predictive analytics.',
  },
  'Premium Support': {
    name: 'Premium Support',
    requiredTierLevel: 5,
    requiredTierName: 'Premium Plus',
    description: '24/7 premium support with dedicated account manager.',
  },
};

export const useTierAccess = () => {
  const { data: subscriptionData, isLoading } =
    useQuery<UserSubscriptionData | null>({
      queryKey: ['userSubscription', 'default-user'],
      queryFn: async () => {
        try {
          const { fetchUserSubscriptionData } = await import(
            '@/app/dashboard/UserSubscriptionFetcher'
          );
          return await fetchUserSubscriptionData('default-user');
        } catch (error) {
          console.error('Error fetching subscription data:', error);
          return null;
        }
      },
    });

  const currentTierLevel = subscriptionData?.package?.tierLevel || 1;
  const currentTierName = subscriptionData?.package?.tierName || 'Starter Plus';

  console.log('useTierAccess - subscriptionData:', subscriptionData);
  console.log('useTierAccess - currentTierLevel:', currentTierLevel);
  console.log('useTierAccess - currentTierName:', currentTierName);

  const hasFeatureAccess = (featureName: string): boolean => {
    const feature = TIER_FEATURES[featureName];
    if (!feature) {
      console.warn(`Feature "${featureName}" not found in TIER_FEATURES`);
      return true;
    }
    return currentTierLevel >= feature.requiredTierLevel;
  };

  const getFeatureRequirement = (featureName: string): TierFeature | null => {
    return TIER_FEATURES[featureName] || null;
  };

  const getAvailableFeatures = (): string[] => {
    return Object.keys(TIER_FEATURES).filter((featureName) =>
      hasFeatureAccess(featureName)
    );
  };

  const getLockedFeatures = (): TierFeature[] => {
    return Object.values(TIER_FEATURES).filter(
      (feature) => currentTierLevel < feature.requiredTierLevel
    );
  };

  const getNextTierFeatures = (): TierFeature[] => {
    const nextTierLevel = currentTierLevel + 1;
    return Object.values(TIER_FEATURES).filter(
      (feature) => feature.requiredTierLevel === nextTierLevel
    );
  };

  const hasPackageAccess = (
    requiredMinPrice: number,
    packageName?: string
  ): boolean => {
    const currentPackage =
      TIER_TO_PACKAGE_MAPPING[
        currentTierLevel as keyof typeof TIER_TO_PACKAGE_MAPPING
      ];
    if (!currentPackage) return false;

    if (packageName && currentPackage.name === 'Premium Plus') {
      return true;
    }

    return currentPackage.minPrice >= requiredMinPrice;
  };

  const getCurrentPackageInfo = () => {
    return (
      TIER_TO_PACKAGE_MAPPING[
        currentTierLevel as keyof typeof TIER_TO_PACKAGE_MAPPING
      ] || TIER_TO_PACKAGE_MAPPING[1]
    );
  };

  return {
    subscriptionData,
    currentTierLevel,
    currentTierName,
    isLoading,
    hasFeatureAccess,
    getFeatureRequirement,
    getAvailableFeatures,
    getLockedFeatures,
    getNextTierFeatures,
    hasPackageAccess,
    getCurrentPackageInfo,
  };
};

export default useTierAccess;
