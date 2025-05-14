// Mock for keycloak-js
const mockKeycloak = function () {
  return {
    init: jest.fn().mockResolvedValue(true),
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    accountManagement: jest.fn(),
    createLoginUrl: jest
      .fn()
      .mockReturnValue('http://mock-login-url'),
    createLogoutUrl: jest
      .fn()
      .mockReturnValue('http://mock-logout-url'),
    createRegisterUrl: jest
      .fn()
      .mockReturnValue(
        'http://mock-register-url'
      ),
    createAccountUrl: jest
      .fn()
      .mockReturnValue('http://mock-account-url'),
    isTokenExpired: jest
      .fn()
      .mockReturnValue(false),
    updateToken: jest
      .fn()
      .mockResolvedValue(true),
    clearToken: jest.fn(),
    hasRealmRole: jest.fn().mockReturnValue(true),
    hasResourceRole: jest
      .fn()
      .mockReturnValue(true),
    loadUserProfile: jest.fn().mockResolvedValue({
      id: 'mock-user-id',
      username: 'mock-username',
      email: 'mock@example.com',
      firstName: 'Mock',
      lastName: 'User',
    }),
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    tokenParsed: {
      exp: Date.now() + 3600000,
      preferred_username: 'mock-username',
      email: 'mock@example.com',
      given_name: 'Mock',
      family_name: 'User',
      realm_access: {
        roles: ['user', 'admin'],
      },
    },
    onTokenExpired: jest.fn(),
    onAuthSuccess: jest.fn(),
    onAuthError: jest.fn(),
    onAuthRefreshSuccess: jest.fn(),
    onAuthRefreshError: jest.fn(),
    onAuthLogout: jest.fn(),
    authenticated: true,
  };
};

module.exports = mockKeycloak;
