import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PricingPackagesContainer from '../PricingPackagesContainer';
import { useApiClient } from '@/api/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const AuthContext = React.createContext({
  authenticated: true,
  setAuthenticated: (value: boolean) => {},
  token: null,
});

jest.mock('@/api/axiosClient', () => ({
  useApiClient: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@/contexts/PackageSelectionContext', () => ({
  usePackageSelection: jest.fn(() => ({
    selectPackage: jest.fn(),
    isPackageDisabled: jest.fn(() => false),
  })),
}));

jest.mock('@/contexts/CurrencyContext', () => ({
  useCurrency: jest.fn(() => ({
    currency: 'USD',
    rate: 1,
    formatPrice: jest.fn((price) => price.toString()),
    currencySymbol: '$',
  })),
}));

jest.mock('../PricingPackageCard', () => {
  return function MockPricingPackageCard({ packageData }: any) {
    return (
      <div data-testid={`package-card-${packageData.type}`}>
        {packageData.title}
      </div>
    );
  };
});

describe('PricingPackagesContainer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useApiClient as jest.Mock).mockReturnValue({
      get: jest.fn(),
    });

    (usePackageSelection as jest.Mock).mockReturnValue({
      selectPackage: jest.fn(),
      isPackageDisabled: jest.fn().mockReturnValue(false),
    });

    (useCurrency as jest.Mock).mockReturnValue({
      currency: 'USD',
      rate: 1,
      formatPrice: jest.fn((price) => price.toString()),
      currencySymbol: '$',
    });
  });

  it('should display error message when API call fails', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      error: new Error('API call failed'),
      isLoading: false,
      refetch: jest.fn(),
    });

    render(
      <AuthContext.Provider
        value={{
          authenticated: true,
          setAuthenticated: jest.fn(),
        }}
      >
        <PricingPackagesContainer />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('No pricing packages available at this time.')
      ).toBeInTheDocument();
    });
  });

  it('should display error message when API returns empty data', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });

    render(
      <AuthContext.Provider
        value={{
          authenticated: true,
          setAuthenticated: jest.fn(),
        }}
      >
        <PricingPackagesContainer />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('No pricing packages available at this time.')
      ).toBeInTheDocument();
    });
  });

  it('should display sign-in message when not authenticated', async () => {
    render(
      <AuthContext.Provider
        value={{
          authenticated: false,
          setAuthenticated: jest.fn(),
        }}
      >
        <PricingPackagesContainer />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Sign in to view your personalized pricing packages')
      ).toBeInTheDocument();
    });

    expect(screen.queryByTestId(/package-card-/)).not.toBeInTheDocument();
  });

  it.skip('should display packages from API when call succeeds', async () => {});
});
