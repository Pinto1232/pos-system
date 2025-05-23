'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { KeycloakInstance } from 'keycloak-js';
import keycloakInstance from '@/auth/keycloak';
import { isKeycloakError } from '@/types/keycloak';
import { validateAuthEnvVars } from '@/utils/envValidation';

const MAX_REFRESH_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const FALLBACK_CONFIG = {
  url: 'http://localhost:8282',
  realm: 'pisval-pos-realm',
  clientId: 'pos-backend',
  redirectUri: 'http://localhost:3000/after-auth',
  loginRedirect: 'http://localhost:3000/',
  logoutRedirect: 'http://localhost:3000/login',
};

const getKeycloakConfig = () => ({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || FALLBACK_CONFIG.url,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || FALLBACK_CONFIG.realm,
  clientId:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || FALLBACK_CONFIG.clientId,
  redirectUri:
    process.env.NEXT_PUBLIC_REDIRECT_URI || FALLBACK_CONFIG.redirectUri,
  loginRedirect:
    process.env.NEXT_PUBLIC_LOGIN_REDIRECT || FALLBACK_CONFIG.loginRedirect,
  logoutRedirect:
    process.env.NEXT_PUBLIC_LOGOUT_REDIRECT || FALLBACK_CONFIG.logoutRedirect,
});

export interface AuthContextProps {
  token: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authenticated: boolean;
  error: string | null;
  isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: async () => {},
  logout: async () => {},
  authenticated: false,
  error: null,
  isInitialized: false,
});

const calculateRefreshTime = (token: string): number => {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return 60000;
    }

    const payload = JSON.parse(atob(tokenParts[1]));

    if (payload.exp) {
      const expiryTimeInSeconds = payload.exp;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const timeUntilExpiryInSeconds =
        expiryTimeInSeconds - currentTimeInSeconds;

      const refreshTimeInMs = Math.min(
        Math.max(timeUntilExpiryInSeconds * 0.7 * 1000, 10000),
        300000
      );

      return refreshTimeInMs;
    }
  } catch (error) {
    console.error(
      'Error calculating token refresh time:',
      JSON.stringify(error, null, 2)
    );
  }

  return 60000;
};

const setTokenCookie = async (token: string) => {
  if (!token) {
    console.error('Attempted to set empty token in cookie');
    return;
  }

  const tokenExpiry = new Date();
  tokenExpiry.setTime(tokenExpiry.getTime() + 24 * 60 * 60 * 1000);

  const payload = { token };
  const jsonBody = JSON.stringify(payload);

  console.log(
    'Setting token cookie, payload length:',
    JSON.stringify(jsonBody.length, null, 2)
  );

  try {
    const response = await fetch('/api/auth-token/set-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: jsonBody,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to set token cookie: ${response.status} ${response.statusText}`,
        JSON.stringify(errorText, null, 2)
      );
      return;
    }

    const data = await response.json();
    console.log('Token cookie set response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to set token cookie:', JSON.stringify(err, null, 2));
  }
};

const clearTokenCookie = () => {
  fetch('/api/auth-token/clear-token', {
    method: 'POST',
    credentials: 'include',
  }).catch((err) => {
    console.error(
      'Failed to clear token cookie:',
      JSON.stringify(err, null, 2)
    );
  });
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const keycloakRef = useRef<KeycloakInstance>(keycloakInstance);

  const configRef = useRef(getKeycloakConfig());

  const initStartedRef = useRef(false);
  const keycloakInitializedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);

    console.log(
      'Using Keycloak config from AuthContext:',
      JSON.stringify(configRef.current, null, 2)
    );

    const envValidation = validateAuthEnvVars();
    if (!envValidation.isValid) {
      console.warn(
        `Using fallback values for: ${envValidation.missingVars.join(', ')}`
      );
    }
  }, []);

  const handleCleanLogout = useCallback(async () => {
    try {
      localStorage.removeItem('accessToken');
      clearTokenCookie();
      setToken(null);

      if (isMounted) {
        const config = configRef.current;
        const logoutRedirect = window.encodeURIComponent(config.logoutRedirect);
        console.log(
          'Logout redirect URI:',
          JSON.stringify(logoutRedirect, null, 2)
        );

        const logoutUrl = `${config.url}/realms/${config.realm}/protocol/openid-connect/logout`;

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
        form.appendChild(createFormInput('client_id', config.clientId));
        form.appendChild(
          createFormInput('post_logout_redirect_uri', config.logoutRedirect)
        );

        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      console.error('Manual logout failed:', JSON.stringify(err, null, 2));
      if (isMounted) {
        window.location.href = configRef.current.logoutRedirect;
      }
    }
  }, [isMounted]);

  const handleTokenRefresh = useCallback(
    async (kc: KeycloakInstance, retryCount = 0) => {
      try {
        console.log('Attempting token refresh');
        const refreshed = await kc.updateToken(70);

        if (refreshed && kc.token) {
          console.log('Token refreshed successfully');
          setToken(kc.token);
          localStorage.setItem('accessToken', kc.token);
          await setTokenCookie(kc.token);

          const refreshTime = calculateRefreshTime(kc.token);
          console.log(
            `Scheduling token refresh in ${Math.round(refreshTime / 1000)} seconds`
          );

          setTimeout(() => {
            handleTokenRefresh(kc);
          }, refreshTime);
        } else {
          if (kc.token) {
            const refreshTime = calculateRefreshTime(kc.token);
            console.log(
              `Scheduling token refresh in ${Math.round(refreshTime / 1000)} seconds`
            );

            setTimeout(() => {
              handleTokenRefresh(kc);
            }, refreshTime);
          }
        }
      } catch (refreshError) {
        console.error(
          'Token refresh failed:',
          JSON.stringify(refreshError, null, 2)
        );

        if (retryCount < MAX_REFRESH_RETRIES) {
          console.log(
            `Retrying token refresh (${retryCount + 1}/${MAX_REFRESH_RETRIES}) in ${RETRY_DELAY_MS * Math.pow(2, retryCount)}ms`
          );
          setTimeout(
            () => {
              handleTokenRefresh(kc, retryCount + 1);
            },
            RETRY_DELAY_MS * Math.pow(2, retryCount)
          );
          return;
        }

        await handleCleanLogout();
      }
    },
    [handleCleanLogout]
  );

  const login = useCallback(async () => {
    console.log('Login requested');
    try {
      if (isMounted) {
        const config = configRef.current;

        const loginRedirect = window.location.origin + '/';
        console.log(
          'Using login redirect:',
          JSON.stringify(loginRedirect, null, 2)
        );

        const username = sessionStorage.getItem('kc_username');
        const password = sessionStorage.getItem('kc_password');

        if (username && password) {
          console.log('Using credentials from sessionStorage');

          try {
            const tokenUrl = `${config.url}/realms/${config.realm}/protocol/openid-connect/token`;
            const formData = new URLSearchParams();
            formData.append('grant_type', 'password');
            formData.append('client_id', config.clientId);
            formData.append('username', username);
            formData.append('password', password);

            console.log('Sending direct token request to Keycloak');

            const response = await fetch(tokenUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              console.log('Direct token request successful');

              keycloakRef.current.token = data.access_token;
              keycloakRef.current.refreshToken = data.refresh_token;
              keycloakRef.current.idToken = data.id_token;

              setToken(data.access_token);
              localStorage.setItem('accessToken', data.access_token);
              await setTokenCookie(data.access_token);

              const refreshTime = calculateRefreshTime(data.access_token);
              console.log(
                `Scheduling token refresh in ${Math.round(refreshTime / 1000)} seconds`
              );
              setTimeout(() => {
                handleTokenRefresh(keycloakRef.current);
              }, refreshTime);

              sessionStorage.removeItem('kc_username');
              sessionStorage.removeItem('kc_password');

              window.location.href = loginRedirect;
              return;
            } else {
              console.error(
                'Direct token request failed:',
                JSON.stringify(response.status, null, 2)
              );
            }
          } catch (tokenError) {
            console.error(
              'Error during direct token request:',
              JSON.stringify(tokenError, null, 2)
            );
          }

          sessionStorage.removeItem('kc_username');
          sessionStorage.removeItem('kc_password');
        }

        await keycloakRef.current.login({
          redirectUri: loginRedirect,
          prompt: 'login',
        });
      }
    } catch (err) {
      console.error('Login error:', JSON.stringify(err, null, 2));
      setError(
        err instanceof Error ? `Login failed: ${err.message}` : 'Login failed'
      );
    }
  }, [isMounted, handleTokenRefresh]);

  const performLogin = useCallback(async () => {
    console.log('Performing login redirect...');
    if (isMounted) {
      const loginRedirect = window.location.origin + '/';

      try {
        await keycloakRef.current.login({
          redirectUri: loginRedirect,
          prompt: 'login',
        });
      } catch (err) {
        console.error('Login redirect error:', JSON.stringify(err, null, 2));
        setError(
          err instanceof Error
            ? `Login redirect failed: ${err.message}`
            : 'Login redirect failed'
        );
      }
    }
  }, [isMounted]);

  const initializeAuth = useCallback(async (): Promise<() => void> => {
    if (!isMounted) return () => {};

    const kc = keycloakRef.current;
    let refreshTimeout: NodeJS.Timeout | null = null;

    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
      refreshTimeout = null;
    }

    console.log('Starting Keycloak initialization...');

    const config = configRef.current;
    console.log('Using Keycloak config:', JSON.stringify(config, null, 2));

    try {
      const isNewRegistration =
        localStorage.getItem('newRegistration') === 'true';

      const onLoadOption = isNewRegistration ? 'login-required' : 'check-sso';

      console.log(
        'Keycloak onLoad option:',
        onLoadOption,
        'isNewRegistration:',
        JSON.stringify(isNewRegistration, null, 2)
      );

      const authenticated = await kc.init({
        onLoad: onLoadOption,
        redirectUri: window.location.origin + '/',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        responseMode: 'query',
        enableLogging: true,

        silentCheckSsoRedirectUri: undefined,
        silentCheckSsoFallback: false,
      });

      if (isNewRegistration) {
        localStorage.removeItem('newRegistration');
      }

      console.log(
        'Redirect URI:',
        JSON.stringify(window.location.origin + '/', null, 2)
      );

      if (authenticated) {
        if (kc.token) {
          console.log('Setting token in state and cookie');
          setToken(kc.token);
          localStorage.setItem('accessToken', kc.token);
          await setTokenCookie(kc.token);

          const refreshTime = calculateRefreshTime(kc.token);
          console.log(
            `Scheduling token refresh in ${Math.round(refreshTime / 1000)} seconds`
          );

          refreshTimeout = setTimeout(() => {
            handleTokenRefresh(kc);
          }, refreshTime);

          if (window.location.pathname === '/after-auth') {
            window.location.href = '/';
          }
        } else {
          console.warn('Authenticated but no token available');
        }

        setInitialized(true);
      } else {
        console.log('Not authenticated, redirecting to login');
        setInitialized(true);

        await performLogin();
      }
    } catch (err: unknown) {
      console.error('Authentication Error Raw:', JSON.stringify(err, null, 2));
      let errorMessage = 'Unknown authentication error';
      console.error('Authentication Error:', JSON.stringify(err, null, 2));

      if (err instanceof Error) {
        errorMessage = `Authentication error: ${err.message}`;
      } else if (isKeycloakError(err)) {
        if (err.error && err.error_description) {
          errorMessage = `Keycloak Error: ${err.error} - ${err.error_description}`;
        } else if (err.error) {
          errorMessage = `Keycloak Error: ${err.error}`;
        }
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = `Authentication error: ${JSON.stringify(err)}`;
      }

      console.error(
        'Final error message:',
        JSON.stringify(errorMessage, null, 2)
      );
      setError(errorMessage);
      localStorage.removeItem('accessToken');
      clearTokenCookie();
      setInitialized(true);
    }

    return () => {
      if (refreshTimeout) {
        console.log('Cleaning up refresh timeout');
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
      }
    };
  }, [isMounted, handleTokenRefresh, performLogin]);

  useEffect(() => {
    if (isMounted && !initStartedRef.current) {
      console.log('Checking if we should fetch token from API...');

      const isTestPage =
        typeof window !== 'undefined' &&
        (window.location.pathname.startsWith('/test-') ||
          window.location.pathname === '/test-csp' ||
          window.location.pathname === '/test-fix-verification' ||
          window.location.pathname === '/test-addons' ||
          window.location.pathname === '/test-custom-pro');

      if (isTestPage) {
        console.log(
          'Skipping authentication for test page:',
          window.location.pathname
        );
        setInitialized(true);
        initStartedRef.current = true;
        return;
      }

      const skipAuthApi = process.env.NEXT_PUBLIC_SKIP_AUTH_API === 'true';

      if (skipAuthApi) {
        console.log(
          'Using mock token API due to NEXT_PUBLIC_SKIP_AUTH_API flag'
        );

        const fetchMockToken = async () => {
          try {
            console.log('Making fetch request to /api/auth-token/mock-token');
            const response = await fetch('/api/auth-token/mock-token', {
              credentials: 'include',
              headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
              },
            });

            if (!response.ok) {
              throw new Error(
                `Failed to get mock token: ${response.status} ${response.statusText}`
              );
            }

            const data = await response.json();
            console.log('Mock token received');

            if (data.token) {
              setToken(data.token);
              localStorage.setItem('accessToken', data.token);
              setInitialized(true);
              console.log('Mock token set');
            }
          } catch (err) {
            console.error(
              'Error fetching mock token:',
              JSON.stringify(err, null, 2)
            );
          }
        };

        fetchMockToken();
      } else {
        const fetchToken = async () => {
          try {
            console.log('Making fetch request to /api/auth-token/get-token');
            const response = await fetch('/api/auth-token/get-token', {
              credentials: 'include',
              headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
              },
            });

            console.log(
              'Token API response status:',
              JSON.stringify(response.status, null, 2)
            );

            if (!response.ok) {
              throw new Error(
                `Failed to get token: ${response.status} ${response.statusText}`
              );
            }

            const data = await response.json();
            console.log(
              'Token API response data:',
              JSON.stringify(data, null, 2)
            );

            if (data.token) {
              setToken(data.token);
              localStorage.setItem('accessToken', data.token);
              setInitialized(true);
              console.log('Token set from API');
              return true;
            } else {
              console.log(
                'No token in API response, proceeding with Keycloak initialization'
              );
            }
          } catch (err) {
            console.error(
              'Error fetching token:',
              JSON.stringify(err, null, 2)
            );
          }
          return false;
        };

        fetchToken();
      }

      if (!keycloakInitializedRef.current) {
        console.log('Starting Keycloak initialization for the first time');
        keycloakInitializedRef.current = true;
        initStartedRef.current = true;

        const cleanupPromise = initializeAuth();

        return () => {
          cleanupPromise.then((cleanup) => cleanup());
        };
      } else {
        console.log('Keycloak already initialized, skipping initialization');
        initStartedRef.current = true;
        setInitialized(true);
      }
    }
  }, [isMounted, initializeAuth]);

  const logout = useCallback(async () => {
    console.log('Logout requested');
    await handleCleanLogout();
  }, [handleCleanLogout]);

  const contextValue = useMemo(
    () => ({
      token,
      login,
      logout,
      authenticated: !!token,
      error,
      isInitialized: initialized,
    }),
    [token, login, logout, error, initialized]
  );

  if (!isMounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
