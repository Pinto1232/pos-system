import Providers from '@/components/providers/Providers';
import { LoginFormProvider } from '@/contexts/LoginFormContext';
import './globals.css';
import Layout from '@/layouts/Layout';
import { CartProvider } from '@/contexts/CartContext';

export const metadata = {
  title: 'Pisval Tech POS',
  description: 'Your POS application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <CartProvider>
          <LoginFormProvider>
            <Providers>
              <Layout>{children}</Layout>
            </Providers>
          </LoginFormProvider>
        </CartProvider>
      </body>
    </html>
  );
}
