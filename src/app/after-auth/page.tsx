'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/api/axiosClient';

const AfterAuth = () => {
  const router = useRouter();
  const [status, setStatus] = useState('Initializing authentication...');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const exchangeCodeForToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        console.error('Auth error:', params.toString());
        router.replace(`/?error=${encodeURIComponent(error)}`);
        return;
      }

      if (!code) {
        console.log('No authorization code found, redirecting to home page');
        router.replace('/');
        return;
      }

      try {
        setStatus('Exchanging authorization code...');
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
          localStorage.setItem('accessToken', response.data.accessToken);
          router.replace('/');
        } else {
          throw new Error('Invalid server response');
        }
      } catch (err) {
        console.error('Token exchange error:', JSON.stringify(err, null, 2));
        const errorMessage =
          err instanceof Error ? err.message : 'exchange_failed';
        router.replace(`/?error=${encodeURIComponent(errorMessage)}`);
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e3e3e3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px',
        }}
      ></div>
      <p
        style={{
          fontSize: '18px',
          color: '#333',
          textAlign: 'center',
          margin: '0',
        }}
      >
        {status}
      </p>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AfterAuth;
