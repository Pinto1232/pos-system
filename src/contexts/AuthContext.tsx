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
import Keycloak from 'keycloak-js';
import keycloakInstance, { authConfig } from '@/auth/keycloak';
import { isKeycloakError } from '@/types/keycloak';
import {
  validateAuthEnvVars,
  EnvValidationResult,
} from '@/utils/envValidation';
import {
  runKeycloakDiagnostics,
  logDiagnostics,
} from '@/utils/keycloakDiagnostics';

const MAX_REFRESH_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const FALLBACK_CONFIG = {
  url: 'http://localhost:8282',
  realm: 'pisval-pos-realm',
  clientId: 'pos-frontend',
  redirectUri: 'http://localhost:3000/after-auth',
  loginRedirect: 'http://localhost:3000/',
  logoutRedirect: 'http://localhost:3000/login',
};

interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  redirectUri: string;
  loginRedirect: string;
  logoutRedirect: string;
  validation: EnvValidationResult;
}

const mapAuthConfigToKeycloakConfig = (
  config: typeof authConfig
): KeycloakConfig => {
  return {
    url: config.keycloakUrl,
    realm: config.realm,
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    loginRedirect:
      process.env.NEXT_PUBLIC_LOGIN_REDIRECT ?? FALLBACK_CONFIG.loginRedirect,
    logoutRedirect:
      process.env.NEXT_PUBLIC_LOGOUT_REDIRECT ?? FALLBACK_CONFIG.logoutRedirect,
    validation: config.validation,
  };
};

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
  login: async () => {
    console.log(
      'AuthContext: DEFAULT login function from createContext CALLED'
    );
  },
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

  const keycloakRef = useRef<Keycloak>(keycloakInstance);
  const configRef = useRef(mapAuthConfigToKeycloakConfig(authConfig));
  const initStartedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);

    console.log(
      'Using Keycloak config from AuthContext:',
      JSON.stringify(configRef.current, null, 2)
    );

    const envValidation = validateAuthEnvVars();
    console.log('🔍 Environment validation in AuthContext:', {
      isValid: envValidation.isValid,
      source: envValidation.source,
      context: envValidation.context,
      missingVars: envValidation.missingVars,
    });

    if (envValidation.source === 'fallback') {
      console.warn(
        `⚠️ Using fallback configuration - environment variables not properly loaded`
      );
      console.warn('Missing variables:', envValidation.missingVars);
    } else {
      console.log('✅ Environment variables loaded successfully');
    }
  }, []);
  const handleCleanLogout = useCallback(async () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('newRegistration');
      localStorage.removeItem('pendingRegistration');
      sessionStorage.removeItem('kc_username');
      sessionStorage.removeItem('kc_password');

      await fetch('/api/auth-token/clear-token', {
        method: 'POST',
        credentials: 'include',
      });

      setToken(null);
      setInitialized(false);

      if (document.body) {
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
      if (typeof window !== 'undefined') {
        window.location.href = configRef.current.logoutRedirect;
      }
    }
  }, []);

  const handleTokenRefresh = useCallback(
    async (kc: Keycloak, retryCount = 0) => {
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
        } else if (kc.token) {
          const refreshTime = calculateRefreshTime(kc.token);
          console.log(
            `Scheduling token refresh in ${Math.round(refreshTime / 1000)} seconds`
          );

          setTimeout(() => {
            handleTokenRefresh(kc);
          }, refreshTime);
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
    console.log('AuthContext: REAL LOGIN FUNCTION ENTERED - AuthContext.tsx');
    console.log('AuthContext: login function CALLED');
    console.log('Login requested');
    try {
      if (typeof window !== 'undefined') {
        const loginRedirectUri = window.location.origin + '/';
        console.log(
          'Using login redirect URI for Keycloak:',
          JSON.stringify(loginRedirectUri, null, 2)
        );

        console.log('AuthContext.login: Proceeding with redirect-based login.');
        console.log('🔍 Inspecting keycloakRef.current before .login() call:');
        console.log(`  Flow: ${keycloakRef.current.flow}`);
        console.log(`  ResponseMode: ${keycloakRef.current.responseMode}`);
        console.log(`  ResponseType: ${keycloakRef.current.responseType}`);
        await keycloakRef.current.login({
          redirectUri: loginRedirectUri,
          prompt: 'login',
        });
      }
    } catch (err) {
      console.error('Login error:', JSON.stringify(err, null, 2));
      setError(
        err instanceof Error ? `Login failed: ${err.message}` : 'Login failed'
      );
    }
  }, []);

  const handleRealmCheckFailure = useCallback(
    async (config: KeycloakConfig) => {
      console.log('Running comprehensive Keycloak diagnostics...');

      try {
        const diagnostics = await runKeycloakDiagnostics(
          config.url,
          config.realm,
          config.clientId
        );
        logDiagnostics(diagnostics);

        if (diagnostics.overall === 'unhealthy') {
          console.warn(
            'Keycloak diagnostics indicate unhealthy state - this may be normal in development'
          );
          console.log(
            'Proceeding with authentication despite diagnostic warnings...'
          );
        } else if (diagnostics.overall === 'degraded') {
          console.log(
            'Keycloak diagnostics show some issues but core functionality appears to work'
          );
        }
      } catch (diagError) {
        console.error('Failed to run diagnostics:', diagError);
      }

      console.log(
        'Proceeding with Keycloak initialization despite realm check failure...'
      );
    },
    []
  );

  const checkRealmAccessibility = useCallback(
    async (config: KeycloakConfig) => {
      const realmCheckUrl = `${config.url}/realms/${config.realm}/.well-known/openid_configuration`;
      console.log('Checking Keycloak realm accessibility:', realmCheckUrl);

      try {
        const realmResponse = await fetch(realmCheckUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: AbortSignal.timeout(5000),
        });

        if (!realmResponse.ok) {
          console.warn(
            `Realm well-known endpoint not accessible: ${realmResponse.status} ${realmResponse.statusText}`
          );
          console.log(
            'Proceeding with Keycloak initialization despite well-known endpoint issue...'
          );
        } else {
          console.log('✓ Keycloak realm is accessible');
        }
      } catch (realmError) {
        console.warn('✗ Keycloak realm check failed:', realmError);
        await handleRealmCheckFailure(config);
      }
    },
    [handleRealmCheckFailure]
  );

  const handleSuccessfulAuthentication = useCallback(
    async (
      kc: Keycloak,
      refreshTimeoutRef: { current: NodeJS.Timeout | null }
    ) => {
      if (kc.token) {
        console.log('Setting token in secure cookie');
        setToken(kc.token);

        await fetch('/api/auth-token/set-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: kc.token }),
          credentials: 'include',
        });

        const refreshTime = calculateRefreshTime(kc.token);
        console.log(
          `Scheduling token refresh in ${Math.round(refreshTime / 1000)} seconds`
        );

        refreshTimeoutRef.current = setTimeout(() => {
          handleTokenRefresh(kc);
        }, refreshTime);

        if (window.location.pathname === '/after-auth') {
          window.location.href = '/';
        }
      } else {
        console.warn('Authenticated but no token available');
      }

      setInitialized(true);
    },
    [handleTokenRefresh]
  );

  const handleUnauthenticatedState = useCallback(async () => {
    console.log('Not authenticated, redirecting to login');
    setInitialized(true);

    console.log('Performing login redirect...');
    if (typeof window !== 'undefined') {
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
  }, []);

  const handleAuthenticationError = useCallback((err: unknown) => {
    console.error('Authentication Error:', JSON.stringify(err, null, 2));
    let errorMessage = 'Unknown authentication error';

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
  }, []);

  const initializeAuth = useCallback(async (): Promise<() => void> => {
    if (typeof window === 'undefined') return () => {};

    const kc = keycloakRef.current;
    const refreshTimeoutRef = { current: null as NodeJS.Timeout | null };

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    console.log('Starting Keycloak initialization...');
    const config = configRef.current;
    console.log('Using Keycloak config:', JSON.stringify(config, null, 2));

    try {
      await checkRealmAccessibility(config);

      const isNewRegistration =
        localStorage.getItem('newRegistration') === 'true';
      const onLoadOption = isNewRegistration ? 'login-required' : 'check-sso';

      console.log(
        'Keycloak onLoad option:',
        onLoadOption,
        'isNewRegistration:',
        JSON.stringify(isNewRegistration, null, 2)
      );

      if (!kc.authenticated) {
        console.log('🔍 Inspecting Keycloak instance before init:');
        console.log(`  kc.authServerUrl: ${kc.authServerUrl}`);
        console.log(`  kc.realm: ${kc.realm}`);
        console.log(`  kc.clientId: ${kc.clientId}`);
        const authenticated = await kc.init({
          onLoad: onLoadOption,
          redirectUri: window.location.origin + config.loginRedirect,
          checkLoginIframe: false,
          pkceMethod: 'S256',
          responseMode: 'query',
          enableLogging: true,
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
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
          await handleSuccessfulAuthentication(kc, refreshTimeoutRef);
        } else {
          await handleUnauthenticatedState();
        }
      } else {
        console.log('Keycloak already authenticated, skipping initialization');
        if (kc.token) {
          setToken(kc.token);
          setInitialized(true);
        }
      }
    } catch (err) {
      handleAuthenticationError(err);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        console.log('Cleaning up refresh timeout');
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [
    checkRealmAccessibility,
    handleSuccessfulAuthentication,
    handleUnauthenticatedState,
    handleAuthenticationError,
  ]);

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
      } else {
        const fetchToken = async () => {
          try {
            const response = await fetch('/api/auth-token/get-token', {
              credentials: 'include',
              headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
              },
            });

            if (!response.ok) {
              throw new Error(
                `Failed to get token: ${response.status} ${response.statusText}`
              );
            }

            const data = await response.json();
            if (data.token) {
              setToken(data.token);
              localStorage.setItem('accessToken', data.token);
              setInitialized(true);
              console.log('Token set from API');
              return true;
            }
            return false;
          } catch (err) {
            console.error(
              'Error fetching token:',
              JSON.stringify(err, null, 2)
            );
            return false;
          }
        };

        fetchToken().then((tokenFetched) => {
          console.log(
            `AuthContext: fetchToken completed. tokenFetched: ${tokenFetched}, initStartedRef.current: ${initStartedRef.current}`
          );
          if (!tokenFetched && !initStartedRef.current) {
            console.log(
              'AuthContext: Conditions met. Starting Keycloak initialization for the first time.'
            );
            initStartedRef.current = true;

            const cleanupPromise = initializeAuth();
            return () => {
              cleanupPromise.then((cleanup) => cleanup());
            };
          }
        });
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

  console.log(
    'AuthProvider LOG: Providing context. Type of login function:',
    typeof contextValue.login
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
