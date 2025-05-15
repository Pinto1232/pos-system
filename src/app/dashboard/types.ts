export interface UserSubscriptionData {
  id: number;
  userId: string;
  pricingPackageId: number;
  package?: {
    id: number;
    title: string;
    type: string;
  };
  startDate: string;
  isActive: boolean;
  enabledFeatures: string[];
  additionalPackages: any[];
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
