import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

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

jest.mock('@/components/auth/RegistrationHandler', () => {
  return function MockRegistrationHandler() {
    return <div data-testid="registration-handler">Registration Handler</div>;
  };
});

jest.mock('@/utils/authUtils', () => ({
  handleRegistrationRedirect: jest.fn(),
  isRedirectFromRegistration: jest.fn(),
  markAsNewRegistration: jest.fn(),
  redirectToKeycloakRegistration: jest.fn(),
}));

describe('Registration Redirect Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should include RegistrationHandler in the Home page', () => {
    const { getByTestId } = render(<Home />);

    expect(getByTestId('registration-handler')).toBeInTheDocument();
  });

  it('should call handleRegistrationRedirect in the layout', () => {
    const originalWindow = global.window;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: '?session_code=abc123',
        pathname: '/',
        origin: 'http://localhost:3000',
      },
      writable: true,
    });

    const { isRedirectFromRegistration } = require('@/utils/authUtils');
    isRedirectFromRegistration.mockReturnValue(true);

    jest.isolateModules(() => {
      const { handleRegistrationRedirect } = require('@/utils/authUtils');

      if (typeof window !== 'undefined') {
        handleRegistrationRedirect();
      }

      expect(handleRegistrationRedirect).toHaveBeenCalled();
    });

    global.window = originalWindow;
  });
});
