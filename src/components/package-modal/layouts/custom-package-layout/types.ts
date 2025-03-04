export interface Package {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: "starter" | "growth" | "enterprise" | "custom" | "premium";
  isCustomizable: boolean;
  selectedFeatures?: number[] | null;
  selectedAddOns?: number[] | null;
  selectedUsageBasedPricing?: UsagePricing[] | null;
  multiCurrencyPrices: string; // Add this property
}

export interface Feature {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  isRequired: boolean;
  multiCurrencyPrices?: Record<string, number>; // Add this property
}

export interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  multiCurrencyPrices?: Record<string, number>; // Add this property
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