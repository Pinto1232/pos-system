'use client';

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Snackbar, Button, Box, Typography, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Package as ApiPackage } from './types';
import { sortPackages, refreshPricingPackages, fetchPricingPackagesClient } from './PricingPackagesUtils';
import { usePackageSelection, Package as ContextPackage } from '@/contexts/PackageSelectionContext';
import { AuthContext } from '@/contexts/AuthContext';
import PricingPackageCard from '@/components/pricing-packages/PricingPackageCard';
import styles from '@/components/pricing-packages/PricingPackages.module.css';

const adaptPackage = (pkg: ApiPackage): ContextPackage => {
  return {
    ...pkg,
    id: typeof pkg.id === 'string' ? parseInt(pkg.id, 10) : pkg.id,

    type: pkg.type.toLowerCase() as 'custom' | 'starter' | 'growth' | 'enterprise' | 'premium',
  };
};

interface PricingPackagesClientProps {
  initialPackages: ApiPackage[];
}

export default function PricingPackagesClient({ initialPackages }: PricingPackagesClientProps) {
  const { selectPackage } = usePackageSelection();
  const { authenticated } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) {
      queryClient.setQueryData(['pricingPackages'], initialPackages);
    }
  }, [initialPackages, queryClient]);

  const refreshData = useCallback(async () => {
    try {
      setSnackbarMessage('Refreshing pricing data...');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);

      console.log(`[CLIENT] Starting pricing data refresh at ${new Date().toISOString()}`);
      const refreshedData = await refreshPricingPackages();

      if (refreshedData && refreshedData.length > 0) {
        console.log(`[CLIENT] Refreshed pricing data (first item):`, {
          id: refreshedData[0].id,
          title: refreshedData[0].title,
          price: refreshedData[0].price,
          timestamp: new Date().toISOString(),
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ['pricingPackages'],
        refetchType: 'all',
      });

      try {
        const timestamp = new Date().getTime();
        await fetch(`/api/pricing-packages?refresh=true&t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
          cache: 'no-store',
        });
      } catch (fetchError) {
        console.error('Error during force fetch:', JSON.stringify(fetchError, null, 2));
      }

      setSnackbarMessage('Pricing data refreshed successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error refreshing data:', JSON.stringify(error, null, 2));
      setSnackbarMessage('Failed to refresh pricing data. Please try again.');
      setSnackbarSeverity('error');
    }
  }, [queryClient]);

  const {
    data: packages = [],
    isLoading,
    error,
  } = useQuery<ApiPackage[]>({
    queryKey: ['pricingPackages'],
    queryFn: async () => {
      const data = await fetchPricingPackagesClient(true);

      console.log(`[CLIENT] Received pricing data in queryFn at ${new Date().toISOString()}`);
      if (data && data.length > 0) {
        console.log(`[CLIENT] Sample pricing data (first item):`, {
          id: data[0].id,
          title: data[0].title,
          price: data[0].price,
          timestamp: new Date().toISOString(),
        });
      }

      return sortPackages(data);
    },

    initialData: initialPackages && initialPackages.length > 0 ? initialPackages : undefined,
    staleTime: 60 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (packages && packages.length > 0) {
      console.log(`[CLIENT] Rendering pricing packages at ${new Date().toISOString()}`);
      console.log(`[CLIENT] Rendered pricing data (first item):`, {
        id: packages[0].id,
        title: packages[0].title,
        price: packages[0].price,
        timestamp: new Date().toISOString(),
      });
    }
  }, [packages]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!authenticated) {
    return (
      <Box className={styles.wrapper}>
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 4 }}>
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
          Please sign in to view your personalized pricing packages
        </Alert>
      </Box>
    );
  }

  if (isLoading && (!packages || packages.length === 0)) {
    return (
      <Box className={styles.wrapper} sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading pricing packages...
        </Typography>
      </Box>
    );
  }

  if (error && (!packages || packages.length === 0)) {
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
            <Button color="inherit" size="small" onClick={refreshData}>
              Retry
            </Button>
          }
        >
          Error loading pricing packages: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 4 }}>
        Pricing Packages
      </Typography>

      {}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
        }}
      >
        <Button startIcon={<RefreshIcon />} onClick={refreshData} variant="outlined" size="small">
          Refresh Pricing
        </Button>
      </Box>

      {}
      <div className={styles.container}>
        {packages && packages.length > 0 ? (
          packages.map((pkg) => {
            const adaptedPkg = adaptPackage(pkg);
            return <PricingPackageCard key={pkg.id} packageData={adaptedPkg} onBuyNow={() => selectPackage(adaptedPkg)} />;
          })
        ) : (
          <div className={styles.message}>No pricing packages available at this time.</div>
        )}
      </div>

      {}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
