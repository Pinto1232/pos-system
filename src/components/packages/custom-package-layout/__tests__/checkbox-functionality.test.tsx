import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PackageProvider } from '../context/PackageContext';
import PackageDetailsStep from '../components/steps/PackageDetailsStep';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

// Mock data
const mockAddOns = [
  {
    id: 1,
    name: 'Premium Support',
    description: 'Premium support service',
    price: 199.99,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 2,
    name: 'Advanced Analytics',
    description: 'Advanced analytics features',
    price: 299.99,
    currency: 'USD',
    isActive: true,
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

const mockInitialData = {
  features: [],
  addOns: mockAddOns,
  usagePricing: [],
  selectedFeatures: [],
  selectedAddOns: [],
  usageQuantities: {},
  basePrice: 2199.99,
  packageDetails: {
    title: 'Custom Pro',
    description: 'Customize your package to fit your business needs',
    testPeriod: 30,
  },
  selectedPackage: mockPackage,
  isCustomizable: true,
  currentStep: 0,
  currentCurrency: 'USD',
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

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CurrencyProvider>
    <PackageProvider initialData={mockInitialData} callbacks={mockCallbacks}>
      {children}
    </PackageProvider>
  </CurrencyProvider>
);

describe('Custom Package Checkbox Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render checkboxes for each add-on and billing period', async () => {
    render(
      <TestWrapper>
        <PackageDetailsStep />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for Premium Support checkboxes
      expect(
        screen.getByLabelText(/Select Premium Support for Monthly billing/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Select Premium Support for Quarterly billing/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Select Premium Support for Annual billing/i)
      ).toBeInTheDocument();

      // Check for Advanced Analytics checkboxes
      expect(
        screen.getByLabelText(/Select Advanced Analytics for Monthly billing/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(
          /Select Advanced Analytics for Quarterly billing/i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Select Advanced Analytics for Annual billing/i)
      ).toBeInTheDocument();
    });
  });

  it('should disable Continue button when no checkboxes are selected', async () => {
    render(
      <TestWrapper>
        <PackageDetailsStep />
      </TestWrapper>
    );

    await waitFor(() => {
      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toBeDisabled();
    });
  });

  it('should enable Continue button when any checkbox is selected', async () => {
    render(
      <TestWrapper>
        <PackageDetailsStep />
      </TestWrapper>
    );

    await waitFor(() => {
      const premiumSupportMonthlyCheckbox = screen.getByLabelText(
        /Select Premium Support for Monthly billing/i
      );
      const continueButton = screen.getByRole('button', { name: /continue/i });

      // Initially disabled
      expect(continueButton).toBeDisabled();

      // Click checkbox
      fireEvent.click(premiumSupportMonthlyCheckbox);

      // Should be enabled now
      expect(continueButton).toBeEnabled();
    });
  });

  it('should allow multiple checkboxes to be selected', async () => {
    render(
      <TestWrapper>
        <PackageDetailsStep />
      </TestWrapper>
    );

    await waitFor(() => {
      const premiumSupportMonthlyCheckbox = screen.getByLabelText(
        /Select Premium Support for Monthly billing/i
      );
      const analyticsQuarterlyCheckbox = screen.getByLabelText(
        /Select Advanced Analytics for Quarterly billing/i
      );

      // Select first checkbox
      fireEvent.click(premiumSupportMonthlyCheckbox);
      expect(premiumSupportMonthlyCheckbox).toBeChecked();

      // Select second checkbox
      fireEvent.click(analyticsQuarterlyCheckbox);
      expect(analyticsQuarterlyCheckbox).toBeChecked();

      // Both should remain checked
      expect(premiumSupportMonthlyCheckbox).toBeChecked();
      expect(analyticsQuarterlyCheckbox).toBeChecked();
    });
  });

  it('should disable Continue button when all checkboxes are deselected', async () => {
    render(
      <TestWrapper>
        <PackageDetailsStep />
      </TestWrapper>
    );

    await waitFor(() => {
      const premiumSupportMonthlyCheckbox = screen.getByLabelText(
        /Select Premium Support for Monthly billing/i
      );
      const continueButton = screen.getByRole('button', { name: /continue/i });

      // Select checkbox
      fireEvent.click(premiumSupportMonthlyCheckbox);
      expect(continueButton).toBeEnabled();

      // Deselect checkbox
      fireEvent.click(premiumSupportMonthlyCheckbox);
      expect(continueButton).toBeDisabled();
    });
  });
});
