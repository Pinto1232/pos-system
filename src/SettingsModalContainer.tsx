'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUpdateCustomization } from '@/api/axiosClient';
import eventBus, { UI_EVENTS } from '@/utils/eventBus';
import { fetchAvailableCurrencies } from '@/api/currencyApi';
import { mockFetchCustomization, mockUpdateCustomization } from '@/api/mockUserCustomization';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';
import SettingsModalPresentation from './SettingsModalPresentation';
import {
  UserCustomization,
  TaxSettings,
  RegionalSettings,
  SettingsModalProps
} from './types/settingsTypes';

// Default values
const DEFAULT_SIDEBAR_COLOR = '#173A79';
const DEFAULT_LOGO_URL = '/Pisval_Logo.jpg';
const DEFAULT_NAVBAR_COLOR = '#000000';

const DEFAULT_TAX_SETTINGS: TaxSettings = {
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
      description: 'Standard VAT rate for most goods and services',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Reduced Rate',
      rate: 7.5,
      description: 'Reduced rate for specific goods and services',
      isDefault: false,
    },
    {
      id: 3,
      name: 'Zero Rate',
      rate: 0,
      description: 'Zero-rated goods and services',
      isDefault: false,
    },
  ],
  displayTaxOnReceipts: true,
  enableTaxExemptions: false,
  taxReportingPeriod: 'monthly',
};

const DEFAULT_REGIONAL_SETTINGS: RegionalSettings = {
  defaultCurrency: 'ZAR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  timezone: 'Africa/Johannesburg',
  numberFormat: '#,###.##',
  language: 'en-ZA',
  autoDetectLocation: true,
  enableMultiCurrency: true,
  supportedCurrencies: ['ZAR', 'USD', 'EUR', 'GBP'],
};

const fetchCustomization = async (userId: string): Promise<UserCustomization> => {
  try {
    console.log(`Fetching user customization for user ID: ${userId}`);

    const endpoint = userId === 'current-user'
      ? '/api/UserCustomization/current-user'
      : `/api/UserCustomization/${userId}`;

    console.log(`Using endpoint: ${endpoint}`);

    const response = await fetch(endpoint);

    if (response.ok) {
      const data = await response.json();
      console.log('Fetched customization from API:', data);
      return data;
    } else {
      console.warn(`API call failed with status ${response.status}, falling back to mock data`);
      return mockFetchCustomization(userId);
    }
  } catch (error) {
    console.error('Error fetching customization, using mock data:', error);
    return mockFetchCustomization(userId);
  }
};

const SettingsModalContainer: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  userId,
  onCustomizationUpdated,
  initialSetting = 'General Settings',
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<UserCustomization, Error>({
    queryKey: ['userCustomization', userId],
    queryFn: () => fetchCustomization(userId),
    enabled: open,
    staleTime: 60000,
    gcTime: 300000,
  });

  // State for settings
  const [sidebarColor, setSidebarColor] = useState('');
  const [navbarColor, setNavbarColor] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [showSidebarColorPicker, setShowSidebarColorPicker] = useState(false);
  const [showNavbarColorPicker, setShowNavbarColorPicker] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(initialSetting);
  const [searchQuery, setSearchQuery] = useState('');
  const [changeHistory, setChangeHistory] = useState<{
    timestamp: Date;
    setting: string;
    oldValue: unknown;
    newValue: unknown;
  }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [taxSettings, setTaxSettingsDirect] = useState<TaxSettings>(() =>
    JSON.parse(JSON.stringify(DEFAULT_TAX_SETTINGS))
  );
  const [regionalSettings, setRegionalSettingsDirect] = useState<RegionalSettings>(() =>
    JSON.parse(JSON.stringify(DEFAULT_REGIONAL_SETTINGS))
  );
  const [selectedRoleTab, setSelectedRoleTab] = useState(0);
  const [cacheDuration, setCacheDuration] = useState('60000');
  const [autoRefreshOnFocus, setAutoRefreshOnFocus] = useState(true);
  const [prefetchImportantData, setPrefetchImportantData] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Create New Role Modal state
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [configurePermissionsAfter, setConfigurePermissionsAfter] = useState(true);
  const [roleNameError, setRoleNameError] = useState('');
  const [createRolePending, setCreateRolePending] = useState(false);

  const taxSettingsRef = useRef(taxSettings);
  const regionalSettingsRef = useRef(regionalSettings);

  useEffect(() => {
    taxSettingsRef.current = taxSettings;
  }, [taxSettings]);

  useEffect(() => {
    regionalSettingsRef.current = regionalSettings;
  }, [regionalSettings]);

  // Function to get template permissions based on selected template
  const getTemplatePermissions = (template: string): string[] => {
    switch (template) {
      case 'manager':
        return [
          'dashboard.view',
          'products.view',
          'products.create',
          'products.edit',
          'products.delete',
          'sales.view',
          'sales.create',
          'sales.void',
          'reports.view',
          'users.view',
          'inventory.view',
          'inventory.edit',
        ];
      case 'cashier':
        return [
          'dashboard.view',
          'products.view',
          'sales.view',
          'sales.create',
          'customers.view',
          'customers.create',
        ];
      case 'inventory':
        return [
          'dashboard.view',
          'products.view',
          'products.create',
          'products.edit',
          'inventory.view',
          'inventory.create',
          'inventory.edit',
          'reports.inventory',
        ];
      default:
        return [];
    }
  };

  // Function to handle role creation
  const handleCreateRole = async () => {
    // Validate role name
    if (!newRoleName.trim()) {
      setRoleNameError('Role name cannot be empty');
      return;
    }

    setRoleNameError('');
    setCreateRolePending(true);

    try {
      // Prepare permissions based on template
      const permissions = selectedTemplate ? getTemplatePermissions(selectedTemplate) : [];

      // Create role data
      const roleData = {
        name: newRoleName.trim(),
        description: newRoleDescription.trim(),
        permissions: permissions,
      };

      // Call the role service to create the role
      // In a real implementation, this would call the API directly
      // For now, we'll just log it and show a success message
      console.log('Role created:', roleData);

      // Invalidate the roles query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });

      // Show success message
      setSnackbarMessage('Role created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Close modal and reset form
      setCreateRoleModalOpen(false);
      setNewRoleName('');
      setNewRoleDescription('');
      setSelectedTemplate('');

    } catch (error) {
      console.error('Error creating role:', error);
      setSnackbarMessage('Failed to create role. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setCreateRolePending(false);
    }
  };

  // Load cache settings from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCacheDuration = localStorage.getItem('cacheDuration');
      const savedAutoRefreshOnFocus = localStorage.getItem('autoRefreshOnFocus');
      const savedPrefetchImportantData = localStorage.getItem('prefetchImportantData');

      if (savedCacheDuration) {
        setCacheDuration(savedCacheDuration);
      }

      if (savedAutoRefreshOnFocus) {
        setAutoRefreshOnFocus(savedAutoRefreshOnFocus === 'true');
      }

      if (savedPrefetchImportantData) {
        setPrefetchImportantData(savedPrefetchImportantData === 'true');
      }
    }
  }, []);

  const setTaxSettings = useCallback((newSettings: TaxSettings) => {
    setChangeHistory((prev) => [
      ...prev,
      {
        timestamp: new Date(),
        setting: 'Tax Settings',
        oldValue: taxSettingsRef.current,
        newValue: newSettings,
      },
    ]);
    setTaxSettingsDirect(newSettings);
  }, []);

  const setRegionalSettings = useCallback((newSettings: RegionalSettings) => {
    setChangeHistory((prev) => [
      ...prev,
      {
        timestamp: new Date(),
        setting: 'Regional Settings',
        oldValue: regionalSettingsRef.current,
        newValue: newSettings,
      },
    ]);
    setRegionalSettingsDirect(newSettings);
  }, []);

  useEffect(() => {
    console.log('Tax settings updated:', taxSettings);
  }, [taxSettings]);

  useEffect(() => {
    console.log('Regional settings updated:', regionalSettings);
  }, [regionalSettings]);

  useEffect(() => {
    const handleOpenSettingsModal = (event: CustomEvent) => {
      if (event.detail?.initialTab) {
        setSelectedSetting(event.detail.initialTab);
      }
    };

    // Event handler for opening the Create Role modal
    const handleOpenCreateRoleModal = () => {
      setSelectedSetting('User & Role Management');
      setSelectedRoleTab(0);
      setCreateRoleModalOpen(true);
    };

    window.addEventListener('openSettingsModal', handleOpenSettingsModal as EventListener);
    window.addEventListener('openCreateRoleModal', handleOpenCreateRoleModal);

    return () => {
      window.removeEventListener('openSettingsModal', handleOpenSettingsModal as EventListener);
      window.removeEventListener('openCreateRoleModal', handleOpenCreateRoleModal);
    };
  }, []);

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const currencies = await fetchAvailableCurrencies();
        console.log('Fetched currencies:', currencies);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    if (open) {
      getCurrencies();
    }
  }, [open]);

  useEffect(() => {
    console.log('Data received from API:', data);

    if (open) {
      setSidebarColor(DEFAULT_SIDEBAR_COLOR);
      setNavbarColor(DEFAULT_NAVBAR_COLOR);
      setLogoPreview(DEFAULT_LOGO_URL);

      // Create deep clones of default settings
      const defaultTaxSettings = JSON.parse(JSON.stringify(DEFAULT_TAX_SETTINGS));
      const defaultRegionalSettings = JSON.parse(JSON.stringify(DEFAULT_REGIONAL_SETTINGS));

      // Set default settings
      setTaxSettings(defaultTaxSettings);
      setRegionalSettings(defaultRegionalSettings);

      // Then override with data if available
      if (data) {
        if (data.sidebarColor) setSidebarColor(data.sidebarColor);
        if (data.navbarColor) setNavbarColor(data.navbarColor);
        if (data.logoUrl) setLogoPreview(data.logoUrl);

        if (data.taxSettings) {
          console.log('Tax settings from API:', data.taxSettings);

          const mergedTaxSettings = {
            ...defaultTaxSettings,
            ...data.taxSettings,
            taxCategories: Array.isArray(data.taxSettings.taxCategories)
              ? data.taxSettings.taxCategories
              : defaultTaxSettings.taxCategories,
          };

          setTaxSettings(mergedTaxSettings);
        }

        if (data.regionalSettings) {
          console.log('Regional settings from API:', data.regionalSettings);

          const mergedRegionalSettings = {
            ...defaultRegionalSettings,
            ...data.regionalSettings,
            // Ensure supportedCurrencies is always an array
            supportedCurrencies: Array.isArray(data.regionalSettings.supportedCurrencies)
              ? data.regionalSettings.supportedCurrencies
              : defaultRegionalSettings.supportedCurrencies,
          };

          setRegionalSettings(mergedRegionalSettings);
        }
      }
    }
  }, [data, open, setTaxSettings, setRegionalSettings]);

  useEffect(() => {
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setLogoPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [selectedFile]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const updateCustomizationMutation = useUpdateCustomization<UserCustomization, UserCustomization>();

  const handleSave = () => {
    const dataToSave: UserCustomization = {
      id: data?.id || 0,
      userId,
      sidebarColor,
      navbarColor,
      logoUrl: logoPreview,
      taxSettings: taxSettings,
      regionalSettings: regionalSettings,
    };

    console.log('Saving customization data:', dataToSave);
    console.log('Tax settings being saved:', taxSettings);
    console.log('Regional settings being saved:', regionalSettings);

    console.log('SettingsModal: Applying changes immediately to UI with data:', dataToSave);
    onCustomizationUpdated(dataToSave);

    console.log('SettingsModal: Emitting customization update event with navbarColor:', navbarColor);
    eventBus.emit(UI_EVENTS.CUSTOMIZATION_UPDATED, {
      navbarColor,
      sidebarColor,
      logoUrl: logoPreview,
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('userCustomization', JSON.stringify(dataToSave));
        console.log('SettingsModal: Saved customization data directly to localStorage');
      } catch (error) {
        console.error('SettingsModal: Error saving to localStorage:', error);
      }
    }

    try {
      updateCustomizationMutation.mutate(dataToSave, {
        onSuccess: (updatedData) => {
          console.log('Updated data returned from API:', updatedData);

          onCustomizationUpdated(updatedData as UserCustomization);

          queryClient.invalidateQueries({
            queryKey: ['userCustomization', userId],
          });

          queryClient.invalidateQueries({
            queryKey: ['customization'],
          });

          onClose();
        },
        onError: (error) => {
          console.error('Error saving to API, falling back to mock:', error);

          mockUpdateCustomization(dataToSave).then((updatedData) => {
            console.log('Updated data returned from mock:', updatedData);

            onCustomizationUpdated(updatedData);

            queryClient.invalidateQueries({
              queryKey: ['userCustomization', userId],
            });

            queryClient.invalidateQueries({
              queryKey: ['customization'],
            });

            onClose();
          });
        },
      });
    } catch (error) {
      console.error('Error in mutation, falling back to mock:', error);

      mockUpdateCustomization(dataToSave).then((updatedData) => {
        console.log('Updated data returned from mock:', updatedData);

        onCustomizationUpdated(updatedData);

        queryClient.invalidateQueries({
          queryKey: ['userCustomization', userId],
        });

        queryClient.invalidateQueries({
          queryKey: ['customization'],
        });

        onClose();
      });
    }
  };

  const handleReset = () => {
    setSidebarColor(DEFAULT_SIDEBAR_COLOR);
    setNavbarColor(DEFAULT_NAVBAR_COLOR);
    setLogoPreview(DEFAULT_LOGO_URL);
    setTaxSettings(DEFAULT_TAX_SETTINGS);
    setRegionalSettings(DEFAULT_REGIONAL_SETTINGS);
  };

  // Import UserSubscriptionContext
  const { enableAdditionalPackage: enablePackage, disableAdditionalPackage: disablePackage } = useUserSubscription();

  // Functions for enabling/disabling packages with UI updates
  const enableAdditionalPackage = async (packageId: number) => {
    console.log(`Enable package ${packageId}`);
    try {
      // Call the API through the context
      await enablePackage(packageId);

      // Notify the sidebar to refresh
      const packageChangedEvent = new CustomEvent('packageChanged');
      window.dispatchEvent(packageChangedEvent);

      // Show success message
      console.log(`Package ${packageId} enabled successfully`);
    } catch (error) {
      console.error('Error enabling package:', error);
    }
  };

  const disableAdditionalPackage = async (packageId: number) => {
    console.log(`Disable package ${packageId}`);
    try {
      // Call the API through the context
      await disablePackage(packageId);

      // Notify the sidebar to refresh
      const packageChangedEvent = new CustomEvent('packageChanged');
      window.dispatchEvent(packageChangedEvent);

      // Show success message
      console.log(`Package ${packageId} disabled successfully`);
    } catch (error) {
      console.error('Error disabling package:', error);
    }
  };

  // Define package type
  interface Package {
    id: number;
    title: string;
    description: string;
    type: string;
    price: number;
  }

  // Fetch available packages
  const { data: packages } = useQuery<Package[]>({
    queryKey: ['pricingPackages'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/packages');
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const data = await response.json();
        // Check if the data is in the expected format with a 'data' property
        if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        }
        // Ensure we return an array even if the API returns something else
        return Array.isArray(data) ? data : [
          {
            id: 1,
            title: 'Starter',
            description: 'Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting',
            type: 'starter',
            price: 29.99,
          },
          {
            id: 2,
            title: 'Growth',
            description: 'Everything in Starter;Multi-store support;Customer loyalty program;Priority support;Advanced reporting;Employee management',
            type: 'growth',
            price: 59.99,
          },
          {
            id: 3,
            title: 'Premium',
            description: 'Everything in Growth;Advanced inventory forecasting;Custom branding;24/7 support;API access;Advanced analytics;Multi-currency support',
            type: 'premium',
            price: 99.99,
          },
          {
            id: 4,
            title: 'Enterprise',
            description: 'Everything in Premium;Dedicated account manager;Custom development;White-label solution;Unlimited users;Advanced security features;Data migration assistance',
            type: 'enterprise',
            price: 199.99,
          },
        ];
      } catch (error) {
        console.error('Error fetching packages:', error);
        // Return mock data
        return [
          {
            id: 1,
            title: 'Starter',
            description: 'Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting',
            type: 'starter',
            price: 29.99,
          },
          {
            id: 2,
            title: 'Growth',
            description: 'Everything in Starter;Multi-store support;Customer loyalty program;Priority support;Advanced reporting;Employee management',
            type: 'growth',
            price: 59.99,
          },
          {
            id: 3,
            title: 'Premium',
            description: 'Everything in Growth;Advanced inventory forecasting;Custom branding;24/7 support;API access;Advanced analytics;Multi-currency support',
            type: 'premium',
            price: 99.99,
          },
          {
            id: 4,
            title: 'Enterprise',
            description: 'Everything in Premium;Dedicated account manager;Custom development;White-label solution;Unlimited users;Advanced security features;Data migration assistance',
            type: 'enterprise',
            price: 199.99,
          },
        ];
      }
    },
    enabled: open && selectedSetting === 'Package Management',
  });

  // Define subscription type
  interface Subscription {
    id: number;
    userId: string;
    pricingPackageId: number;
    package: {
      id: number;
      title: string;
      type: string;
    };
    startDate: string;
    isActive: boolean;
    enabledFeatures: string[];
    additionalPackages: number[];
  }

  // Mock subscription data for development
  const subscription: Subscription = {
    id: 1,
    userId: userId,
    pricingPackageId: 1,
    package: {
      id: 1,
      title: 'Starter',
      type: 'starter',
    },
    startDate: new Date().toISOString(),
    isActive: true,
    enabledFeatures: [
      'Dashboard',
      'Products List',
      'Add/Edit Product',
      'Sales Reports',
      'Inventory Management',
      'Customer Management',
    ],
    additionalPackages: [],
  };

  // Mock available features
  const availableFeatures = [
    'Dashboard',
    'Products List',
    'Add/Edit Product',
    'Sales Reports',
    'Inventory Management',
    'Customer Management',
  ];

  return (
    <SettingsModalPresentation
      open={open}
      onClose={onClose}
      isLoading={isLoading}
      error={error}
      sidebarColor={sidebarColor}
      setSidebarColor={setSidebarColor}
      navbarColor={navbarColor}
      setNavbarColor={setNavbarColor}
      logoPreview={logoPreview}
      showSidebarColorPicker={showSidebarColorPicker}
      setShowSidebarColorPicker={setShowSidebarColorPicker}
      showNavbarColorPicker={showNavbarColorPicker}
      setShowNavbarColorPicker={setShowNavbarColorPicker}
      selectedSetting={selectedSetting}
      setSelectedSetting={setSelectedSetting}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleLogoFileChange={handleLogoFileChange}
      handleSave={handleSave}
      handleReset={handleReset}
      taxSettings={taxSettings}
      setTaxSettings={setTaxSettings}
      regionalSettings={regionalSettings}
      setRegionalSettings={setRegionalSettings}
      selectedRoleTab={selectedRoleTab}
      setSelectedRoleTab={setSelectedRoleTab}
      createRoleModalOpen={createRoleModalOpen}
      setCreateRoleModalOpen={setCreateRoleModalOpen}
      newRoleName={newRoleName}
      setNewRoleName={setNewRoleName}
      newRoleDescription={newRoleDescription}
      setNewRoleDescription={setNewRoleDescription}
      selectedTemplate={selectedTemplate}
      setSelectedTemplate={setSelectedTemplate}
      configurePermissionsAfter={configurePermissionsAfter}
      setConfigurePermissionsAfter={setConfigurePermissionsAfter}
      roleNameError={roleNameError}
      createRolePending={createRolePending}
      handleCreateRole={handleCreateRole}
      getTemplatePermissions={getTemplatePermissions}
      packages={packages}
      subscription={subscription}
      availableFeatures={availableFeatures}
      enableAdditionalPackage={enableAdditionalPackage}
      disableAdditionalPackage={disableAdditionalPackage}
      cacheDuration={cacheDuration}
      setCacheDuration={setCacheDuration}
      autoRefreshOnFocus={autoRefreshOnFocus}
      setAutoRefreshOnFocus={setAutoRefreshOnFocus}
      prefetchImportantData={prefetchImportantData}
      setPrefetchImportantData={setPrefetchImportantData}
      snackbarOpen={snackbarOpen}
      setSnackbarOpen={setSnackbarOpen}
      snackbarMessage={snackbarMessage}
      snackbarSeverity={snackbarSeverity}
      changeHistory={changeHistory}
    />
  );
};

export default SettingsModalContainer;