'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Alert,
  Snackbar,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Package as ApiPackage } from './types';
import {
  sortPackages,
  refreshPricingPackages,
  fetchPricingPackagesClient,
} from './PricingPackagesUtils';
import {
  usePackageSelection,
  Package as ContextPackage,
} from '@/contexts/PackageSelectionContext';
import { AuthContext } from '@/contexts/AuthContext';
import PricingPackageCard from '@/components/pricing-packages/PricingPackageCard';
import styles from '@/components/pricing-packages/PricingPackages.module.css';

// Helper function to convert API package type to Context package type
const adaptPackage = (
  pkg: ApiPackage
): ContextPackage => {
  return {
    ...pkg,
    id:
      typeof pkg.id === 'string'
        ? parseInt(pkg.id, 10)
        : pkg.id,
    // Convert type string to the expected union type
    type: pkg.type.toLowerCase() as
      | 'custom'
      | 'starter'
      | 'growth'
      | 'enterprise'
      | 'premium',
  };
};

interface PricingPackagesClientProps {
  initialPackages: ApiPackage[];
}

export default function PricingPackagesClient({
  initialPackages,
}: PricingPackagesClientProps) {
  const { selectPackage } = usePackageSelection();
  const { authenticated } =
    useContext(AuthContext);
  const queryClient = useQueryClient();

  // State for UI feedback
  const [snackbarOpen, setSnackbarOpen] =
    useState(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<
      'success' | 'info' | 'warning' | 'error'
    >('info');

  // Set initial data in React Query cache
  useEffect(() => {
    if (
      initialPackages &&
      initialPackages.length > 0
    ) {
      queryClient.setQueryData(
        ['pricingPackages'],
        initialPackages
      );
    }
  }, [initialPackages, queryClient]);

  // Function to refresh data using client-side utility
  const refreshData = useCallback(async () => {
    try {
      setSnackbarMessage(
        'Refreshing pricing data...'
      );
      setSnackbarSeverity('info');
      setSnackbarOpen(true);

      // Use the client-side utility to refresh data with force refresh
      console.log(
        `[CLIENT] Starting pricing data refresh at ${new Date().toISOString()}`
      );
      const refreshedData =
        await refreshPricingPackages();

      // Log the refreshed data
      if (
        refreshedData &&
        refreshedData.length > 0
      ) {
        console.log(
          `[CLIENT] Refreshed pricing data (first item):`,
          {
            id: refreshedData[0].id,
            title: refreshedData[0].title,
            price: refreshedData[0].price,
            timestamp: new Date().toISOString(),
          }
        );
      }

      // Invalidate and refetch the query
      await queryClient.invalidateQueries({
        queryKey: ['pricingPackages'],
        refetchType: 'all',
      });

      // Force a direct fetch with cache-busting
      try {
        // Fetch with cache-busting timestamp
        const timestamp = new Date().getTime();
        await fetch(
          `/api/pricing-packages?refresh=true&t=${timestamp}`,
          {
            method: 'GET',
            headers: {
              'Cache-Control':
                'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            cache: 'no-store',
          }
        );
      } catch (fetchError) {
        console.error(
          'Error during force fetch:',
          fetchError
        );
      }

      setSnackbarMessage(
        'Pricing data refreshed successfully!'
      );
      setSnackbarSeverity('success');
    } catch (error) {
      console.error(
        'Error refreshing data:',
        error
      );
      setSnackbarMessage(
        'Failed to refresh pricing data. Please try again.'
      );
      setSnackbarSeverity('error');
    }
  }, [queryClient]);

  // Use React Query to handle client-side data fetching and caching
  const {
    data: packages = [], // Provide default empty array to avoid 'never' type
    isLoading,
    error,
  } = useQuery<ApiPackage[]>({
    queryKey: ['pricingPackages'],
    queryFn: async () => {
      // Use the client-side utility to fetch data with forceRefresh=true to bypass cache
      const data =
        await fetchPricingPackagesClient(true);

      // Log the data received from the utility function
      console.log(
        `[CLIENT] Received pricing data in queryFn at ${new Date().toISOString()}`
      );
      if (data && data.length > 0) {
        console.log(
          `[CLIENT] Sample pricing data (first item):`,
          {
            id: data[0].id,
            title: data[0].title,
            price: data[0].price,
            timestamp: new Date().toISOString(),
          }
        );
      }

      return sortPackages(data);
    },
    // Use the server-provided initial data
    initialData:
      initialPackages &&
      initialPackages.length > 0
        ? initialPackages
        : undefined,
    staleTime: 60 * 1000, // 1 minute (reduced from 1 hour)
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true, // Changed to true to refresh when window gets focus
    refetchOnMount: true, // Changed to true to refresh when component mounts
  });

  // Log the packages being rendered - moved after packages declaration
  useEffect(() => {
    if (packages && packages.length > 0) {
      console.log(
        `[CLIENT] Rendering pricing packages at ${new Date().toISOString()}`
      );
      console.log(
        `[CLIENT] Rendered pricing data (first item):`,
        {
          id: packages[0].id,
          title: packages[0].title,
          price: packages[0].price,
          timestamp: new Date().toISOString(),
        }
      );
    }
  }, [packages]);

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // If not authenticated, show login message
  if (!authenticated) {
    return (
      <Box className={styles.wrapper}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ textAlign: 'center', mb: 4 }}
        >
          Pricing Packages
        </Typography>
        <Alert
          severity="info"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mb: 4,
          }}
        >
          Please sign in to view your personalized
          pricing packages
        </Alert>
      </Box>
    );
  }

  // If loading, show loading state
  if (
    isLoading &&
    (!packages || packages.length === 0)
  ) {
    return (
      <Box
        className={styles.wrapper}
        sx={{ textAlign: 'center', py: 8 }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading pricing packages...
        </Typography>
      </Box>
    );
  }

  // If error, show error message with retry button
  if (
    error &&
    (!packages || packages.length === 0)
  ) {
    return (
      <Box className={styles.wrapper}>
        <Alert
          severity="error"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            mb: 4,
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={refreshData}
            >
              Retry
            </Button>
          }
        >
          Error loading pricing packages:{' '}
          {error instanceof Error
            ? error.message
            : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  // Render the packages
  return (
    <div className={styles.wrapper}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Pricing Packages
      </Typography>

      {/* Refresh button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <Button
          startIcon={<RefreshIcon />}
          onClick={refreshData}
          variant="outlined"
          size="small"
        >
          Refresh Pricing
        </Button>
      </Box>

      {/* Packages grid */}
      <div className={styles.container}>
        {packages && packages.length > 0 ? (
          packages.map((pkg) => {
            // Convert API package to Context package
            const adaptedPkg = adaptPackage(pkg);
            return (
              <PricingPackageCard
                key={pkg.id}
                packageData={adaptedPkg}
                onBuyNow={() =>
                  selectPackage(adaptedPkg)
                }
              />
            );
          })
        ) : (
          <div className={styles.message}>
            No pricing packages available at this
            time.
          </div>
        )}
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
