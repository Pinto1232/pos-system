'use client';

import React, {
  useEffect,
  useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/api/axiosClient';
import styles from './PricingPackages.module.css';
import PricingPackageCard from './PricingPackageCard';
import {
  usePackageSelection,
  type Package,
} from '@/contexts/PackageSelectionContext';
import { AxiosInstance } from 'axios';
import { PricePackages } from '@/components/pricing-packages/types';
import { fetchCurrencyAndRate } from '@/utils/currencyUtils';

const PricingPackagesContainer: React.FC = () => {
  const { apiClient } = useApiClient();
  const { selectPackage } = usePackageSelection();
  const [currencyInfo, setCurrencyInfo] =
    useState<{
      currency: string;
      rate: number;
    }>({
      currency: 'USD',
      rate: 1,
    });

  const fetchPricingPackages = async (
    axiosClient: AxiosInstance,
    pageNumber: number,
    pageSize: number
  ): Promise<PricePackages> => {
    const response = await axiosClient.get(
      `/api/PricingPackages?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  };

  const { data, error, isLoading, refetch } =
    useQuery<PricePackages, Error>({
      queryKey: ['pricingPackages'],
      queryFn: () =>
        fetchPricingPackages(apiClient, 1, 10),
      retry: 3,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
    });

  useEffect(() => {
    fetchCurrencyAndRate()
      .then(setCurrencyInfo)
      .catch((error: Error) => {
        console.error(
          'Error fetching currency info:',
          error
        );
        setCurrencyInfo({
          currency: 'USD',
          rate: 1,
        });
      });
  }, []);

  useEffect(() => {
    if (data) {
      console.log(
        '📦 Retrieved Pricing Packages:',
        data
      );
    }
  }, [data]);

  if (isLoading)
    return (
      <div className={styles.loading}>
        Loading pricing packages...
      </div>
    );
  if (error) {
    return (
      <div className={styles.error}>
        <button
          onClick={() => refetch()}
          className={styles.retryButton}
        >
          {/* Retry */}
        </button>
      </div>
    );
  }

  const packages = (data?.data ?? []).map(
    (pkg) => {
      const type =
        pkg.type || pkg.packageType || 'starter';
      const validType = [
        'starter',
        'growth',
        'enterprise',
        'custom',
        'premium',
      ].includes(type)
        ? (type as
            | 'starter'
            | 'growth'
            | 'enterprise'
            | 'custom'
            | 'premium')
        : 'starter';

      return {
        id: pkg.id,
        title: pkg.title || '',
        description: pkg.description || '',
        icon: pkg.icon || '',
        extraDescription:
          pkg.extraDescription || '',
        price: pkg.price || 0,
        testPeriodDays: pkg.testPeriodDays || 0,
        type: validType,
      } as Package;
    }
  );

  return (
    <div className={styles.container}>
      {packages.map((pkg) => (
        <PricingPackageCard
          key={pkg.id}
          packageData={pkg}
          onBuyNow={() => selectPackage(pkg)}
          currency={currencyInfo.currency}
          rate={currencyInfo.rate}
        />
      ))}
    </div>
  );
};

export default PricingPackagesContainer;
