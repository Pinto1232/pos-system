'use client';

import React, {
  useEffect,
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
import { AuthContext } from '@/contexts/AuthContext';

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
  currency?: string;
  multiCurrencyPrices?: string;
  [key: string]: unknown;
}

// Fallback packages to use when API call fails
const fallbackPackages: PackageData[] = [
  {
    id: 1,
    title: 'Starter',
    description:
      'Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting',
    icon: 'MUI:StarIcon',
    extraDescription:
      'Perfect for small businesses just getting started',
    price: 29.99,
    testPeriodDays: 14,
    type: 'starter',
    currency: 'USD',
    multiCurrencyPrices:
      '{"ZAR": 549.99, "EUR": 27.99, "GBP": 23.99}',
  },
  {
    id: 2,
    title: 'Growth',
    description:
      'Everything in Starter;Multi-store support;Customer loyalty program;Priority support;Advanced reporting;Employee management',
    icon: 'MUI:TrendingUpIcon',
    extraDescription:
      'Ideal for growing businesses with multiple locations',
    price: 59.99,
    testPeriodDays: 14,
    type: 'growth',
    currency: 'USD',
    multiCurrencyPrices:
      '{"ZAR": 999.99, "EUR": 54.99, "GBP": 47.99}',
  },
  {
    id: 5,
    title: 'Custom',
    description:
      'Build your own package;Select only the features you need;Add modules as your business grows;Flexible pricing based on selections;Pay only for what you use;Scalable solution for any business size',
    icon: 'MUI:SettingsIcon',
    extraDescription:
      'Create a custom solution that fits your exact needs',
    price: 49.99,
    testPeriodDays: 14,
    type: 'custom',
    currency: 'USD',
    multiCurrencyPrices:
      '{"ZAR": 899.99, "EUR": 45.99, "GBP": 39.99}',
  },
  {
    id: 4,
    title: 'Enterprise',
    description:
      'Everything in Premium;Dedicated account manager;Custom development;White-label solution;Unlimited users;Advanced security features;Data migration assistance',
    icon: 'MUI:BusinessIcon',
    extraDescription:
      'Tailored solutions for large enterprises',
    price: 199.99,
    testPeriodDays: 30,
    type: 'enterprise',
    currency: 'USD',
    multiCurrencyPrices:
      '{"ZAR": 3499.99, "EUR": 179.99, "GBP": 159.99}',
  },
  {
    id: 3,
    title: 'Premium',
    description:
      'Everything in Growth;Advanced inventory forecasting;Custom branding;24/7 support;API access;Advanced analytics;Multi-currency support',
    icon: 'MUI:DiamondIcon',
    extraDescription:
      'For established businesses requiring advanced features',
    price: 99.99,
    testPeriodDays: 14,
    type: 'premium',
    currency: 'USD',
    multiCurrencyPrices:
      '{"ZAR": 1799.99, "EUR": 89.99, "GBP": 79.99}',
  },
];

const PricingPackagesContainer: React.FC = () => {
  const { apiClient } = useApiClient();
  const { selectPackage } = usePackageSelection();
  const { authenticated, token } =
    useContext(AuthContext);

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
      console.error(
        'Error fetching pricing packages:',
        error
      );

      // Return fallback packages for any error
      console.log(
        'Using fallback pricing packages'
      );
      return {
        data: fallbackPackages,
        pageSize,
        pageNumber,
        totalItems: fallbackPackages.length,
      } as PricePackages;
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

  // Currency is now handled by the CurrencyContext

  useEffect(() => {
    if (data) {
      console.log(
        '📦 Retrieved Pricing Packages:',
        data
      );

      // Log the custom package price specifically
      const customPackage = data.data.find(
        (pkg) =>
          pkg.type?.toLowerCase() === 'custom'
      );
      if (customPackage) {
        console.log(
          'Custom Package Price:',
          customPackage.price
        );
      } else {
        console.log(
          'No custom package found in data'
        );
      }
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

  // If there's an error, we'll still show the fallback packages
  if (error) {
    console.warn(
      'Error loading packages, using fallbacks:',
      error
    );
    // Process fallback packages
    const fallbackProcessedPackages =
      fallbackPackages.map((pkg: PackageData) => {
        const type =
          pkg.type ||
          pkg.packageType ||
          'starter';
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

        // Set a fixed price for the Custom package
        let price = pkg.price || 0;
        if (validType === 'custom') {
          price = 49.99;
          console.log(
            'Setting custom package price in fallback to:',
            price
          );
        }

        return {
          id: pkg.id,
          title: pkg.title || '',
          description: pkg.description || '',
          icon: pkg.icon || '',
          extraDescription:
            pkg.extraDescription || '',
          price: price,
          testPeriodDays: pkg.testPeriodDays || 0,
          type: validType,
          currency: pkg.currency || 'USD',
          multiCurrencyPrices:
            pkg.multiCurrencyPrices ||
            '{"ZAR": 549.99, "EUR": 27.99, "GBP": 23.99}',
        } as Package;
      });

    return (
      <div className={styles.wrapper}>
        <div
          className={styles.container}
          style={{
            width: '100%',
            margin: '0 auto',
          }}
        >
          {fallbackProcessedPackages.map(
            (pkg: Package) => (
              <PricingPackageCard
                key={pkg.id}
                packageData={pkg}
                onBuyNow={() =>
                  selectPackage(pkg)
                }
              />
            )
          )}
        </div>
        <div className={styles.errorNotice}>
          <button
            onClick={() => refetch()}
            className={styles.retryButton}
          >
            Retry loading from server
          </button>
        </div>
      </div>
    );
  }

  // Map the packages from the API
  const mappedPackages = (data?.data ?? []).map(
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

      // Set a fixed price for the Custom package
      let price = pkg.price || 0;
      if (validType === 'custom') {
        price = 49.99;
        console.log(
          'Setting custom package price to:',
          price
        );
      }

      return {
        id: pkg.id,
        title: pkg.title || '',
        description: pkg.description || '',
        icon: pkg.icon || '',
        extraDescription:
          pkg.extraDescription || '',
        price: price,
        testPeriodDays: pkg.testPeriodDays || 0,
        type: validType,
        currency: pkg.currency || 'USD',
        multiCurrencyPrices:
          pkg.multiCurrencyPrices || '{}',
      } as Package;
    }
  );

  // Reorder packages to swap Premium and Custom positions
  const packages = [...mappedPackages];

  // Find the Premium and Custom packages
  const premiumIndex = packages.findIndex(
    (pkg) => pkg.type === 'premium'
  );
  const customIndex = packages.findIndex(
    (pkg) => pkg.type === 'custom'
  );

  // Only swap if both packages exist
  if (premiumIndex !== -1 && customIndex !== -1) {
    // Determine which should come first based on the current order in the UI
    // If Premium is currently at position 3 (after Starter and Growth) and Custom is at position 5
    // We want Custom to be at position 3 and Premium at position 5
    if (premiumIndex < customIndex) {
      // Swap the packages
      [
        packages[premiumIndex],
        packages[customIndex],
      ] = [
        packages[customIndex],
        packages[premiumIndex],
      ];
    }
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.container}
        style={{
          width: '100%',
          margin: '0 auto',
        }}
      >
        {packages.length > 0 ? (
          packages.map((pkg: Package) => (
            <PricingPackageCard
              key={pkg.id}
              packageData={pkg}
              onBuyNow={() => selectPackage(pkg)}
            />
          ))
        ) : (
          <div className={styles.message}>
            No pricing packages available at this
            time.
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPackagesContainer;
