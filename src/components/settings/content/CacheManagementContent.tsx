import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useQueryClient } from '@tanstack/react-query';
import {
  resetEntireCache,
  refreshCommonPageCaches,
} from '@/utils/cacheUtils';
import { revalidateAllCacheAction } from '@/utils/cacheRevalidation';

interface CacheManagementContentProps {
  cacheDuration: string;
  setCacheDuration: (duration: string) => void;
  autoRefreshOnFocus: boolean;
  setAutoRefreshOnFocus: (
    refresh: boolean
  ) => void;
  prefetchImportantData: boolean;
  setPrefetchImportantData: (
    prefetch: boolean
  ) => void;
}

/**
 * Component for cache management settings content
 */
const CacheManagementContent: React.FC<
  CacheManagementContentProps
> = ({
  cacheDuration,
  setCacheDuration,
  autoRefreshOnFocus,
  setAutoRefreshOnFocus,
  prefetchImportantData,
  setPrefetchImportantData,
}) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [isClearing, setIsClearing] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] =
    useState(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<
      'success' | 'error' | 'info' | 'warning'
    >('success');

  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'cacheDuration',
        cacheDuration
      );
      localStorage.setItem(
        'autoRefreshOnFocus',
        autoRefreshOnFocus.toString()
      );
      localStorage.setItem(
        'prefetchImportantData',
        prefetchImportantData.toString()
      );

      setSnackbarMessage(
        'Cache settings saved successfully'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const handleRefreshAllCaches = async () => {
    try {
      setIsRefreshing(true);
      console.log(
        '[CACHE-UI] Starting cache refresh operation'
      );

      // Specifically invalidate pricing packages first
      console.log(
        '[CACHE-UI] Specifically invalidating pricing packages cache'
      );
      queryClient.invalidateQueries({
        queryKey: ['pricingPackages'],
        refetchType: 'all',
      });

      // Revalidate all cache data including home page and dashboard
      console.log(
        '[CACHE-UI] Calling revalidateAllCacheAction'
      );
      await revalidateAllCacheAction();

      // Refresh home page and common page caches
      console.log(
        '[CACHE-UI] Calling refreshCommonPageCaches'
      );
      await refreshCommonPageCaches(queryClient);

      // Force a direct fetch to the pricing packages API with cache-busting
      console.log(
        '[CACHE-UI] Directly fetching pricing packages with cache-busting'
      );
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(
          `/api/pricing-packages?refresh=true&t=${timestamp}`,
          {
            method: 'GET',
            headers: {
              'Cache-Control':
                'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
          }
        );

        if (response.ok) {
          console.log(
            '[CACHE-UI] Successfully fetched fresh pricing packages data'
          );
        } else {
          console.warn(
            '[CACHE-UI] Failed to fetch fresh pricing packages data:',
            response.status
          );
        }
      } catch (fetchError) {
        console.error(
          '[CACHE-UI] Error fetching pricing packages:',
          fetchError
        );
      }

      // Refetch all active queries in React Query
      console.log(
        '[CACHE-UI] Refetching all active queries'
      );
      await queryClient.refetchQueries();

      console.log(
        '[CACHE-UI] Cache refresh operation completed successfully'
      );
      setSnackbarMessage(
        'All caches refreshed successfully'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        '[CACHE-UI] Error refreshing caches:',
        error
      );
      setSnackbarMessage(
        'Failed to refresh caches'
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearAllCaches = async () => {
    try {
      setIsClearing(true);
      console.log(
        '[CACHE-UI] Starting cache clear operation'
      );

      // Specifically invalidate pricing packages first
      console.log(
        '[CACHE-UI] Specifically invalidating pricing packages cache before full clear'
      );
      queryClient.invalidateQueries({
        queryKey: ['pricingPackages'],
        refetchType: 'all',
      });

      // Clear React Query cache
      console.log(
        '[CACHE-UI] Calling resetEntireCache'
      );
      await resetEntireCache(queryClient);

      // Revalidate all cache data to ensure fresh data is fetched
      console.log(
        '[CACHE-UI] Calling revalidateAllCacheAction'
      );
      await revalidateAllCacheAction();

      // Refresh home page and common page caches
      console.log(
        '[CACHE-UI] Calling refreshCommonPageCaches'
      );
      await refreshCommonPageCaches(queryClient);

      // Force a direct fetch to the pricing packages API with cache-busting
      console.log(
        '[CACHE-UI] Directly fetching pricing packages with cache-busting'
      );
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(
          `/api/pricing-packages?refresh=true&t=${timestamp}`,
          {
            method: 'GET',
            headers: {
              'Cache-Control':
                'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
          }
        );

        if (response.ok) {
          console.log(
            '[CACHE-UI] Successfully fetched fresh pricing packages data after clear'
          );
        } else {
          console.warn(
            '[CACHE-UI] Failed to fetch fresh pricing packages data after clear:',
            response.status
          );
        }
      } catch (fetchError) {
        console.error(
          '[CACHE-UI] Error fetching pricing packages after clear:',
          fetchError
        );
      }

      console.log(
        '[CACHE-UI] Cache clear operation completed successfully'
      );
      setSnackbarMessage(
        'All caches cleared successfully'
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        '[CACHE-UI] Error clearing caches:',
        error
      );
      setSnackbarMessage(
        'Failed to clear caches'
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsClearing(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cache Management
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
        >
          Cache Settings
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="body1">
                  Cache Duration (ms):
                </Typography>
                <TextField
                  type="number"
                  value={cacheDuration}
                  onChange={(e) =>
                    setCacheDuration(
                      e.target.value
                    )
                  }
                  size="small"
                  sx={{ width: 150 }}
                  InputProps={{
                    endAdornment: (
                      <Typography variant="caption">
                        ms
                      </Typography>
                    ),
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                How long data should be cached
                before being refreshed (in
                milliseconds)
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefreshOnFocus}
                    onChange={(e) =>
                      setAutoRefreshOnFocus(
                        e.target.checked
                      )
                    }
                  />
                }
                label="Auto-refresh data when window regains focus"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={
                      prefetchImportantData
                    }
                    onChange={(e) =>
                      setPrefetchImportantData(
                        e.target.checked
                      )
                    }
                  />
                }
                label="Prefetch important data for faster navigation"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  mt: 1,
                }}
              >
                Save Cache Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
        >
          Cache Status
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                Products Data
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 1,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 4,
                  }}
                />
                <Typography variant="caption">
                  85%
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Last updated: 5 minutes ago
                </Typography>
                <Chip
                  label="Fresh"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                Sales Data
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 1,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={42}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 4,
                  }}
                />
                <Typography variant="caption">
                  42%
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Last updated: 35 minutes ago
                </Typography>
                <Chip
                  label="Stale"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                Customer Data
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 1,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={93}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 4,
                  }}
                />
                <Typography variant="caption">
                  93%
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Last updated: 2 minutes ago
                </Typography>
                <Chip
                  label="Fresh"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                Inventory Data
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 1,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={67}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 4,
                  }}
                />
                <Typography variant="caption">
                  67%
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Last updated: 15 minutes ago
                </Typography>
                <Chip
                  label="Fresh"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
        >
          Cache Actions
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
            sx={{
              textTransform: 'none',
              borderRadius: 2,
            }}
            onClick={handleRefreshAllCaches}
            disabled={isRefreshing || isClearing}
          >
            Refresh All Caches
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={
              isClearing ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                />
              ) : (
                <DeleteSweepIcon />
              )
            }
            sx={{
              textTransform: 'none',
              borderRadius: 2,
            }}
            onClick={handleClearAllCaches}
            disabled={isRefreshing || isClearing}
          >
            Clear All Caches
          </Button>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CacheManagementContent;
