'use client';
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const keycloakRef = useRef<KeycloakInstance>(keycloakInstance);

  // Main initialization effect
  useEffect(() => {
    const kc = keycloakRef.current;
    let refreshInterval: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        const authenticated = await kc.init({
          onLoad: 'login-required',
          redirectUri: 'http://localhost:7005/',
          checkLoginIframe: false,
          pkceMethod: 'S256',
          responseMode: 'query',
          enableLogging: true
        });

        if (authenticated) {
          await handleSuccessfulAuth(kc);
        } else {
          await kc.login();
        }
      } catch (err) {
        handleAuthError(err);
      }
    };

    const handleSuccessfulAuth = async (kc: KeycloakInstance) => {
      if (kc.token) {
        setToken(kc.token);
        localStorage.setItem('accessToken', kc.token);
        setInitialized(true);
        startTokenRefresh(kc);
      }
    };

    const startTokenRefresh = (kc: KeycloakInstance) => {
      refreshInterval = setInterval(async () => {
        try {
          const refreshed = await kc.updateToken(70);
          if (refreshed && kc.token) {
            setToken(kc.token);
            localStorage.setItem('accessToken', kc.token);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          await kc.logout();
          setError('Session expired. Please login again.');
        }
      }, 60000);
    };

    const handleAuthError = (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
      console.error('Authentication Error:', errorMessage);
      setError(errorMessage);
      localStorage.removeItem('accessToken');
      setInitialized(true);
    };

    if (!initialized) {
      initializeAuth();
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [initialized]);

  const login = useCallback(async () => {
    try {
      await keycloakRef.current.login({
        redirectUri: 'http://localhost:3000/dashboard'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await keycloakRef.current.logout({
        redirectUri: 'http://localhost:3000/login'
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
    error
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