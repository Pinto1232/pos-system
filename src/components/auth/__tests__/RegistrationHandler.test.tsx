import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegistrationHandler } from '../RegistrationHandler';
import * as authUtils from '@/utils/authUtils';

// Mock the authUtils module
jest.mock('@/utils/authUtils', () => ({
  handleRegistrationRedirect: jest.fn(),
}));

describe('RegistrationHandler Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should call handleRegistrationRedirect when mounted', () => {
    // Render the component
    render(<RegistrationHandler />);

    // Check if handleRegistrationRedirect was called
    expect(
      authUtils.handleRegistrationRedirect
    ).toHaveBeenCalledTimes(1);
  });

  it('should not render any visible content', () => {
    // Render the component
    const { container } = render(
      <RegistrationHandler />
    );

    // Check if the component doesn't render any visible content
    expect(container.firstChild).toBeNull();
  });
});
