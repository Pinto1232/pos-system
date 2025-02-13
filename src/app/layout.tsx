// This is a server component.
import Providers from '@/components/providers/Providers';
import './globals.css';
import Layout from '@/layouts/Layout';

export const metadata = {
  title: 'Pisval Tech POS ',
  description: 'Your POS application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>{/* Meta tags etc. */}</head>
      <body>
      <Providers>
          <Layout>{children}</Layout> 
        </Providers>
      </body>
    </html>
  );
}
