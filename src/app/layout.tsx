import Providers from '@/components/providers/Providers';
import { LoginFormProvider } from '@/contexts/LoginFormContext';
import './globals.css';
import Layout from '@/layouts/Layout';

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
        <LoginFormProvider>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </LoginFormProvider>
      </body>
    </html>
  );
}
