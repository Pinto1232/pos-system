import Keycloak from 'keycloak-js';
import { getAuthConfig } from '@/utils/envValidation';

console.log('🔧 Initializing Keycloak configuration...');


const authConfig = getAuthConfig();

console.log('📋 Keycloak Configuration Summary:');
console.log(`  URL: ${authConfig.keycloakUrl}`);
console.log(`  Realm: ${authConfig.realm}`);
console.log(`  Client ID: ${authConfig.clientId}`);
console.log(`  Redirect URI: ${authConfig.redirectUri}`);
console.log(`  Source: ${authConfig.validation.source}`);
console.log(`  Context: ${authConfig.validation.context}`);
console.log(`  Valid: ${authConfig.validation.isValid}`);

if (authConfig.validation.source === 'fallback') {
  console.warn(
    '⚠️ Using fallback configuration - environment variables not loaded'
  );
  console.warn('Missing variables:', authConfig.validation.missingVars);
} else if (authConfig.validation.source === 'runtime') {
  console.log('✅ Using mixed environment and fallback configuration');
} else {
  console.log('✅ Using environment variables');
}


const keycloak = new Keycloak({
  url: authConfig.keycloakUrl,
  realm: authConfig.realm,
  clientId: authConfig.clientId,
});


export { authConfig };
export default keycloak;
