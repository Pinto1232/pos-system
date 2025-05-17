'use client';

import React, { useEffect, useState, useCallback } from 'react';
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

export default function CacheMonitor() {
  const queryClient = useQueryClient();
  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const refreshCacheData = useCallback(() => {
    setIsLoading(true);

    const queries = queryClient.getQueryCache().getAll();

    const entries: CacheEntry[] = queries.map((query) => {
      const key = JSON.stringify(query.queryKey);

      let status: CacheEntry['status'] = 'fresh';
      if (query.isStale()) {
        status = 'stale';
      }
      if (query.state.fetchStatus === 'fetching') {
        status = 'fetching';
      }

      const lastUpdated = new Date(query.state.dataUpdatedAt);

      let dataSize = 'Unknown';
      try {
        const data = query.state.data;
        if (data) {
          const jsonSize = JSON.stringify(data).length;
          dataSize = formatBytes(jsonSize);
        }
      } catch (error) {
        console.error('Error calculating data size:', JSON.stringify(error, null, 2));
      }

      return {
        key,
        status,
        lastUpdated,
        dataSize,
      };
    });

    entries.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

    setCacheEntries(entries);
    setLastRefreshed(new Date());
    setIsLoading(false);
  }, [queryClient]);

  useEffect(() => {
    const unsubscribe = setupCacheListeners(queryClient);

    refreshCacheData();

    const interval = setInterval(refreshCacheData, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [queryClient, refreshCacheData]);

  const formatRelativeTime = (date: Date): string => {
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

  type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

  const getStatusColor = (status: CacheEntry['status']): ChipColor => {
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
        <Typography variant="h6">Cache Monitor</Typography>

        <Box>
          <Typography variant="caption" sx={{ mr: 2 }}>
            Last refreshed: {formatRelativeTime(lastRefreshed)}
          </Typography>

          <Button size="small" variant="outlined" onClick={refreshCacheData} disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : 'Refresh'}
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
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={24} sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            ) : cacheEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
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
                    <Chip label={entry.status} size="small" color={getStatusColor(entry.status)} variant="outlined" />
                  </TableCell>
                  <TableCell>{formatRelativeTime(entry.lastUpdated)}</TableCell>
                  <TableCell>{entry.dataSize}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
