'use client';

import { useState } from 'react';
import { Button, Box, Typography, Paper, Grid, Alert, Snackbar } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {
  revalidatePathAction,
  revalidateTagAction,
  revalidatePricingPackagesAction,
  revalidateDashboardAction,
  revalidateAllCacheAction,
} from '@/utils/cacheRevalidation';

export default function CacheManager() {
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRevalidate = async (action: () => Promise<void>, successMessage: string) => {
    try {
      setIsRevalidating(true);
      setError(null);
      await action();
      setMessage(successMessage);
    } catch (err) {
      console.error('Error revalidating cache:', JSON.stringify(err, null, 2));
      setError('Failed to revalidate cache. See console for details.');
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        <CachedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Cache Management
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        Use these controls to manually revalidate cached data in the application. This is useful when you've made changes that should be
        immediately visible to users.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<RefreshIcon />}
            onClick={() => handleRevalidate(() => revalidatePricingPackagesAction(), 'Pricing packages cache revalidated successfully')}
            disabled={isRevalidating}
          >
            Refresh Pricing Packages
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<RefreshIcon />}
            onClick={() => handleRevalidate(() => revalidateDashboardAction(), 'Dashboard cache revalidated successfully')}
            disabled={isRevalidating}
          >
            Refresh Dashboard
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="outlined"
            color="warning"
            fullWidth
            startIcon={<DeleteSweepIcon />}
            onClick={() => handleRevalidate(() => revalidateAllCacheAction(), 'All cache data revalidated successfully')}
            disabled={isRevalidating}
          >
            Revalidate All Cache
          </Button>
        </Grid>
      </Grid>

      {}
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert onClose={() => setMessage(null)} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
