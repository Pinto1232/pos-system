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
import PackagePreloader from '@/components/packages/PackagePreloader';
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
  type:
    | 'starter-plus'
    | 'growth-pro'
    | 'enterprise-elite'
    | 'custom-pro'
    | 'premium-plus';
  currency: string;
  multiCurrencyPrices: string;

  tierId?: number;
  tierLevel?: number;
  tierName?: string;
  tierDescription?: string;
};

import { apiClient } from '@/api/axiosClient';
type AxiosInstance = typeof apiClient;
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

  tierId?: number;
  tierLevel?: number;
  tierName?: string;
  tierDescription?: string;
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
        throw new Error('API response missing data property');
      }

      if (!response.data.data) {
        console.log(
          'Response data structure:',
          JSON.stringify(response.data, null, 2)
        );
        throw new Error('API response missing data.data property');
      }

      if (!Array.isArray(response.data.data)) {
        console.log(
          'data.data type:',
          JSON.stringify(typeof response.data.data, null, 2)
        );
        throw new Error('API response data.data is not an array');
      }

      if (response.data.data.length === 0) {
        throw new Error('API response data.data is an empty array');
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
      const hasExpectedTypes = packageTypes.some((type: string) => {
        const normalizedType = type.toLowerCase().replace(/_/g, '-');
        return expectedTypes.includes(normalizedType);
      });

      if (!hasExpectedTypes) {
        console.warn(
          `[${new Date().toISOString()}] API response doesn't contain any of the expected package types`
        );
        console.log('Expected types:', JSON.stringify(expectedTypes, null, 2));
        console.log('Actual types:', JSON.stringify(packageTypes, null, 2));

        console.log(
          'Processing packages anyway - type normalization will handle the conversion'
        );
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

      throw error;
    }
  };

  const { data, error, isLoading, refetch } = useQuery<PricePackages, Error>({
    queryKey: ['pricingPackages', 'v2'],

    staleTime: 0,
    queryFn: async () => {
      console.log('Executing pricing packages query function');
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

      return result;
    },
    retry: 5,
    retryDelay: (attemptIndex) => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 60000);
      console.log(`Retry attempt ${attemptIndex + 1} scheduled in ${delay}ms`);
      return delay;
    },
    enabled: true,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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
    () =>
      [
        'starter-plus',
        'growth-pro',
        'enterprise-elite',
        'custom-pro',
        'premium-plus',
      ] as const,
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
      // Convert underscores to hyphens to match expected format
      const normalizedType = type.replace(/_/g, '-');

      // Update valid types to include new package types
      const isValidType = (t: string): t is (typeof newPackageTypes)[number] =>
        newPackageTypes.includes(t as (typeof newPackageTypes)[number]);
      const validType = isValidType(normalizedType)
        ? normalizedType
        : 'starter-plus';

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

      const finalId = isNaN(numericId)
        ? Date.now() + Math.random() * 1000
        : numericId;

      const result = {
        id: finalId,
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

      console.log(
        `[createPackageFromData] Input: ${pkg.title} -> Output: ${result.title} (type: ${pkg.type} -> ${validType})`
      );

      return result;
    },
    [newPackageTypes]
  );

  const processLogRef = useRef({ lastDataKey: '', lastFilteredCount: 0 });

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

      // Only log if the data has changed
      const dataKey = `${packagesData.length}-${packagesData.map((p) => p?.id).join(',')}`;
      if (processLogRef.current.lastDataKey !== dataKey) {
        processLogRef.current.lastDataKey = dataKey;
        console.log('Processing packages data:', packagesData.length, 'items');
        console.log(
          'Package titles from API:',
          packagesData.map((p) => ({
            id: p?.id,
            title: p?.title,
            type: p?.type,
          }))
        );
      }

      const filteredPackages = packagesData.filter((pkg: PackageData) => {
        if (!pkg) return false;
        const type = (pkg.type || pkg.packageType || '').toLowerCase();
        // Convert underscores to hyphens to match expected format
        const normalizedType = type.replace(/_/g, '-');
        const matchesType = newPackageTypes.includes(
          normalizedType as (typeof newPackageTypes)[number]
        );

        return matchesType;
      });

      if (processLogRef.current.lastFilteredCount !== filteredPackages.length) {
        processLogRef.current.lastFilteredCount = filteredPackages.length;
        console.log(
          'Filtered to new packages:',
          filteredPackages.length,
          'items'
        );
      }

      if (filteredPackages.length === 0) {
        console.warn('No packages matched the expected types after filtering');
        console.log(
          'Available package types:',
          packagesData.map((p) => p?.type || p?.packageType)
        );
        console.log('Expected package types:', newPackageTypes);

        return packagesData.map(createPackageFromData);
      }

      return filteredPackages.map(createPackageFromData);
    },
    [newPackageTypes, createPackageFromData]
  );

  const { packagesToDisplay, showError } = useMemo(() => {
    let packages: Package[] = [];
    let hasError = false;

    if (!authenticated) {
      console.log('User not authenticated, cannot display packages');
      hasError = true;
    } else if (isLoading) {
      console.log('Loading packages from backend');
    } else if (error) {
      console.error('Error from backend:', error);
      hasError = true;

      if (initialPackages && initialPackages.length > 0) {
        console.log('Using initialPackages as fallback due to API error');
        packages = initialPackages;
        hasError = false;
      }
    } else if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('Invalid data structure from backend');
      hasError = true;

      if (initialPackages && initialPackages.length > 0) {
        console.log(
          'Using initialPackages as fallback due to invalid data structure'
        );
        packages = initialPackages;
        hasError = false;
      }
    } else if (data.data.length === 0) {
      console.warn('Empty data array from backend');
      hasError = true;

      if (initialPackages && initialPackages.length > 0) {
        console.log(
          'Using initialPackages as fallback due to empty API response'
        );
        packages = initialPackages;
        hasError = false;
      }
    } else {
      console.log(
        'Using packages from API - data received:',
        data.data.length,
        'packages'
      );
      packages = processPackages(data.data);
      console.log('Processed packages:', packages.length);
    }

    return { packagesToDisplay: packages, showError: hasError };
  }, [authenticated, isLoading, error, data, processPackages, initialPackages]);

  const packageTypesLogRef = useRef<string>('');

  const packages = useMemo(() => {
    if (packagesToDisplay.length === 0 && authenticated && !isLoading) {
      console.warn(
        `[${new Date().toISOString()}] No packages to display after all fallbacks`
      );
    }

    const workingPackages = [...packagesToDisplay];

    const packageOrder: Record<string, number> = {
      'starter-plus': 1,
      'growth-pro': 2,
      'custom-pro': 3,
      'enterprise-elite': 4,
      'premium-plus': 5,
    };

    if (workingPackages.length === 0) {
      console.log('No packages available from backend');

      if (initialPackages && initialPackages.length > 0) {
        console.log('Using initialPackages as final fallback');
        return [...initialPackages];
      }
    }

    workingPackages.sort((a, b) => {
      const orderA = packageOrder[a.type as string] || 999;
      const orderB = packageOrder[b.type as string] || 999;
      return orderA - orderB;
    });

    const packageTypesKey = workingPackages.map((pkg) => pkg.type).join(',');
    if (packageTypesLogRef.current !== packageTypesKey) {
      packageTypesLogRef.current = packageTypesKey;
      console.log(
        'Final packages to render:',
        workingPackages.map((pkg) => ({
          id: pkg.id,
          type: pkg.type,
          title: pkg.title,
        }))
      );
    }

    return workingPackages;
  }, [packagesToDisplay, authenticated, isLoading, initialPackages]);

  const dataLogRef = useRef<string>('');
  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      const currentDataKey = `${data.data[0].id}-${data.data[0].title}`;
      if (dataLogRef.current !== currentDataKey) {
        dataLogRef.current = currentDataKey;
        console.log(
          `[CONTAINER] Rendering pricing packages at ${new Date().toISOString()}`
        );
        console.log(`[CONTAINER] Rendered pricing data (first item):`, {
          id: data.data[0].id,
          title: data.data[0].title,
          price: data.data[0].price,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }, [data]);

  // Use refreshPricingPackages instead of handleManualRefresh

  return (
    <div className={styles.wrapper}>
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
          }}
        />
      </Box>

      <PackagePreloader>
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
                  key={`${pkg.id}-${pkg.type}`}
                  packageData={pkg}
                  onBuyNow={() => {
                    const packageForSelection = {
                      ...pkg,
                      type:
                        pkg.type === 'custom-pro'
                          ? 'custom-pro'
                          : pkg.type === 'starter-plus'
                            ? 'starter-plus'
                            : pkg.type === 'growth-pro'
                              ? 'growth-pro'
                              : pkg.type === 'enterprise-elite'
                                ? 'enterprise-elite'
                                : pkg.type === 'premium-plus'
                                  ? 'premium-plus'
                                  : 'starter-plus',
                      isCustomizable: pkg.type === 'custom-pro',
                    } as unknown as import('@/contexts/PackageSelectionContext').Package;

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
      </PackagePreloader>

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
