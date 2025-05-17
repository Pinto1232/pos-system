'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

export default function DashboardLoading() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5">Loading dashboard data...</Typography>
    </Box>
  );
}
