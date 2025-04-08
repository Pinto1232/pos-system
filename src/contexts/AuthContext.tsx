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
import { Box, Typography } from '@mui/material';
import LoadingDots from '@/components/LoadingDots';

// Global flag to track Keycloak initialization
let keycloakInitialized = false;

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

  const handleCleanLogout = useCallback(async () => {
    try {
      localStorage.removeItem('accessToken');
      setToken(null);

      if (typeof window !== 'undefined') {
        const logoutRedirect = window.encodeURIComponent(
          process.env.NEXT_PUBLIC_LOGOUT_REDIRECT ||
            window.location.origin + '/login'
        );
        console.log('Logout redirect URI:', logoutRedirect);

        const logoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/logout`;

        const createFormInput = (name: string, value: string) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          return input;
        };

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = logoutUrl;
        form.appendChild(
          createFormInput(
            'client_id',
            process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || ''
          )
        );
        form.appendChild(
          createFormInput(
            'post_logout_redirect_uri',
            process.env.NEXT_PUBLIC_LOGOUT_REDIRECT ||
              window.location.origin + '/login'
          )
        );

        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      console.error('Manual logout failed:', err);
      if (typeof window !== 'undefined') {
        window.location.href =
          process.env.NEXT_PUBLIC_LOGOUT_REDIRECT || '/login';
      }
    }
  }, []);

  const login = useCallback(async () => {
    console.log('Login requested');
    try {
      if (typeof window !== 'undefined') {
        const loginRedirect =
          process.env.NEXT_PUBLIC_LOGIN_REDIRECT ||
          process.env.NEXT_PUBLIC_REDIRECT_URI;
        console.log('Using login redirect:', loginRedirect);

        await keycloakRef.current.login({
          redirectUri: loginRedirect,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err instanceof Error ? `Login failed: ${err.message}` : 'Login failed'
      );
    }
  }, []);

  const initializeAuth = useCallback(async (): Promise<() => void> => {
    if (typeof window === 'undefined') return () => {};

    const kc = keycloakRef.current;
    let refreshInterval: NodeJS.Timeout | null = null;

    // Clear any existing interval before starting a new one
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }

    console.log('Starting Keycloak initialization...');
    console.log('Environment variables:', {
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      loginRedirect: process.env.NEXT_PUBLIC_LOGIN_REDIRECT,
      logoutRedirect: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT,
    });

    const handleTokenRefresh = async () => {
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
        if (refreshInterval) {
          clearInterval(refreshInterval);
          refreshInterval = null;
        }
        await handleCleanLogout();
      }
    };

    try {
      const authenticated = await kc.init({
        onLoad: 'check-sso',
        redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        checkLoginIframe: false,
        pkceMethod: 'S256',
        responseMode: 'query',
        enableLogging: true,
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        silentCheckSsoFallback: false,
      });

      console.log('Redirect URI:', process.env.NEXT_PUBLIC_REDIRECT_URI);

      if (authenticated) {
        if (kc.token) {
          console.log('Setting token in state and localStorage');
          setToken(kc.token);
          localStorage.setItem('accessToken', kc.token);
        } else {
          console.warn('Authenticated but no token available');
        }

        setInitialized(true);

        // Set up token refresh with proper cleanup
        refreshInterval = setInterval(handleTokenRefresh, 60000);
      } else {
        console.log('Not authenticated, redirecting to login');
        setInitialized(true);
        await login();
      }
    } catch (err) {
      console.error('Authentication Error Raw:', err);
      let errorMessage = 'Unknown authentication error';
      console.error('Authentication Error:', err);

      if (err instanceof Error) {
        errorMessage = `Authentication error: ${err.message}`;
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = `Authentication error: ${JSON.stringify(err)}`;
        const kcError = err as {
          error?: string;
          error_description?: string;
        };
        if (kcError.error && kcError.error_description) {
          errorMessage = `Keycloak Error: ${kcError.error} - ${kcError.error_description}`;
        } else if (kcError.error) {
          errorMessage = `Keycloak Error: ${kcError.error}`;
        }
      }

      console.error('Final error message:', errorMessage);
      setError(errorMessage);
      localStorage.removeItem('accessToken');
      setInitialized(true);
    }

    return () => {
      if (refreshInterval) {
        console.log('Cleaning up refresh interval');
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
    };
  }, [handleCleanLogout, login]);

  useEffect(() => {
    if (!keycloakInitialized) {
      keycloakInitialized = true;
      const cleanupPromise = initializeAuth();

      return () => {
        cleanupPromise.then((cleanup) => cleanup());
      };
    } else {
      console.log('Keycloak already initialized, skipping');
      setInitialized(true);
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [initializeAuth]);

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6" color="error">
          Authentication Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!initialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          Initializing authentication
          <LoadingDots />
        </Typography>
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
