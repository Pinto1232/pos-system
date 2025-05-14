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

    // Check if we're coming from the payment success page
    const fromPaymentSuccess =
      sessionStorage.getItem(
        'fromPaymentSuccess'
      ) === 'true';

    if (isFreshLogin || fromPaymentSuccess) {
      if (isFreshLogin) {
        sessionStorage.removeItem('freshLogin');
      }

      if (fromPaymentSuccess) {
        sessionStorage.removeItem(
          'fromPaymentSuccess'
        );
      }

      // Show loading for 3 seconds
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
