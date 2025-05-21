'use client';

import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/api/axiosClient';
import styles from './PricingPackages.module.css';
import PricingPackageCard from './PricingPackageCard';
import { Alert, Snackbar, Button, Box, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CacheControl from '@/components/ui/CacheControl';

import { usePackageSelection } from '@/contexts/PackageSelectionContext';

type Package = {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: string;
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

interface PricingPackagesContainerProps {
  initialPackages?: Package[];
}

const PricingPackagesContainer: React.FC<PricingPackagesContainerProps> = ({
  initialPackages,
}) => {
  const { apiClient } = useApiClient();
  const { selectPackage } = usePackageSelection();
  const { authenticated, token } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('info');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPricingPackages = async () => {
    try {
      setIsRefreshing(true);
      console.log('[PRICING] Manually refreshing pricing packages');

      queryClient.invalidateQueries({
        queryKey: ['pricingPackages'],
        refetchType: 'all',
      });

      queryClient.invalidateQueries({
        queryKey: [CACHE_TAGS.PRICING_PACKAGES],
        refetchType: 'all',
      });

      const { refreshPricingPackages: refreshPricingPackagesUtil } =
        await import('@/app/pricing-packages/PricingPackagesUtils');

      console.log(
        '[PRICING] Directly fetching pricing packages with cache-busting'
      );

      try {
        console.log(
          `[CONTAINER] Starting manual refresh at ${new Date().toISOString()}`
        );
        const refreshedData = await refreshPricingPackagesUtil();

        if (refreshedData && refreshedData.length > 0) {
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
        setSnackbarMessage('Pricing packages refreshed successfully');
        setSnackbarSeverity('success');

        setUsingFallbackData(false);
      } catch (fetchError) {
        console.error(
          '[PRICING] Error fetching pricing packages:',
          JSON.stringify(fetchError, null, 2)
        );
        setSnackbarMessage('Error refreshing pricing packages');
        setSnackbarSeverity('error');
      }

      await refetch();

      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        '[PRICING] Error refreshing pricing packages:',
        JSON.stringify(error, null, 2)
      );
      setSnackbarMessage('Error refreshing pricing packages');
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
      localStorageToken: !!localStorage.getItem('accessToken'),
    });
  }, [authenticated, token]);

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
        multiCurrencyPrices: '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
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
        multiCurrencyPrices: '{"ZAR": 1399.99, "EUR": 72.99, "GBP": 63.99}',
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
        multiCurrencyPrices: '{"ZAR": 2199.99, "EUR": 119.99, "GBP": 104.99}',
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
        multiCurrencyPrices: '{"ZAR": 4299.99, "EUR": 229.99, "GBP": 199.99}',
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
        multiCurrencyPrices: '{"ZAR": 5999.99, "EUR": 319.99, "GBP": 279.99}',
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
      const token = localStorage.getItem('accessToken');

      console.log(
        `[${new Date().toISOString()}] Request headers for pricing packages:`,
        {
          Authorization: token
            ? `Bearer ${token.substring(0, 10)}...`
            : 'No token available',
          hasToken: !!token,
        }
      );

      console.log(
        `[${new Date().toISOString()}] Network status: ${navigator.onLine ? 'Online' : 'Offline'}`
      );

      // Use PricingPackages (PascalCase) to match the backend controller route
      const endpoint = `/api/PricingPackages?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      console.log(
        `[${new Date().toISOString()}] Attempting to fetch pricing packages from: ${endpoint}`
      );

      const baseUrl = apiClient.defaults.baseURL || '';
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

      const response = await axiosClient.get(endpoint, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          'If-None-Match': '', // Bypass ETag caching
          'If-Modified-Since': '', // Bypass Last-Modified caching
        },
      });

      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log(
        `[${endTime.toISOString()}] API response received in ${duration}ms:`,
        {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          hasData: !!response.data,
          dataStructure: response.data ? Object.keys(response.data) : 'No data',
        }
      );

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
          JSON.stringify(response.data, null, 2)
        );
        return fallbackPackages;
      }

      if (!Array.isArray(response.data.data)) {
        console.warn(
          `[${new Date().toISOString()}] API response data.data is not an array`
        );
        console.log(
          'data.data type:',
          JSON.stringify(typeof response.data.data, null, 2)
        );
        return fallbackPackages;
      }

      if (response.data.data.length === 0) {
        console.warn(
          `[${new Date().toISOString()}] API response data.data is an empty array`
        );
        return fallbackPackages;
      }

      const packageTypes = response.data.data.map(
        (pkg: PackageData) => pkg.type
      );
      console.log(
        `[${new Date().toISOString()}] Package types in response:`,
        JSON.stringify(packageTypes, null, 2)
      );

      const expectedTypes = [
        'starter-plus',
        'growth-pro',
        'enterprise-elite',
        'custom-pro',
        'premium-plus',
      ];
      const hasExpectedTypes = packageTypes.some((type: string) =>
        expectedTypes.includes(type.toLowerCase())
      );

      if (!hasExpectedTypes) {
        console.warn(
          `[${new Date().toISOString()}] API response doesn't contain any of the expected package types`
        );
        console.log('Expected types:', JSON.stringify(expectedTypes, null, 2));
        console.log('Actual types:', JSON.stringify(packageTypes, null, 2));
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

      if (error instanceof Error && error.message.includes('Network Error')) {
        console.warn(
          `[${new Date().toISOString()}] Network error detected, backend might be unavailable`
        );
        console.error(
          `[${new Date().toISOString()}] Please check if the backend server is running at ${apiClient.defaults.baseURL}`
        );
      }

      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(
          `[${new Date().toISOString()}] Request was aborted due to timeout`
        );
      }

      const axiosError = error as {
        response?: { status: number };
      };
      if (axiosError.response && axiosError.response.status === 404) {
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

  const [usingFallbackData, setUsingFallbackData] = useState(false);

  const [, setLastSuccessfulFetch] = useState<Date | null>(null);

  const handleSuccessfulFetch = useCallback(() => {
    setUsingFallbackData(false);
    setLastSuccessfulFetch(new Date());
    console.log('Successfully fetched real data from backend');
  }, []);

  const handleFallbackUsed = useCallback(() => {
    setUsingFallbackData(true);
    console.warn('Using fallback data due to API issues');
  }, []);

  const initialPricePackages = useMemo(() => {
    if (initialPackages && initialPackages.length > 0) {
      return {
        data: initialPackages.map((pkg) => ({
          id: typeof pkg.id === 'string' ? parseInt(pkg.id, 10) : pkg.id,
          title: pkg.title,
          description: pkg.description,
          icon: pkg.icon,
          extraDescription: pkg.extraDescription,
          price: pkg.price,
          testPeriodDays: pkg.testPeriodDays,
          type: pkg.type,
          currency: pkg.currency,
          multiCurrencyPrices: pkg.multiCurrencyPrices,
        })),
        pageSize: 10,
        pageNumber: 1,
        totalItems: initialPackages.length,
      } as PricePackages;
    }
    return undefined;
  }, [initialPackages]);

  const { data, error, isLoading, refetch } = useQuery<PricePackages, Error>({
    queryKey: ['pricingPackages'],
    initialData: initialPricePackages,
    staleTime: 60 * 1000,
    queryFn: async () => {
      console.log('Executing pricing packages query function');
      try {
        console.log(
          `[CONTAINER] Fetching pricing packages at ${new Date().toISOString()}`
        );
        const result = await fetchPricingPackages(apiClient, 1, 10);

        if (result && result.data && result.data.length > 0) {
          console.log(`[CONTAINER] Fetched pricing data (first item):`, {
            id: result.data[0].id,
            title: result.data[0].title,
            price: result.data[0].price,
            timestamp: new Date().toISOString(),
          });
        }

        const isFallbackData = result === fallbackPackages;

        if (!isFallbackData) {
          handleSuccessfulFetch();
        } else {
          handleFallbackUsed();
        }

        return result;
      } catch (err) {
        console.error('Error in query function:', JSON.stringify(err, null, 2));
        handleFallbackUsed();
        return fallbackPackages;
      }
    },
    retry: 5,
    retryDelay: (attemptIndex) => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 60000);
      console.log(`Retry attempt ${attemptIndex + 1} scheduled in ${delay}ms`);
      return delay;
    },
    enabled: true,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      console.log(
        '📦 [HOME PAGE] Retrieved Pricing Packages:',
        JSON.stringify(data, null, 2)
      );

      data.data.forEach((pkg) => {
        console.log(`[HOME PAGE] Package: ${pkg.title}`, {
          id: pkg.id,
          price: pkg.price,
          currency: pkg.currency,
          multiCurrencyPrices: pkg.multiCurrencyPrices,
          type: pkg.type,
        });
      });

      const customPackage = data.data.find(
        (pkg: PackageData) => pkg.type?.toLowerCase() === 'custom'
      );
      if (customPackage) {
        console.log(
          '[HOME PAGE] Custom Package Price:',
          JSON.stringify(customPackage.price, null, 2)
        );
      } else {
        console.log('[HOME PAGE] No custom package found in data');
      }
    }
  }, [data]);

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

  const createPackageFromData = useCallback(
    (pkg: PackageData): Package => {
      if (!pkg) {
        console.warn('Attempted to create package from undefined data');
        return {
          id: Date.now(),
          title: 'Default Package',
          description: 'Default package description',
          icon: 'MUI:StarIcon',
          extraDescription: 'Default package',
          price: 39.99,
          testPeriodDays: 14,
          type: 'starter-plus',
          currency: 'USD',
          multiCurrencyPrices: '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
        };
      }

      const type = (pkg.type || pkg.packageType || '').toLowerCase() as string;

      // Update valid types to include new package types
      const validType = newPackageTypes.includes(type) ? type : 'starter-plus';

      let price = pkg.price || 0;
      let multiCurrencyPrices = pkg.multiCurrencyPrices || '';

      // Ensure custom-pro has the correct price
      if (validType === 'custom-pro') {
        price = 129.99;
        multiCurrencyPrices = '{"ZAR": 2199.99, "EUR": 119.99, "GBP": 104.99}';
        console.log(
          'Setting custom-pro package price to:',
          JSON.stringify(price, null, 2)
        );
      }

      const numericId =
        typeof pkg.id === 'string'
          ? parseInt(pkg.id, 10)
          : pkg.id || Date.now();

      return {
        id: isNaN(numericId) ? Date.now() : numericId,
        title: pkg.title || 'Unnamed Package',
        description: pkg.description || 'No description available',
        icon: pkg.icon || 'MUI:StarIcon',
        extraDescription: pkg.extraDescription || '',
        price: price,
        testPeriodDays: pkg.testPeriodDays || 14,
        type: validType,
        currency: pkg.currency || 'USD',
        multiCurrencyPrices:
          multiCurrencyPrices || '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
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
          JSON.stringify(packagesData, null, 2)
        );
        return [];
      }

      console.log('Processing packages data:', packagesData.length, 'items');

      const filteredPackages = packagesData.filter((pkg: PackageData) => {
        if (!pkg) return false;
        const type = (pkg.type || pkg.packageType || '').toLowerCase();
        return newPackageTypes.includes(type);
      });

      console.log(
        'Filtered to new packages:',
        filteredPackages.length,
        'items'
      );

      if (filteredPackages.length === 0) {
        console.warn('No packages matched the expected types after filtering');

        return packagesData.map(createPackageFromData);
      }

      return filteredPackages.map(createPackageFromData);
    },
    [newPackageTypes, createPackageFromData]
  );

  let packagesToDisplay: Package[] = [];
  let showError = false;

  if (!authenticated) {
    console.log('User not authenticated, cannot display packages');
    showError = true;
  } else if (isLoading) {
    console.log('Loading packages from backend');
  } else if (error) {
    console.warn(
      'Error from backend, but using fallback data:',
      JSON.stringify(error, null, 2)
    );

    packagesToDisplay = processPackages(fallbackPackages.data);
  } else if (!data || !data.data || !Array.isArray(data.data)) {
    console.warn('Invalid data structure from backend, using fallback data');

    packagesToDisplay = processPackages(fallbackPackages.data);
  } else if (data.data.length === 0) {
    console.warn('Empty data array from backend, using fallback data');

    packagesToDisplay = processPackages(fallbackPackages.data);
  } else {
    console.log('Using packages from API');
    packagesToDisplay = processPackages(data.data);
  }

  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const retryCallback = () => {
      console.log(
        `[${new Date().toISOString()}] Attempting periodic retry to fetch real data`
      );
      refetch();
    };

    if (usingFallbackData && !retryIntervalRef.current) {
      console.log(
        `[${new Date().toISOString()}] Setting up periodic retry for real data`
      );

      retryIntervalRef.current = setInterval(retryCallback, 30000);
    } else if (!usingFallbackData && retryIntervalRef.current) {
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

  if (packagesToDisplay.length === 0 && authenticated && !isLoading) {
    console.warn(
      `[${new Date().toISOString()}] No packages to display after all fallbacks`
    );
    showError = true;
  }

  const packages = [...packagesToDisplay];

  const packageOrder: Record<string, number> = {
    'starter-plus': 1,
    'growth-pro': 2,
    'custom-pro': 3,
    'enterprise-elite': 4,
    'premium-plus': 5,
  };

  if (packages.length === 0 || usingFallbackData) {
    console.log('Using fallback packages to ensure we have all package types');

    const existingTypes = new Set(packages.map((pkg) => pkg.type));

    for (const pkgType of newPackageTypes) {
      if (!existingTypes.has(pkgType)) {
        const fallbackPkg = fallbackPackages.data.find(
          (pkg) => (pkg.type?.toLowerCase() || '') === pkgType
        );

        if (fallbackPkg) {
          const processedPkg = createPackageFromData(fallbackPkg);
          packages.push(processedPkg);
          existingTypes.add(pkgType);
          console.log(`Added missing package type from fallback: ${pkgType}`);
        }
      }
    }
  }

  // Sort packages based on the defined order
  packages.sort((a, b) => {
    const orderA = packageOrder[a.type as string] || 999;
    const orderB = packageOrder[b.type as string] || 999;
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
    if (data && data.data && data.data.length > 0) {
      console.log(
        `[CONTAINER] Rendering pricing packages at ${new Date().toISOString()}`
      );
      console.log(`[CONTAINER] Rendered pricing data (first item):`, {
        id: data.data[0].id,
        title: data.data[0].title,
        price: data.data[0].price,
        timestamp: new Date().toISOString(),
        usingFallbackData: usingFallbackData,
      });
    }
  }, [data, usingFallbackData]);

  // Use refreshPricingPackages instead of handleManualRefresh

  return (
    <div className={styles.wrapper}>
      {/* Fallback data indicator */}
      {usingFallbackData && (
        <div className={styles.fallbackNotice || ''}>
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
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            }
          >
            Showing cached pricing data. We&apos;re having trouble connecting to
            our servers.
          </Alert>
        </div>
      )}

      {}
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
            isRefreshing ? <CircularProgress size={16} /> : <RefreshIcon />
          }
          disabled={isRefreshing}
          sx={{ mr: 1 }}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Pricing'}
        </Button>

        <CacheControl
          variant="minimal"
          onSuccess={() => {
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
                  const packageForSelection = {
                    ...pkg,

                    type: pkg.type.includes('custom')
                      ? 'custom'
                      : pkg.type.includes('starter')
                        ? 'starter'
                        : pkg.type.includes('growth')
                          ? 'growth'
                          : pkg.type.includes('enterprise')
                            ? 'enterprise'
                            : pkg.type.includes('premium')
                              ? 'premium'
                              : 'starter',
                  } as import('@/contexts/PackageSelectionContext').Package;

                  selectPackage(packageForSelection);
                }}
              />
            ) : null
          )
        ) : (
          <div className={styles.message}>
            No pricing packages available at this time.
          </div>
        )}
      </div>

      {showError && (
        <div className={styles.errorNotice}>
          {!authenticated ? (
            <div className={styles.message}>
              Sign in to view your personalized pricing packages
            </div>
          ) : (
            <div>
              <div className={styles.message}>
                Unable to load pricing packages from the server. Please try
                again later.
              </div>
              <button onClick={() => refetch()} className={styles.retryButton}>
                Retry loading from server
              </button>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loading}>Loading pricing packages...</div>
        </div>
      )}

      {}
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
              {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
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
