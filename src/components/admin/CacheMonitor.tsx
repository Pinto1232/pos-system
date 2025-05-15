'use client';

import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { setupCacheListeners } from '@/utils/cacheUtils';

interface CacheEntry {
  key: string;
  status: 'fresh' | 'stale' | 'fetching';
  lastUpdated: Date;
  dataSize: string;
}

/**
 * Component for monitoring cache status
 * This is useful for debugging and understanding cache behavior
 */
export default function CacheMonitor() {
  const queryClient = useQueryClient();
  const [cacheEntries, setCacheEntries] =
    useState<CacheEntry[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [lastRefreshed, setLastRefreshed] =
    useState<Date>(new Date());

  // Helper function to format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(
      Math.log(bytes) / Math.log(k)
    );

    return (
      parseFloat(
        (bytes / Math.pow(k, i)).toFixed(2)
      ) +
      ' ' +
      sizes[i]
    );
  };

  // Function to refresh cache data
  const refreshCacheData = useCallback(() => {
    setIsLoading(true);

    // Get all queries from the cache
    const queries = queryClient
      .getQueryCache()
      .getAll();

    // Map queries to cache entries
    const entries: CacheEntry[] = queries.map(
      (query) => {
        // Get the query key as a string
        const key = JSON.stringify(
          query.queryKey
        );

        // Determine the status
        let status: CacheEntry['status'] =
          'fresh';
        if (query.isStale()) {
          status = 'stale';
        }
        if (
          query.state.fetchStatus === 'fetching'
        ) {
          status = 'fetching';
        }

        // Get the last updated time
        const lastUpdated = new Date(
          query.state.dataUpdatedAt
        );

        // Estimate the data size
        let dataSize = 'Unknown';
        try {
          const data = query.state.data;
          if (data) {
            const jsonSize =
              JSON.stringify(data).length;
            dataSize = formatBytes(jsonSize);
          }
        } catch (error) {
          console.error(
            'Error calculating data size:',
            error
          );
        }

        return {
          key,
          status,
          lastUpdated,
          dataSize,
        };
      }
    );

    // Sort entries by last updated time (newest first)
    entries.sort(
      (a, b) =>
        b.lastUpdated.getTime() -
        a.lastUpdated.getTime()
    );

    setCacheEntries(entries);
    setLastRefreshed(new Date());
    setIsLoading(false);
  }, [queryClient]);

  // Set up cache listeners and initial data load
  useEffect(() => {
    // Set up listeners for cache changes
    const unsubscribe =
      setupCacheListeners(queryClient);

    // Load initial cache data
    refreshCacheData();

    // Set up interval to refresh cache data
    const interval = setInterval(
      refreshCacheData,
      5000
    );

    // Clean up
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [queryClient, refreshCacheData]);

  // Helper function to format relative time
  const formatRelativeTime = (
    date: Date
  ): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);

    if (diffSec < 60) {
      return `${diffSec} sec ago`;
    }

    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) {
      return `${diffMin} min ago`;
    }

    const diffHour = Math.round(diffMin / 60);
    if (diffHour < 24) {
      return `${diffHour} hour ago`;
    }

    const diffDay = Math.round(diffHour / 24);
    return `${diffDay} day ago`;
  };

  // Define the possible chip colors
  type ChipColor =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';

  // Get status color
  const getStatusColor = (
    status: CacheEntry['status']
  ): ChipColor => {
    switch (status) {
      case 'fresh':
        return 'success';
      case 'stale':
        return 'warning';
      case 'fetching':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">
          Cache Monitor
        </Typography>

        <Box>
          <Typography
            variant="caption"
            sx={{ mr: 2 }}
          >
            Last refreshed:{' '}
            {formatRelativeTime(lastRefreshed)}
          </Typography>

          <Button
            size="small"
            variant="outlined"
            onClick={refreshCacheData}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              'Refresh'
            )}
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cache Key</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Data Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                >
                  <CircularProgress
                    size={24}
                    sx={{ my: 2 }}
                  />
                </TableCell>
              </TableRow>
            ) : cacheEntries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                >
                  No cache entries found
                </TableCell>
              </TableRow>
            ) : (
              cacheEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.key}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entry.status}
                      size="small"
                      color={getStatusColor(
                        entry.status
                      )}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {formatRelativeTime(
                      entry.lastUpdated
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.dataSize}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
