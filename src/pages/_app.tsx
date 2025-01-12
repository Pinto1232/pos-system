// pages/_app.tsx
import { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/queryClient'; // adjust path to match your setup

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
