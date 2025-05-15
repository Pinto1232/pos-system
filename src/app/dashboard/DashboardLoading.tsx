'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Loading component for the dashboard
 * This is a Client Component as it uses MUI components which require client-side rendering
 */
export default function DashboardLoading() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5">
        Loading dashboard data...
      </Typography>
    </Box>
  );
}
