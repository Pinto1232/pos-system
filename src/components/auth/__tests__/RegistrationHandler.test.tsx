import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RegistrationHandler } from '../RegistrationHandler';
import * as authUtils from '@/utils/authUtils';

jest.mock('@/utils/authUtils', () => ({
  handleRegistrationRedirect: jest.fn(),
}));

describe('RegistrationHandler Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call handleRegistrationRedirect when mounted', () => {
    render(<RegistrationHandler />);

    expect(authUtils.handleRegistrationRedirect).toHaveBeenCalledTimes(1);
  });

  it('should not render any visible content', () => {
    const { container } = render(<RegistrationHandler />);

    expect(container.firstChild).toBeNull();
  });
});
