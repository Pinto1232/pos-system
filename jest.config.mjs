import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[jt]sx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(keycloak-js)/)"
  ],
  // Optionally, if mocking keycloak-js instead:
  // moduleNameMapper: {
  //   '^keycloak-js$': '<rootDir>/__mocks__/keycloak-js.js'
  // },
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
};

export default createJestConfig(customJestConfig);
