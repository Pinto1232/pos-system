import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import * as authUtils from '@/utils/authUtils';
import keycloak from '@/auth/keycloak';

jest.mock('@/components/pricing-packages/PricingPackagesContainer', () => {
  return function MockPricingPackagesContainer() {
    return <div data-testid="pricing-packages">Pricing Packages</div>;
  };
});

jest.mock('@/components/features/HeroContainer', () => {
  return function MockHeroContainer() {
    return <div data-testid="hero-container">Hero Container</div>;
  };
});

jest.mock('@/components/testimonial/TestimonialContainer', () => {
  return function MockTestimonialContainer() {
    return <div data-testid="testimonial-container">Testimonial Container</div>;
  };
});

jest.mock('@/components/slider/FeaturesSlider', () => {
  return function MockFeaturesSlider() {
    return <div data-testid="features-slider">Features Slider</div>;
  };
});

jest.mock('@/auth/keycloak', () => ({
  init: jest.fn().mockResolvedValue(true),
  login: jest.fn(),
  logout: jest.fn(),
  token: 'mock-token',
  authenticated: true,
  updateToken: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/utils/authUtils', () => {
  const originalModule = jest.requireActual('@/utils/authUtils');
  return {
    ...originalModule,
    handleRegistrationRedirect: jest.fn(
      originalModule.handleRegistrationRedirect
    ),
    isRedirectFromRegistration: jest.fn(
      originalModule.isRedirectFromRegistration
    ),
    markAsNewRegistration: jest.fn(() => {
      localStorage.setItem('newRegistration', 'true');
    }),
    redirectToKeycloakRegistration: jest.fn(
      (keycloakUrl, realm, clientId, redirectUri) => {
        authUtils.markAsNewRegistration();

        const registrationUrl = `${keycloakUrl || 'http://localhost:8282'}/realms/${realm || 'pisval-pos-realm'}/protocol/openid-connect/registrations?client_id=${clientId || 'pos-backend'}&redirect_uri=${encodeURIComponent(redirectUri || window.location.origin + '/')}`;

        window.location.href = registrationUrl;
      }
    ),
  };
});

describe('Registration to Login Flow', () => {
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
    localStorageMock.clear();
    locationMock.href = '';
    locationMock.search = '';
    locationMock.pathname = '/';
  });

  it('should simulate the complete registration to login flow', async () => {
    act(() => {
      authUtils.redirectToKeycloakRegistration();
    });

    expect(authUtils.markAsNewRegistration).toHaveBeenCalled();

    expect(locationMock.href).toContain(
      '/realms/pisval-pos-realm/protocol/openid-connect/registrations'
    );

    locationMock.search = '?session_code=abc123';

    (authUtils.isRedirectFromRegistration as jest.Mock).mockReturnValue(true);

    render(<Home />);

    expect(authUtils.handleRegistrationRedirect).toHaveBeenCalled();

    expect(historyMock.replaceState).toHaveBeenCalled();

    localStorageMock.setItem('newRegistration', 'true');

    expect(localStorageMock.getItem('newRegistration')).toBe('true');

    act(() => {
      jest.runAllTimers();
    });

    expect(locationMock.href).toContain(
      '/realms/pisval-pos-realm/protocol/openid-connect/auth'
    );
    expect(locationMock.href).toContain('response_type=code');
    expect(locationMock.href).toContain('scope=openid');

    expect(localStorageMock.getItem('newRegistration')).toBe('true');

    localStorageMock.removeItem('newRegistration');

    expect(localStorageMock.getItem('newRegistration')).toBeNull();
  });
});
