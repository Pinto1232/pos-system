'use client';

import React, { ErrorInfo } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  Collapse,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface DashboardErrorProps {
  error: Error;
  errorInfo?: ErrorInfo | null;
  reset: () => void;
}

/**
 * Error component for the dashboard
 * This is a Client Component as it uses MUI components and client-side navigation
 *
 * Enhanced to:
 * - Display detailed error information
 * - Support cache revalidation
 * - Provide better debugging information
 */
export default function DashboardError({
  error,
  errorInfo,
  reset,
}: DashboardErrorProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] =
    useState(false);

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
        >
          Error loading dashboard
        </Typography>
        <Typography variant="body1">
          {error.message}
        </Typography>
      </Alert>

      {/* Error details (expandable) */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="text"
          color="info"
          size="small"
          onClick={() =>
            setShowDetails(!showDetails)
          }
          sx={{ mb: 1 }}
        >
          {showDetails ? 'Hide' : 'Show'}{' '}
          Technical Details
        </Button>

        <Collapse in={showDetails}>
          <Paper
            sx={{
              p: 2,
              bgcolor: '#f5f5f5',
              overflowX: 'auto',
            }}
          >
            <Typography
              variant="subtitle2"
              color="error"
              gutterBottom
            >
              Error: {error.name}
            </Typography>

            <Typography
              variant="body2"
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                fontSize: '0.8rem',
              }}
            >
              {error.stack || error.message}
            </Typography>

            {errorInfo && (
              <>
                <Typography
                  variant="subtitle2"
                  color="error"
                  sx={{ mt: 2 }}
                  gutterBottom
                >
                  Component Stack:
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.8rem',
                  }}
                >
                  {errorInfo.componentStack}
                </Typography>
              </>
            )}
          </Paper>
        </Collapse>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        paragraph
      >
        This error might be caused by stale data.
        Try refreshing to get the latest content.
      </Typography>

      <Box
        sx={{ display: 'flex', gap: 2, mt: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={reset}
        >
          Refresh and Try Again
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push('/')}
        >
          Return to Home
        </Button>
      </Box>
    </Box>
  );
}
