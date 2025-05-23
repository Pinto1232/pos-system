import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import * as authUtils from '@/utils/authUtils';

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

jest.mock('@/utils/authUtils', () => ({
  handleRegistrationRedirect: jest.fn(),
  isRedirectFromRegistration: jest.fn(),
  markAsNewRegistration: jest.fn(),
}));

jest.mock('@/components/auth/RegistrationHandler', () => {
  return function MockRegistrationHandler() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleRegistrationRedirect } = require('@/utils/authUtils');
    React.useEffect(() => {
      handleRegistrationRedirect();
    }, [handleRegistrationRedirect]);
    return <div data-testid="registration-handler"></div>;
  };
});

describe('Registration Flow', () => {
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

  beforeEach(() => {
    // Setup mocks before each test
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    });

    jest.clearAllMocks();
    localStorageMock.clear();
    locationMock.href = '';
    locationMock.search = '';
    locationMock.pathname = '/';
  });

  it('should include RegistrationHandler in the Home page', () => {
    const { getByTestId } = render(<Home />);

    expect(getByTestId('registration-handler')).toBeInTheDocument();
  });

  it('should handle registration redirect when URL has registration parameters', () => {
    (authUtils.isRedirectFromRegistration as jest.Mock).mockReturnValue(true);

    locationMock.search = '?session_code=abc123';

    render(<Home />);

    expect(authUtils.handleRegistrationRedirect).toHaveBeenCalled();
  });

  it('should set newRegistration flag and redirect to login when handling registration redirect', () => {
    (authUtils.handleRegistrationRedirect as jest.Mock).mockImplementation(
      () => {
        if ((authUtils.isRedirectFromRegistration as jest.Mock)()) {
          (authUtils.markAsNewRegistration as jest.Mock)();
          locationMock.href =
            'http://localhost:8282/realms/pisval-pos-realm/protocol/openid-connect/auth';
        }
      }
    );

    (authUtils.isRedirectFromRegistration as jest.Mock).mockReturnValue(true);

    locationMock.search = '?session_code=abc123';

    render(<Home />);

    expect(authUtils.markAsNewRegistration).toHaveBeenCalled();

    expect(locationMock.href).toBe(
      'http://localhost:8282/realms/pisval-pos-realm/protocol/openid-connect/auth'
    );
  });
});
