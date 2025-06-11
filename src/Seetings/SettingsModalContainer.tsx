'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useUpdateCustomization } from '@/api/axiosClient';
import eventBus, { UI_EVENTS } from '@/utils/eventBus';
import { fetchAvailableCurrencies } from '@/api/currencyApi';
import {
  mockFetchCustomization,
  mockUpdateCustomization,
} from '@/api/mockUserCustomization';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { useTierAccess } from '@/hooks/useTierAccess';
import SettingsModalPresentation from './SettingsModalPresentation';
import {
  UserCustomization,
  TaxSettings,
  RegionalSettings,
  SettingsModalProps,
  Package,
} from '../types/settingsTypes';

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

const fetchCustomization = async (
  userId: string
): Promise<UserCustomization> => {
  try {
    console.log(`Fetching user customization for user ID: ${userId}`);

    const endpoint =
      userId === 'current-user'
        ? '/api/UserCustomization/current-user'
        : `/api/UserCustomization/${userId}`;

    console.log(`Using endpoint: ${endpoint}`);

    const response = await fetch(endpoint);

    if (response.ok) {
      const data = await response.json();
      console.log(
        'Fetched customization from API:',
        JSON.stringify(data, null, 2)
      );
      return data;
    } else {
      console.warn(
        `API call failed with status ${response.status}, falling back to mock data`
      );
      return mockFetchCustomization(userId);
    }
  } catch (error) {
    console.error(
      'Error fetching customization, using mock data:',
      JSON.stringify(error, null, 2)
    );
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
  const { t: translator } = useTranslation();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<UserCustomization, Error>({
    queryKey: ['userCustomization', userId],
    queryFn: () => fetchCustomization(userId),
    enabled: open,
    staleTime: 60000,
    gcTime: 300000,
  });

  const [sidebarColor, setSidebarColor] = useState('');
  const [navbarColor, setNavbarColor] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [showSidebarColorPicker, setShowSidebarColorPicker] = useState(false);
  const [showNavbarColorPicker, setShowNavbarColorPicker] = useState(false);
  // Use translator to handle any translated initial settings
  const [selectedSetting, setSelectedSetting] = useState(
    initialSetting === 'settings.currencyRegional'
      ? translator('settings.currencyRegional')
      : initialSetting
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [changeHistory, setChangeHistory] = useState<
    {
      timestamp: Date;
      setting: string;
      oldValue: unknown;
      newValue: unknown;
    }[]
  >([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [taxSettings, setTaxSettingsDirect] = useState<TaxSettings>(() =>
    JSON.parse(JSON.stringify(DEFAULT_TAX_SETTINGS))
  );
  const [regionalSettings, setRegionalSettingsDirect] =
    useState<RegionalSettings>(() =>
      JSON.parse(JSON.stringify(DEFAULT_REGIONAL_SETTINGS))
    );
  const [selectedRoleTab, setSelectedRoleTab] = useState(0);
  const [cacheDuration, setCacheDuration] = useState('60000');
  const [autoRefreshOnFocus, setAutoRefreshOnFocus] = useState(true);
  const [prefetchImportantData, setPrefetchImportantData] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');
  const [isSaving, setIsSaving] = useState(false);

  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [configurePermissionsAfter, setConfigurePermissionsAfter] =
    useState(true);
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

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      setRoleNameError('Role name cannot be empty');
      return;
    }

    setRoleNameError('');
    setCreateRolePending(true);

    try {
      // Prepare permissions based on template
      const permissions = selectedTemplate
        ? getTemplatePermissions(selectedTemplate)
        : [];

      // Create role data
      const roleData = {
        name: newRoleName.trim(),
        description: newRoleDescription.trim(),
        permissions: permissions,
      };

      // Call the role service to create the role
      // In a real implementation, this would call the API directly
      // For now, we'll just log it and show a success message
      console.log('Role created:', JSON.stringify(roleData, null, 2));

      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });

      setSnackbarMessage('Role created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setCreateRoleModalOpen(false);
      setNewRoleName('');
      setNewRoleDescription('');
      setSelectedTemplate('');
    } catch (error) {
      console.error('Error creating role:', JSON.stringify(error, null, 2));
      setSnackbarMessage('Failed to create role. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setCreateRolePending(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCacheDuration = localStorage.getItem('cacheDuration');
      const savedAutoRefreshOnFocus =
        localStorage.getItem('autoRefreshOnFocus');
      const savedPrefetchImportantData = localStorage.getItem(
        'prefetchImportantData'
      );

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
    console.log('Tax settings updated:', JSON.stringify(taxSettings, null, 2));
  }, [taxSettings]);

  useEffect(() => {
    console.log(
      'Regional settings updated:',
      JSON.stringify(regionalSettings, null, 2)
    );
  }, [regionalSettings]);

  useEffect(() => {
    const handleOpenSettingsModal = (event: CustomEvent) => {
      if (event.detail?.initialTab) {
        setSelectedSetting(event.detail.initialTab);
      }
    };

    const handleOpenCreateRoleModal = () => {
      setSelectedSetting('User & Role Management');
      setSelectedRoleTab(0);
      setCreateRoleModalOpen(true);
    };

    window.addEventListener(
      'openSettingsModal',
      handleOpenSettingsModal as EventListener
    );
    window.addEventListener('openCreateRoleModal', handleOpenCreateRoleModal);

    return () => {
      window.removeEventListener(
        'openSettingsModal',
        handleOpenSettingsModal as EventListener
      );
      window.removeEventListener(
        'openCreateRoleModal',
        handleOpenCreateRoleModal
      );
    };
  }, []);

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const currencies = await fetchAvailableCurrencies();
        console.log('Fetched currencies:', JSON.stringify(currencies, null, 2));
      } catch (error) {
        console.error(
          'Error fetching currencies:',
          JSON.stringify(error, null, 2)
        );
      }
    };

    if (open) {
      getCurrencies();
    }
  }, [open]);

  useEffect(() => {
    console.log('Data received from API:', JSON.stringify(data, null, 2));

    if (open) {
      setSidebarColor(DEFAULT_SIDEBAR_COLOR);
      setNavbarColor(DEFAULT_NAVBAR_COLOR);
      setLogoPreview(DEFAULT_LOGO_URL);

      const defaultTaxSettings = JSON.parse(
        JSON.stringify(DEFAULT_TAX_SETTINGS)
      );
      const defaultRegionalSettings = JSON.parse(
        JSON.stringify(DEFAULT_REGIONAL_SETTINGS)
      );

      setTaxSettings(defaultTaxSettings);
      setRegionalSettings(defaultRegionalSettings);

      if (typeof window !== 'undefined') {
        const savedSidebarColor = localStorage.getItem('sidebarColor');
        const savedNavbarColor = localStorage.getItem('navbarColor');

        if (savedSidebarColor) {
          console.log(
            'Found saved sidebar color in localStorage:',
            JSON.stringify(savedSidebarColor, null, 2)
          );
          setSidebarColor(savedSidebarColor);
        }

        if (savedNavbarColor) {
          console.log(
            'Found saved navbar color in localStorage:',
            JSON.stringify(savedNavbarColor, null, 2)
          );
          setNavbarColor(savedNavbarColor);
        }
      }

      if (data) {
        if (data.sidebarColor) {
          console.log(
            'Setting sidebar color from API data:',
            JSON.stringify(data.sidebarColor, null, 2)
          );
          setSidebarColor(data.sidebarColor);

          if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarColor', data.sidebarColor);
          }
        }

        if (data.navbarColor) {
          console.log(
            'Setting navbar color from API data:',
            JSON.stringify(data.navbarColor, null, 2)
          );
          setNavbarColor(data.navbarColor);

          if (typeof window !== 'undefined') {
            localStorage.setItem('navbarColor', data.navbarColor);
          }
        }

        if (data.logoUrl) setLogoPreview(data.logoUrl);

        if (data.taxSettings) {
          console.log(
            'Tax settings from API:',
            JSON.stringify(data.taxSettings, null, 2)
          );

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
          console.log(
            'Regional settings from API:',
            JSON.stringify(data.regionalSettings, null, 2)
          );

          const mergedRegionalSettings = {
            ...defaultRegionalSettings,
            ...data.regionalSettings,

            supportedCurrencies: Array.isArray(
              data.regionalSettings.supportedCurrencies
            )
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

  const updateCustomizationMutation = useUpdateCustomization<
    UserCustomization,
    UserCustomization
  >();

  const handleSave = () => {
    setIsSaving(true);

    const validatedSidebarColor = sidebarColor.startsWith('#')
      ? sidebarColor
      : `#${sidebarColor}`;
    const validatedNavbarColor = navbarColor.startsWith('#')
      ? navbarColor
      : `#${navbarColor}`;

    console.log('Validated sidebar color before save:', validatedSidebarColor);
    console.log('Validated navbar color before save:', validatedNavbarColor);

    setSidebarColor(validatedSidebarColor);
    setNavbarColor(validatedNavbarColor);

    const dataToSave: UserCustomization = {
      id: data?.id || 0,
      userId,
      sidebarColor: validatedSidebarColor,
      navbarColor: validatedNavbarColor,
      logoUrl: logoPreview,
      taxSettings: taxSettings,
      regionalSettings: regionalSettings,
    };

    console.log(
      'Saving customization data:',
      JSON.stringify(dataToSave, null, 2)
    );
    console.log(
      'Tax settings being saved:',
      JSON.stringify(taxSettings, null, 2)
    );
    console.log(
      'Regional settings being saved:',
      JSON.stringify(regionalSettings, null, 2)
    );
    console.log(
      'Sidebar Color being saved:',
      JSON.stringify(sidebarColor, null, 2)
    );
    console.log(
      'Navbar Color being saved:',
      JSON.stringify(navbarColor, null, 2)
    );

    console.log(
      'SettingsModal: Applying changes immediately to UI with data:',
      JSON.stringify(dataToSave, null, 2)
    );
    onCustomizationUpdated(dataToSave);

    console.log(
      'SettingsModal: Emitting customization update event with colors:',
      JSON.stringify(
        {
          sidebarColor: validatedSidebarColor,
          navbarColor: validatedNavbarColor,
        },
        null,
        2
      )
    );
    eventBus.emit(UI_EVENTS.CUSTOMIZATION_UPDATED, {
      navbarColor: validatedNavbarColor,
      sidebarColor: validatedSidebarColor,
      logoUrl: logoPreview,
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('userCustomization', JSON.stringify(dataToSave));

        localStorage.setItem('sidebarColor', validatedSidebarColor);
        localStorage.setItem('navbarColor', validatedNavbarColor);

        console.log(
          'SettingsModal: Saved customization data directly to localStorage'
        );
        console.log(
          'SettingsModal: Saved colors to localStorage:',
          JSON.stringify(
            {
              sidebarColor: validatedSidebarColor,
              navbarColor: validatedNavbarColor,
            },
            null,
            2
          )
        );

        const savedNavbarColor = localStorage.getItem('navbarColor');
        console.log(
          'Verification - Navbar color in localStorage:',
          savedNavbarColor
        );
      } catch (error) {
        console.error(
          'SettingsModal: Error saving to localStorage:',
          JSON.stringify(error, null, 2)
        );
      }
    }

    try {
      console.log(
        'Saving sidebar and navbar colors to database:',
        JSON.stringify(
          {
            sidebarColor: validatedSidebarColor,
            navbarColor: validatedNavbarColor,
          },
          null,
          2
        )
      );

      updateCustomizationMutation.mutate(dataToSave, {
        onSuccess: (updatedData) => {
          console.log(
            'Updated data returned from API:',
            JSON.stringify(updatedData, null, 2)
          );

          const savedData = updatedData as UserCustomization;
          console.log(
            'Saved sidebar color:',
            JSON.stringify(savedData.sidebarColor, null, 2)
          );
          console.log(
            'Saved navbar color:',
            JSON.stringify(savedData.navbarColor, null, 2)
          );

          onCustomizationUpdated(savedData);

          if (typeof window !== 'undefined') {
            const confirmedSidebarColor = savedData.sidebarColor.startsWith('#')
              ? savedData.sidebarColor
              : `#${savedData.sidebarColor}`;

            const confirmedNavbarColor = savedData.navbarColor.startsWith('#')
              ? savedData.navbarColor
              : `#${savedData.navbarColor}`;

            setSidebarColor(confirmedSidebarColor);
            setNavbarColor(confirmedNavbarColor);

            localStorage.setItem('sidebarColor', confirmedSidebarColor);
            localStorage.setItem('navbarColor', confirmedNavbarColor);

            console.log('Confirmed colors saved to localStorage:', {
              sidebarColor: confirmedSidebarColor,
              navbarColor: confirmedNavbarColor,
            });

            const savedNavbarColor = localStorage.getItem('navbarColor');
            console.log(
              'Verification after API success - Navbar color in localStorage:',
              savedNavbarColor
            );
          }

          queryClient.invalidateQueries({
            queryKey: ['userCustomization', userId],
          });

          queryClient.invalidateQueries({
            queryKey: ['customization'],
          });

          setSnackbarMessage('Changes Saved Successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);

          setIsSaving(false);
        },
        onError: (error) => {
          console.error(
            'Error saving to API, falling back to mock:',
            JSON.stringify(error, null, 2)
          );

          mockUpdateCustomization(dataToSave).then((updatedData) => {
            console.log(
              'Updated data returned from mock:',
              JSON.stringify(updatedData, null, 2)
            );

            const savedData = updatedData as UserCustomization;
            console.log(
              'Mock saved sidebar color:',
              JSON.stringify(savedData.sidebarColor, null, 2)
            );
            console.log(
              'Mock saved navbar color:',
              JSON.stringify(savedData.navbarColor, null, 2)
            );

            const confirmedSidebarColor = savedData.sidebarColor.startsWith('#')
              ? savedData.sidebarColor
              : `#${savedData.sidebarColor}`;

            const confirmedNavbarColor = savedData.navbarColor.startsWith('#')
              ? savedData.navbarColor
              : `#${savedData.navbarColor}`;

            setSidebarColor(confirmedSidebarColor);
            setNavbarColor(confirmedNavbarColor);

            if (typeof window !== 'undefined') {
              localStorage.setItem('sidebarColor', confirmedSidebarColor);
              localStorage.setItem('navbarColor', confirmedNavbarColor);

              console.log('Mock confirmed colors saved to localStorage:', {
                sidebarColor: confirmedSidebarColor,
                navbarColor: confirmedNavbarColor,
              });

              const savedNavbarColor = localStorage.getItem('navbarColor');
              console.log(
                'Verification after mock - Navbar color in localStorage:',
                savedNavbarColor
              );
            }

            onCustomizationUpdated({
              ...updatedData,
              sidebarColor: confirmedSidebarColor,
              navbarColor: confirmedNavbarColor,
            });

            queryClient.invalidateQueries({
              queryKey: ['userCustomization', userId],
            });

            queryClient.invalidateQueries({
              queryKey: ['customization'],
            });

            setSnackbarMessage('Changes Saved Successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setIsSaving(false);
          });
        },
      });
    } catch (error) {
      console.error(
        'Error in mutation, falling back to mock:',
        JSON.stringify(error, null, 2)
      );

      mockUpdateCustomization(dataToSave).then((updatedData) => {
        console.log(
          'Updated data returned from mock:',
          JSON.stringify(updatedData, null, 2)
        );

        const savedData = updatedData as UserCustomization;
        console.log(
          'Mock saved sidebar color (catch):',
          JSON.stringify(savedData.sidebarColor, null, 2)
        );
        console.log(
          'Mock saved navbar color (catch):',
          JSON.stringify(savedData.navbarColor, null, 2)
        );

        const confirmedSidebarColor = savedData.sidebarColor.startsWith('#')
          ? savedData.sidebarColor
          : `#${savedData.sidebarColor}`;

        const confirmedNavbarColor = savedData.navbarColor.startsWith('#')
          ? savedData.navbarColor
          : `#${savedData.navbarColor}`;

        setSidebarColor(confirmedSidebarColor);
        setNavbarColor(confirmedNavbarColor);

        if (typeof window !== 'undefined') {
          localStorage.setItem('sidebarColor', confirmedSidebarColor);
          localStorage.setItem('navbarColor', confirmedNavbarColor);

          console.log('Catch block: Confirmed colors saved to localStorage:', {
            sidebarColor: confirmedSidebarColor,
            navbarColor: confirmedNavbarColor,
          });

          const savedNavbarColor = localStorage.getItem('navbarColor');
          console.log(
            'Verification in catch block - Navbar color in localStorage:',
            savedNavbarColor
          );
        }

        onCustomizationUpdated({
          ...updatedData,
          sidebarColor: confirmedSidebarColor,
          navbarColor: confirmedNavbarColor,
        });

        queryClient.invalidateQueries({
          queryKey: ['userCustomization', userId],
        });

        queryClient.invalidateQueries({
          queryKey: ['customization'],
        });

        setSnackbarMessage('Changes Saved Successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        setIsSaving(false);
      });
    }
  };

  const handleReset = () => {
    setSidebarColor(DEFAULT_SIDEBAR_COLOR);
    setNavbarColor(DEFAULT_NAVBAR_COLOR);
    setLogoPreview(DEFAULT_LOGO_URL);
    setTaxSettings(DEFAULT_TAX_SETTINGS);
    setRegionalSettings(DEFAULT_REGIONAL_SETTINGS);

    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarColor', DEFAULT_SIDEBAR_COLOR);
      localStorage.setItem('navbarColor', DEFAULT_NAVBAR_COLOR);

      const savedCustomization = localStorage.getItem('userCustomization');
      if (savedCustomization) {
        try {
          const customization = JSON.parse(savedCustomization);
          customization.sidebarColor = DEFAULT_SIDEBAR_COLOR;
          customization.navbarColor = DEFAULT_NAVBAR_COLOR;
          localStorage.setItem(
            'userCustomization',
            JSON.stringify(customization)
          );
        } catch (error) {
          console.error(
            'Error updating userCustomization in localStorage:',
            error
          );
        }
      }
    }
  };

  const { selectPackage: selectPackageInContext } = usePackageSelection();

  const { subscriptionData } = useTierAccess();

  const enablePackageImpl = useCallback(
    async (packageId: number): Promise<void> => {
      console.log(`Enabling package ${packageId}`);
    },
    []
  );

  const disablePackageImpl = useCallback(
    async (packageId: number): Promise<void> => {
      console.log(`Disabling package ${packageId}`);
    },
    []
  );

  const enableOperationInProgressRef = useRef<boolean>(false);
  const packageBeingProcessedRef = useRef<number | null>(null);

  const disableOperationInProgressRef = useRef<boolean>(false);
  const packageBeingDisabledRef = useRef<number | null>(null);

  const { getSavedPackage } = usePackageSelection();

  const transformPackage = (apiPackage: Record<string, unknown>): Package => {
    const validTypes: Package['type'][] = [
      'starter-plus',
      'growth-pro',
      'enterprise-elite',
      'custom-pro',
      'premium-plus',
    ];
    const type = String(apiPackage.type || '').toLowerCase();
    const validType = validTypes.includes(type as Package['type'])
      ? (type as Package['type'])
      : 'starter-plus';

    return {
      id: Number(apiPackage.id) || 0,
      title: String(apiPackage.title || ''),
      description: String(apiPackage.description || ''),
      icon: String(apiPackage.icon || ''),
      extraDescription: String(apiPackage.extraDescription || ''),
      price: Number(apiPackage.price) || 0,
      testPeriodDays: Number(apiPackage.testPeriodDays) || 14,
      type: validType,
      currency: apiPackage.currency ? String(apiPackage.currency) : undefined,
      multiCurrencyPrices: apiPackage.multiCurrencyPrices
        ? String(apiPackage.multiCurrencyPrices)
        : undefined,
    };
  };

  const {
    data: packages,
    isLoading: isPackagesLoading,
    error: packagesError,
    refetch: refetchPackages,
  } = useQuery<Package[]>({
    queryKey: ['pricingPackages'],
    queryFn: async () => {
      try {
        console.log(
          '[SETTINGS MODAL] Fetching pricing packages for SettingsModal'
        );

        const savedPackage = getSavedPackage();
        if (savedPackage) {
          console.log(
            '[SETTINGS MODAL] Found saved package in context:',
            savedPackage.title
          );
        }

        const timestamp = Date.now();

        const response = await fetch(`/api/PricingPackages?_t=${timestamp}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch packages: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data)) {
          console.log(
            `[SETTINGS MODAL] Retrieved ${data.data.length} packages from API`
          );
          console.log(
            '[SETTINGS MODAL] Package titles:',
            data.data.map((p: Package) => p.title)
          );

          const logLimit = Math.min(data.data.length, 3);
          for (let i = 0; i < logLimit; i++) {
            const pkg = data.data[i];
            console.log(
              `[SETTINGS MODAL] Package ${i + 1}/${data.data.length}: ${pkg.title}`,
              {
                id: pkg.id,
                price: pkg.price,
                currency: pkg.currency,
                type: pkg.type,
              }
            );
          }

          const uniquePackages = data.data.filter(
            (
              pkg: Record<string, unknown>,
              index: number,
              self: Record<string, unknown>[]
            ) =>
              index ===
              self.findIndex(
                (p: Record<string, unknown>) => p.title === pkg.title
              )
          );
          return uniquePackages.map(transformPackage);
        }

        if (Array.isArray(data)) {
          console.log(
            `[SETTINGS MODAL] Retrieved ${data.length} packages from API (array format)`
          );

          const logLimit = Math.min(data.length, 3);
          for (let i = 0; i < logLimit; i++) {
            const pkg = data[i];
            console.log(
              `[SETTINGS MODAL] Package ${i + 1}/${data.length}: ${pkg.title}`,
              {
                id: pkg.id,
                price: pkg.price,
                currency: pkg.currency,
                type: pkg.type,
              }
            );
          }

          return data.map(transformPackage);
        }

        console.warn('No valid package data found, using fallback data');
        console.log(
          '[SETTINGS MODAL] Using fallback packages - should have 5 packages'
        );

        return [
          {
            id: 1,
            title: 'Starter Plus',
            description:
              'Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting',
            icon: 'MUI:StarIcon',
            extraDescription:
              'Perfect for small businesses looking for essential features',
            price: 39.99,
            testPeriodDays: 14,
            type: 'starter-plus',
            currency: 'ZAR',
            multiCurrencyPrices: '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
          },
          {
            id: 2,
            title: 'Growth Pro',
            description:
              'Everything in Growth;Advanced inventory forecasting;Enhanced customer loyalty program;Marketing automation tools;Staff performance tracking',
            icon: 'MUI:TrendingUpIcon',
            extraDescription:
              'Ideal for growing businesses that need advanced features',
            price: 79.99,
            testPeriodDays: 14,
            type: 'growth-pro',
            currency: 'ZAR',
            multiCurrencyPrices: '{"ZAR": 1399.99, "EUR": 72.99, "GBP": 63.99}',
          },
          {
            id: 3,
            title: 'Custom',
            description:
              'Tailor-made solutions for your unique business needs;Perfect for businesses requiring customized POS features;Build your own feature set;Pay only for what you need',
            icon: 'MUI:SettingsIcon',
            extraDescription:
              'Bespoke solution tailored to your specific business requirements',
            price: 129.99,
            testPeriodDays: 30,
            type: 'custom-pro',
            currency: 'ZAR',
            multiCurrencyPrices:
              '{"ZAR": 1806.48, "EUR": 119.99, "GBP": 99.99}',
          },
          {
            id: 4,
            title: 'Enterprise Elite',
            description:
              'Comprehensive POS solutions for large enterprises;Includes all advanced features and premium support;Multi-location management;Enterprise-level analytics',
            icon: 'MUI:BusinessIcon',
            extraDescription:
              'Complete solution for large businesses with complex requirements',
            price: 249.99,
            testPeriodDays: 30,
            type: 'enterprise-elite',
            currency: 'ZAR',
            multiCurrencyPrices:
              '{"ZAR": 4299.99, "EUR": 239.99, "GBP": 209.99}',
          },
          {
            id: 5,
            title: 'Premium Plus',
            description:
              'All-inclusive POS package with premium features;Best for businesses looking for top-tier POS solutions;Advanced AI-powered analytics;Predictive inventory management',
            icon: 'MUI:DiamondIcon',
            extraDescription:
              'The ultimate POS experience with cutting-edge features and premium support',
            price: 349.99,
            testPeriodDays: 30,
            type: 'premium-plus',
            currency: 'ZAR',
            multiCurrencyPrices:
              '{"ZAR": 5999.99, "EUR": 319.99, "GBP": 279.99}',
          },
        ];
      } catch (error) {
        console.error(
          'Error fetching packages:',
          JSON.stringify(error, null, 2)
        );

        return [
          {
            id: 1,
            title: 'Starter Plus',
            description:
              'Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting',
            icon: 'MUI:StarIcon',
            extraDescription:
              'Perfect for small businesses looking for essential features',
            price: 39.99,
            testPeriodDays: 14,
            type: 'starter-plus',
            currency: 'ZAR',
            multiCurrencyPrices: '{"ZAR": 699.99, "EUR": 36.99, "GBP": 31.99}',
          },
          {
            id: 2,
            title: 'Growth Pro',
            description:
              'Everything in Growth;Advanced inventory forecasting;Enhanced customer loyalty program;Marketing automation tools;Staff performance tracking',
            icon: 'MUI:TrendingUpIcon',
            extraDescription:
              'Ideal for growing businesses that need advanced features',
            price: 79.99,
            testPeriodDays: 14,
            type: 'growth-pro',
            currency: 'ZAR',
            multiCurrencyPrices: '{"ZAR": 1399.99, "EUR": 72.99, "GBP": 63.99}',
          },
          {
            id: 3,
            title: 'Custom',
            description:
              'Tailor-made solutions for your unique business needs;Perfect for businesses requiring customized POS features;Build your own feature set;Pay only for what you need',
            icon: 'MUI:SettingsIcon',
            extraDescription:
              'Bespoke solution tailored to your specific business requirements',
            price: 129.99,
            testPeriodDays: 30,
            type: 'custom-pro',
            currency: 'ZAR',
            multiCurrencyPrices:
              '{"ZAR": 2199.99, "EUR": 119.99, "GBP": 99.99}',
          },
          {
            id: 4,
            title: 'Enterprise Elite',
            description:
              'Comprehensive POS solutions for large enterprises;Includes all advanced features and premium support;Multi-location management;Enterprise-level analytics',
            icon: 'MUI:BusinessIcon',
            extraDescription:
              'Complete solution for large businesses with complex requirements',
            price: 249.99,
            testPeriodDays: 30,
            type: 'enterprise-elite',
            currency: 'ZAR',
            multiCurrencyPrices:
              '{"ZAR": 4299.99, "EUR": 239.99, "GBP": 209.99}',
          },
          {
            id: 5,
            title: 'Premium Plus',
            description:
              'All-inclusive POS package with premium features;Best for businesses looking for top-tier POS solutions;Advanced AI-powered analytics;Predictive inventory management',
            icon: 'MUI:DiamondIcon',
            extraDescription:
              'The ultimate POS experience with cutting-edge features and premium support',
            price: 349.99,
            testPeriodDays: 30,
            type: 'premium-plus',
            currency: 'ZAR',
            multiCurrencyPrices:
              '{"ZAR": 5999.99, "EUR": 319.99, "GBP": 279.99}',
          },
        ];
      }
    },
    enabled: open && selectedSetting === 'Package Management',
    staleTime: 300000,
    gcTime: 600000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });

  const enableAdditionalPackage = useCallback(
    async (packageId: number) => {
      if (
        enableOperationInProgressRef.current ||
        packageBeingProcessedRef.current === packageId
      ) {
        console.log(
          `Skipping duplicate enable operation for package ${packageId}`
        );
        return;
      }

      console.log(`Enable package ${packageId}`);

      enableOperationInProgressRef.current = true;
      packageBeingProcessedRef.current = packageId;

      try {
        await enablePackageImpl(packageId);

        const selectedPkg = packages?.find((pkg) => pkg.id === packageId);
        if (selectedPkg) {
          const packageForSelection = JSON.parse(JSON.stringify(selectedPkg));

          let normalizedType = 'starter';
          if (selectedPkg.type) {
            if (selectedPkg.type.includes('custom')) {
              normalizedType = 'custom';
            } else if (selectedPkg.type.includes('starter')) {
              normalizedType = 'starter';
            } else if (selectedPkg.type.includes('growth')) {
              normalizedType = 'growth';
            } else if (selectedPkg.type.includes('enterprise')) {
              normalizedType = 'enterprise';
            } else if (selectedPkg.type.includes('premium')) {
              normalizedType = 'premium';
            }
          }

          packageForSelection.type = normalizedType;

          console.log(
            `Selecting package in context:`,
            JSON.stringify(
              {
                id: packageForSelection.id,
                title: packageForSelection.title,
                type: packageForSelection.type,
                originalType: selectedPkg.type,
              },
              null,
              2
            )
          );

          const isCustomPackage = normalizedType === 'custom';

          selectPackageInContext(packageForSelection);
          console.log(
            `Package ${packageId} selected in context:`,
            packageForSelection.title
          );

          if (!isCustomPackage) {
            const packageChangedEvent = new CustomEvent('packageChanged', {
              detail: {
                packageId: packageId,
                fromSettingsModal: true,
                timestamp: Date.now(),
                skipRefetch: true,
              },
            });
            window.dispatchEvent(packageChangedEvent);
          }

          const resetDelay = isCustomPackage ? 800 : 300;
          setTimeout(() => {
            enableOperationInProgressRef.current = false;
            packageBeingProcessedRef.current = null;
          }, resetDelay);
        } else {
          console.warn(
            `Package with ID ${packageId} not found in available packages`
          );

          enableOperationInProgressRef.current = false;
          packageBeingProcessedRef.current = null;
        }

        console.log(`Package ${packageId} enabled successfully`);
      } catch (error) {
        console.error(
          'Error enabling package:',
          JSON.stringify(error, null, 2)
        );

        enableOperationInProgressRef.current = false;
        packageBeingProcessedRef.current = null;
      }
    },
    [enablePackageImpl, packages, selectPackageInContext]
  );

  const disableAdditionalPackage = useCallback(
    async (packageId: number) => {
      if (
        disableOperationInProgressRef.current ||
        packageBeingDisabledRef.current === packageId
      ) {
        console.log(
          `Skipping duplicate disable operation for package ${packageId}`
        );
        return;
      }

      console.log(`Disable package ${packageId}`);

      disableOperationInProgressRef.current = true;
      packageBeingDisabledRef.current = packageId;

      try {
        await disablePackageImpl(packageId);

        const selectedPkg = packages?.find((pkg) => pkg.id === packageId);
        const isCustomPackage = selectedPkg?.type?.includes('custom') || false;

        if (!isCustomPackage) {
          const packageChangedEvent = new CustomEvent('packageChanged', {
            detail: {
              packageId: packageId,
              fromSettingsModal: true,
              timestamp: Date.now(),
              action: 'disable',
              skipRefetch: true,
            },
          });
          window.dispatchEvent(packageChangedEvent);
        }

        console.log(`Package ${packageId} disabled successfully`);
      } catch (error) {
        console.error(
          'Error disabling package:',
          JSON.stringify(error, null, 2)
        );
      } finally {
        const selectedPkg = packages?.find((pkg) => pkg.id === packageId);
        const isCustomPackage = selectedPkg?.type?.includes('custom') || false;
        const resetDelay = isCustomPackage ? 800 : 300;

        setTimeout(() => {
          disableOperationInProgressRef.current = false;
          packageBeingDisabledRef.current = null;
        }, resetDelay);
      }
    },
    [disablePackageImpl, packages]
  );

  const lastProcessedEventRef = useRef<number>(0);

  const handlePackageSelected = useCallback(
    (event: CustomEvent) => {
      console.log(
        '[SETTINGS MODAL] Package selection event received:',
        event.detail
      );

      if (event.detail?.fromSettingsModal) {
        console.log('[SETTINGS MODAL] Skipping event from settings modal');
        return;
      }

      if (event.detail?.skipRefetch) {
        console.log(
          '[SETTINGS MODAL] Skipping refetch due to skipRefetch flag'
        );
        return;
      }

      const eventTimestamp = event.detail?.timestamp || Date.now();
      if (eventTimestamp - lastProcessedEventRef.current < 1000) {
        console.log(
          '[SETTINGS MODAL] Debouncing event, too soon after last event'
        );
        return;
      }

      if (
        event.detail &&
        event.detail.packageId &&
        open &&
        selectedSetting === 'Package Management'
      ) {
        console.log('[SETTINGS MODAL] Processing package selection event');
        lastProcessedEventRef.current = Date.now();

        const packageId = event.detail.packageId;
        const selectedPkg = packages?.find((pkg) => pkg.id === packageId);
        const isCustomPackage = selectedPkg?.type?.includes('custom') || false;

        if (!isCustomPackage) {
          refetchPackages();
        } else {
          console.log(
            '[SETTINGS MODAL] Skipping refetch and UI update for custom package to prevent flickering'
          );
          return;
        }
      }
    },
    [open, selectedSetting, refetchPackages, packages]
  );

  const handlePackageChanged = useCallback(
    (event: CustomEvent) => {
      console.log(
        '[SETTINGS MODAL] Package changed event received:',
        event.detail
      );

      if (event.detail?.fromSettingsModal) {
        console.log('[SETTINGS MODAL] Skipping event from settings modal');
        return;
      }

      if (event.detail?.skipRefetch) {
        console.log(
          '[SETTINGS MODAL] Skipping refetch due to skipRefetch flag'
        );
        return;
      }

      const eventTimestamp = event.detail?.timestamp || Date.now();
      if (eventTimestamp - lastProcessedEventRef.current < 1000) {
        console.log(
          '[SETTINGS MODAL] Debouncing event, too soon after last event'
        );
        return;
      }

      if (event.detail && open && selectedSetting === 'Package Management') {
        console.log(
          '[SETTINGS MODAL] Processing package changed event, refetching packages'
        );
        lastProcessedEventRef.current = Date.now();

        const packageId = event.detail.packageId;
        if (packageId) {
          const selectedPkg = packages?.find((pkg) => pkg.id === packageId);
          const isCustomPackage =
            selectedPkg?.type?.includes('custom') || false;

          if (!isCustomPackage) {
            refetchPackages();
          } else {
            console.log(
              '[SETTINGS MODAL] Skipping refetch for custom package to prevent UI flashing'
            );
          }
        } else {
          refetchPackages();
        }
      }
    },
    [open, selectedSetting, refetchPackages, packages]
  );

  useEffect(() => {
    console.log('[SETTINGS MODAL] Setting up event listeners');

    window.addEventListener(
      'packageSelected',
      handlePackageSelected as EventListener
    );

    window.addEventListener(
      'packageChanged',
      handlePackageChanged as EventListener
    );

    return () => {
      console.log('[SETTINGS MODAL] Cleaning up event listeners');

      window.removeEventListener(
        'packageSelected',
        handlePackageSelected as EventListener
      );

      window.removeEventListener(
        'packageChanged',
        handlePackageChanged as EventListener
      );
    };
  }, [handlePackageSelected, handlePackageChanged]);

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
      isPackagesLoading={isPackagesLoading}
      packagesError={packagesError}
      refetchPackages={refetchPackages}
      subscription={null}
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
      isSaving={isSaving}
      subscriptionData={subscriptionData}
    />
  );
};

export default SettingsModalContainer;
