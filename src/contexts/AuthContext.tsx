"use client";
import React, { createContext, useState, useEffect, ReactNode, useRef } from 'react';
import { KeycloakInstance } from 'keycloak-js';
import keycloakInstance from '@/auth/keycloak';

export interface AuthContextProps {
  keycloak: KeycloakInstance;
  token: string | null;
  login: () => void;
  logout: () => void;
  authenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  keycloak: keycloakInstance,
  token: null,
  login: () => {},
  logout: () => {},
  authenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  // Create a ref for the Keycloak instance (imported from a separate module)
  const keycloakRef = useRef<KeycloakInstance>(keycloakInstance);

  useEffect(() => {
    const kc = keycloakRef.current;
    if (!initialized) {
      kc
        .init({
          onLoad: 'login-required',
          // Make sure this redirectUri matches what is configured in Keycloak for this client.
          redirectUri: 'http://localhost:7005/',
        })
        .then((authenticated) => {
          if (authenticated) {
            setToken(kc.token ?? null);
            localStorage.setItem('accessToken', kc.token ?? '');
          } else {
            kc.login();
          }
          setInitialized(true);
        })
        .catch((err) => {
          console.error("Keycloak initialization error", err);
        });

      // Refresh token periodically (every 60 seconds)
      const refreshInterval = setInterval(() => {
        kc
          .updateToken(70)
          .then((refreshed) => {
            if (refreshed) {
              setToken(kc.token ?? null);
              localStorage.setItem('accessToken', kc.token ?? '');
            }
          })
          .catch(() => {
            console.error('Failed to refresh token');
          });
      }, 60000);

      return () => clearInterval(refreshInterval);
    }
  }, [initialized]);

  const login = () => {
    keycloakRef.current.login();
  };

  const logout = () => {
    keycloakRef.current.logout();
    localStorage.removeItem('accessToken');
    setToken(null);
  };

  if (!initialized) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        keycloak: keycloakRef.current,
        token,
        login,
        logout,
        authenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
