// src/auth/keycloak.ts
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8282/',
  realm: 'pisval-pos-realm',
  clientId: 'pos-backend',
});

export default keycloak;
