import React from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/globalLayout/Layout";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/styles/theme";
import Keycloak from "@/lib/keycloak";

// ✅ Create a new Keycloak instance (NOT a singleton)
const keycloak = new Keycloak();

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/silent-check-sso.html`,
      }}
      autoRefreshToken={true}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReactKeycloakProvider>
  );
}

export default MyApp;
