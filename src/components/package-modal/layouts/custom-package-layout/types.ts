export interface Package {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: "starter" | "growth" | "enterprise" | "custom" | "premium";
  isCustomizable: boolean; // Add this property
  selectedFeatures?: number[] | null;
  selectedAddOns?: number[] | null;
  selectedUsageBasedPricing?: UsagePricing[] | null;
}

  
  export interface Feature {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    isRequired: boolean;
  }
  
  export interface AddOn {
    id: number;
    name: string;
    description: string;
    price: number;
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