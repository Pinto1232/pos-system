import Providers from '@/components/providers/Providers';
import { LoginFormProvider } from '@/contexts/LoginFormContext';
import './globals.css';
import Layout from '@/layouts/Layout';
import { CartProvider } from '@/contexts/CartContext';
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
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#173a79" />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
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
