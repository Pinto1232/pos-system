'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function DashboardLoading() {
  const pathname = usePathname();

  const isMainDashboard = pathname === '/dashboard' || pathname === '/';

  if (isMainDashboard) {
    return null;
  }

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5">Loading dashboard data...</Typography>
    </Box>
  );
}
