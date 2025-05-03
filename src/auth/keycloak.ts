import Keycloak from 'keycloak-js';
import { validateAuthEnvVars } from '@/utils/envValidation';

const FALLBACK_CONFIG = {
  url: 'http://localhost:8282',
  realm: 'pisval-pos-realm',
  clientId: 'pos-backend',
};

console.log(
  'Environment Variables in Keycloak Setup:'
);
console.log(
  'NEXT_PUBLIC_KEYCLOAK_URL:',
  process.env.NEXT_PUBLIC_KEYCLOAK_URL ||
    FALLBACK_CONFIG.url
);
console.log(
  'NEXT_PUBLIC_KEYCLOAK_REALM:',
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM ||
    FALLBACK_CONFIG.realm
);
console.log(
  'NEXT_PUBLIC_KEYCLOAK_CLIENT_ID:',
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
    FALLBACK_CONFIG.clientId
);

const envValidation = validateAuthEnvVars();
console.log(
  'Environment validation result:',
  envValidation
);

const keycloakUrl =
  process.env.NEXT_PUBLIC_KEYCLOAK_URL ||
  FALLBACK_CONFIG.url;
const keycloakRealm =
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM ||
  FALLBACK_CONFIG.realm;
const keycloakClientId =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
  FALLBACK_CONFIG.clientId;

console.log('Using Keycloak configuration:', {
  url: keycloakUrl,
  realm: keycloakRealm,
  clientId: keycloakClientId,
});

const keycloak = new Keycloak({
  url: keycloakUrl,
  realm: keycloakRealm,
  clientId: keycloakClientId,
});

export default keycloak;
