// jest.setup.js
import '@testing-library/jest-dom';

// Mock Keycloak
jest.mock('keycloak-js', () => {
  return function () {
    return {
      init: jest.fn().mockResolvedValue(true),
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      accountManagement: jest.fn(),
      createLoginUrl: jest.fn().mockReturnValue('http://mock-login-url'),
      createLogoutUrl: jest.fn().mockReturnValue('http://mock-logout-url'),
      createRegisterUrl: jest.fn().mockReturnValue('http://mock-register-url'),
      createAccountUrl: jest.fn().mockReturnValue('http://mock-account-url'),
      isTokenExpired: jest.fn().mockReturnValue(false),
      updateToken: jest.fn().mockResolvedValue(true),
      clearToken: jest.fn(),
      hasRealmRole: jest.fn().mockReturnValue(true),
      hasResourceRole: jest.fn().mockReturnValue(true),
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
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: '/',
  })),
  usePathname: jest.fn(() => '/'),
}));

// Mock Next.js link
jest.mock('next/link', () => {
  return ({ children, ...props }) => {
    return (
      <a
        {...props}
        onClick={(e) => {
          if (props.onClick) props.onClick(e);
          e.preventDefault();
        }}
      >
        {children}
      </a>
    );
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockSessionStorage.clear();
  mockLocalStorage.clear();
});
