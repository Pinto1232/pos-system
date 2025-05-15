'use client';

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Snackbar, Button, Box, Typography, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Package } from './types';
import { sortPackages, refreshPricingPackages, fetchPricingPackagesClient } from './PricingPackagesUtils';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { AuthContext } from '@/contexts/AuthContext';
import PricingPackageCard from '@/components/pricing-packages/PricingPackageCard';
import styles from '@/components/pricing-packages/PricingPackages.module.css';

interface PricingPackagesClientProps {
  initialPackages: Package[];
}

export default function PricingPackagesClient({ initialPackages }: PricingPackagesClientProps) {
  const { selectPackage } = usePackageSelection();
  const { authenticated } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // State for UI feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  // Set initial data in React Query cache
  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) {
      queryClient.setQueryData(['pricingPackages'], initialPackages);
    }
  }, [initialPackages, queryClient]);

  // Function to refresh data using client-side utility
  const refreshData = useCallback(async () => {
    try {
      setSnackbarMessage('Refreshing pricing data...');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);

      // Use the client-side utility to refresh data
      await refreshPricingPackages();

      // Invalidate and refetch the query
      await queryClient.invalidateQueries({ queryKey: ['pricingPackages'] });

      setSnackbarMessage('Pricing data refreshed successfully!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error refreshing data:', error);
      setSnackbarMessage('Failed to refresh pricing data. Please try again.');
      setSnackbarSeverity('error');
    }
  }, [queryClient]);

  // Use React Query to handle client-side data fetching and caching
  const { data: packages, isLoading, error } = useQuery<Package[]>({
    queryKey: ['pricingPackages'],
    queryFn: async () => {
      // Use the client-side utility to fetch data
      const data = await fetchPricingPackagesClient();
      return sortPackages(data);
    },
    // Use the server-provided initial data
    initialData: initialPackages && initialPackages.length > 0 ? initialPackages : undefined,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // If not authenticated, show login message
  if (!authenticated) {
    return (
      <Box className={styles.wrapper}>
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 4 }}>
          Pricing Packages
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Please sign in to view your personalized pricing packages
        </Alert>
      </Box>
    );
  }

  // If loading, show loading state
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

  // If error, show error message with retry button
  if (error && (!packages || packages.length === 0)) {
    return (
      <Box className={styles.wrapper}>
        <Alert
          severity="error"
          sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
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

  // Render the packages
  return (
    <div className={styles.wrapper}>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 4 }}>
        Pricing Packages
      </Typography>

      {/* Refresh button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
          packages.map((pkg) => (
            <PricingPackageCard
              key={pkg.id}
              packageData={pkg}
              onBuyNow={() => selectPackage(pkg)}
            />
          ))
        ) : (
          <div className={styles.message}>
            No pricing packages available at this time.
          </div>
        )}
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
