export interface Package {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type:
    | 'starter'
    | 'growth'
    | 'enterprise'
    | 'custom'
    | 'premium';
  isCustomizable: boolean;
  selectedFeatures?: number[] | null;
  selectedAddOns?: number[] | null;
  selectedUsageBasedPricing?:
    | UsagePricing[]
    | null;
  multiCurrencyPrices: string;
}

export interface Feature {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  isRequired: boolean;
  multiCurrencyPrices?: Record<string, number>;
}

export interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  multiCurrencyPrices?: Record<string, number>;
}

export interface UsagePricing {
  id: number;
  featureId: number;
  name: string;
  unit: string;
  minValue: number;
  maxValue: number;
  pricePerUnit: number;
  defaultValue: number;
  multiCurrencyPrices?: Record<string, number>;
}

export interface FeaturesResponse {
  coreFeatures: Feature[];
  addOns: AddOn[];
  usageBasedPricing: UsagePricing[];
}

export interface PriceCalculationRequest {
  packageId: number;
  selectedFeatures: number[];
  selectedAddOns: number[];
  usageLimits: Record<number, number>;
}

export interface PriceCalculationResponse {
  totalPrice: number;
}

export interface PackageSelectionRequest {
  packageId: number;
  features?: number[];
  addOns?: number[];
  usage?: Record<number, number>;
}

export interface CustomPackageLayoutProps {
  isCustomizable: boolean;
  currentStep: number;
  steps: string[];
  features: Feature[];
  addOns: AddOn[];
  usagePricing: UsagePricing[];
  selectedFeatures: Feature[];
  selectedAddOns: AddOn[];
  usageQuantities: Record<number, number>;
  onShowSuccessMessage?: (
    message: string
  ) => void;
  basePrice: number;
  calculatedPrice: number;
  packageDetails: {
    title: string;
    description: string;
    testPeriod: number;
  };
  selectedPackage: Package;
  onNext: () => void;
  onBack: () => void;
  onSave: (data: {
    selectedFeatures: Feature[];
    selectedAddOns: AddOn[];
    usageQuantities: Record<number, number>;
    calculatedPrice: number;
    selectedCurrency: string;
    formData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      country: string;
      state: string;
      city: string;
      zipCode: string;
    };
  }) => void;
  onFeatureToggle: (features: Feature[]) => void;
  onAddOnToggle: (addOns: AddOn[]) => void;
  onUsageChange: (
    quantities: Record<number, number>
  ) => void;
  setSelectedCurrency: React.Dispatch<
    React.SetStateAction<string>
  >;
  enterpriseFeatures?: Record<string, boolean>;
  onEnterpriseFeatureToggle?: (
    featureId: string
  ) => void;
}
