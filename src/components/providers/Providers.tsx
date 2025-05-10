'use client';

import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  DefaultOptions,
} from '@tanstack/react-query';
import AuthProvider from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { CustomizationProvider } from '@/contexts/CustomizationContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AxiosError } from 'axios';
import AuthWrapper from '@/contexts/AuthWrapper';

const defaultQueryOptions: DefaultOptions = {
  queries: {
    retry: (
      failureCount: number,
      error: unknown
    ) => {
      console.error(
        `Query failed (${failureCount} attempts):`,
        error
      );

      if (
        error instanceof AxiosError &&
        error.response?.status === 401
      ) {
        console.warn(
          'Unauthorized (401) - Redirecting to login...'
        );
        return false;
      }

      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: 2,
  },
};

const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

// Make queryClient globally available for prefetching
if (typeof window !== 'undefined') {
  window.queryClient = queryClient;
}

queryClient.getQueryCache().subscribe((event) => {
  if (
    event?.query.getObserversCount() > 0 &&
    event.query.state.status === 'error'
  ) {
    console.error(
      `Query error [${event.query.queryKey.join(',')}]:`,
      event.query.state.error
    );
  }
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <AuthWrapper>
            <ProductProvider>
              <CustomizationProvider userId="current-user">
                <QueryClientProvider
                  client={queryClient}
                >
                  <NotificationProvider>
                    {children}
                  </NotificationProvider>
                </QueryClientProvider>
              </CustomizationProvider>
            </ProductProvider>
          </AuthWrapper>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
