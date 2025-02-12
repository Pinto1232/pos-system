import keycloak from '@/auth/keycloak';

test('Keycloak instance is defined', () => {
  expect(keycloak).toBeDefined();
});
