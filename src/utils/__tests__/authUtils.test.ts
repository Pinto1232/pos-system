/**
 * Tests for authentication utility functions
 */
// Import the functions directly to test their behavior
import {
  markAsNewRegistration,
  redirectToKeycloakRegistration,
  isRedirectFromRegistration,
  handleRegistrationRedirect,
} from '../authUtils';

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

describe('Authentication Utilities', () => {
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
    localStorageMock.clear();
    locationMock.href = '';
    locationMock.search = '';
    locationMock.pathname = '/';
  });

  describe('markAsNewRegistration', () => {
    it('should set the newRegistration flag in localStorage', () => {
      // Mock the implementation of localStorage.setItem
      jest.spyOn(window.localStorage, 'setItem');

      // Call the function
      markAsNewRegistration();

      // Check if localStorage.setItem was called
      expect(
        window.localStorage.setItem
      ).toHaveBeenCalledWith(
        'newRegistration',
        'true'
      );
    });
  });

  describe('redirectToKeycloakRegistration', () => {
    it('should mark as new registration and redirect to Keycloak registration page', () => {
      // Spy on markAsNewRegistration
      const markAsNewRegistrationSpy = jest.spyOn(
        window.localStorage,
        'setItem'
      );

      // Call the function with default parameters
      redirectToKeycloakRegistration();

      // Check if localStorage.setItem was called (via markAsNewRegistration)
      expect(
        markAsNewRegistrationSpy
      ).toHaveBeenCalledWith(
        'newRegistration',
        'true'
      );

      // Check if window.location.href was set to the Keycloak registration URL
      expect(locationMock.href).toContain(
        '/realms/pisval-pos-realm/protocol/openid-connect/registrations'
      );
      expect(locationMock.href).toContain(
        'client_id=pos-backend'
      );
      expect(locationMock.href).toContain(
        `redirect_uri=${encodeURIComponent('http://localhost:3000/')}`
      );
    });

    it('should use custom parameters when provided', () => {
      // Spy on markAsNewRegistration
      const markAsNewRegistrationSpy = jest.spyOn(
        window.localStorage,
        'setItem'
      );

      // Call the function with custom parameters
      redirectToKeycloakRegistration(
        'https://custom-keycloak.example.com',
        'custom-realm',
        'custom-client',
        'https://custom-redirect.example.com'
      );

      // Check if localStorage.setItem was called
      expect(
        markAsNewRegistrationSpy
      ).toHaveBeenCalledWith(
        'newRegistration',
        'true'
      );

      // Check if window.location.href was set to the custom Keycloak registration URL
      expect(locationMock.href).toContain(
        'https://custom-keycloak.example.com'
      );
      expect(locationMock.href).toContain(
        '/realms/custom-realm/protocol/openid-connect/registrations'
      );
      expect(locationMock.href).toContain(
        'client_id=custom-client'
      );
      expect(locationMock.href).toContain(
        `redirect_uri=${encodeURIComponent('https://custom-redirect.example.com')}`
      );
    });
  });

  describe('isRedirectFromRegistration', () => {
    it('should return true when URL has session_code parameter', () => {
      // Setup
      locationMock.search =
        '?session_code=abc123';

      // Call the function
      const result = isRedirectFromRegistration();

      // Check the result
      expect(result).toBe(true);
    });

    it('should return true when URL has code parameter', () => {
      // Setup
      locationMock.search = '?code=xyz789';

      // Call the function
      const result = isRedirectFromRegistration();

      // Check the result
      expect(result).toBe(true);
    });

    it('should return false when URL has neither session_code nor code parameter', () => {
      // Setup
      locationMock.search = '?other=param';

      // Call the function
      const result = isRedirectFromRegistration();

      // Check the result
      expect(result).toBe(false);
    });
  });

  describe('handleRegistrationRedirect', () => {
    // Mock setTimeout
    jest.useFakeTimers();

    it('should do nothing if not redirected from registration', () => {
      // Setup
      locationMock.search = '?other=param';

      // Call the function
      handleRegistrationRedirect();

      // Check the results
      expect(
        historyMock.replaceState
      ).not.toHaveBeenCalled();
      expect(
        window.localStorage.setItem
      ).not.toHaveBeenCalled();
      expect(locationMock.href).toBe('');
    });

    it('should handle redirect from registration with session_code', () => {
      // Setup
      locationMock.search =
        '?session_code=abc123';

      // Spy on localStorage.setItem
      const localStorageSpy = jest.spyOn(
        window.localStorage,
        'setItem'
      );

      // Call the function
      handleRegistrationRedirect();

      // Check if URL parameters were cleared
      expect(
        historyMock.replaceState
      ).toHaveBeenCalled();

      // Check if newRegistration flag was set
      expect(
        localStorageSpy
      ).toHaveBeenCalledWith(
        'newRegistration',
        'true'
      );

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

      // Spy on localStorage.setItem
      const localStorageSpy = jest.spyOn(
        window.localStorage,
        'setItem'
      );

      // Call the function
      handleRegistrationRedirect();

      // Check if URL parameters were cleared
      expect(
        historyMock.replaceState
      ).toHaveBeenCalled();

      // Check if newRegistration flag was set
      expect(
        localStorageSpy
      ).toHaveBeenCalledWith(
        'newRegistration',
        'true'
      );

      // Check if redirect to login was scheduled
      jest.runAllTimers();
      expect(locationMock.href).toContain(
        '/realms/pisval-pos-realm/protocol/openid-connect/auth'
      );
    });
  });
});
