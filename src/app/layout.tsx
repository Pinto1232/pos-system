// This is a server component.
import Providers from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'POS Frontend',
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
