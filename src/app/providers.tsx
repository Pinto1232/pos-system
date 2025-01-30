"use client";

import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import KeycloakService from "@/lib/keycloak"; // Verify this path exists

// Must use default export
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const keycloak = KeycloakService.getInstance();

  return (
    <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false, // Disable iframe check since we're using silent-check-sso.html
      silentCheckSsoRedirectUri: 
        typeof window !== 'undefined'
          ? `${window.location.origin}/silent-check-sso.html`
          : undefined,
    }}
    autoRefreshToken={true}
  >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ReactKeycloakProvider>
  );
}