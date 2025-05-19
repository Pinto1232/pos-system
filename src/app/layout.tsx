import Providers from '@/components/providers/Providers';
import { LoginFormProvider } from '@/contexts/LoginFormContext';
import './globals.css';
import Layout from '@/layouts/Layout';
import { CartProvider } from '@/contexts/CartContext';
import { handleRegistrationRedirect } from '@/utils/authUtils';
import DataPrefetcher from '@/components/cache/DataPrefetcher';

import LazyLoadInitializer from '@/components/performance/LazyLoadInitializer';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';

export const metadata = {
  title: 'Pisval Tech POS',
  description: 'Your POS application',

  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#4285f4',

  other: {
    'cache-control':
      'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== 'undefined') {
    handleRegistrationRedirect();
  }

  return (
    <html lang="en">
      <head>
        {}
        {}
        <link rel="preconnect" href="https://example.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        <CartProvider>
          <LoginFormProvider>
            <Providers>
              <DataPrefetcher />
              <Layout>{children}</Layout>
              <LazyLoadInitializer />
              <PerformanceMonitor />
            </Providers>
          </LoginFormProvider>
        </CartProvider>
      </body>
    </html>
  );
}
