'use client';

import React, { useEffect } from 'react';
import DashboardContainer from '@/components/dashboard-layout/DashboardContainer';
import { useSpinner } from '@/contexts/SpinnerContext';
import { updateLoginStatus } from '@/api/userManagementApi';

const Dashboard = () => {
  const { stopLoading } = useSpinner();

  useEffect(() => {
    const isFreshLogin =
      sessionStorage.getItem('freshLogin') ===
      'true';

    if (isFreshLogin) {
      sessionStorage.removeItem('freshLogin');

      // Update login status in the database
      console.log(
        '[DEBUG] Attempting to update login status from Dashboard'
      );
      updateLoginStatus()
        .then((result) => {
          console.log(
            '[DEBUG] Dashboard login status update response:',
            result
          );
        })
        .catch((error) => {
          console.error(
            '[DEBUG] Failed to update login status from Dashboard:',
            error
          );
          // Don't block dashboard loading if this fails
        });

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
