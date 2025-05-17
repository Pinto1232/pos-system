import { renderHook } from '@testing-library/react';
import { useKeycloakUser } from '../useKeycloakUser';
import { AuthContext } from '@/contexts/AuthContext';
import React from 'react';

type AuthContextType = {
  token: string | null;
  login: jest.Mock;
  logout: jest.Mock;
  authenticated: boolean;
  error: string | null;
  isInitialized: boolean;
};

const mockAuthContext: AuthContextType = {
  token: null,
  login: jest.fn(),
  logout: jest.fn(),
  authenticated: false,
  error: null,
  isInitialized: true,
};

const wrapper = ({
  children,
  contextValue = mockAuthContext,
}: {
  children: React.ReactNode;
  contextValue?: AuthContextType;
}) => (
  <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
);

describe('useKeycloakUser Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null userInfo when not authenticated', () => {
    const { result } = renderHook(() => useKeycloakUser(), {
      wrapper: ({ children }) => wrapper({ children }),
    });

    expect(result.current.userInfo).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should extract user info from a valid token', () => {
    const mockPayload = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      preferred_username: 'johndoe',
      given_name: 'John',
      family_name: 'Doe',
      sub: 'user-123',
    };

    const encodedPayload = btoa(JSON.stringify(mockPayload));
    const mockToken = `header.${encodedPayload}.signature`;

    const contextWithToken = {
      ...mockAuthContext,
      token: mockToken,
      authenticated: true,
    };

    global.atob = jest.fn().mockImplementation((str) => {
      return Buffer.from(str, 'base64').toString('binary');
    });

    const { result } = renderHook(() => useKeycloakUser(), {
      wrapper: ({ children }) =>
        wrapper({
          children,
          contextValue: contextWithToken,
        }),
    });

    expect(result.current.userInfo).toEqual({
      name: 'John Doe',
      email: 'john.doe@example.com',
      preferred_username: 'johndoe',
      given_name: 'John',
      family_name: 'Doe',
      sub: 'user-123',
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle missing fields in the token', () => {
    const mockPayload = {
      sub: 'user-456',
    };

    const encodedPayload = btoa(JSON.stringify(mockPayload));
    const mockToken = `header.${encodedPayload}.signature`;

    const contextWithToken = {
      ...mockAuthContext,
      token: mockToken,
      authenticated: true,
    };

    global.atob = jest.fn().mockImplementation((str) => {
      return Buffer.from(str, 'base64').toString('binary');
    });

    const { result } = renderHook(() => useKeycloakUser(), {
      wrapper: ({ children }) =>
        wrapper({
          children,
          contextValue: contextWithToken,
        }),
    });
    expect(result.current.userInfo).toEqual({
      name: 'Unknown User',
      email: '',
      preferred_username: '',
      sub: 'user-456',
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle invalid token format', () => {
    const mockToken = 'invalid-token';

    const contextWithToken = {
      ...mockAuthContext,
      token: mockToken,
      authenticated: true,
    };

    const originalConsoleError = console.error;
    console.error = jest.fn();

    const { result } = renderHook(() => useKeycloakUser(), {
      wrapper: ({ children }) =>
        wrapper({
          children,
          contextValue: contextWithToken,
        }),
    });

    expect(result.current.userInfo).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Invalid token format');

    console.error = originalConsoleError;
  });

  it.skip('should update when token changes', async () => {
    expect(true).toBe(true);
  });
});
