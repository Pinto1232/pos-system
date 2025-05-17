import {
  markAsNewRegistration,
  redirectToKeycloakRegistration,
  isRedirectFromRegistration,
  handleRegistrationRedirect,
} from '../authUtils';

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

describe('Authentication Utilities', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    });
    Object.defineProperty(window, 'history', {
      value: historyMock,
    });

    jest.clearAllMocks();
    localStorageMock.clear();
    locationMock.href = '';
    locationMock.search = '';
    locationMock.pathname = '/';
  });

  describe('markAsNewRegistration', () => {
    it('should set the newRegistration flag in localStorage', () => {
      jest.spyOn(window.localStorage, 'setItem');

      markAsNewRegistration();

      expect(window.localStorage.setItem).toHaveBeenCalledWith('newRegistration', 'true');
    });
  });

  describe('redirectToKeycloakRegistration', () => {
    it('should mark as new registration and redirect to Keycloak registration page', () => {
      const markAsNewRegistrationSpy = jest.spyOn(window.localStorage, 'setItem');

      redirectToKeycloakRegistration();

      expect(markAsNewRegistrationSpy).toHaveBeenCalledWith('newRegistration', 'true');

      expect(locationMock.href).toContain('/realms/pisval-pos-realm/protocol/openid-connect/registrations');
      expect(locationMock.href).toContain('client_id=pos-backend');
      expect(locationMock.href).toContain(`redirect_uri=${encodeURIComponent('http://localhost:3000/')}`);
    });

    it('should use custom parameters when provided', () => {
      const markAsNewRegistrationSpy = jest.spyOn(window.localStorage, 'setItem');

      redirectToKeycloakRegistration(
        'https://custom-keycloak.example.com',
        'custom-realm',
        'custom-client',
        'https://custom-redirect.example.com'
      );

      expect(markAsNewRegistrationSpy).toHaveBeenCalledWith('newRegistration', 'true');

      expect(locationMock.href).toContain('https://custom-keycloak.example.com');
      expect(locationMock.href).toContain('/realms/custom-realm/protocol/openid-connect/registrations');
      expect(locationMock.href).toContain('client_id=custom-client');
      expect(locationMock.href).toContain(`redirect_uri=${encodeURIComponent('https://custom-redirect.example.com')}`);
    });
  });

  describe('isRedirectFromRegistration', () => {
    it('should return true when URL has session_code parameter', () => {
      locationMock.search = '?session_code=abc123';

      const result = isRedirectFromRegistration();

      expect(result).toBe(true);
    });

    it('should return true when URL has code parameter', () => {
      locationMock.search = '?code=xyz789';

      const result = isRedirectFromRegistration();

      expect(result).toBe(true);
    });

    it('should return false when URL has neither session_code nor code parameter', () => {
      locationMock.search = '?other=param';

      const result = isRedirectFromRegistration();

      expect(result).toBe(false);
    });
  });

  describe('handleRegistrationRedirect', () => {
    jest.useFakeTimers();

    it('should do nothing if not redirected from registration', () => {
      locationMock.search = '?other=param';

      handleRegistrationRedirect();

      expect(historyMock.replaceState).not.toHaveBeenCalled();
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
      expect(locationMock.href).toBe('');
    });

    it('should handle redirect from registration with session_code', () => {
      locationMock.search = '?session_code=abc123';

      const localStorageSpy = jest.spyOn(window.localStorage, 'setItem');

      handleRegistrationRedirect();

      expect(historyMock.replaceState).toHaveBeenCalled();

      expect(localStorageSpy).toHaveBeenCalledWith('newRegistration', 'true');

      jest.runAllTimers();
      expect(locationMock.href).toContain('/realms/pisval-pos-realm/protocol/openid-connect/auth');
      expect(locationMock.href).toContain('client_id=pos-backend');
      expect(locationMock.href).toContain('response_type=code');
      expect(locationMock.href).toContain('scope=openid');
    });

    it('should handle redirect from registration with code', () => {
      locationMock.search = '?code=xyz789';

      const localStorageSpy = jest.spyOn(window.localStorage, 'setItem');

      handleRegistrationRedirect();

      expect(historyMock.replaceState).toHaveBeenCalled();

      expect(localStorageSpy).toHaveBeenCalledWith('newRegistration', 'true');

      jest.runAllTimers();
      expect(locationMock.href).toContain('/realms/pisval-pos-realm/protocol/openid-connect/auth');
    });
  });
});
