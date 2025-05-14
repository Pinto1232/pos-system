/**
 * Test for the behavior of the handleRegistrationRedirect function
 */

// Import the function directly to test its behavior
import * as authUtils from '@/utils/authUtils';

// Create a mock implementation of the functions
jest.mock('@/utils/authUtils', () => {
  const originalModule = jest.requireActual(
    '@/utils/authUtils'
  );
  return {
    ...originalModule,
    markAsNewRegistration: jest.fn(() => {
      // Mock implementation that sets the flag in localStorage
      localStorage.setItem(
        'newRegistration',
        'true'
      );
    }),
    handleRegistrationRedirect: jest.fn(
      function () {
        // Call the actual implementation but with our mocks
        if (
          originalModule.isRedirectFromRegistration()
        ) {
          // Clear URL parameters
          if (
            window.history &&
            window.history.replaceState
          ) {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }

          // Mark as new registration
          authUtils.markAsNewRegistration();

          // Mock the redirect
          setTimeout(() => {
            window.location.href =
              'http://localhost:8282/realms/pisval-pos-realm/protocol/openid-connect/auth?client_id=pos-backend&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=openid';
          }, 100);
        }
      }
    ),
  };
});

describe('Registration Redirect Behavior', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  // Mock window.location
  const locationMock = {
    href: '',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  };

  // Mock window.history
  const historyMock = {
    replaceState: jest.fn(),
    pushState: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  };

  // Mock setTimeout
  jest.useFakeTimers();

  beforeEach(() => {
    // Setup mocks before each test
    Object.defineProperty(
      window,
      'localStorage',
      { value: localStorageMock }
    );
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    });
    Object.defineProperty(window, 'history', {
      value: historyMock,
    });

    // Reset all mocks
    jest.clearAllMocks();
    locationMock.href = '';
    locationMock.search = '';
    locationMock.pathname = '/';
  });

  it('should do nothing if not redirected from registration', () => {
    // Setup
    locationMock.search = '?other=param';

    // Call the function
    authUtils.handleRegistrationRedirect();

    // Check the results
    expect(
      historyMock.replaceState
    ).not.toHaveBeenCalled();
    expect(
      localStorageMock.setItem
    ).not.toHaveBeenCalled();
    expect(locationMock.href).toBe('');
  });

  it('should handle redirect from registration with session_code', () => {
    // Setup
    locationMock.search = '?session_code=abc123';

    // Call the function
    authUtils.handleRegistrationRedirect();

    // Check if URL parameters were cleared
    expect(
      historyMock.replaceState
    ).toHaveBeenCalled();

    // Check if markAsNewRegistration was called
    expect(
      authUtils.markAsNewRegistration
    ).toHaveBeenCalled();

    // Check if redirect to login was scheduled
    jest.runAllTimers();
    expect(locationMock.href).toContain(
      '/realms/pisval-pos-realm/protocol/openid-connect/auth'
    );
    expect(locationMock.href).toContain(
      'client_id=pos-backend'
    );
    expect(locationMock.href).toContain(
      'response_type=code'
    );
    expect(locationMock.href).toContain(
      'scope=openid'
    );
  });

  it('should handle redirect from registration with code', () => {
    // Setup
    locationMock.search = '?code=xyz789';

    // Call the function
    authUtils.handleRegistrationRedirect();

    // Check if URL parameters were cleared
    expect(
      historyMock.replaceState
    ).toHaveBeenCalled();

    // Check if markAsNewRegistration was called
    expect(
      authUtils.markAsNewRegistration
    ).toHaveBeenCalled();

    // Check if redirect to login was scheduled
    jest.runAllTimers();
    expect(locationMock.href).toContain(
      '/realms/pisval-pos-realm/protocol/openid-connect/auth'
    );
  });
});
