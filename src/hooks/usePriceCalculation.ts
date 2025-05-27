'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useApiClient } from '@/api/axiosClient';
import { debounce } from 'lodash';

interface PriceCalculationRequest {
  packageId: number;
  basePrice: number;
  selectedFeatures: number[];
  selectedAddOns: number[];
  usageLimits: Record<number, number>;
}

interface PriceCalculationResponse {
  totalPrice: number;
  breakdown?: {
    basePrice: number;
    featuresPrice: number;
    addOnsPrice: number;
    usagePrice: number;
  };
}

interface UsePriceCalculationProps {
  packageId: number;
  basePrice: number;
  isCustomizable: boolean;
}

export const usePriceCalculation = ({
  packageId,
  basePrice,
  isCustomizable,
}: UsePriceCalculationProps) => {
  const { apiClient } = useApiClient();
  const [calculatedPrice, setCalculatedPrice] = useState<number>(basePrice);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceCache = useRef<Map<string, number>>(new Map());
  const lastCalculationRef = useRef<string>('');

  // Create a cache key from the calculation parameters
  const createCacheKey = useCallback(
    (
      selectedFeatures: number[],
      selectedAddOns: number[],
      usageLimits: Record<number, number>
    ) => {
      const sortedFeatures = [...selectedFeatures].sort((a, b) => a - b);
      const sortedAddOns = [...selectedAddOns].sort((a, b) => a - b);

      return JSON.stringify({
        packageId,
        basePrice,
        selectedFeatures: sortedFeatures,
        selectedAddOns: sortedAddOns,
        usageLimits,
      });
    },
    [packageId, basePrice]
  );

  // Debounced price calculation function
  const calculatePrice = useCallback(
    debounce(
      async (
        selectedFeatures: number[],
        selectedAddOns: number[],
        usageLimits: Record<number, number>
      ) => {
        if (!isCustomizable) {
          setCalculatedPrice(basePrice);
          return;
        }

        const cacheKey = createCacheKey(
          selectedFeatures,
          selectedAddOns,
          usageLimits
        );

        // Check if this is the same as the last calculation
        if (lastCalculationRef.current === cacheKey) {
          return;
        }

        // Check cache first
        const cachedPrice = priceCache.current.get(cacheKey);
        if (cachedPrice !== undefined) {
          console.log('Using cached price calculation:', cachedPrice);
          setCalculatedPrice(cachedPrice);
          lastCalculationRef.current = cacheKey;
          return;
        }

        setIsCalculating(true);
        setError(null);

        const requestBody: PriceCalculationRequest = {
          packageId,
          basePrice,
          selectedFeatures,
          selectedAddOns,
          usageLimits,
        };

        console.log(
          'Calculating price with request body:',
          JSON.stringify(requestBody, null, 2)
        );

        try {
          const response = await apiClient.post<PriceCalculationResponse>(
            '/api/pricing-packages/custom/calculate-price',
            requestBody
          );

          console.log(
            'Price calculation response:',
            JSON.stringify(response.data, null, 2)
          );

          const newPrice = response.data.totalPrice;
          setCalculatedPrice(newPrice);

          priceCache.current.set(cacheKey, newPrice);
          lastCalculationRef.current = cacheKey;

          if (priceCache.current.size > 50) {
            const firstKey = priceCache.current.keys().next().value;
            priceCache.current.delete(firstKey);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error('Failed to calculate price:', errorMessage);
          setError(errorMessage);

          setCalculatedPrice(basePrice);
        } finally {
          setIsCalculating(false);
        }
      },
      300
    ),
    [apiClient, packageId, basePrice, isCustomizable, createCacheKey]
  );

  useEffect(() => {
    priceCache.current.clear();
    lastCalculationRef.current = '';
    setCalculatedPrice(basePrice);
  }, [packageId, basePrice]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      calculatePrice.cancel();
    };
  }, [calculatePrice]);

  const clearCache = useCallback(() => {
    priceCache.current.clear();
    lastCalculationRef.current = '';
    console.log('Price calculation cache cleared');
  }, []);

  return {
    calculatedPrice,
    isCalculating,
    error,
    calculatePrice,
    clearCache,
  };
};
