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
  loginRedirect:
    'http://localhost:3000/dashboard',
  logoutRedirect: 'http://localhost:3000/login',
};

const getKeycloakConfig = () => ({
  url:
    process.env.NEXT_PUBLIC_KEYCLOAK_URL ||
    FALLBACK_CONFIG.url,
  realm:
    process.env.NEXT_PUBLIC_KEYCLOAK_REALM ||
    FALLBACK_CONFIG.realm,
  clientId:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
    FALLBACK_CONFIG.clientId,
  redirectUri:
    process.env.NEXT_PUBLIC_REDIRECT_URI ||
    FALLBACK_CONFIG.redirectUri,
  loginRedirect:
    process.env.NEXT_PUBLIC_LOGIN_REDIRECT ||
    FALLBACK_CONFIG.loginRedirect,
  logoutRedirect:
    process.env.NEXT_PUBLIC_LOGOUT_REDIRECT ||
    FALLBACK_CONFIG.logoutRedirect,
});

let keycloakInitialized = false;

export interface AuthContextProps {
  token: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authenticated: boolean;
  error: string | null;
  isInitialized: boolean;
}

export const AuthContext =
  createContext<AuthContextProps>({
    token: null,
    login: async () => {},
    logout: async () => {},
    authenticated: false,
    error: null,
    isInitialized: false,
  });

const calculateRefreshTime = (
  token: string
): number => {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return 60000;
    }

    const payload = JSON.parse(
      atob(tokenParts[1])
    );

    if (payload.exp) {
      const expiryTimeInSeconds = payload.exp;
      const currentTimeInSeconds = Math.floor(
        Date.now() / 1000
      );
      const timeUntilExpiryInSeconds =
        expiryTimeInSeconds -
        currentTimeInSeconds;

      const refreshTimeInMs = Math.min(
        Math.max(
          timeUntilExpiryInSeconds * 0.7 * 1000,
          10000
        ),
        300000
      );

      return refreshTimeInMs;
    }
  } catch (error) {
    console.error(
      'Error calculating token refresh time:',
      error
    );
  }

  return 60000;
};

const setTokenCookie = (token: string) => {
  const tokenExpiry = new Date();
  tokenExpiry.setTime(
    tokenExpiry.getTime() + 24 * 60 * 60 * 1000
  );

  fetch('/api/auth-token/set-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    credentials: 'include',
  }).catch((err) => {
    console.error(
      'Failed to set token cookie:',
      err
    );
  });
};

const clearTokenCookie = () => {
  fetch('/api/auth-token/clear-token', {
    method: 'POST',
    credentials: 'include',
  }).catch((err) => {
    console.error(
      'Failed to clear token cookie:',
      err
    );
  });
};

const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [token, setToken] = useState<
    string | null
  >(null);
  const [initialized, setInitialized] =
    useState(false);
  const [error, setError] = useState<
    string | null
  >(null);
  const [isMounted, setIsMounted] =
    useState(false);
  const keycloakRef = useRef<KeycloakInstance>(
    keycloakInstance
  );

  const configRef = useRef(getKeycloakConfig());

  const initStartedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);

    console.log(
      'Using Keycloak config from AuthContext:',
      configRef.current
    );

    const envValidation = validateAuthEnvVars();
    if (!envValidation.isValid) {
      console.warn(
        `Using fallback values for: ${envValidation.missingVars.join(', ')}`
      );
    }
  }, []);

  const handleCleanLogout =
    useCallback(async () => {
      try {
        localStorage.removeItem('accessToken');
        clearTokenCookie();
        setToken(null);

        if (isMounted) {
          const config = configRef.current;
          const logoutRedirect =
            window.encodeURIComponent(
              config.logoutRedirect
            );
          console.log(
            'Logout redirect URI:',
            logoutRedirect
          );

          const logoutUrl = `${config.url}/realms/${config.realm}/protocol/openid-connect/logout`;

          const createFormInput = (
            name: string,
            value: string
          ) => {
            const input =
              document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            return input;
          };

          const form =
            document.createElement('form');
          form.method = 'POST';
          form.action = logoutUrl;
          form.appendChild(
            createFormInput(
              'client_id',
              config.clientId
            )
          );
          form.appendChild(
            createFormInput(
              'post_logout_redirect_uri',
              config.logoutRedirect
            )
          );

          document.body.appendChild(form);
          form.submit();
        }
      } catch (err) {
        console.error(
          'Manual logout failed:',
          err
        );
        if (isMounted) {
          window.location.href =
            configRef.current.logoutRedirect;
        }
      }
    }, [isMounted]);

  const login = useCallback(async () => {
    console.log('Login requested');
    try {
      if (isMounted) {
        const config = configRef.current;
        const loginRedirect =
          config.loginRedirect;
        console.log(
          'Using login redirect:',
          loginRedirect
        );

        await keycloakRef.current.login({
          redirectUri: loginRedirect,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err instanceof Error
          ? `Login failed: ${err.message}`
          : 'Login failed'
      );
    }
  }, [isMounted]);

  const handleTokenRefresh = useCallback(
    async (
      kc: KeycloakInstance,
      retryCount = 0
    ) => {
      try {
        console.log('Attempting token refresh');
        const refreshed =
          await kc.updateToken(70);

        if (refreshed && kc.token) {
          console.log(
            'Token refreshed successfully'
          );
          setToken(kc.token);
          localStorage.setItem(
            'accessToken',
            kc.token
          );
          setTokenCookie(kc.token);

          const refreshTime =
            calculateRefreshTime(kc.token);
          console.log(
            `Scheduling token refresh in ${Math.round(refreshTime / 1000)} seconds`
          );

          setTimeout(() => {
            handleTokenRefresh(kc);
          }, refreshTime);
        } else {
          if (kc.token) {
            const refreshTime =
              calculateRefreshTime(kc.token);
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
          refreshError
        );

        if (retryCount < MAX_REFRESH_RETRIES) {
          console.log(
            `Retrying token refresh (${retryCount + 1}/${MAX_REFRESH_RETRIES}) in ${RETRY_DELAY_MS * Math.pow(2, retryCount)}ms`
          );
          setTimeout(
            () => {
              handleTokenRefresh(
                kc,
                retryCount + 1
              );
            },
            RETRY_DELAY_MS *
              Math.pow(2, retryCount)
          );
          return;
        }

        await handleCleanLogout();
      }
    },
    [handleCleanLogout]
  );

  const initializeAuth =
    useCallback(async (): Promise<() => void> => {
      if (!isMounted) return () => {};

      const kc = keycloakRef.current;
      let refreshTimeout: NodeJS.Timeout | null =
        null;

      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
      }

      console.log(
        'Starting Keycloak initialization...'
      );

      const config = configRef.current;
      console.log(
        'Using Keycloak config:',
        config
      );

      try {
        const authenticated = await kc.init({
          onLoad: 'check-sso',
          redirectUri: config.redirectUri,
          checkLoginIframe: false,
          pkceMethod: 'S256',
          responseMode: 'query',
          enableLogging: true,
          silentCheckSsoRedirectUri:
            window.location.origin +
            '/silent-check-sso.html',
          silentCheckSsoFallback: false,
        });

        console.log(
          'Redirect URI:',
          config.redirectUri
        );

        if (authenticated) {
          if (kc.token) {
            console.log(
              'Setting token in state and cookie'
            );
            setToken(kc.token);
            localStorage.setItem(
              'accessToken',
              kc.token
            );
            setTokenCookie(kc.token);

            const refreshTime =
              calculateRefreshTime(kc.token);
            console.log(
              `Scheduling token refresh in ${Math.round(refreshTime / 1000)} seconds`
            );

            refreshTimeout = setTimeout(() => {
              handleTokenRefresh(kc);
            }, refreshTime);
          } else {
            console.warn(
              'Authenticated but no token available'
            );
          }

          setInitialized(true);
        } else {
          console.log(
            'Not authenticated, redirecting to login'
          );
          setInitialized(true);
          await login();
        }
      } catch (err: unknown) {
        console.error(
          'Authentication Error Raw:',
          err
        );
        let errorMessage =
          'Unknown authentication error';
        console.error(
          'Authentication Error:',
          err
        );

        if (err instanceof Error) {
          errorMessage = `Authentication error: ${err.message}`;
        } else if (isKeycloakError(err)) {
          if (
            err.error &&
            err.error_description
          ) {
            errorMessage = `Keycloak Error: ${err.error} - ${err.error_description}`;
          } else if (err.error) {
            errorMessage = `Keycloak Error: ${err.error}`;
          }
        } else if (
          typeof err === 'object' &&
          err !== null
        ) {
          errorMessage = `Authentication error: ${JSON.stringify(err)}`;
        }

        console.error(
          'Final error message:',
          errorMessage
        );
        setError(errorMessage);
        localStorage.removeItem('accessToken');
        clearTokenCookie();
        setInitialized(true);
      }

      return () => {
        if (refreshTimeout) {
          console.log(
            'Cleaning up refresh timeout'
          );
          clearTimeout(refreshTimeout);
          refreshTimeout = null;
        }
      };
    }, [handleTokenRefresh, login, isMounted]);

  useEffect(() => {
    if (isMounted && !initStartedRef.current) {
      console.log('Fetching token from API...');
      fetch('/api/auth-token/get-token', {
        credentials: 'include',
      })
        .then((response) => {
          console.log(
            'Token API response status:',
            response.status
          );
          if (response.ok) {
            return response.json();
          }
          throw new Error('Failed to get token');
        })
        .then((data) => {
          console.log(
            'Token API response data:',
            data
          );
          if (data.token) {
            setToken(data.token);
            localStorage.setItem(
              'accessToken',
              data.token
            );
            setInitialized(true);
            console.log('Token set from API');
          } else {
            console.log(
              'No token in API response'
            );
          }
        })
        .catch((err) => {
          console.error(
            'Error fetching token:',
            err
          );
        });

      if (!keycloakInitialized) {
        console.log(
          'Starting Keycloak initialization for the first time'
        );
        keycloakInitialized = true;
        initStartedRef.current = true;

        const cleanupPromise = initializeAuth();

        return () => {
          cleanupPromise.then((cleanup) =>
            cleanup()
          );
        };
      } else {
        console.log(
          'Keycloak already initialized globally, skipping initialization'
        );
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
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
