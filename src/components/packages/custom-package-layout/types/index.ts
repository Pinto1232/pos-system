export interface Package {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: 'starter' | 'growth' | 'enterprise' | 'custom' | 'custom-pro' | 'premium';
  isCustomizable: boolean;
  selectedFeatures?: number[] | null;
  selectedAddOns?: number[] | null;
  selectedUsageBasedPricing?: UsagePricing[] | null;
  multiCurrencyPrices: string;
  currency?: string;
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
  currency?: string;
  multiCurrencyPrices?: Record<string, number>;
  category?: string;
  isActive?: boolean;
  features?: string[] | string;
  dependencies?: string[] | string;
  icon?: string;
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

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

export interface PackageDetails {
  title: string;
  description: string;
  testPeriod: number;
}

export interface PricingState {
  totalFeaturePrice: number;
  featurePrices: Record<number, number>;
  planDiscount: number;
  supportPrice: number;
  totalPrice: number;
}

export interface EnterpriseFeatures {
  [key: string]: boolean;
}

export interface SavedPackageData {
  selectedFeatures: Feature[];
  selectedAddOns: AddOn[];
  usageQuantities: Record<number, number>;
  calculatedPrice: number;
  selectedCurrency: string;
  formData: FormData;
  planDiscount: number;
  supportLevel: number | null;
  supportPrice: number;
}

export interface SuccessMessageData {
  formData?: FormData;
  selectedFeatures?: Feature[];
  selectedAddOns?: AddOn[];
  usageQuantities?: Record<number, number>;
  calculatedPrice?: number;
  selectedCurrency?: string;
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
    message: string,
    packageData?: SuccessMessageData
  ) => void;
  basePrice: number;
  calculatedPrice: number;
  packageDetails: PackageDetails;
  selectedPackage: Package;
  onNext: () => void;
  onBack: () => void;
  onSave: (data: SavedPackageData) => void;
  onFeatureToggle: (features: Feature[]) => void;
  onAddOnToggle: (addOns: AddOn[]) => void;
  onUsageChange: (quantities: Record<number, number>) => void;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
  enterpriseFeatures?: EnterpriseFeatures;
  onEnterpriseFeatureToggle?: (featureId: string) => void;
  currentCurrency?: string;
}

export interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  isBackLoading: boolean;
}

export interface PackageDetailsStepProps extends StepProps {
  packageDetails: PackageDetails;
  basePrice: number;
  isCustomizable: boolean;
  totalPrice: number;
  totalFeaturePrice: number;
  supportPrice: number;
  planDiscount: number;
  selectedCurrency: string;
  formatPrice: (currency: string, price: number) => string;
  addOns: AddOn[];
  checkboxStates: Record<string, boolean>;
  handleCheckboxChange: (id: string) => void;
  isAnyCheckboxSelected: () => boolean;
  handleSave: () => void;
  featurePrices: Record<number, number>;
}

export interface CoreFeaturesStepProps extends StepProps {
  features: Feature[];
  selectedFeatures: Feature[];
  handleFeatureToggle: (feature: Feature) => void;
  selectedCurrency: string;
  formatPrice: (currency: string, price: number) => string;
  totalPrice: number;
}

export interface AddOnsStepProps extends StepProps {
  addOns: AddOn[];
  selectedAddOns: AddOn[];
  handleAddOnToggle: (addOn: AddOn) => void;
  selectedCurrency: string;
  formatPrice: (currency: string, price: number) => string;
  totalPrice: number;
  featurePrices: Record<number, number>;
}

export interface UsageStepProps extends StepProps {
  usagePricing: UsagePricing[];
  usageQuantities: Record<number, number>;
  handleUsageUpdate: (id: number, value: string) => void;
  selectedCurrency: string;
  formatPrice: (currency: string, price: number) => string;
  totalPrice: number;
}

export interface PaymentPlanStepProps extends StepProps {
  basePrice: number;
  totalFeaturePrice: number;
  supportPrice: number;
  selectedPlanIndex: number | null;
  handlePlanSelect: (index: number) => void;
  selectedCurrency: string;
  formatPrice: (currency: string, price: number) => string;
  getCurrentCurrencySymbol: () => string;
  formatCurrencyPrice: (price: number) => string;
  convertPrice: (price: number) => number;
}

export interface SupportLevelStepProps extends StepProps {
  basePrice: number;
  totalFeaturePrice: number;
  selectedSupportIndex: number | null;
  handleSupportSelect: (index: number) => void;
  selectedCurrency: string;
  formatPrice: (currency: string, price: number) => string;
}

export interface EnterpriseStepProps extends StepProps {
  enterpriseFeatures?: EnterpriseFeatures;
  onEnterpriseFeatureToggle?: (featureId: string) => void;
  activeEnterpriseCategory: string | null;
  isEnterpriseFeatureDisabled: (category: string) => boolean;
  handleEnterpriseFeatureToggle: (
    featureName: string,
    category: string
  ) => void;
  dialogOpen: boolean;
  handleDialogClose: () => void;
  handleInfoClick: () => void;
  isAnyEnterpriseFeatureSelected: () => boolean;
}

export interface ReviewStepProps extends StepProps {
  formData: FormData;
  handleTextFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
  countries: string[];
  states: string[];
  basePrice: number;
  totalFeaturePrice: number;
  supportPrice: number;
  planDiscount: number;
  totalPrice: number;
  selectedCurrency: string;
  formatPrice: (currency: string, price: number) => string;
  getCurrencySymbol: (currency: string) => string;
  formatCurrencyPrice: (price: number) => string;
  onShowSuccessMessage?: (
    message: string,
    packageData?: SuccessMessageData
  ) => void;
}

import { SelectChangeEvent } from '@mui/material/Select';
