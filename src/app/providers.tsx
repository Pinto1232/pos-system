"use client";

import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js"; // ✅ Import directly

// Initialize Keycloak instance
const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
});

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      {typeof window !== "undefined" ? (
        <ReactKeycloakProvider
          authClient={keycloak} // ✅ Pass new instance, not singleton
          initOptions={{
            onLoad: "check-sso",
            pkceMethod: "S256",
            checkLoginIframe: false,
            silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
          }}
          autoRefreshToken={true}
        >
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ReactKeycloakProvider>
      ) : (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )}
    </>
  );
}
