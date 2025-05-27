import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { PackageProvider } from '../../../context/PackageContext';
import UsageStep from '../UsageStep';

const mockUsagePricing = [
  {
    id: 1,
    featureId: 1,
    name: 'Number of Transactions',
    unit: 'transactions/month',
    minValue: 1000,
    maxValue: 100000,
    pricePerUnit: 0.01,
    defaultValue: 1000,
    multiCurrencyPrices: {
      USD: 0.01,
      EUR: 0.009,
      GBP: 0.0075,
      ZAR: 0.18,
    },
  },
  {
    id: 2,
    featureId: 2,
    name: 'Number of Products',
    unit: 'products',
    minValue: 100,
    maxValue: 10000,
    pricePerUnit: 0.05,
    defaultValue: 100,
    multiCurrencyPrices: {
      USD: 0.05,
      EUR: 0.045,
      GBP: 0.0375,
      ZAR: 0.9,
    },
  },
  {
    id: 3,
    featureId: 3,
    name: 'Number of Users',
    unit: 'users',
    minValue: 1,
    maxValue: 100,
    pricePerUnit: 5.0,
    defaultValue: 1,
    multiCurrencyPrices: {
      USD: 5.0,
      EUR: 4.5,
      GBP: 3.75,
      ZAR: 90.0,
    },
  },
];

const mockPackage = {
  id: 1,
  title: 'Custom Pro',
  description: 'Custom Pro package',
  icon: 'custom-icon',
  extraDescription: 'Additional description',
  price: 2199.99,
  testPeriodDays: 30,
  type: 'custom-pro' as const,
  isCustomizable: true,
  multiCurrencyPrices: '{"USD": 2199.99, "EUR": 1999.99}',
};

const mockInitialDataWithUsage = {
  features: [],
  addOns: [],
  usagePricing: mockUsagePricing,
  selectedFeatures: [],
  selectedAddOns: [],
  usageQuantities: {
    1: 1000,
    2: 100,
    3: 1,
  },
  basePrice: 2199.99,
  calculatedPrice: 2199.99,
  packageDetails: {
    title: 'Custom Pro',
    description: 'Customize your package to fit your business needs',
    testPeriod: 30,
  },
  selectedPackage: mockPackage,
  isCustomizable: true,
  currentStep: 3, // Usage step
  currentCurrency: 'USD',
  enterpriseFeatures: {},
};

const mockInitialDataWithoutUsage = {
  ...mockInitialDataWithUsage,
  usagePricing: [],
  usageQuantities: {
    1: 1000,
    2: 100,
    3: 1,
  },
};

const mockCallbacks = {
  onNext: jest.fn(),
  onBack: jest.fn(),
  onSave: jest.fn(),
  onFeatureToggle: jest.fn(),
  onAddOnToggle: jest.fn(),
  onUsageChange: jest.fn(),
  setSelectedCurrency: jest.fn(),
};

const TestWrapper: React.FC<{
  children: React.ReactNode;
  initialData?: typeof mockInitialDataWithUsage;
}> = ({ children, initialData = mockInitialDataWithUsage }) => (
  <CurrencyProvider>
    <PackageProvider initialData={initialData} callbacks={mockCallbacks}>
      {children}
    </PackageProvider>
  </CurrencyProvider>
);

describe('UsageStep Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render usage configuration inputs when usage pricing data is available', async () => {
    render(
      <TestWrapper>
        <UsageStep />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Configure Usage')).toBeInTheDocument();
      expect(
        screen.getByText(/Adjust the usage metrics to fit your business needs/)
      ).toBeInTheDocument();

      // Check for usage inputs
      expect(screen.getByText('Number of Transactions')).toBeInTheDocument();
      expect(screen.getByText('Number of Products')).toBeInTheDocument();
      expect(screen.getByText('Number of Users')).toBeInTheDocument();

      // Check for unit labels
      expect(screen.getByText('$0.01/transactions/month')).toBeInTheDocument();
      expect(screen.getByText('$0.05/products')).toBeInTheDocument();
      expect(screen.getByText('$5.00/users')).toBeInTheDocument();
    });
  });

  it('should show "No usage metrics to configure" when no usage pricing data is available', async () => {
    render(
      <TestWrapper initialData={mockInitialDataWithoutUsage}>
        <UsageStep />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Configure Usage')).toBeInTheDocument();
      expect(
        screen.getByText('No usage metrics to configure')
      ).toBeInTheDocument();

      // Should have a Continue button in the empty state
      const continueButtons = screen.getAllByText('Continue');
      expect(continueButtons.length).toBeGreaterThan(0);
    });
  });

  it('should display default values in input fields', async () => {
    render(
      <TestWrapper>
        <UsageStep />
      </TestWrapper>
    );

    await waitFor(() => {
      const transactionInput = screen.getByDisplayValue('1000');
      const productInput = screen.getByDisplayValue('100');
      const userInput = screen.getByDisplayValue('1');

      expect(transactionInput).toBeInTheDocument();
      expect(productInput).toBeInTheDocument();
      expect(userInput).toBeInTheDocument();
    });
  });

  it('should allow users to update usage quantities', async () => {
    render(
      <TestWrapper>
        <UsageStep />
      </TestWrapper>
    );

    await waitFor(() => {
      const transactionInput = screen.getByDisplayValue('1000');

      fireEvent.change(transactionInput, { target: { value: '5000' } });

      expect(transactionInput).toHaveValue(5000);
    });
  });

  it('should show validation errors for invalid values', async () => {
    render(
      <TestWrapper>
        <UsageStep />
      </TestWrapper>
    );

    await waitFor(() => {
      const transactionInput = screen.getByLabelText(
        'Number of Transactions quantity'
      );

      // Try to set a value below minimum
      fireEvent.change(transactionInput, { target: { value: '500' } });

      // Should show validation error
      expect(
        screen.getByText('Value must be between 1000 and 100000')
      ).toBeInTheDocument();
    });
  });

  it('should have a Continue button with pricing information', async () => {
    render(
      <TestWrapper>
        <UsageStep />
      </TestWrapper>
    );

    await waitFor(() => {
      const continueButton = screen.getByRole('button', {
        name: /continue to next step/i,
      });
      expect(continueButton).toBeInTheDocument();
      expect(continueButton).toBeEnabled();
    });
  });
});
