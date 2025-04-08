'use client';

import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  DefaultOptions,
} from '@tanstack/react-query';
import AuthProvider from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { AxiosError } from 'axios';

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
    gcTime: 10 * 60 * 1000,
  },
};

const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

queryClient.getQueryCache().subscribe((event) => {
  if (
    event?.query.getObserversCount() > 0 &&
    event.query.state.status === 'error'
  ) {
    console.error(
      'A query error occurred:',
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
    <AuthProvider>
      <ProductProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
