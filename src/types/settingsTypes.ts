export interface TaxSettings {
  enableTaxCalculation: boolean;
  defaultTaxRate: number;
  taxCalculationMethod: 'inclusive' | 'exclusive';
  vatRegistered: boolean;
  vatNumber: string;
  enableMultipleTaxRates: boolean;
  taxCategories: TaxCategory[];
  displayTaxOnReceipts: boolean;
  enableTaxExemptions: boolean;
  taxReportingPeriod: 'monthly' | 'quarterly' | 'annually';
}

export interface TaxCategory {
  id: number;
  name: string;
  rate: number;
  description: string;
  isDefault: boolean;
}

export interface RegionalSettings {
  defaultCurrency: string;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  numberFormat: string;
  language: string;
  autoDetectLocation: boolean;
  enableMultiCurrency: boolean;
  supportedCurrencies: string[];
}

export interface UserCustomization {
  id: number;
  userId: string;
  sidebarColor: string;
  logoUrl: string;
  navbarColor: string;
  taxSettings?: TaxSettings;
  regionalSettings?: RegionalSettings;
}

export interface SettingsItem {
  label: string;
  tooltip: string;
}

export interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onCustomizationUpdated: (updated: UserCustomization) => void;
  initialSetting?: string;
}

export interface SettingsModalPresentationProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: Error | null;
  sidebarColor: string;
  setSidebarColor: (color: string) => void;
  navbarColor: string;
  setNavbarColor: (color: string) => void;
  logoPreview: string;
  showSidebarColorPicker: boolean;
  setShowSidebarColorPicker: (show: boolean) => void;
  showNavbarColorPicker: boolean;
  setShowNavbarColorPicker: (show: boolean) => void;
  selectedSetting: string;
  setSelectedSetting: (setting: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleLogoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleReset: () => void;
  taxSettings: TaxSettings;
  setTaxSettings: (settings: TaxSettings) => void;
  regionalSettings: RegionalSettings;
  setRegionalSettings: (settings: RegionalSettings) => void;
  selectedRoleTab: number;
  setSelectedRoleTab: (tab: number) => void;
  createRoleModalOpen: boolean;
  setCreateRoleModalOpen: (open: boolean) => void;
  newRoleName: string;
  setNewRoleName: (name: string) => void;
  newRoleDescription: string;
  setNewRoleDescription: (description: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  configurePermissionsAfter: boolean;
  setConfigurePermissionsAfter: (configure: boolean) => void;
  roleNameError: string;
  createRolePending: boolean;
  handleCreateRole: () => void;
  getTemplatePermissions: (template: string) => string[];
  packages: any[] | undefined;
  isPackagesLoading?: boolean;
  packagesError?: Error | null;
  refetchPackages?: () => void;
  subscription: any;
  availableFeatures: string[];
  enableAdditionalPackage: (packageId: number) => Promise<void>;
  disableAdditionalPackage: (packageId: number) => Promise<void>;
  cacheDuration: string;
  setCacheDuration: (duration: string) => void;
  autoRefreshOnFocus: boolean;
  setAutoRefreshOnFocus: (refresh: boolean) => void;
  prefetchImportantData: boolean;
  setPrefetchImportantData: (prefetch: boolean) => void;
  snackbarOpen: boolean;
  setSnackbarOpen: (open: boolean) => void;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'info' | 'warning';
  changeHistory: {
    timestamp: Date;
    setting: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  isSaving?: boolean;
}

export const settingsItems: SettingsItem[] = [
  {
    label: 'General Settings',
    tooltip: 'Configure application appearance, logo, and theme colors',
  },
  {
    label: 'Business Information',
    tooltip:
      'Manage your business details, contact information, and registration data',
  },
  {
    label: 'Tax & VAT Configuration',
    tooltip:
      'Set up tax rates, VAT settings, and configure tax calculation methods',
  },
  {
    label: 'Currency & Regional Settings',
    tooltip: 'Configure currencies, date formats, and regional preferences',
  },
  {
    label: 'User & Role Management',
    tooltip: 'Manage users, roles, and permissions for system access',
  },
  {
    label: 'Package Management',
    tooltip: 'Manage your subscription packages and enable additional features',
  },
  {
    label: 'Email & Notification Settings',
    tooltip:
      'Configure email servers, notification preferences, and message templates',
  },
  {
    label: 'System Backup & Restore',
    tooltip:
      'Create backups, schedule automatic backups, and restore from previous backups',
  },
  {
    label: 'API & Third-Party Integrations',
    tooltip:
      'Manage API keys and configure integrations with external services',
  },
  {
    label: 'Cache Management',
    tooltip: 'Manage application cache settings and refresh data when needed',
  },
  {
    label: 'Change History',
    tooltip: 'View history of changes made to settings',
  },
];
