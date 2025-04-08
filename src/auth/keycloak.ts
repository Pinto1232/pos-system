import Keycloak from 'keycloak-js';

// Log environment variables for debugging
console.log(
  'Environment Variables in Keycloak Setup:'
);
console.log(
  'NEXT_PUBLIC_KEYCLOAK_URL:',
  process.env.NEXT_PUBLIC_KEYCLOAK_URL
);
console.log(
  'NEXT_PUBLIC_KEYCLOAK_REALM:',
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM
);
console.log(
  'NEXT_PUBLIC_KEYCLOAK_CLIENT_ID:',
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
);

// Create a properly formatted Keycloak instance
const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || '',
  realm:
    process.env.NEXT_PUBLIC_KEYCLOAK_REALM || '',
  clientId:
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
    '',
});

export default keycloak;
