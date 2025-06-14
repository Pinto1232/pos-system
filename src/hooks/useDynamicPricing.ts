import { useState, useEffect, useCallback } from 'react';
import pricingService, { PricingPackageData } from '@/api/pricingService';

export interface UseDynamicPricingOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface PackagePricingInfo {
  name: string;
  minPrice: number;
  currency: string;
  exists: boolean;
}

export interface UseDynamicPricingReturn {
  packages: PricingPackageData[];
  loading: boolean;
  error: string | null;
  getPackagePrice: (packageName: string) => Promise<PackagePricingInfo>;
  refreshPricing: () => Promise<void>;
  isPackageAvailable: (packageName: string) => boolean;
}

export function useDynamicPricing(
  options: UseDynamicPricingOptions = {}
): UseDynamicPricingReturn {
  const { autoRefresh = false, refreshInterval = 5 * 60 * 1000 } = options;

  const [packages, setPackages] = useState<PricingPackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPackages = await pricingService.getAllPackages();
      setPackages(fetchedPackages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch pricing packages';
      setError(errorMessage);
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPackagePrice = useCallback(
    async (packageName: string): Promise<PackagePricingInfo> => {
      try {
        return await pricingService.getPackagePricingInfo(packageName);
      } catch (err) {
        console.error(`Error getting price for package ${packageName}:`, err);
        return {
          name: packageName,
          minPrice: 0,
          currency: 'USD',
          exists: false,
        };
      }
    },
    []
  );

  const refreshPricing = useCallback(async () => {
    pricingService.clearCache();
    await fetchPackages();
  }, [fetchPackages]);

  const isPackageAvailable = useCallback(
    (packageName: string): boolean => {
      return packages.some(
        (pkg) =>
          pkg.title.toLowerCase() === packageName.toLowerCase() ||
          pkg.type.toLowerCase() === packageName.toLowerCase()
      );
    },
    [packages]
  );

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshPricing();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshPricing]);

  return {
    packages,
    loading,
    error,
    getPackagePrice,
    refreshPricing,
    isPackageAvailable,
  };
}

export function useSidebarPricing() {
  const { packages, loading, error, getPackagePrice, refreshPricing } =
    useDynamicPricing({ autoRefresh: true });

  const [packagePriceMap, setPackagePriceMap] = useState<
    Map<string, PackagePricingInfo>
  >(new Map());

  useEffect(() => {
    const buildPriceMap = async () => {
      const priceMap = new Map<string, PackagePricingInfo>();

      const commonPackages = [
        'Basic',
        'Professional',
        'Enterprise',
        'Premium Plus',
      ];

      for (const packageName of commonPackages) {
        const pricingInfo = await getPackagePrice(packageName);
        priceMap.set(packageName.toLowerCase(), pricingInfo);
      }

      setPackagePriceMap(priceMap);
    };

    if (!loading && packages.length > 0) {
      buildPriceMap();
    }
  }, [packages, loading, getPackagePrice]);

  const getMinPrice = useCallback(
    (packageName: string): number => {
      const pricingInfo = packagePriceMap.get(packageName.toLowerCase());
      return pricingInfo?.minPrice || 0;
    },
    [packagePriceMap]
  );

  const getCurrency = useCallback(
    (packageName: string): string => {
      const pricingInfo = packagePriceMap.get(packageName.toLowerCase());
      return pricingInfo?.currency || 'USD';
    },
    [packagePriceMap]
  );

  const packageExists = useCallback(
    (packageName: string): boolean => {
      const pricingInfo = packagePriceMap.get(packageName.toLowerCase());
      return pricingInfo?.exists || false;
    },
    [packagePriceMap]
  );

  return {
    loading,
    error,
    refreshPricing,
    getMinPrice,
    getCurrency,
    packageExists,
    packages,
  };
}

export default useDynamicPricing;
