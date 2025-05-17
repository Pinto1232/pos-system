import { Suspense } from 'react';
import { Box, Typography, Paper, Skeleton } from '@mui/material';
import CacheManager from '@/components/admin/CacheManager';
import CacheMonitor from '@/components/admin/CacheMonitor';
import { CACHE_TIMES, CACHE_TAGS } from '../../cache-constants';

function CachePageLoading() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cache Management
      </Typography>
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={300} />
    </Box>
  );
}

export default function CachePage() {
  return (
    <Suspense fallback={<CachePageLoading />}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Cache Management
        </Typography>

        <CacheManager />

        <CacheMonitor />

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Cache Configuration
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Cache Durations
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            {Object.entries(CACHE_TIMES).map(([key, value]) => (
              <Box component="li" key={key}>
                <Typography variant="body2">
                  <strong>{key}:</strong> {value} seconds ({Math.round(value / 60)} minutes)
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Cache Tags
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            {Object.entries(CACHE_TAGS).map(([key, value]) => (
              <Box component="li" key={key}>
                <Typography variant="body2">
                  <strong>{key}:</strong> {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Caching Documentation
          </Typography>

          <Typography variant="body2" paragraph>
            Our application uses Next.js&apos;s built-in caching mechanisms to optimize performance:
          </Typography>

          <Box component="ol" sx={{ pl: 3 }}>
            <Box component="li">
              <Typography variant="body2" gutterBottom>
                <strong>React Server Components Cache:</strong> Caches the rendered output of Server Components
              </Typography>
            </Box>

            <Box component="li">
              <Typography variant="body2" gutterBottom>
                <strong>Data Cache:</strong> Caches the results of fetch requests made in Server Components
              </Typography>
            </Box>

            <Box component="li">
              <Typography variant="body2" gutterBottom>
                <strong>Full Route Cache:</strong> Caches the rendered HTML of routes
              </Typography>
            </Box>

            <Box component="li">
              <Typography variant="body2" gutterBottom>
                <strong>Router Cache:</strong> Caches route payloads on the client for faster navigation
              </Typography>
            </Box>

            <Box component="li">
              <Typography variant="body2" gutterBottom>
                <strong>Request Memoization:</strong> Deduplicates fetch requests during rendering
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mt: 2 }}>
            For more detailed information, see the <code>CACHING.md</code> documentation file.
          </Typography>
        </Paper>
      </Box>
    </Suspense>
  );
}
