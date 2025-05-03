'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/axiosClient';

const AfterAuth = () => {
  const router = useRouter();
  const [status, setStatus] = useState(
    'Initializing authentication...'
  );

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      15000
    );

    const exchangeCodeForToken = async () => {
      const params = new URLSearchParams(
        window.location.search
      );
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        console.error(
          'Auth error:',
          params.toString()
        );
        router.replace(
          `/?error=${encodeURIComponent(error)}`
        );
        return;
      }

      if (!code) {
        console.log(
          'No authorization code found, redirecting to home page'
        );
        router.replace('/');
        return;
      }

      try {
        setStatus(
          'Exchanging authorization code...'
        );
        const response = await apiClient.post(
          '/auth/keycloak/callback',
          { code },
          {
            signal: controller.signal,
            suppressAuthErrors: true,
          }
        );

        if (response.data?.accessToken) {
          setStatus('Authentication successful!');
          localStorage.setItem(
            'accessToken',
            response.data.accessToken
          );
          router.replace('/dashboard');
        } else {
          throw new Error(
            'Invalid server response'
          );
        }
      } catch (err) {
        console.error(
          'Token exchange error:',
          err
        );
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'exchange_failed';
        router.replace(
          `/?error=${encodeURIComponent(errorMessage)}`
        );
      } finally {
        clearTimeout(timeout);
      }
    };
    exchangeCodeForToken();

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="auth-processing">
      <div className="spinner"></div>
      <p>{status}</p>
    </div>
  );
};

export default AfterAuth;
