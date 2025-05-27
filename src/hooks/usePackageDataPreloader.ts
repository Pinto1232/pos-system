'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApiClient } from '@/api/axiosClient';
import { useQuery } from '@tanstack/react-query';

interface Feature {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  isRequired: boolean;
  multiCurrencyPrices?: Record<string, number>;
}

interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  currency?: string;
  multiCurrencyPrices?: Record<string, number>;
  category?: string;
  isActive?: boolean;
  features?: string[];
  dependencies?: string[];
  icon?: string;
}

interface UsagePricing {
  id: number;
  featureId: number;
  name: string;
  unit: string;
  minValue: number;
  maxValue: number;
  pricePerUnit: number;
  defaultValue: number;
  multiCurrencyPrices?: Record<string, number>;
}

interface FeaturesResponse {
  coreFeatures: Feature[];
  addOns: AddOn[];
  usageBasedPricing: UsagePricing[];
}

interface PackageDataCache {
  features: Feature[];
  addOns: AddOn[];
  usagePricing: UsagePricing[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_KEY = 'package_data_cache';

export const usePackageDataPreloader = () => {
  const { apiClient } = useApiClient();
  const [cache, setCache] = useState<PackageDataCache | null>(null);

  const { data: customFeaturesData, isLoading: isCustomFeaturesLoading } =
    useQuery<FeaturesResponse>({
      queryKey: ['customPackageFeatures'],
      queryFn: async () => {
        console.log('Preloading custom package features...');
        const response = await apiClient.get<FeaturesResponse>(
          '/api/pricing-packages/custom/features'
        );
        return response.data;
      },
      staleTime: CACHE_DURATION,
      gcTime: CACHE_DURATION * 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  useEffect(() => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsed: PackageDataCache = JSON.parse(cachedData);
        const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;

        if (!isExpired) {
          setCache(parsed);
          console.log('Loaded package data from cache');
        } else {
          localStorage.removeItem(CACHE_KEY);
          console.log('Cache expired, removed from localStorage');
        }
      }
    } catch (error) {
      console.error('Error loading package data cache:', error);
      localStorage.removeItem(CACHE_KEY);
    }
  }, []);

  useEffect(() => {
    if (customFeaturesData && !isCustomFeaturesLoading) {
      const newCache: PackageDataCache = {
        features: customFeaturesData.coreFeatures || [],
        addOns: customFeaturesData.addOns || [],
        usagePricing: customFeaturesData.usageBasedPricing || [],
        timestamp: Date.now(),
      };

      setCache(newCache);

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
        console.log('Package data cached successfully');
      } catch (error) {
        console.error('Error caching package data:', error);
      }
    }
  }, [customFeaturesData, isCustomFeaturesLoading]);

  const getCachedData = useCallback(() => {
    if (cache) {
      return {
        features: cache.features,
        addOns: cache.addOns,
        usagePricing: cache.usagePricing,
        isFromCache: true,
      };
    }

    if (customFeaturesData) {
      return {
        features: customFeaturesData.coreFeatures || [],
        addOns: customFeaturesData.addOns || [],
        usagePricing: customFeaturesData.usageBasedPricing || [],
        isFromCache: false,
      };
    }

    return null;
  }, [cache, customFeaturesData]);

  const preloadData = useCallback(async () => {
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      console.log('Using cached package data');
      return cache;
    }

    try {
      console.log('Preloading fresh package data...');
      const response = await apiClient.get<FeaturesResponse>(
        '/api/pricing-packages/custom/features'
      );

      const newCache: PackageDataCache = {
        features: response.data.coreFeatures || [],
        addOns: response.data.addOns || [],
        usagePricing: response.data.usageBasedPricing || [],
        timestamp: Date.now(),
      };

      setCache(newCache);
      localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));

      return newCache;
    } catch (error) {
      console.error('Error preloading package data:', error);
      return cache;
    }
  }, [apiClient, cache]);

  const clearCache = useCallback(() => {
    setCache(null);
    localStorage.removeItem(CACHE_KEY);
    console.log('Package data cache cleared');
  }, []);

  return {
    getCachedData,
    preloadData,
    clearCache,
    isLoading: isCustomFeaturesLoading && !cache,
    hasCache: !!cache,
  };
};
