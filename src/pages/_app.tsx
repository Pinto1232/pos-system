// pages/_app.tsx
/* eslint-disable react/react-in-jsx-scope */
import { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/queryClient'; // Adjust the path if necessary
import { AuthProvider } from '@/context/AuthContext'; // Ensure the path is correct
import Layout from '@/components/globalLayout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;