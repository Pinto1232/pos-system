'use client';

import React, { useState, useCallback, memo } from 'react';
import DashboardLayout from '@/components/dashboard-layout/DashboardLayout';

const DashboardContainer = memo(() => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen((prevState) => !prevState);
  }, []);

  return (
    <DashboardLayout
      isDrawerOpen={isDrawerOpen}
      onDrawerToggle={handleDrawerToggle}
      backgroundColor="#1E3A8A"
      textColor="#FFFFFF"
      iconColor="#FFFFFF"
      navbarBgColor="#1F2937"
    />
  );
});

DashboardContainer.displayName = 'DashboardContainer';

export default DashboardContainer;
