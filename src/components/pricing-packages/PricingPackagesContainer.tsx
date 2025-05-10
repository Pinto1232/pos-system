'use client';

import React, {
  useEffect,
  useState,
  useContext,
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
import { AuthContext } from '@/contexts/AuthContext';
import { AxiosError } from 'axios';

interface PackageData {
  id: string | number;
  title?: string;
  description?: string;
  icon?: string;
  extraDescription?: string;
  price?: number;
  testPeriodDays?: number;
  type?: string;
  packageType?: string;
  [key: string]: unknown;
}

const PricingPackagesContainer: React.FC = () => {
  const { apiClient } = useApiClient();
  const { selectPackage } = usePackageSelection();
  const { authenticated, token } =
    useContext(AuthContext);
  const [currencyInfo, setCurrencyInfo] =
    useState<{
      currency: string;
      rate: number;
    }>({
      currency: 'USD',
      rate: 1,
    });

  useEffect(() => {
    console.log('Authentication state:', {
      authenticated,
      hasToken: !!token,
      localStorageToken: !!localStorage.getItem(
        'accessToken'
      ),
    });
  }, [authenticated, token]);

  const fetchPricingPackages = async (
    axiosClient: AxiosInstance,
    pageNumber: number,
    pageSize: number
  ): Promise<PricePackages> => {
    try {
      console.log(
        'Request headers for pricing packages:',
        {
          Authorization: `Bearer ${localStorage.getItem('accessToken')?.substring(0, 10)}...`,
        }
      );

      const response = await axiosClient.get(
        `/api/PricingPackages?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response?.status === 401
      ) {
        console.error(
          'Authentication error when fetching pricing packages:',
          error
        );
        return {
          data: [],
          pageSize,
          pageNumber,
        } as PricePackages;
      }
      throw error;
    }
  };

  const { data, error, isLoading, refetch } =
    useQuery<PricePackages, Error>({
      queryKey: ['pricingPackages'],
      queryFn: () =>
        fetchPricingPackages(apiClient, 1, 10),
      retry: authenticated ? 3 : 0,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      enabled: authenticated,
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

  if (!authenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>
          Sign in to view pricing packages
        </div>
      </div>
    );
  }

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
          Retry
        </button>
      </div>
    );
  }

  const packages = (data?.data ?? []).map(
    (pkg: PackageData) => {
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
      {packages.length > 0 ? (
        packages.map((pkg: Package) => (
          <PricingPackageCard
            key={pkg.id}
            packageData={pkg}
            onBuyNow={() => selectPackage(pkg)}
            currency={currencyInfo.currency}
            rate={currencyInfo.rate}
          />
        ))
      ) : (
        <div className={styles.message}>
          No pricing packages available at this
          time.
        </div>
      )}
    </div>
  );
};

export default PricingPackagesContainer;
