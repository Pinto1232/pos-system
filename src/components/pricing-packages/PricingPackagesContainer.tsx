'use client';

import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useApiClient } from '@/api/axiosClient';
import styles from './PricingPackages.module.css';
import PricingPackageCard from './PricingPackageCard';
import {
  Alert,
  Snackbar,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CacheControl from '@/components/ui/CacheControl';
// These imports are used in the JSX
import { usePackageSelection } from '@/contexts/PackageSelectionContext';

// Define a custom Package type that includes the new package types
type Package = {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: string; // Allow any string for package type
  currency: string;
  multiCurrencyPrices: string;
};
import { AxiosInstance } from 'axios';
import { PricePackages } from '@/components/pricing-packages/types';
import { AuthContext } from '@/contexts/AuthContext';
import { CACHE_TAGS } from '@/app/cache-constants';

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

const PricingPackagesContainer: React.FC = () => {
  const { apiClient } = useApiClient();
  const { selectPackage } = usePackageSelection();
  const { authenticated, token } =
    useContext(AuthContext);
  const queryClient = useQueryClient();

  // State for snackbar
  const [snackbarOpen, setSnackbarOpen] =
    useState(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<
      'success' | 'error' | 'info' | 'warning'
    >('info');
  const [isRefreshing, setIsRefreshing] =
    useState(false);

  // Function to manually refresh pricing packages
  const refreshPricingPackages = async () => {
    try {
      setIsRefreshing(true);
      console.log(
        '[PRICING] Manually refreshing pricing packages'
      );

      // Invalidate the pricing packages cache in React Query
      queryClient.invalidateQueries({
        queryKey: ['pricingPackages'],
        refetchType: 'all',
      });

      queryClient.invalidateQueries({
        queryKey: [CACHE_TAGS.PRICING_PACKAGES],
        refetchType: 'all',
      });

      // Import the utility function from PricingPackagesUtils
      const {
        refreshPricingPackages:
          refreshPricingPackagesUtil,
      } = await import(
        '@/app/pricing-packages/PricingPackagesUtils'
      );

      // Use the utility function to refresh pricing packages with cache-busting
      console.log(
        '[PRICING] Directly fetching pricing packages with cache-busting'
      );

      try {
        // This utility function already includes cache-busting and no-cache headers
        console.log(
          `[CONTAINER] Starting manual refresh at ${new Date().toISOString()}`
        );
        const refreshedData =
          await refreshPricingPackagesUtil();

        // Log the refreshed data
        if (
          refreshedData &&
          refreshedData.length > 0
        ) {
          console.log(
            `[CONTAINER] Manually refreshed pricing data (first item):`,
            {
              id: refreshedData[0].id,
              title: refreshedData[0].title,
              price: refreshedData[0].price,
              timestamp: new Date().toISOString(),
            }
          );
        }

        console.log(
          '[PRICING] Successfully fetched fresh pricing packages data'
        );
        setSnackbarMessage(
          'Pricing packages refreshed successfully'
        );
        setSnackbarSeverity('success');

        // Set usingFallbackData to false since we've successfully refreshed
        setUsingFallbackData(false);
      } catch (fetchError) {
        console.error(
          '[PRICING] Error fetching pricing packages:',
          fetchError
        );
        setSnackbarMessage(
          'Error refreshing pricing packages'
        );
        setSnackbarSeverity('error');
      }

      // Refetch the query to update the UI with fresh data
      await refetch();

      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        '[PRICING] Error refreshing pricing packages:',
        error
      );
      setSnackbarMessage(
        'Error refreshing pricing packages'
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('Authentication state:', {
      authenticated,
      hasToken: !!token,
      localStorageToken: !!localStorage.getItem(
        'accessToken'
      ),
    });
  }, [authenticated, token]);

  // Fallback data to use when API returns empty results
  const fallbackPackages: PricePackages = {
    totalItems: 5,
    data: [
      {
        id: 1,
        title: 'Starter Plus',
        description:
          'Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting;Customer database;Simple analytics',
        icon: 'MUI:StarIcon',
        extraDescription:
          'Perfect for small businesses looking for essential features',
        price: 39.99,
        testPeriodDays: 14,
        type: 'starter-plus',
        currency: 'USD',
        multiCurrencyPrices:
          '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
      },
      {
        id: 2,
        title: 'Growth Pro',
        description:
          'Everything in Growth;Advanced inventory forecasting;Enhanced customer loyalty program;Marketing automation tools;Staff performance tracking;Customizable dashboards;Mobile app access',
        icon: 'MUI:TrendingUpIcon',
        extraDescription:
          'Ideal for growing businesses that need advanced features',
        price: 79.99,
        testPeriodDays: 14,
        type: 'growth-pro',
        currency: 'USD',
        multiCurrencyPrices:
          '{"ZAR": 1399.99, "EUR": 72.99, "GBP": 63.99}',
      },
      {
        id: 3,
        title: 'Custom Pro',
        description:
          'Tailor-made solutions for your unique business needs;Perfect for businesses requiring customized POS features;Build your own feature set;Pay only for what you need;Flexible scaling options;Industry-specific solutions;Personalized onboarding',
        icon: 'MUI:BuildIcon',
        extraDescription:
          'The ultimate flexibility with professional customization services',
        price: 129.99,
        testPeriodDays: 30,
        type: 'custom-pro',
        currency: 'USD',
        multiCurrencyPrices:
          '{"ZAR": 2199.99, "EUR": 119.99, "GBP": 104.99}',
      },
      {
        id: 4,
        title: 'Enterprise Elite',
        description:
          'Comprehensive POS solutions for large enterprises;Includes all advanced features and premium support;Multi-location management;Enterprise-level analytics;Custom API integrations;White-label options;Dedicated account manager;Priority 24/7 support',
        icon: 'MUI:BusinessIcon',
        extraDescription:
          'Complete solution for large organizations with complex requirements',
        price: 249.99,
        testPeriodDays: 30,
        type: 'enterprise-elite',
        currency: 'USD',
        multiCurrencyPrices:
          '{"ZAR": 4299.99, "EUR": 229.99, "GBP": 199.99}',
      },
      {
        id: 5,
        title: 'Premium Plus',
        description:
          'All-inclusive POS package with premium features;Best for businesses looking for top-tier POS solutions;Advanced AI-powered analytics;Predictive inventory management;Omnichannel integration;VIP support;Quarterly business reviews;Custom reporting',
        icon: 'MUI:DiamondIcon',
        extraDescription:
          'The ultimate POS experience with cutting-edge features and premium support',
        price: 349.99,
        testPeriodDays: 30,
        type: 'premium-plus',
        currency: 'USD',
        multiCurrencyPrices:
          '{"ZAR": 5999.99, "EUR": 319.99, "GBP": 279.99}',
      },
    ],
    pageSize: 10,
    pageNumber: 1,
  };

  const fetchPricingPackages = async (
    axiosClient: AxiosInstance,
    pageNumber: number,
    pageSize: number
  ): Promise<PricePackages> => {
    const startTime = new Date();
    console.log(
      `[${startTime.toISOString()}] Starting pricing packages fetch operation`
    );

    try {
      const token = localStorage.getItem(
        'accessToken'
      );

      console.log(
        `[${new Date().toISOString()}] Request headers for pricing packages:`,
        {
          Authorization: token
            ? `Bearer ${token.substring(0, 10)}...`
            : 'No token available',
          hasToken: !!token,
        }
      );

      // Log network status
      console.log(
        `[${new Date().toISOString()}] Network status: ${navigator.onLine ? 'Online' : 'Offline'}`
      );

      // Use the lowercase version of the endpoint to match the Next.js API route
      // Use the correct endpoint format to match the backend API
      // The backend API uses lowercase 'pricingpackages' with no hyphen
      const endpoint = `/api/pricingpackages?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      console.log(
        `[${new Date().toISOString()}] Attempting to fetch pricing packages from: ${endpoint}`
      );

      // Log the full URL that will be used (for debugging)
      const baseUrl =
        apiClient.defaults.baseURL || '';
      console.log(
        `[${new Date().toISOString()}] Full URL will be: ${baseUrl}${endpoint}`
      );

      // Ensure the backend API is properly configured
      console.log(
        `[${new Date().toISOString()}] Backend API URL from environment: ${process.env.NEXT_PUBLIC_API_URL || 'not set'}`
      );
      console.log(
        `[${new Date().toISOString()}] Backend API URL from axios client: ${baseUrl}`
      );

      // Set a timeout for the request
      const timeoutMs = 10000; // 10 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn(
          `[${new Date().toISOString()}] Request timed out after ${timeoutMs}ms`
        );
      }, timeoutMs);

      const response = await axiosClient.get(
        endpoint,
        {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            'If-None-Match': '', // Bypass ETag caching
            'If-Modified-Since': '', // Bypass Last-Modified caching
          },
        }
      );

      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      const endTime = new Date();
      const duration =
        endTime.getTime() - startTime.getTime();
      console.log(
        `[${endTime.toISOString()}] API response received in ${duration}ms:`,
        {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          hasData: !!response.data,
          dataStructure: response.data
            ? Object.keys(response.data)
            : 'No data',
        }
      );

      // Detailed validation of the response data
      if (!response.data) {
        console.warn(
          `[${new Date().toISOString()}] API response missing data property`
        );
        return fallbackPackages;
      }

      if (!response.data.data) {
        console.warn(
          `[${new Date().toISOString()}] API response missing data.data property`
        );
        console.log(
          'Response data structure:',
          response.data
        );
        return fallbackPackages;
      }

      if (!Array.isArray(response.data.data)) {
        console.warn(
          `[${new Date().toISOString()}] API response data.data is not an array`
        );
        console.log(
          'data.data type:',
          typeof response.data.data
        );
        return fallbackPackages;
      }

      if (response.data.data.length === 0) {
        console.warn(
          `[${new Date().toISOString()}] API response data.data is an empty array`
        );
        return fallbackPackages;
      }

      // Check if the data contains the expected package types
      const packageTypes = response.data.data.map(
        (pkg: PackageData) => pkg.type
      );
      console.log(
        `[${new Date().toISOString()}] Package types in response:`,
        packageTypes
      );

      // Check if any of our expected package types are present
      const expectedTypes = [
        'starter-plus',
        'growth-pro',
        'enterprise-elite',
        'custom-pro',
        'premium-plus',
      ];
      const hasExpectedTypes = packageTypes.some(
        (type: string) =>
          expectedTypes.includes(
            type.toLowerCase()
          )
      );

      if (!hasExpectedTypes) {
        console.warn(
          `[${new Date().toISOString()}] API response doesn't contain any of the expected package types`
        );
        console.log(
          'Expected types:',
          expectedTypes
        );
        console.log(
          'Actual types:',
          packageTypes
        );
        return fallbackPackages;
      }

      console.log(
        `[${new Date().toISOString()}] Successfully fetched valid pricing packages from API`
      );
      return response.data;
    } catch (error: unknown) {
      const errorTime = new Date();
      console.error(
        `[${errorTime.toISOString()}] Error fetching pricing packages:`,
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error
      );

      // Check if it's a network error
      if (
        error instanceof Error &&
        error.message.includes('Network Error')
      ) {
        console.warn(
          `[${new Date().toISOString()}] Network error detected, backend might be unavailable`
        );
        console.error(
          `[${new Date().toISOString()}] Please check if the backend server is running at ${apiClient.defaults.baseURL}`
        );
      }

      // Check if it's a timeout error
      if (
        error instanceof Error &&
        error.name === 'AbortError'
      ) {
        console.warn(
          `[${new Date().toISOString()}] Request was aborted due to timeout`
        );
      }

      // Check if it's a 404 error (Not Found)
      // Use type assertion for axios error
      const axiosError = error as {
        response?: { status: number };
      };
      if (
        axiosError.response &&
        axiosError.response.status === 404
      ) {
        const currentEndpoint = `/api/pricing-packages?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        console.error(
          `[${new Date().toISOString()}] 404 Not Found error for endpoint: ${currentEndpoint}`
        );
        console.error(`[${new Date().toISOString()}] This could be due to:
          1. The backend API route doesn't exist
          2. Case sensitivity issues in the route path
          3. The backend server is not properly configured

          Full URL: ${apiClient.defaults.baseURL}${currentEndpoint}
        `);
      }

      console.log(
        `[${new Date().toISOString()}] Using fallback data due to error`
      );
      return fallbackPackages;
    }
  };

  // State to track if we're using fallback data
  const [
    usingFallbackData,
    setUsingFallbackData,
  ] = useState(false);

  // State to track the last time we successfully fetched data
  // Using this state in handleSuccessfulFetch to track when we last got real data
  const [, setLastSuccessfulFetch] =
    useState<Date | null>(null);

  // Function to handle successful data fetch
  const handleSuccessfulFetch =
    useCallback(() => {
      setUsingFallbackData(false);
      setLastSuccessfulFetch(new Date());
      console.log(
        'Successfully fetched real data from backend'
      );
    }, []);

  // Function to handle fallback to mock data
  const handleFallbackUsed = useCallback(() => {
    setUsingFallbackData(true);
    console.warn(
      'Using fallback data due to API issues'
    );
  }, []);

  const { data, error, isLoading, refetch } =
    useQuery<PricePackages, Error>({
      queryKey: ['pricingPackages'],
      queryFn: async () => {
        console.log(
          'Executing pricing packages query function'
        );
        try {
          // If we couldn't get fresh data, try the original method
          console.log(
            `[CONTAINER] Fetching pricing packages at ${new Date().toISOString()}`
          );
          const result =
            await fetchPricingPackages(
              apiClient,
              1,
              10
            );

          // Log the fetched data
          if (
            result &&
            result.data &&
            result.data.length > 0
          ) {
            console.log(
              `[CONTAINER] Fetched pricing data (first item):`,
              {
                id: result.data[0].id,
                title: result.data[0].title,
                price: result.data[0].price,
                timestamp:
                  new Date().toISOString(),
              }
            );
          }

          // Check if this is real data or fallback data
          const isFallbackData =
            result === fallbackPackages;

          if (!isFallbackData) {
            handleSuccessfulFetch();
          } else {
            handleFallbackUsed();
          }

          return result;
        } catch (err) {
          console.error(
            'Error in query function:',
            err
          );
          handleFallbackUsed();
          return fallbackPackages;
        }
      },
      retry: 5, // Increased from 3 to 5
      retryDelay: (attemptIndex) => {
        const delay = Math.min(
          1000 * 2 ** attemptIndex,
          60000
        ); // Increased max delay to 60 seconds
        console.log(
          `Retry attempt ${attemptIndex + 1} scheduled in ${delay}ms`
        );
        return delay;
      },
      enabled: true,
      staleTime: 60 * 1000, // Reduced to 1 minute to check for updates more frequently
      gcTime: 2 * 60 * 1000, // Cache for 2 minutes (cacheTime was renamed to gcTime in React Query v4)
      refetchOnWindowFocus: true, // Refetch when window gets focus
      refetchOnMount: true, // Refetch when component mounts
      placeholderData: (previousData) =>
        previousData,
    });

  useEffect(() => {
    if (
      data &&
      data.data &&
      Array.isArray(data.data)
    ) {
      console.log(
        '📦 Retrieved Pricing Packages:',
        data
      );

      const customPackage = data.data.find(
        (pkg: PackageData) =>
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

  // Define new package types at the component level so it can be used elsewhere
  // Wrap in useMemo to prevent unnecessary re-renders
  const newPackageTypes = React.useMemo(
    () => [
      'starter-plus',
      'growth-pro',
      'enterprise-elite',
      'custom-pro',
      'premium-plus',
    ],
    []
  );

  // Define createPackageFromData before using it in processPackages
  const createPackageFromData = useCallback(
    (pkg: PackageData): Package => {
      if (!pkg) {
        console.warn(
          'Attempted to create package from undefined data'
        );
        return {
          id: Date.now(), // Generate a temporary ID
          title: 'Default Package',
          description:
            'Default package description',
          icon: 'MUI:StarIcon',
          extraDescription: 'Default package',
          price: 39.99,
          testPeriodDays: 14,
          type: 'starter-plus',
          currency: 'USD',
          multiCurrencyPrices:
            '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
        };
      }

      const type = (
        pkg.type ||
        pkg.packageType ||
        ''
      ).toLowerCase() as string;

      // Update valid types to include new package types
      const validType = newPackageTypes.includes(
        type
      )
        ? type
        : 'starter-plus';

      // Set default prices based on package type
      let price = pkg.price || 0;
      let multiCurrencyPrices =
        pkg.multiCurrencyPrices || '';

      // Ensure custom-pro has the correct price
      if (validType === 'custom-pro') {
        price = 129.99;
        multiCurrencyPrices =
          '{"ZAR": 2199.99, "EUR": 119.99, "GBP": 104.99}';
        console.log(
          'Setting custom-pro package price to:',
          price
        );
      }

      // Ensure id is always a number
      const numericId =
        typeof pkg.id === 'string'
          ? parseInt(pkg.id, 10)
          : pkg.id || Date.now();

      return {
        id: isNaN(numericId)
          ? Date.now()
          : numericId,
        title: pkg.title || 'Unnamed Package',
        description:
          pkg.description ||
          'No description available',
        icon: pkg.icon || 'MUI:StarIcon',
        extraDescription:
          pkg.extraDescription || '',
        price: price,
        testPeriodDays: pkg.testPeriodDays || 14,
        type: validType,
        currency: pkg.currency || 'USD',
        multiCurrencyPrices:
          multiCurrencyPrices ||
          '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
      };
    },
    [newPackageTypes]
  );

  const processPackages = useCallback(
    (packagesData: PackageData[]): Package[] => {
      if (
        !packagesData ||
        !Array.isArray(packagesData) ||
        packagesData.length === 0
      ) {
        console.warn(
          'processPackages received invalid or empty data:',
          packagesData
        );
        return [];
      }

      console.log(
        'Processing packages data:',
        packagesData.length,
        'items'
      );

      // Filter packages to only include the new ones
      const filteredPackages =
        packagesData.filter(
          (pkg: PackageData) => {
            if (!pkg) return false;
            const type = (
              pkg.type ||
              pkg.packageType ||
              ''
            ).toLowerCase();
            return newPackageTypes.includes(type);
          }
        );

      console.log(
        'Filtered to new packages:',
        filteredPackages.length,
        'items'
      );

      if (filteredPackages.length === 0) {
        console.warn(
          'No packages matched the expected types after filtering'
        );
        // If no packages match, return the original data converted to our format
        // This ensures we at least show something
        return packagesData.map(
          createPackageFromData
        );
      }

      return filteredPackages.map(
        createPackageFromData
      );
    },
    [newPackageTypes, createPackageFromData]
  );

  let packagesToDisplay: Package[] = [];
  let showError = false;

  if (!authenticated) {
    console.log(
      'User not authenticated, cannot display packages'
    );
    showError = true;
  } else if (isLoading) {
    console.log('Loading packages from backend');
  } else if (error) {
    console.warn(
      'Error from backend, but using fallback data:',
      error
    );
    // Use fallback data instead of showing error
    packagesToDisplay = processPackages(
      fallbackPackages.data
    );
  } else if (
    !data ||
    !data.data ||
    !Array.isArray(data.data)
  ) {
    console.warn(
      'Invalid data structure from backend, using fallback data'
    );
    // Use fallback data instead of showing error
    packagesToDisplay = processPackages(
      fallbackPackages.data
    );
  } else if (data.data.length === 0) {
    console.warn(
      'Empty data array from backend, using fallback data'
    );
    // Use fallback data instead of showing error
    packagesToDisplay = processPackages(
      fallbackPackages.data
    );
  } else {
    console.log('Using packages from API');
    packagesToDisplay = processPackages(
      data.data
    );
  }

  // Implement periodic retry mechanism
  const retryIntervalRef =
    useRef<NodeJS.Timeout | null>(null);

  // Setup periodic retry if using fallback data
  useEffect(() => {
    // Clear any existing interval when component unmounts or when data status changes
    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    };
  }, []);

  // Setup periodic retry when using fallback data
  useEffect(() => {
    if (
      usingFallbackData &&
      !retryIntervalRef.current
    ) {
      console.log(
        `[${new Date().toISOString()}] Setting up periodic retry for real data`
      );

      // Try to refetch real data every 30 seconds when using fallback data
      retryIntervalRef.current = setInterval(
        () => {
          console.log(
            `[${new Date().toISOString()}] Attempting periodic retry to fetch real data`
          );
          refetch();
        },
        30000
      ); // 30 seconds
    } else if (
      !usingFallbackData &&
      retryIntervalRef.current
    ) {
      // If we're no longer using fallback data, clear the interval
      console.log(
        `[${new Date().toISOString()}] Clearing periodic retry - using real data now`
      );
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }

    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    };
  }, [usingFallbackData, refetch]);

  // If we still have no packages to display after all the fallbacks, show error
  if (
    packagesToDisplay.length === 0 &&
    authenticated &&
    !isLoading
  ) {
    console.warn(
      `[${new Date().toISOString()}] No packages to display after all fallbacks`
    );
    showError = true;
  }

  const packages = [...packagesToDisplay];

  // Sort packages in a specific order: starter-plus, growth-pro, custom-pro, enterprise-elite, premium-plus
  const packageOrder: Record<string, number> = {
    'starter-plus': 1,
    'growth-pro': 2,
    'custom-pro': 3,
    'enterprise-elite': 4,
    'premium-plus': 5,
  };

  // Ensure we have at least one package of each type from fallback data if needed
  if (
    packages.length === 0 ||
    usingFallbackData
  ) {
    console.log(
      'Using fallback packages to ensure we have all package types'
    );
    // Create a set of existing package types
    const existingTypes = new Set(
      packages.map((pkg) => pkg.type)
    );

    // Add any missing package types from fallback data
    for (const pkgType of newPackageTypes) {
      if (!existingTypes.has(pkgType)) {
        // Find this package type in fallback data
        const fallbackPkg =
          fallbackPackages.data.find(
            (pkg) =>
              (pkg.type?.toLowerCase() || '') ===
              pkgType
          );

        if (fallbackPkg) {
          const processedPkg =
            createPackageFromData(fallbackPkg);
          packages.push(processedPkg);
          existingTypes.add(pkgType);
          console.log(
            `Added missing package type from fallback: ${pkgType}`
          );
        }
      }
    }
  }

  // Sort packages based on the defined order
  packages.sort((a, b) => {
    const orderA =
      packageOrder[a.type as string] || 999;
    const orderB =
      packageOrder[b.type as string] || 999;
    return orderA - orderB;
  });

  console.log(
    'Packages after sorting and ensuring all types exist:',
    packages.map((pkg) => pkg.type)
  );

  // Show snackbar when using fallback data
  useEffect(() => {
    if (usingFallbackData) {
      setSnackbarMessage(
        "Showing cached pricing data. We're having trouble connecting to our servers."
      );
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(false);
    }
  }, [
    usingFallbackData,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
  ]);

  // Log the packages being rendered
  useEffect(() => {
    if (
      data &&
      data.data &&
      data.data.length > 0
    ) {
      console.log(
        `[CONTAINER] Rendering pricing packages at ${new Date().toISOString()}`
      );
      console.log(
        `[CONTAINER] Rendered pricing data (first item):`,
        {
          id: data.data[0].id,
          title: data.data[0].title,
          price: data.data[0].price,
          timestamp: new Date().toISOString(),
          usingFallbackData: usingFallbackData,
        }
      );
    }
  }, [data, usingFallbackData]);

  // Use refreshPricingPackages instead of handleManualRefresh

  return (
    <div className={styles.wrapper}>
      {/* Fallback data indicator */}
      {usingFallbackData && (
        <div
          className={styles.fallbackNotice || ''}
        >
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={refreshPricingPackages}
                startIcon={<RefreshIcon />}
                disabled={isRefreshing}
              >
                {isRefreshing
                  ? 'Refreshing...'
                  : 'Refresh'}
              </Button>
            }
          >
            Showing cached pricing data.
            We&apos;re having trouble connecting
            to our servers.
          </Alert>
        </div>
      )}

      {/* Add refresh button for pricing packages */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={refreshPricingPackages}
          startIcon={
            isRefreshing ? (
              <CircularProgress size={16} />
            ) : (
              <RefreshIcon />
            )
          }
          disabled={isRefreshing}
          sx={{ mr: 1 }}
        >
          {isRefreshing
            ? 'Refreshing...'
            : 'Refresh Pricing'}
        </Button>

        <CacheControl
          variant="minimal"
          onSuccess={() => {
            // Refetch data after cache is refreshed
            refetch();
            setUsingFallbackData(false);
          }}
        />
      </Box>

      <div
        className={styles.container}
        style={{
          width: '100%',
          margin: '0 auto',
        }}
      >
        {packages.length > 0 ? (
          packages.map((pkg: Package) =>
            pkg ? (
              <PricingPackageCard
                key={pkg.id}
                packageData={pkg}
                onBuyNow={() => {
                  // Convert the package to the expected type for selectPackage
                  const packageForSelection = {
                    ...pkg,
                    // Map the package type to one of the allowed types in PackageSelectionContext
                    type: pkg.type.includes(
                      'custom'
                    )
                      ? 'custom'
                      : pkg.type.includes(
                            'starter'
                          )
                        ? 'starter'
                        : pkg.type.includes(
                              'growth'
                            )
                          ? 'growth'
                          : pkg.type.includes(
                                'enterprise'
                              )
                            ? 'enterprise'
                            : pkg.type.includes(
                                  'premium'
                                )
                              ? 'premium'
                              : 'starter',
                  } as import('@/contexts/PackageSelectionContext').Package;

                  selectPackage(
                    packageForSelection
                  );
                }}
              />
            ) : null
          )
        ) : (
          <div className={styles.message}>
            No pricing packages available at this
            time.
          </div>
        )}
      </div>

      {showError && (
        <div className={styles.errorNotice}>
          {!authenticated ? (
            <div className={styles.message}>
              Sign in to view your personalized
              pricing packages
            </div>
          ) : (
            <div>
              <div className={styles.message}>
                Unable to load pricing packages
                from the server. Please try again
                later.
              </div>
              <button
                onClick={() => refetch()}
                className={styles.retryButton}
              >
                Retry loading from server
              </button>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loading}>
            Loading pricing packages...
          </div>
        </div>
      )}

      {/* Snackbar notification for cache operations */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={refreshPricingPackages}
              disabled={isRefreshing}
            >
              {isRefreshing
                ? 'Refreshing...'
                : 'Refresh Now'}
            </Button>
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PricingPackagesContainer;
