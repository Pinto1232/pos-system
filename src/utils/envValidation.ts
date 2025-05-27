export interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  loadedVars: Record<string, string | undefined>;
  context: 'client' | 'server';
  source: 'process.env' | 'runtime' | 'fallback';
}

const FALLBACK_CONFIG = {
  NEXT_PUBLIC_KEYCLOAK_URL: 'http://localhost:8282',
  NEXT_PUBLIC_KEYCLOAK_REALM: 'pisval-pos-realm',
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: 'pos-frontend',
  NEXT_PUBLIC_REDIRECT_URI: 'http://localhost:3000/after-auth',
};

function getEnvVar(varName: string): string | undefined {
  if (process.env[varName]) {
    return process.env[varName];
  }

  if (typeof window !== 'undefined') {
    const windowWithEnv = window as typeof window & {
      __ENV__?: Record<string, string>;
    };
    if (windowWithEnv.__ENV__?.[varName]) {
      return windowWithEnv.__ENV__[varName];
    }
  }

  if (typeof window !== 'undefined') {
    const windowWithNextData = window as typeof window & {
      __NEXT_DATA__?: {
        props?: {
          pageProps?: {
            env?: Record<string, string>;
          };
        };
      };
    };
    const globalEnv = windowWithNextData.__NEXT_DATA__?.props?.pageProps?.env;
    if (globalEnv?.[varName]) {
      return globalEnv[varName];
    }
  }

  return undefined;
}

export function validateAuthEnvVars(): EnvValidationResult {
  const requiredVars = [
    'NEXT_PUBLIC_KEYCLOAK_URL',
    'NEXT_PUBLIC_KEYCLOAK_REALM',
    'NEXT_PUBLIC_KEYCLOAK_CLIENT_ID',
    'NEXT_PUBLIC_REDIRECT_URI',
  ] as const;

  const context = typeof window === 'undefined' ? 'server' : 'client';
  const loadedVars: Record<string, string | undefined> = {};
  const actualValues: Record<string, string> = {};

  let hasEnvVars = false;
  let hasFallbackVars = false;

  requiredVars.forEach((varName) => {
    const envValue = getEnvVar(varName);
    loadedVars[varName] = envValue;

    if (envValue) {
      actualValues[varName] = envValue;
      hasEnvVars = true;
      console.log(`✓ ${varName}: ${envValue} (from environment)`);
    } else {
      const fallbackValue = FALLBACK_CONFIG[varName];
      actualValues[varName] = fallbackValue;
      hasFallbackVars = true;
      console.log(
        `⚠ ${varName}: ${fallbackValue} (fallback - env var not found)`
      );
    }
  });

  let source: 'process.env' | 'runtime' | 'fallback';
  if (hasEnvVars && hasFallbackVars) {
    source = 'runtime';
  } else if (hasEnvVars) {
    source = 'process.env';
  } else {
    source = 'fallback';
  }

  const missingVars = requiredVars.filter((varName) => !loadedVars[varName]);

  const isValid = requiredVars.every((varName) => actualValues[varName]);

  console.log(`Environment validation (${context}):`, {
    isValid,
    source,
    missingFromEnv: missingVars.length,
    totalRequired: requiredVars.length,
  });

  return {
    isValid,
    missingVars,
    loadedVars: actualValues,
    context,
    source,
  };
}

export function getAuthConfig() {
  const validation = validateAuthEnvVars();

  return {
    keycloakUrl: validation.loadedVars.NEXT_PUBLIC_KEYCLOAK_URL!,
    realm: validation.loadedVars.NEXT_PUBLIC_KEYCLOAK_REALM!,
    clientId: validation.loadedVars.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
    redirectUri: validation.loadedVars.NEXT_PUBLIC_REDIRECT_URI!,
    validation,
  };
}
