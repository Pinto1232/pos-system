import React from 'react';
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
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

interface CacheManagementContentProps {
  cacheDuration: string;
  setCacheDuration: (duration: string) => void;
  autoRefreshOnFocus: boolean;
  setAutoRefreshOnFocus: (refresh: boolean) => void;
  prefetchImportantData: boolean;
  setPrefetchImportantData: (prefetch: boolean) => void;
}

/**
 * Component for cache management settings content
 */
const CacheManagementContent: React.FC<CacheManagementContentProps> = ({
  cacheDuration,
  setCacheDuration,
  autoRefreshOnFocus,
  setAutoRefreshOnFocus,
  prefetchImportantData,
  setPrefetchImportantData,
}) => {
  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cacheDuration', cacheDuration);
      localStorage.setItem('autoRefreshOnFocus', autoRefreshOnFocus.toString());
      localStorage.setItem('prefetchImportantData', prefetchImportantData.toString());
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cache Management
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Cache Settings
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1">Cache Duration (ms):</Typography>
                <TextField
                  type="number"
                  value={cacheDuration}
                  onChange={(e) => setCacheDuration(e.target.value)}
                  size="small"
                  sx={{ width: 150 }}
                  InputProps={{
                    endAdornment: <Typography variant="caption">ms</Typography>,
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                How long data should be cached before being refreshed (in milliseconds)
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefreshOnFocus}
                    onChange={(e) => setAutoRefreshOnFocus(e.target.checked)}
                  />
                }
                label="Auto-refresh data when window regains focus"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={prefetchImportantData}
                    onChange={(e) => setPrefetchImportantData(e.target.checked)}
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
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Cache Status
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">Products Data</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption">85%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
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
              <Typography variant="body2">Sales Data</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={42}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption">42%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
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
              <Typography variant="body2">Customer Data</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={93}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption">93%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
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
              <Typography variant="body2">Inventory Data</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={67}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption">67%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
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
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Cache Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Refresh All Caches
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Clear All Caches
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CacheManagementContent;
