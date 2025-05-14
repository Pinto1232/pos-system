import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Chip,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardActions,
  // Importing but using in Package Management section
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  AlertTitle,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Importing for potential future use
import CancelIcon from '@mui/icons-material/Cancel';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useUpdateCustomization } from '@/api/axiosClient';
import Image from 'next/image';
import { MdRestore } from 'react-icons/md';
import eventBus, {
  UI_EVENTS,
} from '@/utils/eventBus';
import {
  SketchPicker,
  ColorResult,
} from 'react-color';
import { FaPaintBrush } from 'react-icons/fa';
import {
  mockFetchCustomization,
  mockUpdateCustomization,
} from '@/api/mockUserCustomization';
import { fetchAvailableCurrencies } from '@/api/currencyApi';
import RoleManagement from '@/components/roles/RoleManagement';
import UserActivityMonitor from '@/components/roles/UserActivityMonitor';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';
import CacheControl from '@/components/ui/CacheControl';

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
  taxReportingPeriod:
    | 'monthly'
    | 'quarterly'
    | 'annually';
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

interface SettingsItem {
  label: string;
  tooltip: string;
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onCustomizationUpdated: (
    updated: UserCustomization
  ) => void;
  initialSetting?: string;
}

const settingsItems: SettingsItem[] = [
  {
    label: 'General Settings',
    tooltip:
      'Configure application appearance, logo, and theme colors',
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
    tooltip:
      'Configure currencies, date formats, and regional preferences',
  },
  {
    label: 'User & Role Management',
    tooltip:
      'Manage users, roles, and permissions for system access',
  },
  {
    label: 'Package Management',
    tooltip:
      'Manage your subscription packages and enable additional features',
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
    tooltip:
      'Manage application cache settings and refresh data when needed',
  },
  {
    label: 'Change History',
    tooltip:
      'View history of changes made to settings',
  },
];

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

const DEFAULT_REGIONAL_SETTINGS: RegionalSettings =
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

const fetchCustomization = async (
  userId: string
): Promise<UserCustomization> => {
  try {
    console.log(
      `Fetching user customization for user ID: ${userId}`
    );

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
        data
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
      error
    );
    return mockFetchCustomization(userId);
  }
};

const SettingsModal: React.FC<
  SettingsModalProps
> = ({
  open,
  onClose,
  userId,
  onCustomizationUpdated,
  initialSetting = 'General Settings',
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<
    UserCustomization,
    Error
  >({
    queryKey: ['userCustomization', userId],
    queryFn: () => fetchCustomization(userId),
    enabled: open,
    staleTime: 60000,
    gcTime: 300000,
  });

  const [sidebarColor, setSidebarColor] =
    useState('');
  const [navbarColor, setNavbarColor] =
    useState('');
  const [logoPreview, setLogoPreview] =
    useState('');
  const [
    showSidebarColorPicker,
    setShowSidebarColorPicker,
  ] = useState(false);
  const [
    showNavbarColorPicker,
    setShowNavbarColorPicker,
  ] = useState(false);
  const [selectedSetting, setSelectedSetting] =
    useState(initialSetting);
  const [searchQuery, setSearchQuery] =
    useState('');
  const [changeHistory, setChangeHistory] =
    useState<
      {
        timestamp: Date;
        setting: string;
        oldValue: unknown;
        newValue: unknown;
      }[]
    >([]);

  useEffect(() => {
    const handleOpenSettingsModal = (
      event: CustomEvent
    ) => {
      if (event.detail?.initialTab) {
        setSelectedSetting(
          event.detail.initialTab
        );
      }
    };

    window.addEventListener(
      'openSettingsModal',
      handleOpenSettingsModal as EventListener
    );

    return () => {
      window.removeEventListener(
        'openSettingsModal',
        handleOpenSettingsModal as EventListener
      );
    };
  }, []);
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
  const [taxSettings, setTaxSettingsDirect] =
    useState<TaxSettings>(() =>
      JSON.parse(
        JSON.stringify(DEFAULT_TAX_SETTINGS)
      )
    );
  const [
    regionalSettings,
    setRegionalSettingsDirect,
  ] = useState<RegionalSettings>(() =>
    JSON.parse(
      JSON.stringify(DEFAULT_REGIONAL_SETTINGS)
    )
  );
  const [selectedRoleTab, setSelectedRoleTab] =
    useState(0);
  const taxSettingsRef = useRef(taxSettings);
  const regionalSettingsRef = useRef(
    regionalSettings
  );

  useEffect(() => {
    taxSettingsRef.current = taxSettings;
  }, [taxSettings]);

  useEffect(() => {
    regionalSettingsRef.current =
      regionalSettings;
  }, [regionalSettings]);

  const setTaxSettings = useCallback(
    (newSettings: TaxSettings) => {
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
    },
    []
  );

  const setRegionalSettings = useCallback(
    (newSettings: RegionalSettings) => {
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
    },
    []
  );

  useEffect(() => {
    console.log(
      'Tax settings updated:',
      taxSettings
    );
  }, [taxSettings]);

  useEffect(() => {
    console.log(
      'Regional settings updated:',
      regionalSettings
    );
  }, [regionalSettings]);

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const currencies =
          await fetchAvailableCurrencies();
        console.log(
          'Fetched currencies:',
          currencies
        );
      } catch (error) {
        console.error(
          'Error fetching currencies:',
          error
        );
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
      const defaultTaxSettings = JSON.parse(
        JSON.stringify(DEFAULT_TAX_SETTINGS)
      );
      const defaultRegionalSettings = JSON.parse(
        JSON.stringify(DEFAULT_REGIONAL_SETTINGS)
      );

      // Set default settings
      setTaxSettings(defaultTaxSettings);
      setRegionalSettings(
        defaultRegionalSettings
      );

      // Then override with data if available
      if (data) {
        if (data.sidebarColor)
          setSidebarColor(data.sidebarColor);
        if (data.navbarColor)
          setNavbarColor(data.navbarColor);
        if (data.logoUrl)
          setLogoPreview(data.logoUrl);

        if (data.taxSettings) {
          console.log(
            'Tax settings from API:',
            data.taxSettings
          );

          const mergedTaxSettings = {
            ...defaultTaxSettings,
            ...data.taxSettings,
            taxCategories: Array.isArray(
              data.taxSettings.taxCategories
            )
              ? data.taxSettings.taxCategories
              : defaultTaxSettings.taxCategories,
          };

          setTaxSettings(mergedTaxSettings);
        }

        if (data.regionalSettings) {
          console.log(
            'Regional settings from API:',
            data.regionalSettings
          );

          const mergedRegionalSettings = {
            ...defaultRegionalSettings,
            ...data.regionalSettings,
            // Ensure supportedCurrencies is always an array
            supportedCurrencies: Array.isArray(
              data.regionalSettings
                .supportedCurrencies
            )
              ? data.regionalSettings
                  .supportedCurrencies
              : defaultRegionalSettings.supportedCurrencies,
          };

          setRegionalSettings(
            mergedRegionalSettings
          );
        }
      }
    }
  }, [
    data,
    open,
    setTaxSettings,
    setRegionalSettings,
  ]);

  useEffect(() => {
    if (selectedFile) {
      const previewUrl =
        URL.createObjectURL(selectedFile);
      setLogoPreview(previewUrl);

      return () =>
        URL.revokeObjectURL(previewUrl);
    }
  }, [selectedFile]);

  const handleLogoFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      e.target.files &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const updateCustomizationMutation =
    useUpdateCustomization<
      UserCustomization,
      UserCustomization
    >();

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

    console.log(
      'Saving customization data:',
      dataToSave
    );
    console.log(
      'Tax settings being saved:',
      taxSettings
    );
    console.log(
      'Regional settings being saved:',
      regionalSettings
    );

    console.log(
      'SettingsModal: Applying changes immediately to UI with data:',
      dataToSave
    );
    onCustomizationUpdated(dataToSave);

    console.log(
      'SettingsModal: Emitting customization update event with navbarColor:',
      navbarColor
    );
    eventBus.emit(
      UI_EVENTS.CUSTOMIZATION_UPDATED,
      {
        navbarColor,
        sidebarColor,
        logoUrl: logoPreview,
      }
    );

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'userCustomization',
          JSON.stringify(dataToSave)
        );
        console.log(
          'SettingsModal: Saved customization data directly to localStorage'
        );
      } catch (error) {
        console.error(
          'SettingsModal: Error saving to localStorage:',
          error
        );
      }
    }

    try {
      updateCustomizationMutation.mutate(
        dataToSave,
        {
          onSuccess: (updatedData) => {
            console.log(
              'Updated data returned from API:',
              updatedData
            );

            onCustomizationUpdated(
              updatedData as UserCustomization
            );

            queryClient.invalidateQueries({
              queryKey: [
                'userCustomization',
                userId,
              ],
            });

            queryClient.invalidateQueries({
              queryKey: ['customization'],
            });

            onClose();
          },
          onError: (error) => {
            console.error(
              'Error saving to API, falling back to mock:',
              error
            );

            mockUpdateCustomization(
              dataToSave
            ).then((updatedData) => {
              console.log(
                'Updated data returned from mock:',
                updatedData
              );

              onCustomizationUpdated(updatedData);

              queryClient.invalidateQueries({
                queryKey: [
                  'userCustomization',
                  userId,
                ],
              });

              queryClient.invalidateQueries({
                queryKey: ['customization'],
              });

              onClose();
            });
          },
        }
      );
    } catch (error) {
      console.error(
        'Error in mutation, falling back to mock:',
        error
      );

      mockUpdateCustomization(dataToSave).then(
        (updatedData) => {
          console.log(
            'Updated data returned from mock:',
            updatedData
          );

          onCustomizationUpdated(updatedData);

          queryClient.invalidateQueries({
            queryKey: [
              'userCustomization',
              userId,
            ],
          });

          queryClient.invalidateQueries({
            queryKey: ['customization'],
          });

          onClose();
        }
      );
    }
  };

  const handleReset = () => {
    setSidebarColor(DEFAULT_SIDEBAR_COLOR);
    setNavbarColor(DEFAULT_NAVBAR_COLOR);
    setLogoPreview(DEFAULT_LOGO_URL);
    setTaxSettings(DEFAULT_TAX_SETTINGS);
    setRegionalSettings(
      DEFAULT_REGIONAL_SETTINGS
    );
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
        const response = await fetch(
          '/api/PricingPackages'
        );
        if (!response.ok) {
          throw new Error(
            'Failed to fetch packages'
          );
        }
        const data = await response.json();
        // Ensure we return an array even if the API returns something else
        return Array.isArray(data)
          ? data
          : [
              {
                id: 1,
                title: 'Starter',
                description:
                  'Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting',
                type: 'starter',
                price: 29.99,
              },
              {
                id: 2,
                title: 'Growth',
                description:
                  'Everything in Starter;Multi-store support;Customer loyalty program;Priority support;Advanced reporting;Employee management',
                type: 'growth',
                price: 59.99,
              },
              {
                id: 3,
                title: 'Premium',
                description:
                  'Everything in Growth;Advanced inventory forecasting;Custom branding;24/7 support;API access;Advanced analytics;Multi-currency support',
                type: 'premium',
                price: 99.99,
              },
              {
                id: 4,
                title: 'Enterprise',
                description:
                  'Everything in Premium;Dedicated account manager;Custom development;White-label solution;Unlimited users;Advanced security features;Data migration assistance',
                type: 'enterprise',
                price: 199.99,
              },
            ];
      } catch (error) {
        console.error(
          'Error fetching packages:',
          error
        );
        // Return mock data
        return [
          {
            id: 1,
            title: 'Starter',
            description:
              'Basic POS functionality;Inventory management;Single store support;Email support;Basic reporting',
            type: 'starter',
            price: 29.99,
          },
          {
            id: 2,
            title: 'Growth',
            description:
              'Everything in Starter;Multi-store support;Customer loyalty program;Priority support;Advanced reporting;Employee management',
            type: 'growth',
            price: 59.99,
          },
          {
            id: 3,
            title: 'Premium',
            description:
              'Everything in Growth;Advanced inventory forecasting;Custom branding;24/7 support;API access;Advanced analytics;Multi-currency support',
            type: 'premium',
            price: 99.99,
          },
          {
            id: 4,
            title: 'Enterprise',
            description:
              'Everything in Premium;Dedicated account manager;Custom development;White-label solution;Unlimited users;Advanced security features;Data migration assistance',
            type: 'enterprise',
            price: 199.99,
          },
        ];
      }
    },
    enabled:
      open &&
      selectedSetting === 'Package Management',
  });

  // Mock subscription data for development
  const subscription = {
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
    additionalPackages: [] as number[],
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

  // Import UserSubscriptionContext
  const {
    enableAdditionalPackage: enablePackage,
    disableAdditionalPackage: disablePackage,
  } = useUserSubscription();

  // Functions for enabling/disabling packages with UI updates
  const enableAdditionalPackage = async (
    packageId: number
  ) => {
    console.log(`Enable package ${packageId}`);
    try {
      // Call the API through the context
      await enablePackage(packageId);

      // Notify the sidebar to refresh
      const packageChangedEvent = new CustomEvent(
        'packageChanged'
      );
      window.dispatchEvent(packageChangedEvent);

      // Show success message
      console.log(
        `Package ${packageId} enabled successfully`
      );
    } catch (error) {
      console.error(
        'Error enabling package:',
        error
      );
    }
  };

  const disableAdditionalPackage = async (
    packageId: number
  ) => {
    console.log(`Disable package ${packageId}`);
    try {
      // Call the API through the context
      await disablePackage(packageId);

      // Notify the sidebar to refresh
      const packageChangedEvent = new CustomEvent(
        'packageChanged'
      );
      window.dispatchEvent(packageChangedEvent);

      // Show success message
      console.log(
        `Package ${packageId} disabled successfully`
      );
    } catch (error) {
      console.error(
        'Error disabling package:',
        error
      );
    }
  };

  // Always render content regardless of data state
  const renderSettingContent = () => {
    console.log(
      'Rendering content for setting:',
      selectedSetting
    );
    switch (selectedSetting) {
      case 'General Settings':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  bgcolor: '#f9f9f9',
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                >
                  Company Logo
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Upload your company logo to
                  display in the application.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      'space-between',
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border:
                          '1px solid #e0e0e0',
                        borderRadius: 4,
                      }}
                    >
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          width={80}
                          height={80}
                          style={{
                            objectFit: 'cover',
                          }}
                          unoptimized
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          No logo
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2">
                        Recommended size: 200x200
                        pixels
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Supported formats: JPG,
                        PNG, SVG
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={
                      <Box
                        component="span"
                        sx={{
                          fontSize: '1.2rem',
                        }}
                      >
                        📤
                      </Box>
                    }
                    sx={{
                      textTransform: 'none',
                      borderRadius: 4,
                      height: '36px',
                    }}
                  >
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleLogoFileChange
                      }
                      style={{ display: 'none' }}
                    />
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  bgcolor: '#f9f9f9',
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                >
                  Theme Colors
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Customize the colors of your
                  application interface.
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1 }}
                  >
                    Theme Presets
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap',
                    }}
                  >
                    {[
                      {
                        name: 'Corporate',
                        sidebar: '#173A79',
                        navbar: '#000000',
                      },
                      {
                        name: 'Light',
                        sidebar: '#ffffff',
                        navbar: '#f5f5f5',
                      },
                      {
                        name: 'Dark',
                        sidebar: '#1e1e1e',
                        navbar: '#2d2d2d',
                      },
                      {
                        name: 'Vibrant',
                        sidebar: '#2E7D32',
                        navbar: '#1565C0',
                      },
                    ].map((theme) => (
                      <Box
                        key={theme.name}
                        onClick={() => {
                          setSidebarColor(
                            theme.sidebar
                          );
                          setNavbarColor(
                            theme.navbar
                          );
                        }}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          p: 1,
                          border:
                            '1px solid #e0e0e0',
                          borderRadius: 2,
                          width: '80px',
                          '&:hover': {
                            bgcolor:
                              'rgba(0,0,0,0.04)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            width: '100%',
                            height: '30px',
                            mb: 1,
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: '60%',
                              bgcolor:
                                theme.sidebar,
                            }}
                          />
                          <Box
                            sx={{
                              width: '40%',
                              bgcolor:
                                theme.navbar,
                            }}
                          />
                        </Box>
                        <Typography variant="caption">
                          {theme.name}
                        </Typography>
                      </Box>
                    ))}
                    <Box
                      onClick={() => {
                        setSidebarColor(
                          DEFAULT_SIDEBAR_COLOR
                        );
                        setNavbarColor(
                          DEFAULT_NAVBAR_COLOR
                        );
                      }}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        p: 1,
                        border:
                          '1px solid #e0e0e0',
                        borderRadius: 2,
                        width: '80px',
                        '&:hover': {
                          bgcolor:
                            'rgba(0,0,0,0.04)',
                        },
                      }}
                    >
                      <Typography variant="caption">
                        Reset to Default
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ width: '120px' }}
                    >
                      Sidebar Color
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: sidebarColor,
                          border:
                            '1px solid #e0e0e0',
                          borderRadius: 4,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent:
                            'center',
                        }}
                        onClick={() =>
                          setShowSidebarColorPicker(
                            !showSidebarColorPicker
                          )
                        }
                      >
                        <FaPaintBrush
                          color={
                            sidebarColor ===
                              '#ffffff' ||
                            sidebarColor ===
                              '#f5f5f5'
                              ? '#000'
                              : '#fff'
                          }
                          size={16}
                        />
                      </Box>
                      <TextField
                        value={sidebarColor}
                        onChange={(e) =>
                          setSidebarColor(
                            e.target.value
                          )
                        }
                        size="small"
                        sx={{ width: '140px' }}
                      />
                      {showSidebarColorPicker && (
                        <Box
                          sx={{
                            position: 'absolute',
                            zIndex: 2,
                            mt: 20,
                            ml: 5,
                            boxShadow:
                              '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        >
                          <Box
                            sx={{
                              position: 'fixed',
                              top: 0,
                              right: 0,
                              bottom: 0,
                              left: 0,
                              zIndex: 1,
                            }}
                            onClick={() =>
                              setShowSidebarColorPicker(
                                false
                              )
                            }
                          />
                          <Box
                            sx={{
                              position:
                                'relative',
                              zIndex: 2,
                            }}
                          >
                            <SketchPicker
                              color={sidebarColor}
                              onChange={(
                                color: ColorResult
                              ) =>
                                setSidebarColor(
                                  color.hex
                                )
                              }
                            />
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        setSidebarColor(
                          DEFAULT_SIDEBAR_COLOR
                        )
                      }
                      sx={{
                        textTransform: 'none',
                        borderRadius: 4,
                        height: '36px',
                        minWidth: '80px',
                      }}
                    >
                      Reset
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ width: '120px' }}
                    >
                      Navbar Color
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: navbarColor,
                          border:
                            '1px solid #e0e0e0',
                          borderRadius: 4,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent:
                            'center',
                        }}
                        onClick={() =>
                          setShowNavbarColorPicker(
                            !showNavbarColorPicker
                          )
                        }
                      >
                        <FaPaintBrush
                          color={
                            navbarColor ===
                              '#ffffff' ||
                            navbarColor ===
                              '#f5f5f5'
                              ? '#000'
                              : '#fff'
                          }
                          size={16}
                        />
                      </Box>
                      <TextField
                        value={navbarColor}
                        onChange={(e) =>
                          setNavbarColor(
                            e.target.value
                          )
                        }
                        size="small"
                        sx={{ width: '140px' }}
                      />
                      {showNavbarColorPicker && (
                        <Box
                          sx={{
                            position: 'absolute',
                            zIndex: 2,
                            mt: 20,
                            ml: 5,
                            boxShadow:
                              '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        >
                          <Box
                            sx={{
                              position: 'fixed',
                              top: 0,
                              right: 0,
                              bottom: 0,
                              left: 0,
                              zIndex: 1,
                            }}
                            onClick={() =>
                              setShowNavbarColorPicker(
                                false
                              )
                            }
                          />
                          <Box
                            sx={{
                              position:
                                'relative',
                              zIndex: 2,
                            }}
                          >
                            <SketchPicker
                              color={navbarColor}
                              onChange={(
                                color: ColorResult
                              ) =>
                                setNavbarColor(
                                  color.hex
                                )
                              }
                            />
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        setNavbarColor(
                          DEFAULT_NAVBAR_COLOR
                        )
                      }
                      sx={{
                        textTransform: 'none',
                        borderRadius: 4,
                        height: '36px',
                        minWidth: '80px',
                      }}
                    >
                      Reset
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  bgcolor: '#f9f9f9',
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                >
                  Interface Settings
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Configure how the application
                  interface behaves.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'space-between',
                    }}
                  >
                    <Typography variant="body1">
                      Compact Mode
                    </Typography>
                    <Button
                      variant="outlined"
                      color="inherit"
                      sx={{
                        minWidth: '100px',
                        borderRadius: 4,
                        textTransform: 'none',
                      }}
                    >
                      Disabled
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'space-between',
                    }}
                  >
                    <Typography variant="body1">
                      Dark Mode
                    </Typography>
                    <Button
                      variant="outlined"
                      color="inherit"
                      sx={{
                        minWidth: '100px',
                        borderRadius: 4,
                        textTransform: 'none',
                      }}
                    >
                      Disabled
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'space-between',
                    }}
                  >
                    <Typography variant="body1">
                      Animations
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        minWidth: '100px',
                        borderRadius: 4,
                        textTransform: 'none',
                      }}
                    >
                      Enabled
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      case 'Tax & VAT Configuration':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tax & VAT Settings
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1">
                  Enable Tax Calculation
                </Typography>
                <Button
                  variant={
                    taxSettings.enableTaxCalculation
                      ? 'contained'
                      : 'outlined'
                  }
                  color={
                    taxSettings.enableTaxCalculation
                      ? 'primary'
                      : 'inherit'
                  }
                  onClick={() =>
                    setTaxSettings({
                      ...taxSettings,
                      enableTaxCalculation:
                        !taxSettings.enableTaxCalculation,
                    })
                  }
                  sx={{
                    minWidth: '100px',
                    borderRadius: 1,
                    textTransform: 'none',
                  }}
                >
                  {taxSettings.enableTaxCalculation
                    ? 'Enabled'
                    : 'Disabled'}
                </Button>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Default Tax Rate (%)
                </Typography>
                <Box
                  sx={{ position: 'relative' }}
                >
                  <TextField
                    type="number"
                    value={
                      taxSettings.defaultTaxRate ||
                      0
                    }
                    onChange={(e) => {
                      const value =
                        parseFloat(
                          e.target.value
                        ) || 0;
                      setTaxSettings({
                        ...taxSettings,
                        defaultTaxRate: value,
                      });
                    }}
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiInputBase-input': {
                        paddingRight: '30px',
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform:
                        'translateY(-50%)',
                    }}
                  >
                    %
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Tax Calculation Method
                </Typography>
                <Box
                  sx={{ display: 'flex', gap: 2 }}
                >
                  <Button
                    variant={
                      taxSettings.taxCalculationMethod ===
                      'inclusive'
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      taxSettings.taxCalculationMethod ===
                      'inclusive'
                        ? 'primary'
                        : 'inherit'
                    }
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        taxCalculationMethod:
                          'inclusive',
                      })
                    }
                    sx={{
                      flex: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Inclusive
                  </Button>
                  <Button
                    variant={
                      taxSettings.taxCalculationMethod ===
                      'exclusive'
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      taxSettings.taxCalculationMethod ===
                      'exclusive'
                        ? 'primary'
                        : 'inherit'
                    }
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        taxCalculationMethod:
                          'exclusive',
                      })
                    }
                    sx={{
                      flex: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Exclusive
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1">
                  VAT Registered
                </Typography>
                <Button
                  variant={
                    taxSettings.vatRegistered
                      ? 'contained'
                      : 'outlined'
                  }
                  color={
                    taxSettings.vatRegistered
                      ? 'primary'
                      : 'inherit'
                  }
                  onClick={() =>
                    setTaxSettings({
                      ...taxSettings,
                      vatRegistered:
                        !taxSettings.vatRegistered,
                    })
                  }
                  sx={{
                    minWidth: '100px',
                    borderRadius: 1,
                    textTransform: 'none',
                  }}
                >
                  {taxSettings.vatRegistered
                    ? 'Yes'
                    : 'No'}
                </Button>
              </Box>

              {taxSettings.vatRegistered && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    VAT Number
                  </Typography>
                  <TextField
                    value={
                      taxSettings.vatNumber || ''
                    }
                    onChange={(e) =>
                      setTaxSettings({
                        ...taxSettings,
                        vatNumber: e.target.value,
                      })
                    }
                    size="small"
                    placeholder="Enter VAT number"
                  />
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1">
                  Display Tax on Receipts
                </Typography>
                <Button
                  variant={
                    taxSettings.displayTaxOnReceipts
                      ? 'contained'
                      : 'outlined'
                  }
                  color={
                    taxSettings.displayTaxOnReceipts
                      ? 'primary'
                      : 'inherit'
                  }
                  onClick={() =>
                    setTaxSettings({
                      ...taxSettings,
                      displayTaxOnReceipts:
                        !taxSettings.displayTaxOnReceipts,
                    })
                  }
                  sx={{
                    minWidth: '100px',
                    borderRadius: 1,
                    textTransform: 'none',
                  }}
                >
                  {taxSettings.displayTaxOnReceipts
                    ? 'Yes'
                    : 'No'}
                </Button>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Tax Reporting Period
                </Typography>
                <Box
                  sx={{ display: 'flex', gap: 2 }}
                >
                  <Button
                    variant={
                      taxSettings.taxReportingPeriod ===
                      'monthly'
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      taxSettings.taxReportingPeriod ===
                      'monthly'
                        ? 'primary'
                        : 'inherit'
                    }
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        taxReportingPeriod:
                          'monthly',
                      })
                    }
                    sx={{
                      flex: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={
                      taxSettings.taxReportingPeriod ===
                      'quarterly'
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      taxSettings.taxReportingPeriod ===
                      'quarterly'
                        ? 'primary'
                        : 'inherit'
                    }
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        taxReportingPeriod:
                          'quarterly',
                      })
                    }
                    sx={{
                      flex: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Quarterly
                  </Button>
                  <Button
                    variant={
                      taxSettings.taxReportingPeriod ===
                      'annually'
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      taxSettings.taxReportingPeriod ===
                      'annually'
                        ? 'primary'
                        : 'inherit'
                    }
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        taxReportingPeriod:
                          'annually',
                      })
                    }
                    sx={{
                      flex: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Annually
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      case 'Currency & Regional Settings':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Regional Settings
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Default Currency
                </Typography>
                <TextField
                  select
                  value={
                    regionalSettings.defaultCurrency
                  }
                  onChange={(e) =>
                    setRegionalSettings({
                      ...regionalSettings,
                      defaultCurrency:
                        e.target.value,
                    })
                  }
                  size="small"
                  sx={{ minWidth: '200px' }}
                >
                  {regionalSettings.supportedCurrencies.map(
                    (currency) => (
                      <MenuItem
                        key={currency}
                        value={currency}
                      >
                        {currency}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1">
                  Enable Multi-Currency Support
                </Typography>
                <Button
                  variant={
                    regionalSettings.enableMultiCurrency
                      ? 'contained'
                      : 'outlined'
                  }
                  color={
                    regionalSettings.enableMultiCurrency
                      ? 'primary'
                      : 'inherit'
                  }
                  onClick={() =>
                    setRegionalSettings({
                      ...regionalSettings,
                      enableMultiCurrency:
                        !regionalSettings.enableMultiCurrency,
                    })
                  }
                  sx={{
                    minWidth: '100px',
                    borderRadius: 1,
                    textTransform: 'none',
                  }}
                >
                  {regionalSettings.enableMultiCurrency
                    ? 'Enabled'
                    : 'Disabled'}
                </Button>
              </Box>

              {regionalSettings.enableMultiCurrency && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    Supported Currencies
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      maxHeight: '150px',
                      overflowY: 'auto',
                      p: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                    }}
                  >
                    {regionalSettings.supportedCurrencies.map(
                      (currency) => (
                        <Chip
                          key={currency}
                          label={currency}
                          color={
                            regionalSettings.defaultCurrency ===
                            currency
                              ? 'primary'
                              : 'default'
                          }
                          onDelete={() => {
                            if (
                              currency !==
                              regionalSettings.defaultCurrency
                            ) {
                              setRegionalSettings(
                                {
                                  ...regionalSettings,
                                  supportedCurrencies:
                                    regionalSettings.supportedCurrencies.filter(
                                      (c) =>
                                        c !==
                                        currency
                                    ),
                                }
                              );
                            }
                          }}
                          sx={{ m: 0.5 }}
                        />
                      )
                    )}
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Date Format
                </Typography>
                <TextField
                  select
                  value={
                    regionalSettings.dateFormat
                  }
                  onChange={(e) =>
                    setRegionalSettings({
                      ...regionalSettings,
                      dateFormat: e.target.value,
                    })
                  }
                  size="small"
                >
                  <MenuItem value="DD/MM/YYYY">
                    DD/MM/YYYY
                  </MenuItem>
                  <MenuItem value="MM/DD/YYYY">
                    MM/DD/YYYY
                  </MenuItem>
                  <MenuItem value="YYYY-MM-DD">
                    YYYY-MM-DD
                  </MenuItem>
                </TextField>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Time Format
                </Typography>
                <Box
                  sx={{ display: 'flex', gap: 2 }}
                >
                  <Button
                    variant={
                      regionalSettings.timeFormat ===
                      '12h'
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      regionalSettings.timeFormat ===
                      '12h'
                        ? 'primary'
                        : 'inherit'
                    }
                    onClick={() =>
                      setRegionalSettings({
                        ...regionalSettings,
                        timeFormat: '12h',
                      })
                    }
                    sx={{
                      flex: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    12-hour
                  </Button>
                  <Button
                    variant={
                      regionalSettings.timeFormat ===
                      '24h'
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      regionalSettings.timeFormat ===
                      '24h'
                        ? 'primary'
                        : 'inherit'
                    }
                    onClick={() =>
                      setRegionalSettings({
                        ...regionalSettings,
                        timeFormat: '24h',
                      })
                    }
                    sx={{
                      flex: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    24-hour
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Timezone
                </Typography>
                <TextField
                  select
                  value={
                    regionalSettings.timezone
                  }
                  onChange={(e) =>
                    setRegionalSettings({
                      ...regionalSettings,
                      timezone: e.target.value,
                    })
                  }
                  size="small"
                >
                  <MenuItem value="Africa/Johannesburg">
                    Africa/Johannesburg
                  </MenuItem>
                  <MenuItem value="Europe/London">
                    Europe/London
                  </MenuItem>
                  <MenuItem value="America/New_York">
                    America/New_York
                  </MenuItem>
                  <MenuItem value="Asia/Tokyo">
                    Asia/Tokyo
                  </MenuItem>
                </TextField>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="subtitle1">
                  Auto-Detect Location
                </Typography>
                <Button
                  variant={
                    regionalSettings.autoDetectLocation
                      ? 'contained'
                      : 'outlined'
                  }
                  color={
                    regionalSettings.autoDetectLocation
                      ? 'primary'
                      : 'inherit'
                  }
                  onClick={() =>
                    setRegionalSettings({
                      ...regionalSettings,
                      autoDetectLocation:
                        !regionalSettings.autoDetectLocation,
                    })
                  }
                  sx={{
                    minWidth: '100px',
                    borderRadius: 1,
                    textTransform: 'none',
                  }}
                >
                  {regionalSettings.autoDetectLocation
                    ? 'Enabled'
                    : 'Disabled'}
                </Button>
              </Box>
            </Box>
          </Box>
        );
      case 'Business Information':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Business Information
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Business Name
                </Typography>
                <TextField
                  placeholder="Enter your business name"
                  defaultValue="Pisval Tech"
                  size="small"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Business Type
                </Typography>
                <TextField
                  select
                  defaultValue="retail"
                  size="small"
                >
                  <MenuItem value="retail">
                    Retail
                  </MenuItem>
                  <MenuItem value="restaurant">
                    Restaurant
                  </MenuItem>
                  <MenuItem value="service">
                    Service
                  </MenuItem>
                  <MenuItem value="wholesale">
                    Wholesale
                  </MenuItem>
                  <MenuItem value="other">
                    Other
                  </MenuItem>
                </TextField>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Contact Information
                </Typography>
                <TextField
                  placeholder="Phone Number"
                  defaultValue="+27 123 456 789"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  placeholder="Email Address"
                  defaultValue="info@pisvaltech.com"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  placeholder="Website"
                  defaultValue="www.pisvaltech.com"
                  size="small"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Business Address
                </Typography>
                <TextField
                  placeholder="Street Address"
                  defaultValue="123 Main Street"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box
                  sx={{ display: 'flex', gap: 2 }}
                >
                  <TextField
                    placeholder="City"
                    defaultValue="Johannesburg"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    placeholder="Postal Code"
                    defaultValue="2000"
                    size="small"
                    sx={{ width: '120px' }}
                  />
                </Box>
                <TextField
                  select
                  defaultValue="ZA"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  <MenuItem value="ZA">
                    South Africa
                  </MenuItem>
                  <MenuItem value="US">
                    United States
                  </MenuItem>
                  <MenuItem value="UK">
                    United Kingdom
                  </MenuItem>
                  <MenuItem value="AU">
                    Australia
                  </MenuItem>
                </TextField>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Registration Information
                </Typography>
                <TextField
                  placeholder="Company Registration Number"
                  defaultValue="2023/123456/07"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  placeholder="Tax ID / VAT Number"
                  defaultValue="VAT2023456789"
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        );
      case 'User & Role Management':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User & Role Management
            </Typography>

            {/* Tabs for different role management features */}
            <Box sx={{ width: '100%' }}>
              <Tabs
                value={selectedRoleTab}
                onChange={(_, newValue) => {
                  // Use a callback to ensure we're not causing infinite updates
                  setSelectedRoleTab(newValue);
                }}
                aria-label="role management tabs"
                sx={{
                  mb: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Tab label="Role Management" />
                <Tab label="User Activity" />
                <Tab label="Access Control" />
                <Tab label="Audit Logs" />
              </Tabs>

              {/* Role Management Tab */}
              {selectedRoleTab === 0 && (
                <Box>
                  <RoleManagement />
                </Box>
              )}

              {/* User Activity Tab */}
              {selectedRoleTab === 1 && (
                <Box>
                  <UserActivityMonitor />
                </Box>
              )}

              {/* Access Control Tab */}
              {selectedRoleTab === 2 && (
                <Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                    >
                      Business Unit Access Control
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Configure access
                      restrictions based on
                      business units, locations,
                      or departments.
                    </Typography>

                    <TableContainer
                      component={Paper}
                      sx={{ mb: 2 }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              Role
                            </TableCell>
                            <TableCell>
                              Business Unit
                            </TableCell>
                            <TableCell>
                              Access Level
                            </TableCell>
                            <TableCell align="right">
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            {
                              role: 'Manager',
                              unit: 'Store #1',
                              level:
                                'Full Access',
                            },
                            {
                              role: 'Manager',
                              unit: 'Store #2',
                              level: 'Read Only',
                            },
                            {
                              role: 'Cashier',
                              unit: 'Store #1',
                              level:
                                'Limited Access',
                            },
                          ].map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {item.role}
                              </TableCell>
                              <TableCell>
                                {item.unit}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    item.level
                                  }
                                  size="small"
                                  color={
                                    item.level ===
                                    'Full Access'
                                      ? 'success'
                                      : item.level ===
                                          'Read Only'
                                        ? 'primary'
                                        : 'default'
                                  }
                                />
                              </TableCell>
                              <TableCell align="right">
                                <IconButton size="small">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      size="small"
                    >
                      Add Business Unit Access
                    </Button>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                    >
                      Time-Based Restrictions
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Set working hours and
                      time-based access
                      restrictions for roles.
                    </Typography>

                    <TableContainer
                      component={Paper}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              Role
                            </TableCell>
                            <TableCell>
                              Days
                            </TableCell>
                            <TableCell>
                              Hours
                            </TableCell>
                            <TableCell align="right">
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            {
                              role: 'Cashier',
                              days: 'Mon-Fri',
                              hours:
                                '08:00 - 17:00',
                            },
                            {
                              role: 'Manager',
                              days: 'Mon-Sun',
                              hours:
                                '07:00 - 19:00',
                            },
                          ].map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {item.role}
                              </TableCell>
                              <TableCell>
                                {item.days}
                              </TableCell>
                              <TableCell>
                                {item.hours}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton size="small">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              )}

              {/* Audit Logs Tab */}
              {selectedRoleTab === 3 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                  >
                    Permission Change Audit Log
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Track all changes to
                    permissions and roles for
                    compliance purposes.
                  </Typography>

                  <TableContainer
                    component={Paper}
                    sx={{ mb: 3 }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            Date & Time
                          </TableCell>
                          <TableCell>
                            User
                          </TableCell>
                          <TableCell>
                            Action
                          </TableCell>
                          <TableCell>
                            Details
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          {
                            date: '2023-10-15 14:30',
                            user: 'admin@pisvaltech.com',
                            action:
                              'Permission Added',
                            details:
                              'Added "reports.sales" to Manager role',
                          },
                          {
                            date: '2023-10-14 11:20',
                            user: 'admin@pisvaltech.com',
                            action:
                              'Role Created',
                            details:
                              'Created new role "Inventory Manager"',
                          },
                          {
                            date: '2023-10-13 09:45',
                            user: 'manager@pisvaltech.com',
                            action:
                              'User Assigned',
                            details:
                              'Assigned user "john" to Cashier role',
                          },
                        ].map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {item.date}
                            </TableCell>
                            <TableCell>
                              {item.user}
                            </TableCell>
                            <TableCell>
                              {item.action}
                            </TableCell>
                            <TableCell>
                              {item.details}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                    >
                      Export Audit Log
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: '1px solid #e0e0e0',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Note: User management is
                integrated with Keycloak. To add
                or modify users, please use the
                Keycloak admin console.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() =>
                  window.open(
                    'http://localhost:8282/admin/master/console/#/pisval-pos-realm/clients',
                    '_blank'
                  )
                }
                sx={{
                  mt: 1,
                  borderRadius: 1,
                  textTransform: 'none',
                }}
              >
                Open Keycloak Admin Console
              </Button>
            </Box>
          </Box>
        );
      case 'Package Management':
        return (
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              fontWeight="500"
              color="#173A79"
            >
              Package Management
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {subscription ? (
                <>
                  <Box
                    sx={{
                      p: 0,
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow:
                        '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow:
                          '0 6px 25px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        background:
                          'linear-gradient(135deg, #173A79 0%, #2a5cbb 100%)',
                        color: 'white',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        component="div"
                        fontWeight="bold"
                        sx={{
                          fontSize: '1.1rem',
                        }}
                      >
                        Current Subscription
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          opacity: 0.85,
                          mb: 0,
                        }}
                      >
                        Your current active
                        subscription package
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        p: 3,
                        bgcolor: '#fff',
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background:
                            'linear-gradient(135deg, #173A79 0%, #2a5cbb 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent:
                            'center',
                          color: '#fff',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          boxShadow:
                            '0 4px 10px rgba(23, 58, 121, 0.3)',
                        }}
                      >
                        {subscription.package?.type
                          .charAt(0)
                          .toUpperCase()}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          component="div"
                          fontWeight="500"
                        >
                          {subscription.package
                            ?.title ||
                            'Starter'}{' '}
                          Package
                        </Typography>
                        <Typography
                          variant="body2"
                          component="div"
                          color="text.secondary"
                        >
                          Active since:{' '}
                          {new Date(
                            subscription.startDate
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                        sx={{
                          ml: 'auto',
                          fontWeight: 'medium',
                          px: 1,
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 24,
                          background:
                            'linear-gradient(180deg, #173A79 0%, #2a5cbb 100%)',
                          borderRadius: 1,
                          display: 'inline-block',
                          mr: 1,
                        }}
                      ></Box>
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="500"
                        color="#173A79"
                      >
                        Available Packages
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      component="div"
                      color="text.secondary"
                      sx={{ mb: 3, ml: 2 }}
                    >
                      Enable additional packages
                      to access more features
                    </Typography>

                    <Grid container spacing={3}>
                      {packages?.map((pkg) => {
                        const isCurrentPackage =
                          subscription.pricingPackageId ===
                          pkg.id;
                        const isAdditionalPackage =
                          subscription.additionalPackages?.includes(
                            pkg.id
                          );
                        const isEnabled =
                          isCurrentPackage ||
                          isAdditionalPackage;

                        return (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={pkg.id}
                          >
                            <Card
                              sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection:
                                  'column',
                                borderRadius: 2,
                                overflow:
                                  'hidden',
                                boxShadow:
                                  isEnabled
                                    ? '0 6px 20px rgba(76, 175, 80, 0.15)'
                                    : '0 4px 15px rgba(0, 0, 0, 0.05)',
                                transition:
                                  'all 0.3s ease',
                                '&:hover': {
                                  transform:
                                    'translateY(-4px)',
                                  boxShadow:
                                    isEnabled
                                      ? '0 8px 25px rgba(76, 175, 80, 0.2)'
                                      : '0 8px 25px rgba(0, 0, 0, 0.1)',
                                },
                                border: isEnabled
                                  ? '2px solid #4caf50'
                                  : 'none',
                              }}
                            >
                              <Box
                                sx={{
                                  p: 2,
                                  background:
                                    isEnabled
                                      ? 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)'
                                      : 'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)',
                                  borderBottom:
                                    '1px solid',
                                  borderColor:
                                    isEnabled
                                      ? '#c8e6c9'
                                      : '#eeeeee',
                                }}
                              >
                                <Box
                                  sx={{
                                    display:
                                      'flex',
                                    justifyContent:
                                      'space-between',
                                    alignItems:
                                      'center',
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    component="div"
                                    fontWeight="500"
                                  >
                                    {pkg.title}
                                  </Typography>
                                  {isEnabled && (
                                    <CheckCircleIcon color="success" />
                                  )}
                                </Box>
                              </Box>
                              <CardContent
                                sx={{
                                  flexGrow: 1,
                                  p: 3,
                                }}
                              >
                                <Box
                                  sx={{ mb: 3 }}
                                >
                                  {pkg.description
                                    .split(';')
                                    .slice(0, 3)
                                    .map(
                                      (
                                        feature,
                                        index
                                      ) => (
                                        <Box
                                          key={
                                            index
                                          }
                                          sx={{
                                            display:
                                              'flex',
                                            alignItems:
                                              'center',
                                            mb: 1,
                                          }}
                                        >
                                          <Box
                                            component="span"
                                            sx={{
                                              width: 6,
                                              height: 6,
                                              borderRadius:
                                                '50%',
                                              bgcolor:
                                                'primary.main',
                                              display:
                                                'inline-block',
                                              mr: 1.5,
                                            }}
                                          ></Box>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            component="span"
                                          >
                                            {feature.trim()}
                                          </Typography>
                                        </Box>
                                      )
                                    )}
                                  {pkg.description.split(
                                    ';'
                                  ).length >
                                    3 && (
                                    <Box
                                      sx={{
                                        mt: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        color="primary"
                                        component="span"
                                        sx={{
                                          fontWeight:
                                            'medium',
                                          cursor:
                                            'pointer',
                                        }}
                                      >
                                        +{' '}
                                        {pkg.description.split(
                                          ';'
                                        ).length -
                                          3}{' '}
                                        more
                                        features
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                                <Box
                                  sx={{
                                    display:
                                      'flex',
                                    alignItems:
                                      'center',
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    component="div"
                                    color="primary"
                                    fontWeight="bold"
                                  >
                                    <Box
                                      component="span"
                                      sx={{
                                        fontSize:
                                          '1.8rem',
                                        mr: 0.5,
                                      }}
                                    >
                                      ${pkg.price}
                                    </Box>
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{
                                      fontSize:
                                        '0.9rem',
                                      color:
                                        'text.secondary',
                                      fontWeight:
                                        'normal',
                                    }}
                                  >
                                    /month
                                  </Typography>
                                </Box>
                              </CardContent>
                              <CardActions
                                sx={{
                                  p: 2,
                                  pt: 0,
                                }}
                              >
                                {isCurrentPackage ? (
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    disabled
                                    sx={{
                                      py: 1,
                                      borderRadius: 2,
                                      textTransform:
                                        'none',
                                      fontWeight:
                                        'medium',
                                      fontSize:
                                        '0.95rem',
                                    }}
                                  >
                                    Current
                                    Package
                                  </Button>
                                ) : isAdditionalPackage ? (
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    onClick={() =>
                                      disableAdditionalPackage(
                                        pkg.id
                                      )
                                    }
                                    startIcon={
                                      <CancelIcon />
                                    }
                                    sx={{
                                      py: 1,
                                      borderRadius: 2,
                                      textTransform:
                                        'none',
                                      fontWeight:
                                        'medium',
                                      fontSize:
                                        '0.95rem',
                                      borderWidth:
                                        '1.5px',
                                      '&:hover': {
                                        borderWidth:
                                          '1.5px',
                                        bgcolor:
                                          'rgba(211, 47, 47, 0.04)',
                                      },
                                    }}
                                  >
                                    Disable
                                    Package
                                  </Button>
                                ) : (
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={
                                          false
                                        }
                                        onChange={() =>
                                          enableAdditionalPackage(
                                            pkg.id
                                          )
                                        }
                                        color="primary"
                                        sx={{
                                          '& .MuiSwitch-switchBase.Mui-checked':
                                            {
                                              color:
                                                '#173A79',
                                            },
                                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                            {
                                              backgroundColor:
                                                '#173A79',
                                            },
                                        }}
                                      />
                                    }
                                    label="Enable Package"
                                    sx={{
                                      width:
                                        '100%',
                                      justifyContent:
                                        'space-between',
                                      margin: 0,
                                      '.MuiFormControlLabel-label':
                                        {
                                          fontWeight:
                                            'medium',
                                          color:
                                            '#173A79',
                                        },
                                    }}
                                    labelPlacement="start"
                                  />
                                )}
                              </CardActions>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      bgcolor: '#f8f9fa',
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 24,
                          background:
                            'linear-gradient(180deg, #173A79 0%, #2a5cbb 100%)',
                          borderRadius: 1,
                          display: 'inline-block',
                          mr: 1,
                        }}
                      ></Box>
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="500"
                        color="#173A79"
                      >
                        Available Features
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      component="div"
                      color="text.secondary"
                      sx={{ mb: 3, ml: 2 }}
                    >
                      Features available with your
                      current subscription
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                      }}
                    >
                      {availableFeatures.map(
                        (feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            color="primary"
                            variant="outlined"
                            icon={
                              <CheckCircleIcon />
                            }
                            sx={{
                              borderRadius:
                                '16px',
                              py: 0.5,
                              px: 0.5,
                              borderColor:
                                'rgba(23, 58, 121, 0.3)',
                              '& .MuiChip-label':
                                {
                                  px: 1,
                                  fontWeight:
                                    'medium',
                                },
                              '& .MuiChip-icon': {
                                color: '#4caf50',
                              },
                              transition:
                                'all 0.2s ease',
                              '&:hover': {
                                bgcolor:
                                  'rgba(23, 58, 121, 0.08)',
                                boxShadow:
                                  '0 2px 8px rgba(0,0,0,0.05)',
                              },
                            }}
                          />
                        )
                      )}
                    </Box>
                  </Box>
                </>
              ) : (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 2,
                    boxShadow:
                      '0 4px 15px rgba(0,0,0,0.05)',
                    '& .MuiAlert-icon': {
                      color: '#173A79',
                    },
                  }}
                >
                  <AlertTitle
                    sx={{ fontWeight: 'medium' }}
                  >
                    No Subscription Found
                  </AlertTitle>
                  No active subscription found.
                  Please contact support to set up
                  your subscription.
                </Alert>
              )}
            </Box>
          </Box>
        );
      case 'Email & Notification Settings':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Email & Notification Settings
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Email Configuration
                </Typography>
                <TextField
                  label="SMTP Server"
                  placeholder="smtp.example.com"
                  defaultValue="smtp.pisvaltech.com"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box
                  sx={{ display: 'flex', gap: 2 }}
                >
                  <TextField
                    label="SMTP Port"
                    placeholder="587"
                    defaultValue="587"
                    size="small"
                    sx={{ width: '120px' }}
                  />
                  <TextField
                    select
                    label="Encryption"
                    defaultValue="tls"
                    size="small"
                    sx={{ flex: 1 }}
                  >
                    <MenuItem value="none">
                      None
                    </MenuItem>
                    <MenuItem value="ssl">
                      SSL
                    </MenuItem>
                    <MenuItem value="tls">
                      TLS
                    </MenuItem>
                  </TextField>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  mt: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Authentication
                </Typography>
                <TextField
                  label="Username"
                  placeholder="Email username"
                  defaultValue="notifications@pisvaltech.com"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Password"
                  type="password"
                  placeholder="Email password"
                  defaultValue="••••••••••••"
                  size="small"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  mt: 1,
                }}
              >
                <Typography variant="subtitle1">
                  Sender Information
                </Typography>
                <TextField
                  label="From Name"
                  placeholder="Your business name"
                  defaultValue="Pisval Tech"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="From Email"
                  placeholder="noreply@example.com"
                  defaultValue="noreply@pisvaltech.com"
                  size="small"
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                >
                  Notification Preferences
                </Typography>

                {[
                  {
                    id: 'new_order',
                    label:
                      'New Order Notifications',
                    description:
                      'Receive notifications when new orders are placed',
                  },
                  {
                    id: 'low_stock',
                    label: 'Low Stock Alerts',
                    description:
                      'Get alerts when inventory items are running low',
                  },
                  {
                    id: 'customer_signup',
                    label: 'New Customer Signup',
                    description:
                      'Be notified when new customers register',
                  },
                  {
                    id: 'daily_summary',
                    label: 'Daily Sales Summary',
                    description:
                      'Receive a daily summary of sales and transactions',
                  },
                ].map((notification) => (
                  <Box
                    key={notification.id}
                    sx={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      borderBottom:
                        '1px solid #f0f0f0',
                    }}
                  >
                    <Box>
                      <Typography variant="body1">
                        {notification.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {notification.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        minWidth: '100px',
                        borderRadius: 1,
                        textTransform: 'none',
                      }}
                    >
                      Enabled
                    </Button>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    mr: 2,
                  }}
                >
                  Test Email
                </Button>
              </Box>
            </Box>
          </Box>
        );
      case 'Change History':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Change History
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    bgcolor: '#f5f5f5',
                    p: 1.5,
                    borderBottom:
                      '1px solid #e0e0e0',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    Timestamp
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Setting
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Old Value
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    New Value
                  </Typography>
                </Box>

                {changeHistory.length === 0 ? (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No changes have been made
                      yet.
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                    }}
                  >
                    {changeHistory
                      .slice()
                      .reverse()
                      .map((change, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            p: 1.5,
                            borderBottom:
                              index <
                              changeHistory.length -
                                1
                                ? '1px solid #e0e0e0'
                                : 'none',
                            '&:hover': {
                              bgcolor:
                                'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ flex: 2 }}
                          >
                            {change.timestamp.toLocaleString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ flex: 1 }}
                          >
                            {change.setting}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ flex: 1 }}
                          >
                            {typeof change.oldValue ===
                            'object'
                              ? JSON.stringify(
                                  change.oldValue
                                ).substring(
                                  0,
                                  20
                                ) + '...'
                              : String(
                                  change.oldValue
                                )}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ flex: 1 }}
                          >
                            {typeof change.newValue ===
                            'object'
                              ? JSON.stringify(
                                  change.newValue
                                ).substring(
                                  0,
                                  20
                                ) + '...'
                              : String(
                                  change.newValue
                                )}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    setChangeHistory([])
                  }
                  sx={{
                    borderRadius: 4,
                    textTransform: 'none',
                  }}
                >
                  Clear History
                </Button>
              </Box>
            </Box>
          </Box>
        );
      case 'System Backup & Restore':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Backup & Restore
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: '#f9f9f9',
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                >
                  Backup System Data
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Create a complete backup of your
                  system data including products,
                  customers, orders, and settings.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                      <Box
                        component="span"
                        sx={{
                          fontSize: '1.2rem',
                        }}
                      >
                        📥
                      </Box>
                    }
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Create Backup
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Schedule Automatic Backups
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: '#f9f9f9',
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                >
                  Restore System Data
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Restore your system from a
                  previous backup file.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={
                      <Box
                        component="span"
                        sx={{
                          fontSize: '1.2rem',
                        }}
                      >
                        📤
                      </Box>
                    }
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Select Backup File
                    <input
                      type="file"
                      accept=".zip,.bak"
                      style={{ display: 'none' }}
                    />
                  </Button>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No file selected
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="h6"
                sx={{ mt: 3, mb: 1 }}
              >
                Backup History
              </Typography>

              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    bgcolor: '#f5f5f5',
                    p: 1.5,
                    borderBottom:
                      '1px solid #e0e0e0',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 2,
                      fontWeight: 'bold',
                    }}
                  >
                    Backup Date
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Size
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Type
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Status
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Actions
                  </Typography>
                </Box>

                {/* Sample backup history data */}
                {[
                  {
                    date: '2023-10-15 09:30 AM',
                    size: '24.5 MB',
                    type: 'Manual',
                    status: 'Complete',
                  },
                  {
                    date: '2023-10-08 10:00 AM',
                    size: '23.8 MB',
                    type: 'Automatic',
                    status: 'Complete',
                  },
                  {
                    date: '2023-10-01 10:00 AM',
                    size: '23.2 MB',
                    type: 'Automatic',
                    status: 'Complete',
                  },
                ].map((backup, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      p: 1.5,
                      borderBottom:
                        index < 2
                          ? '1px solid #e0e0e0'
                          : 'none',
                      '&:hover': {
                        bgcolor:
                          'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ flex: 2 }}
                    >
                      {backup.date}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ flex: 1 }}
                    >
                      {backup.size}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ flex: 1 }}
                    >
                      {backup.type}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ flex: 1 }}
                    >
                      {backup.status}
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <Button
                        size="small"
                        variant="text"
                        color="primary"
                        sx={{
                          minWidth: 'auto',
                          p: 0.5,
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Note: Regular backups are
                essential to prevent data loss. We
                recommend scheduling automatic
                daily backups.
              </Typography>
            </Box>
          </Box>
        );
      case 'API & Third-Party Integrations':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              API & Third-Party Integrations
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: '#f9f9f9',
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                >
                  API Access
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Manage API keys and access for
                  external integrations.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    label="API Key"
                    value="pk_live_51NxJcTLmCvM6EKkS9Hs2jVnT"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <Button
                          size="small"
                          variant="text"
                          sx={{
                            minWidth: 'auto',
                            p: 0.5,
                          }}
                        >
                          Copy
                        </Button>
                      ),
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Regenerate
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      'space-between',
                  }}
                >
                  <Typography variant="subtitle2">
                    API Access Status
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{
                      minWidth: '100px',
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Enabled
                  </Button>
                </Box>
              </Box>

              <Typography
                variant="h6"
                sx={{ mt: 3, mb: 1 }}
              >
                Connected Services
              </Typography>

              {[
                {
                  name: 'Payment Gateway',
                  provider: 'Stripe',
                  status: 'Connected',
                  icon: '💳',
                },
                {
                  name: 'Shipping Provider',
                  provider: 'DHL Express',
                  status: 'Connected',
                  icon: '🚚',
                },
                {
                  name: 'Email Marketing',
                  provider: 'Mailchimp',
                  status: 'Not Connected',
                  icon: '📧',
                },
                {
                  name: 'Accounting Software',
                  provider: 'QuickBooks',
                  status: 'Not Connected',
                  icon: '📊',
                },
              ].map((service, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      'space-between',
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '1.5rem',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f0f0f0',
                        borderRadius: '50%',
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1">
                        {service.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {service.provider}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant={
                      service.status ===
                      'Connected'
                        ? 'outlined'
                        : 'contained'
                    }
                    color={
                      service.status ===
                      'Connected'
                        ? 'success'
                        : 'primary'
                    }
                    size="small"
                    sx={{
                      minWidth: '120px',
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    {service.status ===
                    'Connected'
                      ? 'Connected'
                      : 'Connect'}
                  </Button>
                </Box>
              ))}

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Note: Third-party integrations may
                require additional setup on the
                provider&apos;s website.
              </Typography>
            </Box>
          </Box>
        );
      case 'Cache Management':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cache Management
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              If you're experiencing issues with data not updating properly,
              you can use these tools to refresh the application's cache.
            </Typography>

            <CacheControl variant="full" />

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                About Caching
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The application stores data temporarily in cache to improve performance.
                Sometimes this cached data may become stale and not reflect the latest changes.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Refresh Data</strong>: Updates specific data without clearing everything.<br />
                • <strong>Reset Cache</strong>: Clears all cached data and fetches fresh data from the server.
              </Typography>
            </Box>

            <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Cache Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Cache Duration
                  </Typography>
                  <Select
                    value="60000"
                    size="small"
                    sx={{ width: '200px' }}
                  >
                    <MenuItem value="30000">30 seconds</MenuItem>
                    <MenuItem value="60000">1 minute</MenuItem>
                    <MenuItem value="300000">5 minutes</MenuItem>
                    <MenuItem value="600000">10 minutes</MenuItem>
                  </Select>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Auto-refresh on Window Focus
                  </Typography>
                  <Switch defaultChecked />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Prefetch Important Data
                  </Typography>
                  <Switch defaultChecked />
                </Box>
              </Box>
            </Box>

            <Alert severity="info" sx={{ mt: 4 }}>
              <AlertTitle>Cache Troubleshooting</AlertTitle>
              If you're still experiencing issues after refreshing the cache, try clearing your browser cache or reloading the application.
            </Alert>
          </Box>
        );
      default:
        return (
          <Box sx={{ p: 2 }}>
            <Typography>
              This section is under development.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (
          reason === 'backdropClick' ||
          reason === 'escapeKeyDown'
        ) {
          return;
        }
        onClose();
      }}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 8,
          padding: 0,
          width: '85%',
          maxWidth: '1200px',
          overflow: 'hidden',
          boxShadow:
            '0 4px 20px rgba(0,0,0,0.15)',
        },
        '& .MuiDialogContent-root': {
          padding: 0,
        },
        '& .MuiDialogTitle-root': {
          padding: '16px 24px',
          borderBottom: '1px solid #e0e0e0',
        },
        '& .MuiDialogActions-root': {
          padding: '16px 24px',
          borderTop: '1px solid #e0e0e0',
        },
        '& ::-webkit-scrollbar': {
          display: 'none',
        },
        '& *': {
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.3rem',
          fontWeight: 'bold',
          padding: '16px 24px',
          color: '#173A79',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#f9f9f9',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Image
            src={logoPreview || DEFAULT_LOGO_URL}
            alt="Pisval Tech Logo"
            width={32}
            height={32}
            style={{ borderRadius: '4px' }}
            unoptimized
          />
          Pisval Tech Settings
        </Box>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ display: 'flex', padding: 0 }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: '280px',
            borderRight: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f8f8f8',
            height: '100%',
          }}
        >
          {/* Search Box */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TextField
              placeholder="Search settings..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => {
                const query =
                  e.target.value.toLowerCase();
                setSearchQuery(query);
              }}
              InputProps={{
                startAdornment: (
                  <Box
                    component="span"
                    sx={{
                      color: 'text.secondary',
                      mr: 1,
                    }}
                  >
                    🔍
                  </Box>
                ),
                sx: {
                  borderRadius: 4,
                  bgcolor: '#fff',
                },
              }}
            />
          </Box>

          {/* Navigation List */}
          <Box
            sx={{
              overflowY: 'auto',
              flexGrow: 1,
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <List
              component="nav"
              aria-label="settings categories"
              sx={{
                py: 0,
              }}
            >
              {(searchQuery.trim() === ''
                ? settingsItems
                : settingsItems.filter((item) =>
                    item.label
                      .toLowerCase()
                      .includes(
                        searchQuery.toLowerCase()
                      )
                  )
              ).map((item) => (
                <Tooltip
                  title={item.tooltip}
                  placement="right"
                  key={item.label}
                >
                  <ListItemButton
                    onClick={() => {
                      setSelectedSetting(
                        item.label
                      );
                      if (
                        item.label ===
                        'Tax & VAT Configuration'
                      )
                        console.log(
                          'Tax & VAT Configuration selected, current settings:',
                          taxSettings
                        );
                    }}
                    selected={
                      selectedSetting ===
                      item.label
                    }
                    sx={{
                      py: 2,
                      borderLeft:
                        selectedSetting ===
                        item.label
                          ? '4px solid #173A79'
                          : '4px solid transparent',
                      bgcolor:
                        selectedSetting ===
                        item.label
                          ? '#fff'
                          : 'transparent',
                      borderBottom:
                        '1px solid #f0f0f0',
                      '&:hover': {
                        bgcolor:
                          selectedSetting ===
                          item.label
                            ? '#fff'
                            : '#f0f0f0',
                      },
                      display: 'flex',
                      justifyContent:
                        'space-between',
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight:
                          selectedSetting ===
                          item.label
                            ? 'bold'
                            : 'normal',
                        color:
                          selectedSetting ===
                          item.label
                            ? '#173A79'
                            : 'inherit',
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{ opacity: 0.5, ml: 1 }}
                    >
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </Tooltip>
              ))}
            </List>
          </Box>
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            width: 'calc(100% - 280px)',
            height: '600px',
            overflowY: 'auto',
            bgcolor: '#fff',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {/* Always render content, show loading/error as overlay if needed */}
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              width: '100%',
            }}
          >
            {renderSettingContent()}

            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor:
                    'rgba(255,255,255,0.8)',
                  zIndex: 10,
                }}
              >
                <Typography>
                  Loading customization...
                </Typography>
              </Box>
            )}

            {error && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor:
                    'rgba(255,255,255,0.8)',
                  zIndex: 10,
                }}
              >
                <Typography color="error">
                  {error.message}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderTop: '1px solid #e0e0e0',
          bgcolor: '#f9f9f9',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: 4,
            px: 3,
            py: 1,
            color: '#666',
            borderColor: '#ccc',
            '&:hover': {
              borderColor: '#999',
              bgcolor: 'rgba(0,0,0,0.03)',
            },
          }}
        >
          Cancel
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Export all settings to a JSON file">
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  if (data) {
                    const settingsData = {
                      sidebarColor,
                      navbarColor,
                      logoUrl:
                        logoPreview ||
                        DEFAULT_LOGO_URL,
                      taxSettings,
                      regionalSettings,
                    };

                    const blob = new Blob(
                      [
                        JSON.stringify(
                          settingsData,
                          null,
                          2
                        ),
                      ],
                      { type: 'application/json' }
                    );
                    const url =
                      URL.createObjectURL(blob);
                    const a =
                      document.createElement('a');
                    a.href = url;
                    a.download =
                      'pisval-settings.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }
                }}
                sx={{
                  textTransform: 'none',
                  borderRadius: 4,
                  px: 2,
                }}
              >
                Export
              </Button>
            </Tooltip>

            <Tooltip title="Import settings from a JSON file">
              <Button
                variant="outlined"
                color="inherit"
                component="label"
                sx={{
                  textTransform: 'none',
                  borderRadius: 4,
                  px: 2,
                }}
              >
                Import
                <input
                  type="file"
                  accept="application/json"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];
                    if (file) {
                      const reader =
                        new FileReader();
                      reader.onload = (event) => {
                        try {
                          const importedSettings =
                            JSON.parse(
                              event.target
                                ?.result as string
                            );
                          if (importedSettings) {
                            if (
                              importedSettings.sidebarColor
                            )
                              setSidebarColor(
                                importedSettings.sidebarColor
                              );
                            if (
                              importedSettings.navbarColor
                            )
                              setNavbarColor(
                                importedSettings.navbarColor
                              );
                            if (
                              importedSettings.taxSettings
                            )
                              setTaxSettings(
                                importedSettings.taxSettings
                              );
                            if (
                              importedSettings.regionalSettings
                            )
                              setRegionalSettings(
                                importedSettings.regionalSettings
                              );
                            // We don't import the logo directly as it's a base64 string
                          }
                        } catch (error) {
                          console.error(
                            'Error importing settings:',
                            error
                          );
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </Button>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              ml: 1,
            }}
          >
            <Button
              onClick={handleReset}
              variant="outlined"
              color="warning"
              startIcon={<MdRestore />}
              sx={{
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 4,
                px: 3,
                py: 1,
              }}
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              disabled={
                updateCustomizationMutation.isPending
              }
              sx={{
                textTransform: 'none',
                borderRadius: 4,
                px: 3,
                py: 1,
                fontWeight: 'bold',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  bgcolor: '#0f2d6a',
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
