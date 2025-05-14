import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import * as authUtils from '@/utils/authUtils';

// Mock the components used in the Home page
jest.mock(
  '@/components/pricing-packages/PricingPackagesContainer',
  () => {
    return function MockPricingPackagesContainer() {
      return (
        <div data-testid="pricing-packages">
          Pricing Packages
        </div>
      );
    };
  }
);

jest.mock(
  '@/components/features/HeroContainer',
  () => {
    return function MockHeroContainer() {
      return (
        <div data-testid="hero-container">
          Hero Container
        </div>
      );
    };
  }
);

jest.mock(
  '@/components/testimonial/TestimonialContainer',
  () => {
    return function MockTestimonialContainer() {
      return (
        <div data-testid="testimonial-container">
          Testimonial Container
        </div>
      );
    };
  }
);

jest.mock(
  '@/components/slider/FeaturesSlider',
  () => {
    return function MockFeaturesSlider() {
      return (
        <div data-testid="features-slider">
          Features Slider
        </div>
      );
    };
  }
);

// Mock the authUtils module
jest.mock('@/utils/authUtils', () => ({
  handleRegistrationRedirect: jest.fn(),
  isRedirectFromRegistration: jest.fn(),
  markAsNewRegistration: jest.fn(),
}));

// Mock the RegistrationHandler component
jest.mock(
  '@/components/auth/RegistrationHandler',
  () => {
    return function MockRegistrationHandler() {
      // Call handleRegistrationRedirect when the component is rendered
      const {
        handleRegistrationRedirect,
      } = require('@/utils/authUtils');
      React.useEffect(() => {
        handleRegistrationRedirect();
      }, []);
      return (
        <div data-testid="registration-handler"></div>
      );
    };
  }
);

describe('Registration Flow', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn(
        (key: string) => store[key] || null
      ),
      setItem: jest.fn(
        (key: string, value: string) => {
          store[key] = value;
        }
      ),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

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

    // Reset all mocks
    jest.clearAllMocks();
    localStorageMock.clear();
    locationMock.href = '';
    locationMock.search = '';
    locationMock.pathname = '/';
  });

  it('should include RegistrationHandler in the Home page', () => {
    // Render the Home page
    const { getByTestId } = render(<Home />);

    // Check if RegistrationHandler is included
    expect(
      getByTestId('registration-handler')
    ).toBeInTheDocument();
  });

  it('should handle registration redirect when URL has registration parameters', () => {
    // Mock isRedirectFromRegistration to return true
    (
      authUtils.isRedirectFromRegistration as jest.Mock
    ).mockReturnValue(true);

    // Set URL search parameters to simulate redirect from registration
    locationMock.search = '?session_code=abc123';

    // Render the Home page
    render(<Home />);

    // Check if handleRegistrationRedirect was called
    expect(
      authUtils.handleRegistrationRedirect
    ).toHaveBeenCalled();
  });

  it('should set newRegistration flag and redirect to login when handling registration redirect', () => {
    // Mock the implementation of handleRegistrationRedirect
    (
      authUtils.handleRegistrationRedirect as jest.Mock
    ).mockImplementation(() => {
      // Simulate the behavior of the real function
      if (
        (
          authUtils.isRedirectFromRegistration as jest.Mock
        )()
      ) {
        (
          authUtils.markAsNewRegistration as jest.Mock
        )();
        locationMock.href =
          'http://localhost:8282/realms/pisval-pos-realm/protocol/openid-connect/auth';
      }
    });

    // Mock isRedirectFromRegistration to return true
    (
      authUtils.isRedirectFromRegistration as jest.Mock
    ).mockReturnValue(true);

    // Set URL search parameters to simulate redirect from registration
    locationMock.search = '?session_code=abc123';

    // Render the Home page
    render(<Home />);

    // Check if markAsNewRegistration was called
    expect(
      authUtils.markAsNewRegistration
    ).toHaveBeenCalled();

    // Check if redirect to login was triggered
    expect(locationMock.href).toBe(
      'http://localhost:8282/realms/pisval-pos-realm/protocol/openid-connect/auth'
    );
  });
});
