import Providers from '@/components/providers/Providers';
import { LoginFormProvider } from '@/contexts/LoginFormContext';
import './globals.css';
import Layout from '@/layouts/Layout';
import { CartProvider } from '@/contexts/CartContext';
import { handleRegistrationRedirect } from '@/utils/authUtils';
import DataPrefetcher from '@/components/cache/DataPrefetcher';

export const metadata = {
  title: 'Pisval Tech POS',
  description: 'Your POS application',
  // Add cache-related metadata
  other: {
    'cache-control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Handle registration redirects on the client side
  if (typeof window !== 'undefined') {
    handleRegistrationRedirect();
  }

  return (
    <html lang="en">
      <head></head>
      <body>
        <CartProvider>
          <LoginFormProvider>
            <Providers>
              <DataPrefetcher />
              <Layout>{children}</Layout>
            </Providers>
          </LoginFormProvider>
        </CartProvider>
      </body>
    </html>
  );
}
