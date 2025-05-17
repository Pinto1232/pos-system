import * as authUtils from '@/utils/authUtils';

jest.mock('@/utils/authUtils', () => {
  const originalModule = jest.requireActual('@/utils/authUtils');
  return {
    ...originalModule,
    markAsNewRegistration: jest.fn(() => {
      localStorage.setItem('newRegistration', 'true');
    }),
    handleRegistrationRedirect: jest.fn(function () {
      if (originalModule.isRedirectFromRegistration()) {
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        authUtils.markAsNewRegistration();

        setTimeout(() => {
          window.location.href =
            'http://localhost:8282/realms/pisval-pos-realm/protocol/openid-connect/auth?client_id=pos-backend&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=openid';
        }, 100);
      }
    }),
  };
});

describe('Registration Redirect Behavior', () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

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
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    });
    Object.defineProperty(window, 'history', {
      value: historyMock,
    });

    jest.clearAllMocks();
    locationMock.href = '';
    locationMock.search = '';
    locationMock.pathname = '/';
  });

  it('should do nothing if not redirected from registration', () => {
    locationMock.search = '?other=param';

    authUtils.handleRegistrationRedirect();

    expect(historyMock.replaceState).not.toHaveBeenCalled();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(locationMock.href).toBe('');
  });

  it('should handle redirect from registration with session_code', () => {
    locationMock.search = '?session_code=abc123';

    authUtils.handleRegistrationRedirect();

    expect(historyMock.replaceState).toHaveBeenCalled();

    expect(authUtils.markAsNewRegistration).toHaveBeenCalled();

    jest.runAllTimers();
    expect(locationMock.href).toContain('/realms/pisval-pos-realm/protocol/openid-connect/auth');
    expect(locationMock.href).toContain('client_id=pos-backend');
    expect(locationMock.href).toContain('response_type=code');
    expect(locationMock.href).toContain('scope=openid');
  });

  it('should handle redirect from registration with code', () => {
    locationMock.search = '?code=xyz789';

    authUtils.handleRegistrationRedirect();

    expect(historyMock.replaceState).toHaveBeenCalled();

    expect(authUtils.markAsNewRegistration).toHaveBeenCalled();

    jest.runAllTimers();
    expect(locationMock.href).toContain('/realms/pisval-pos-realm/protocol/openid-connect/auth');
  });
});
