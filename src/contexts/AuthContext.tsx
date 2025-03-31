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
  login: async () => { },
  logout: async () => { },
  authenticated: false,
  error: null,
});

let isInitializing = false;
let isInitialized = false;

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const keycloakRef = useRef<KeycloakInstance>(keycloakInstance);

  const handleCleanLogout = useCallback(async () => {
    try {
      localStorage.removeItem('accessToken');
      setToken(null);

      const logoutRedirect = window.encodeURIComponent(
        process.env.NEXT_PUBLIC_LOGOUT_REDIRECT || window.location.origin + '/login'
      );
      console.log('Logout redirect URI:', logoutRedirect);


      const logoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/logout`;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = logoutUrl;

      const clientIdInput = document.createElement('input');
      clientIdInput.type = 'hidden';
      clientIdInput.name = 'client_id';
      clientIdInput.value = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || '';
      form.appendChild(clientIdInput);

      const redirectInput = document.createElement('input');
      redirectInput.type = 'hidden';
      redirectInput.name = 'post_logout_redirect_uri';
      redirectInput.value = process.env.NEXT_PUBLIC_LOGOUT_REDIRECT || window.location.origin + '/login';
      form.appendChild(redirectInput);


      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Manual logout failed:', err);
      window.location.href = process.env.NEXT_PUBLIC_LOGOUT_REDIRECT || '/login';
    }
  }, []);

  const login = useCallback(async () => {
    console.log('Login requested');
    try {
      const loginRedirect = process.env.NEXT_PUBLIC_LOGIN_REDIRECT || process.env.NEXT_PUBLIC_REDIRECT_URI;
      console.log('Using login redirect:', loginRedirect);

      await keycloakRef.current.login({
        redirectUri: loginRedirect,
      });
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed';
      if (err instanceof Error) {
        errorMessage = `Login failed: ${err.message}`;
      }
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    if (isInitializing || isInitialized) {
      console.log('Keycloak already initializing or initialized, skipping');
      if (isInitialized) {
        setInitialized(true);
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          setToken(storedToken);
        }
      }
      return;
    }



    isInitializing = true;

    const kc = keycloakRef.current;
    let refreshInterval: NodeJS.Timeout | null = null;

    const initializeAuth = async () => {
      console.log('Starting Keycloak initialization...');
      console.log('Environment variables:', {
        redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        loginRedirect: process.env.NEXT_PUBLIC_LOGIN_REDIRECT,
        logoutRedirect: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT,
      });

      try {
        const authenticated = await kc.init({
          onLoad: 'check-sso',
          redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
          checkLoginIframe: false,
          pkceMethod: 'S256',
          responseMode: 'query',
          enableLogging: true,
        });

        isInitialized = true;
        isInitializing = false;

        console.log('Keycloak initialized successfully:', {
          authenticated,
          hasToken: !!kc.token,
          tokenExpiry: kc.tokenParsed?.exp ? new Date(kc.tokenParsed.exp * 1000).toISOString() : 'unknown'
        });

        if (authenticated) {
          if (kc.token) {
            console.log('Setting token in state and localStorage');
            setToken(kc.token);
            localStorage.setItem('accessToken', kc.token);
          } else {
            console.warn('Authenticated but no token available');
          }

          setInitialized(true);

          refreshInterval = setInterval(async () => {
            try {
              console.log('Attempting token refresh');
              const refreshed = await kc.updateToken(70);
              if (refreshed && kc.token) {
                console.log('Token refreshed successfully');
                setToken(kc.token);
                localStorage.setItem('accessToken', kc.token);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              if (refreshInterval) clearInterval(refreshInterval);

              await handleCleanLogout();
            }
          }, 60000);
        } else {
          console.log('Not authenticated, redirecting to login');
          setInitialized(true);
          await login();
        }
      } catch (err) {
        console.error('Authentication Error Details:', err);
        isInitializing = false;

        let errorMessage = 'Unknown authentication error';

        if (err instanceof Error) {
          errorMessage = `Authentication error: ${err.message}`;
        } else if (typeof err === 'object' && err !== null) {
          try {
            errorMessage = `Authentication error: ${JSON.stringify(err)}`;
          } catch {
            errorMessage = 'Authentication error: Non-serializable error object';
          }
        }

        console.error('Final error message:', errorMessage);
        setError(errorMessage);
        localStorage.removeItem('accessToken');
        setInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      if (refreshInterval) {
        console.log('Cleaning up refresh interval');
        clearInterval(refreshInterval);
      }
    };
  }, [handleCleanLogout, login]);

  const logout = useCallback(async () => {
    console.log('Logout requested');
    await handleCleanLogout();
  }, [handleCleanLogout]);

  const contextValue = {
    token,
    login,
    logout,
    authenticated: !!token,
    error,
  };

  if (error) {
    return (
      <div className="auth-error p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h3 className="font-bold mb-2">Authentication Error</h3>
        <p>{error}</p>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setError(null);
            login();
          }}
        >
          Retry Login
        </button>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="auth-loading p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Initializing authentication...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;