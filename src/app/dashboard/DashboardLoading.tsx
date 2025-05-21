'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import styles from './DashboardLoading.module.css';

export default function DashboardLoading() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isMainDashboard = pathname === '/dashboard' || pathname === '/';

    const shouldHideLoading =
      isMainDashboard ||
      pathname?.includes('/checkout') ||
      !pathname?.includes('/dashboard') ||
      !pathname;

    setIsVisible(!shouldHideLoading);

    const timer = setTimeout(() => {
      if (shouldHideLoading) {
        setIsVisible(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  const containerClass = `${styles.loadingContainer} ${isVisible ? styles.visible : ''}`;

  return (
    <div className={containerClass} aria-hidden={!isVisible}>
      <Typography variant="h5">Loading dashboard data...</Typography>
    </div>
  );
}
