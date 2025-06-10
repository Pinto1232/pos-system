export interface UserSubscriptionData {
  id: number;
  userId: string;
  pricingPackageId: number;
  package?: {
    id: number;
    title: string;
    type:
      | 'starter-plus'
      | 'growth-pro'
      | 'enterprise-elite'
      | 'custom-pro'
      | 'premium-plus';

    tierId?: number;
    tierLevel?: number;
    tierName?: string;
    tierDescription?: string;
  };
  startDate: string;
  isActive: boolean;
  enabledFeatures: string[];
  additionalPackages: number[];
}

export interface DashboardData {
  userSubscription: UserSubscriptionData | null;
  userCustomization?: {
    id: number;
    userId: string;
    sidebarColor: string;
    logoUrl: string;
    navbarColor: string;
    taxSettings: {
      enableTaxCalculation: boolean;
      defaultTaxRate: number;
    };
    regionalSettings: {
      defaultCurrency: string;
      dateFormat: string;
    };
  } | null;
}
