'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {
  invalidateAddOnsQueries,
  refetchAddOnsQueries,
  resetEntireCache,
} from '@/utils/cacheUtils';

interface CacheControlProps {
  variant?: 'minimal' | 'full';
  onSuccess?: () => void;
}

/**
 * A component that provides controls for managing the application's cache
 * Can be used to help users resolve caching issues
 */
const CacheControl: React.FC<
  CacheControlProps
> = ({ variant = 'minimal', onSuccess }) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [isResetting, setIsResetting] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] =
    useState(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<'success' | 'error'>('success');

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      // Invalidate AddOns queries first
      invalidateAddOnsQueries(queryClient);
      // Then force a refetch
      await refetchAddOnsQueries(queryClient);

      setSnackbarMessage(
        'Data refreshed successfully'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        'Error refreshing data:',
        error
      );
      setSnackbarMessage(
        'Failed to refresh data'
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResetCache = async () => {
    try {
      setIsResetting(true);
      // Reset the entire cache
      await resetEntireCache(queryClient);

      setSnackbarMessage(
        'Cache reset successfully'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        'Error resetting cache:',
        error
      );
      setSnackbarMessage('Failed to reset cache');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsResetting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <>
        <Button
          startIcon={
            isRefreshing ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              <RefreshIcon />
            )
          }
          onClick={handleRefreshData}
          disabled={isRefreshing || isResetting}
          size="small"
          color="primary"
        >
          Refresh Data
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Cache Control
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        paragraph
      >
        If you're experiencing issues with data
        not updating, you can try refreshing the
        data or resetting the cache.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={
            isRefreshing ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              <RefreshIcon />
            )
          }
          onClick={handleRefreshData}
          disabled={isRefreshing || isResetting}
        >
          Refresh Data
        </Button>
        <Button
          variant="outlined"
          color="warning"
          startIcon={
            isResetting ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              <DeleteSweepIcon />
            )
          }
          onClick={handleResetCache}
          disabled={isRefreshing || isResetting}
        >
          Reset Cache
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CacheControl;
