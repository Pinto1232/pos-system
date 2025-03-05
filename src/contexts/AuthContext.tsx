'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import { KeycloakInstance } from 'keycloak-js';
import keycloakInstance from '@/auth/keycloak';

export interface AuthContextProps {
  token: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authenticated: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: async () => {},
  logout: async () => {},
  authenticated: false,
  error: null,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const keycloakRef = useRef<KeycloakInstance>(keycloakInstance);

  useEffect(() => {
    const kc = keycloakRef.current;
    let refreshInterval: NodeJS.Timeout | null = null;

    const initializeAuth = async () => {
      try {
        const authenticated = await kc.init({
          onLoad: 'login-required',
          redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
          checkLoginIframe: false,
          pkceMethod: 'S256',
          responseMode: 'query',
          enableLogging: true,
        });

        console.log('Redirect URI:', process.env.NEXT_PUBLIC_REDIRECT_URI); // Log the redirect URI

        if (authenticated) {
          if (kc.token) {
            setToken(kc.token);
            localStorage.setItem('accessToken', kc.token);
          }
          setInitialized(true);

          // Start token refresh every minute using an arrow function
          refreshInterval = setInterval(async () => {
            try {
              const refreshed = await kc.updateToken(70);
              if (refreshed && kc.token) {
                setToken(kc.token);
                localStorage.setItem('accessToken', kc.token);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              await kc.logout({
                redirectUri: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT,
              });
              setError('Session expired. Please login again.');
            }
          }, 60000);
        } else {
          await kc.login();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown authentication error';
        console.error('Authentication Error:', errorMessage);
        console.error('Error details:', err); // Log the full error object for more details
        setError(errorMessage);
        localStorage.removeItem('accessToken');
        setInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  const login = useCallback(async () => {
    try {
      await keycloakRef.current.login({
        redirectUri: process.env.NEXT_PUBLIC_LOGIN_REDIRECT,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await keycloakRef.current.logout({
        redirectUri: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT,
      });
      localStorage.removeItem('accessToken');
      setToken(null);
      setInitialized(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
    }
  }, []);

  const contextValue = {
    token,
    login,
    logout,
    authenticated: !!token,
    error,
  };

  if (error) {
    return <div className="auth-error">Authentication Error: {error}</div>;
  }

  if (!initialized) {
    return <div className="auth-loading">Initializing authentication...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
