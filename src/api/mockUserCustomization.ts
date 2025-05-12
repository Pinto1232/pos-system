import {
  UserCustomization,
  TaxSettings,
  //TaxCategory,
  RegionalSettings,
} from '@/SettingsModal';

const STORAGE_KEY = 'userCustomization';

export const mockFetchCustomization = async (
  userId: string
): Promise<UserCustomization> => {
  if (typeof window !== 'undefined') {
    try {
      const storedData =
        localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        console.log(
          'Found stored customization data in localStorage'
        );
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error(
        'Error accessing localStorage:',
        error
      );
    }
  }

  // Import the default settings from SettingsModal to ensure consistency
  const defaultTaxSettings: TaxSettings = {
    enableTaxCalculation: true,
    defaultTaxRate: 15.0,
    taxCalculationMethod: 'exclusive',
    vatRegistered: true,
    vatNumber: 'VAT2023456789',
    enableMultipleTaxRates: false,
    taxCategories: [
      {
        id: 1,
        name: 'Standard Rate',
        rate: 15.0,
        description:
          'Standard VAT rate for most goods and services',
        isDefault: true,
      },
      {
        id: 2,
        name: 'Reduced Rate',
        rate: 7.5,
        description:
          'Reduced rate for specific goods and services',
        isDefault: false,
      },
      {
        id: 3,
        name: 'Zero Rate',
        rate: 0,
        description:
          'Zero-rated goods and services',
        isDefault: false,
      },
    ],
    displayTaxOnReceipts: true,
    enableTaxExemptions: false,
    taxReportingPeriod: 'monthly',
  };

  // Create default regional settings
  const defaultRegionalSettings: RegionalSettings =
    {
      defaultCurrency: 'ZAR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Africa/Johannesburg',
      numberFormat: '#,###.##',
      language: 'en-ZA',
      autoDetectLocation: true,
      enableMultiCurrency: true,
      supportedCurrencies: [
        'ZAR',
        'USD',
        'EUR',
        'GBP',
      ],
    };

  console.log(
    'Creating default user customization with tax and regional settings'
  );

  return {
    id: 1,
    userId,
    sidebarColor: '#173A79',
    logoUrl: '/Pisval_Logo.jpg',
    navbarColor: '#000000',
    taxSettings: defaultTaxSettings,
    regionalSettings: defaultRegionalSettings,
  };
};

export const mockUpdateCustomization = async (
  customization: UserCustomization
): Promise<UserCustomization> => {
  console.log(
    'Saving customization to localStorage:',
    customization
  );

  // Make sure taxSettings is included
  if (!customization.taxSettings) {
    console.warn(
      'No tax settings provided in customization data, using defaults'
    );
    const defaultData =
      await mockFetchCustomization(
        customization.userId
      );
    customization.taxSettings =
      defaultData.taxSettings;
  }

  // Make sure regionalSettings is included
  if (!customization.regionalSettings) {
    console.warn(
      'No regional settings provided in customization data, using defaults'
    );
    const defaultData =
      await mockFetchCustomization(
        customization.userId
      );
    customization.regionalSettings =
      defaultData.regionalSettings;
  }

  // Check if we're running in a browser environment
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(customization)
      );
      console.log(
        'Customization saved successfully to localStorage'
      );
    } catch (error) {
      console.error(
        'Error saving to localStorage:',
        error
      );
    }
  } else {
    console.log(
      'Not in browser environment, skipping localStorage save'
    );
  }

  return customization;
};
