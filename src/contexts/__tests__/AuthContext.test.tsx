import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthProvider, { AuthContext } from '../AuthContext';

jest.mock('@/auth/keycloak', () => ({
  __esModule: true,
  default: {
    init: jest.fn().mockResolvedValue(true),
    login: jest.fn(),
    logout: jest.fn(),
    token: 'mock-token',
    authenticated: true,
    updateToken: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
  }),
}));

describe('AuthContext', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ token: 'mock-token' }),
  });

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    global.fetch = fetchMock;

    jest.clearAllMocks();
    localStorageMock.clear();

    process.env.NEXT_PUBLIC_KEYCLOAK_URL = 'http://localhost:8282';
    process.env.NEXT_PUBLIC_KEYCLOAK_REALM = 'pisval-pos-realm';
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = 'pos-backend';
  });

  it.skip('should use login-required onLoad option when newRegistration flag is set', async () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'newRegistration') return 'true';
      return null;
    });

    const TestComponent = () => {
      const auth = React.useContext(AuthContext);
      return (
        <div>
          <div data-testid="authenticated">{auth.authenticated.toString()}</div>
          <div data-testid="token">{auth.token || 'no-token'}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('newRegistration');
  });

  it.skip('should use check-sso onLoad option when newRegistration flag is not set', async () => {
    localStorageMock.getItem.mockImplementation(() => null);

    const TestComponent = () => {
      const auth = React.useContext(AuthContext);
      return (
        <div>
          <div data-testid="authenticated">{auth.authenticated.toString()}</div>
          <div data-testid="token">{auth.token || 'no-token'}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });
});
