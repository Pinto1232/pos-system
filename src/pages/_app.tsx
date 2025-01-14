// pages/_app.tsx
import { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/queryClient'; // Adjust the path if necessary
import { AuthProvider } from '@/context/AuthContext'; // Ensure the path is correct

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
