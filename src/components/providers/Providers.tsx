'use client';

import React from 'react';
import { QueryClient, QueryClientProvider, DefaultOptions } from '@tanstack/react-query';
import AuthProvider from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { CustomizationProvider } from '@/contexts/CustomizationContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AxiosError } from 'axios';
import AuthWrapper from '@/contexts/AuthWrapper';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { UserSubscriptionProvider } from '@/contexts/UserSubscriptionContext';

const defaultQueryOptions: DefaultOptions = {
  queries: {
    retry: (failureCount: number, error: unknown) => {
      console.error(`Query failed (${failureCount} attempts):`, JSON.stringify(error, null, 2));

      if (error instanceof AxiosError && error.response?.status === 401) {
        console.warn('Unauthorized (401) - Redirecting to login...');
        return false;
      }

      return failureCount < 3;
    },

    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },
  mutations: {
    retry: 2,
  },
};

const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

if (typeof window !== 'undefined') {
  window.queryClient = queryClient;
}

queryClient.getQueryCache().subscribe((event) => {
  if (event?.query.getObserversCount() > 0 && event.query.state.status === 'error') {
    console.error(`Query error [${event.query.queryKey.join(',')}]:`, event.query.state.error);
  }
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>
        <ProductProvider>
          <CustomizationProvider userId="current-user">
            <CurrencyProvider>
              <QueryClientProvider client={queryClient}>
                <UserSubscriptionProvider>
                  <NotificationProvider>{children}</NotificationProvider>
                </UserSubscriptionProvider>
              </QueryClientProvider>
            </CurrencyProvider>
          </CustomizationProvider>
        </ProductProvider>
      </AuthWrapper>
    </AuthProvider>
  );
}
