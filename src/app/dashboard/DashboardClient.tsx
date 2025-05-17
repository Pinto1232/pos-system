'use client';

import React, { useEffect, useContext, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import DashboardContainer from '@/components/dashboard-layout/DashboardContainer';
import { useSpinner } from '@/contexts/SpinnerContext';
import { useQueryClient } from '@tanstack/react-query';

import { UserSubscriptionData } from './types';
import DashboardLoading from './DashboardLoading';
import { DashboardSummary } from './DashboardDataFetcher';

interface DashboardClientProps {
  initialSubscriptionData?: UserSubscriptionData | null;
  initialDashboardData?: DashboardSummary | null;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  initialSubscriptionData,
  initialDashboardData,
}) => {
  const queryClient = useQueryClient();
  const { stopLoading } = useSpinner();
  const { isInitialized } = useContext(AuthContext);

  const [authStatus, setAuthStatus] = useState({
    isChecking: true,
    isAuthorized: false,
    errorMessage: '',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paymentStatus, setPaymentStatus] = useState({
    isChecking: true,
    isPaid: initialSubscriptionData?.isActive || false,
    errorMessage: '',
  });

  // Use useMemo to read from sessionStorage only once during initial render
  // const isFromPayment = useMemo(() => {
  //   if (typeof window === 'undefined') return false;

  useEffect(() => {
    if (!isInitialized) return;

    console.log(
      '⚠️ WARNING: Client-side authentication check is temporarily disabled for development'
    );
    console.log('⚠️ This should be re-enabled before deploying to production');

    setAuthStatus({
      isChecking: false,
      isAuthorized: true,
      errorMessage: '',
    });

    setPaymentStatus({
      isChecking: false,
      isPaid: true,
      errorMessage: '',
    });

    /* ORIGINAL AUTHENTICATION CODE - COMMENTED OUT TEMPORARILY
    // Handle payment success case
    if (isFromPayment) {
      setAuthStatus({
        isChecking: false,
        isAuthorized: true,
        errorMessage: ''
      });
      setPaymentStatus({
        isChecking: false,
        isPaid: true,
        errorMessage: ''
      });

      // Clean up the payment success flag after authentication is complete
      if (typeof window !== 'undefined') {
        const cleanupTimeout = setTimeout(() => {
          sessionStorage.removeItem('fromPaymentSuccess');
        }, 1000);
        return () => clearTimeout(cleanupTimeout);
      }
      return;
    }


    if (!authenticated || !token) {
      setAuthStatus({
        isChecking: false,
        isAuthorized: false,
        errorMessage: 'You must be logged in to access the dashboard'
      });
      router.replace('/?error=You must be logged in to access the dashboard');
      return;
    }


    const processAuth = async () => {
      try {
        let userId: string | null = null;
        let roles: string[] = [];


        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        userId = payload.sub || payload.userId || null;


        if (payload.realm_access && Array.isArray(payload.realm_access.roles)) {
          roles = [...payload.realm_access.roles] as string[];
        }

        if (payload.roles && Array.isArray(payload.roles)) {
          roles = [...roles, ...payload.roles] as string[];
        }

        if (payload.resource_access) {
          const clientIds = Object.keys(payload.resource_access);
          for (const clientId of clientIds) {
            const clientRoles = payload.resource_access[clientId]?.roles;
            if (Array.isArray(clientRoles)) {
              roles = [...roles, ...clientRoles] as string[];
            }
          }
        }


        const hasRequiredRole = roles.includes('dashboard') ||
                               roles.includes('admin') ||
                               roles.includes('user') ||
                               roles.length === 0;

        if (!hasRequiredRole) {
          setAuthStatus({
            isChecking: false,
            isAuthorized: false,
            errorMessage: 'You do not have permission to access the dashboard'
          });
          router.replace('/?error=You do not have permission to access the dashboard');
          return;
        }


        setAuthStatus({
          isChecking: false,
          isAuthorized: true,
          errorMessage: ''
        });

        // Check payment status if we have a user ID and no initial data
        if (!userId) {
          setPaymentStatus({
            isChecking: false,
            isPaid: true,
            errorMessage: ''
          });
          return;
        }

        // If we have initial data from the server, use it
        if (initialSubscriptionData) {
          setPaymentStatus({
            isChecking: false,
            isPaid: initialSubscriptionData.isActive,
            errorMessage: initialSubscriptionData.isActive ? '' :
              'Dashboard access requires a successful payment. Please complete your payment.'
          });

          if (!initialSubscriptionData.isActive) {
            router.replace('/checkout?error=Dashboard access requires a successful payment. Please complete your payment.');
          }
          return;
        }

        // Otherwise fetch from client-side
        try {
          const res = await fetch(`/api/UserSubscription/user/${userId}`);

          if (!res.ok) {
            if (res.status === 404) {
              setPaymentStatus({ isChecking: false, isPaid: true, errorMessage: '' });
              return;
            }
            throw new Error(`Failed to verify payment status: ${res.status}`);
          }

          const data = await res.json();

          if (data.isActive === true) {
            setPaymentStatus({ isChecking: false, isPaid: true, errorMessage: '' });
          } else {
            setPaymentStatus({
              isChecking: false,
              isPaid: false,
              errorMessage: 'Dashboard access requires a successful payment. Please complete your payment.'
            });
            router.replace('/checkout?error=Dashboard access requires a successful payment. Please complete your payment.');
          }
        } catch {
          // Assume paid on error for better user experience
          setPaymentStatus({
            isChecking: false,
            isPaid: true,
            errorMessage: ''
          });
        }
      } catch (error: unknown) {
        // Log the error for debugging purposes
        console.error(
  'Authentication error:',
  JSON.stringify(error, null, 2)
);

        // Create a more specific error message if possible
        const errorMessage = error instanceof Error
          ? `Authentication error: ${error.message}`
          : 'Authentication error. Please log in again.';

        setAuthStatus({
          isChecking: false,
          isAuthorized: false,
          errorMessage
        });
        router.replace(`/?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    processAuth();
    */
  }, [isInitialized, setAuthStatus, setPaymentStatus]);

  // Initialize dashboard data in React Query cache
  useEffect(() => {
    if (initialDashboardData) {
      queryClient.setQueryData(['dashboardSummary'], initialDashboardData);
    }

    if (initialSubscriptionData) {
      queryClient.setQueryData(
        ['userSubscription', initialSubscriptionData.userId],
        initialSubscriptionData
      );
    }
  }, [initialDashboardData, initialSubscriptionData, queryClient]);

  useEffect(() => {
    if (!isInitialized) return;

    const isFreshLogin =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('freshLogin') === 'true';

    if (isFreshLogin) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('freshLogin');
      }

      const loadingTimeout = setTimeout(() => {
        stopLoading();
      }, 3000);

      return () => clearTimeout(loadingTimeout);
    } else {
      const loadingTimeout = setTimeout(() => {
        stopLoading();
      }, 100);

      return () => clearTimeout(loadingTimeout);
    }
  }, [isInitialized, stopLoading]);

  console.log(
    '⚠️ WARNING: Dashboard rendering check is temporarily disabled for development'
  );

  if (!isInitialized) {
    return <DashboardLoading />;
  }

  return <DashboardContainer />;
};

export default DashboardClient;
