interface SecurityConfig {
  csrfEnabled: boolean;
  secureCookies: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordRequirements: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
  };
}

interface AuthConfig {
  keycloakUrl: string;
  realm: string;
  clientId: string;
  loginRedirect: string;
  logoutRedirect: string;
}

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  rateLimits: {
    maxRequests: number;
    windowMs: number;
  };
}

interface Environment {
  production: boolean;
  security: SecurityConfig;
  auth: AuthConfig;
  api: ApiConfig;
}

const defaultConfig: Environment = {
  production: process.env.NODE_ENV === 'production',
  security: {
    csrfEnabled: true,
    secureCookies: true,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordMinLength: 12,
    passwordRequirements: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      special: true,
    },
  },
  auth: {
    keycloakUrl:
      process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8282',
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'pisval-pos-realm',
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'pos-frontend',
    loginRedirect: process.env.NEXT_PUBLIC_LOGIN_REDIRECT || '/',
    logoutRedirect: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT || '/login',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5107',
    timeout: 30000,
    retryAttempts: 3,
    rateLimits: {
      maxRequests: 100,
      windowMs: 60000,
    },
  },
};

function validateConfig(config: Environment): void {
  if (config.production) {
    if (!config.security.secureCookies) {
      throw new Error('Secure cookies must be enabled in production');
    }
    if (config.security.sessionTimeout > 3600) {
      throw new Error('Session timeout must not exceed 1 hour in production');
    }
  }

  if (!config.auth.keycloakUrl || !config.auth.realm || !config.auth.clientId) {
    throw new Error('Missing required Keycloak configuration');
  }

  if (!config.api.baseUrl) {
    throw new Error('Missing API base URL');
  }
}

export function getConfig(): Environment {
  const config = {
    ...defaultConfig,

    production: process.env.NODE_ENV === 'production',
    auth: {
      ...defaultConfig.auth,
      keycloakUrl:
        process.env.NEXT_PUBLIC_KEYCLOAK_URL || defaultConfig.auth.keycloakUrl,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || defaultConfig.auth.realm,
      clientId:
        process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
        defaultConfig.auth.clientId,
    },
    api: {
      ...defaultConfig.api,
      baseUrl: process.env.NEXT_PUBLIC_API_URL || defaultConfig.api.baseUrl,
    },
  };

  validateConfig(config);
  return config;
}

export function getSecureHeaders(
  context: 'api' | 'page' | 'middleware'
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  if (context === 'page' || context === 'middleware') {
    headers['Content-Security-Policy'] = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      `connect-src 'self' ${defaultConfig.api.baseUrl} ${defaultConfig.auth.keycloakUrl}`,
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join('; ');
  }

  return headers;
}
