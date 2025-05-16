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
      // Try to get the full customization data
      const storedData =
        localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        console.log(
          'Found stored customization data in localStorage'
        );
        return JSON.parse(storedData);
      }

      // If no full data, check if we have a saved navbar color
      const savedNavbarColor =
        localStorage.getItem('navbarColor');
      if (savedNavbarColor) {
        console.log(
          'Found saved navbar color in localStorage:',
          savedNavbarColor
        );
        // Create a customization object with the saved navbar color
        return {
          id: 1,
          userId,
          sidebarColor: '#173A79',
          logoUrl: '/Pisval_Logo.jpg',
          navbarColor: savedNavbarColor,
          taxSettings: createDefaultTaxSettings(),
          regionalSettings:
            createDefaultRegionalSettings(),
        };
      }
    } catch (error) {
      console.error(
        'Error accessing localStorage:',
        error
      );
    }
  }

  return createDefaultCustomization(userId);
};

// Helper function to create default tax settings
const createDefaultTaxSettings =
  (): TaxSettings => {
    return {
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
  };

// Helper function to create default regional settings
const createDefaultRegionalSettings =
  (): RegionalSettings => {
    return {
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
  };

// Helper function to create a default customization object
const createDefaultCustomization = (
  userId: string
): UserCustomization => {
  console.log(
    'Creating default user customization with tax and regional settings'
  );

  return {
    id: 1,
    userId,
    sidebarColor: '#173A79',
    logoUrl: '/Pisval_Logo.jpg',
    navbarColor: '#000000',
    taxSettings: createDefaultTaxSettings(),
    regionalSettings:
      createDefaultRegionalSettings(),
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

  // Ensure navbarColor is included
  if (!customization.navbarColor) {
    console.warn(
      'No navbar color provided in customization data, using default'
    );
    customization.navbarColor = '#000000';
  }

  // Simulate a database save by adding a small delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  );

  // Check if we're running in a browser environment
  if (typeof window !== 'undefined') {
    try {
      // Save to localStorage to persist the data
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(customization)
      );
      console.log(
        'Customization saved successfully to localStorage'
      );

      // Also save the navbar color separately to ensure it persists
      localStorage.setItem(
        'navbarColor',
        customization.navbarColor
      );
      console.log(
        'Navbar color saved separately for persistence:',
        customization.navbarColor
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
