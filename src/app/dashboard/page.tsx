'use client';

import React, { useEffect } from 'react';
import DashboardContainer from '@/components/dashboard-layout/DashboardContainer';
import { useSpinner } from '@/contexts/SpinnerContext';

const Dashboard = () => {
  const { stopLoading } = useSpinner();

  useEffect(() => {
    const isFreshLogin =
      sessionStorage.getItem('freshLogin') ===
      'true';

    if (isFreshLogin) {
      sessionStorage.removeItem('freshLogin');

      const loadingTimeout = setTimeout(() => {
        stopLoading();
      }, 3000);

      return () => clearTimeout(loadingTimeout);
    } else {
      stopLoading();
    }
  }, [stopLoading]);

  return <DashboardContainer />;
};

export default Dashboard;
