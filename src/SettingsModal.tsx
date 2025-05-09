import React, {
  useEffect,
  useState,
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
  Avatar,
} from '@mui/material';
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
import {
  fetchAvailableCurrencies,
  Currency,
} from '@/api/currencyApi';

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
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onCustomizationUpdated: (
    updated: UserCustomization
  ) => void;
}

const settingsItems: SettingsItem[] = [
  { label: 'General Settings' },
  { label: 'Business Information' },
  { label: 'Tax & VAT Configuration' },
  { label: 'Currency & Regional Settings' },
  { label: 'User & Role Management' },
  { label: 'Email & Notification Settings' },
  { label: 'System Backup & Restore' },
  { label: 'API & Third-Party Integrations' },
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
    // Try to fetch from real API first
    console.log(
      `Fetching user customization for user ID: ${userId}`
    );
    const response = await fetch(
      `/api/UserCustomization/${userId}`
    );

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
}) => {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery<
      UserCustomization,
      Error
    >({
      queryKey: ['userCustomization', userId],
      queryFn: () => fetchCustomization(userId),
      enabled: open,
      staleTime: 60000, // Cache data for 1 minute
      cacheTime: 300000, // Keep unused data in cache for 5 minutes
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
      useState('General Settings');
    const [selectedFile, setSelectedFile] =
      useState<File | null>(null);
    const [taxSettings, setTaxSettings] =
      useState<TaxSettings>(DEFAULT_TAX_SETTINGS);
    const [regionalSettings, setRegionalSettings] =
      useState<RegionalSettings>(
        DEFAULT_REGIONAL_SETTINGS
      );
    const [newTaxCategory, setNewTaxCategory] =
      useState<
        Omit<TaxCategory, 'id' | 'isDefault'>
      >({
        name: '',
        rate: 0,
        description: '',
      });

    const [
      availableCurrencies,
      setAvailableCurrencies,
    ] = useState<Currency[]>([]);

    // Add effect to log tax settings changes
    useEffect(() => {
      console.log(
        'Tax settings updated:',
        taxSettings
      );
    }, [taxSettings]);

    // Add effect to log regional settings changes
    useEffect(() => {
      console.log(
        'Regional settings updated:',
        regionalSettings
      );
    }, [regionalSettings]);

    // Fetch available currencies when component mounts
    useEffect(() => {
      const getCurrencies = async () => {
        try {
          const currencies =
            await fetchAvailableCurrencies();
          console.log(
            'Fetched currencies:',
            currencies
          );
          setAvailableCurrencies(currencies);
        } catch (error) {
          console.error(
            'Error fetching currencies:',
            error
          );
          // Set fallback currencies directly in the component as a backup
          setAvailableCurrencies([
            {
              code: 'ZAR',
              name: 'South African Rand',
              symbol: 'R',
            },
            {
              code: 'USD',
              name: 'US Dollar',
              symbol: '$',
            },
            {
              code: 'EUR',
              name: 'Euro',
              symbol: '€',
            },
            {
              code: 'GBP',
              name: 'British Pound',
              symbol: '£',
            },
          ]);
        }
      };

      if (open) {
        getCurrencies();
      }
    }, [open]);

    useEffect(() => {
      console.log('Data received from API:', data);
      if (data) {
        setSidebarColor(data.sidebarColor);
        setNavbarColor(data.navbarColor);
        setLogoPreview(data.logoUrl);

        // Initialize tax settings
        if (data.taxSettings) {
          console.log(
            'Tax settings from API:',
            data.taxSettings
          );
          setTaxSettings(data.taxSettings);
        } else {
          console.log('Using default tax settings');
          setTaxSettings(DEFAULT_TAX_SETTINGS);
        }

        // Initialize regional settings
        if (data.regionalSettings) {
          console.log(
            'Regional settings from API:',
            data.regionalSettings
          );
          setRegionalSettings(
            data.regionalSettings
          );
        } else {
          console.log(
            'Using default regional settings'
          );
          setRegionalSettings(
            DEFAULT_REGIONAL_SETTINGS
          );
        }
      } else {
        setSidebarColor(DEFAULT_SIDEBAR_COLOR);
        setNavbarColor(DEFAULT_NAVBAR_COLOR);
        setLogoPreview(DEFAULT_LOGO_URL);
        setTaxSettings(DEFAULT_TAX_SETTINGS);
        setRegionalSettings(
          DEFAULT_REGIONAL_SETTINGS
        );
      }
    }, [data, open]);

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

      // Apply changes immediately to the UI before saving
      // This ensures the UI updates instantly
      console.log(
        'SettingsModal: Applying changes immediately to UI with data:',
        dataToSave
      );
      onCustomizationUpdated(dataToSave);

      // Directly emit event to update all UI components
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

      // Save to localStorage directly as a backup
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

      // Try to save to real API first
      try {
        updateCustomizationMutation.mutate(
          dataToSave,
          {
            onSuccess: (updatedData) => {
              console.log(
                'Updated data returned from API:',
                updatedData
              );

              // Update the customization context again with the returned data
              onCustomizationUpdated(
                updatedData as UserCustomization
              );

              // Invalidate the React Query cache for userCustomization
              queryClient.invalidateQueries({
                queryKey: [
                  'userCustomization',
                  userId,
                ],
              });

              // Also invalidate any other related queries
              queryClient.invalidateQueries({
                queryKey: ['customization'],
              });

              // Close the modal without reloading the page
              onClose();
            },
            onError: (error) => {
              console.error(
                'Error saving to API, falling back to mock:',
                error
              );
              // Fallback to mock if API fails
              mockUpdateCustomization(
                dataToSave
              ).then((updatedData) => {
                console.log(
                  'Updated data returned from mock:',
                  updatedData
                );

                // Update the customization context
                onCustomizationUpdated(updatedData);

                // Invalidate the React Query cache for userCustomization
                queryClient.invalidateQueries({
                  queryKey: [
                    'userCustomization',
                    userId,
                  ],
                });

                // Also invalidate any other related queries
                queryClient.invalidateQueries({
                  queryKey: ['customization'],
                });

                // Close the modal without reloading the page
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
        // Fallback to mock if mutation throws
        mockUpdateCustomization(dataToSave).then(
          (updatedData) => {
            console.log(
              'Updated data returned from mock:',
              updatedData
            );

            // Update the customization context
            onCustomizationUpdated(updatedData);

            // Invalidate the React Query cache for userCustomization
            queryClient.invalidateQueries({
              queryKey: [
                'userCustomization',
                userId,
              ],
            });

            // Also invalidate any other related queries
            queryClient.invalidateQueries({
              queryKey: ['customization'],
            });

            // Close the modal without reloading the page
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

    // Render content based on selected setting
    const renderSettingContent = () => {
      switch (selectedSetting) {
        case 'General Settings':
          return (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {logoPreview && (
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={logoPreview}
                      alt="Logo Preview"
                      width={80}
                      height={80}
                      style={{
                        borderRadius: '50%',
                        border: '2px solid #ccc',
                      }}
                      unoptimized
                    />
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 4,
                    padding: '8px 16px',
                    fontWeight: 'bold',
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    '&:hover': {
                      backgroundColor:
                        'primary.light',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    hidden
                  />
                </Button>
              </Box>
              <TextField
                label="Sidebar Color"
                value={sidebarColor}
                onChange={(e) =>
                  setSidebarColor(e.target.value)
                }
                margin="normal"
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 4,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <FaPaintBrush
                      style={{
                        color: sidebarColor,
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        marginLeft: '8px',
                      }}
                      onClick={() =>
                        setShowSidebarColorPicker(
                          (prev: boolean) => !prev
                        )
                      }
                    />
                  ),
                }}
              />
              {showSidebarColorPicker && (
                <Box
                  sx={{
                    position: 'absolute',
                    zIndex: 2,
                  }}
                >
                  <SketchPicker
                    color={sidebarColor}
                    onChange={(
                      color: ColorResult
                    ) => setSidebarColor(color.hex)}
                  />
                </Box>
              )}
              <TextField
                label="Navbar Color"
                value={navbarColor}
                onChange={(e) =>
                  setNavbarColor(e.target.value)
                }
                margin="normal"
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 4,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <FaPaintBrush
                      style={{
                        color: navbarColor,
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        marginLeft: '8px',
                      }}
                      onClick={() =>
                        setShowNavbarColorPicker(
                          (prev: boolean) => !prev
                        )
                      }
                    />
                  ),
                }}
              />
              {showNavbarColorPicker && (
                <Box
                  sx={{
                    position: 'absolute',
                    zIndex: 2,
                  }}
                >
                  <SketchPicker
                    color={navbarColor}
                    onChange={(
                      color: ColorResult
                    ) => setNavbarColor(color.hex)}
                  />
                </Box>
              )}
            </>
          );
        case 'Business Information':
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxHeight: '70vh',
                overflow: 'auto',
                pr: 2,
                mr: -2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'transparent',
                },
                '&:hover::-webkit-scrollbar-thumb':
                {
                  background:
                    'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#173A79',
                  mb: 2,
                }}
              >
                Pisval Tech Business Information
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  mb: 2,
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                }}
              >
                <Box>
                  <Image
                    src={
                      logoPreview ||
                      DEFAULT_LOGO_URL
                    }
                    alt="Company Logo"
                    width={100}
                    height={100}
                    style={{
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                    }}
                    unoptimized
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold' }}
                  >
                    Company Logo
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Upload your company logo for
                    receipts, invoices and the POS
                    interface
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: '#173A79',
                      color: '#173A79',
                      '&:hover': {
                        borderColor: '#173A79',
                        backgroundColor:
                          'rgba(23, 58, 121, 0.04)',
                      },
                    }}
                  >
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleLogoFileChange
                      }
                      hidden
                    />
                  </Button>
                </Box>
              </Box>

              <TextField
                label="Company Name"
                defaultValue="Pisval Tech"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Business Registration Number"
                defaultValue="REG123456789"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="VAT/Tax Number"
                defaultValue="VAT2023456789"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Contact Email"
                defaultValue="info@pisvaltech.com"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Contact Phone"
                defaultValue="+27 123 456 789"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Business Address"
                defaultValue="123 Tech Street, Innovation District, Johannesburg, 2000, South Africa"
                fullWidth
                multiline
                rows={2}
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Website"
                defaultValue="www.pisvaltech.com"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Industry"
                defaultValue="Point of Sale Solutions & Technology"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Currency"
                defaultValue="ZAR (South African Rand)"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Business Slogan"
                defaultValue="Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  color: '#173A79',
                  mt: 2,
                  mb: 1,
                }}
              >
                Additional Business Details
              </Typography>

              <TextField
                label="Business Type"
                defaultValue="Corporation"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Year Established"
                defaultValue="2018"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Number of Employees"
                defaultValue="25-50"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Operating Hours"
                defaultValue="Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 2:00 PM"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Social Media"
                defaultValue="Twitter: @PisvalTech, Facebook: PisvalTechSA, LinkedIn: pisval-tech"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  color: '#173A79',
                  mt: 2,
                  mb: 1,
                }}
              >
                Banking Information
              </Typography>

              <TextField
                label="Bank Name"
                defaultValue="First National Bank"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Account Number"
                defaultValue="XXXX-XXXX-XXXX-4567"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Branch Code"
                defaultValue="250655"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  color: '#173A79',
                  mt: 2,
                  mb: 1,
                }}
              >
                Legal Information
              </Typography>

              <TextField
                label="Legal Representative"
                defaultValue="John Smith"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Legal Representative Position"
                defaultValue="Chief Executive Officer"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Legal Representative Contact"
                defaultValue="john.smith@pisvaltech.com"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    color: '#173A79',
                  }}
                >
                  Pisval Tech Business Information
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  This business information will
                  appear on invoices, receipts, and
                  other documents generated by the
                  POS system.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Your company details are also used
                  for tax reporting, customer
                  communications, and legal
                  compliance.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'medium',
                    color: '#173A79',
                  }}
                >
                  Pisval Tech - Empower Your
                  Business with Fast, Secure, and
                  Seamless Point of Sale Solutions
                </Typography>
              </Box>
            </Box>
          );
        case 'Tax & VAT Configuration':
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxHeight: '70vh',
                overflow: 'auto',
                pr: 2,
                mr: -2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'transparent',
                },
                '&:hover::-webkit-scrollbar-thumb':
                {
                  background:
                    'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#173A79',
                  mb: 2,
                }}
              >
                Tax & VAT Configuration
              </Typography>

              {/* General Tax Settings */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#173A79',
                    mb: 2,
                  }}
                >
                  General Tax Settings
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography>
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
                    size="small"
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        enableTaxCalculation:
                          !taxSettings.enableTaxCalculation,
                      })
                    }
                    sx={{
                      minWidth: '100px',
                      borderRadius: 2,
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography>
                    VAT/GST Registered
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
                    size="small"
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        vatRegistered:
                          !taxSettings.vatRegistered,
                      })
                    }
                    sx={{
                      minWidth: '100px',
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    {taxSettings.vatRegistered
                      ? 'Yes'
                      : 'No'}
                  </Button>
                </Box>

                <TextField
                  label="VAT/Tax Number"
                  value={taxSettings.vatNumber}
                  onChange={(e) =>
                    setTaxSettings({
                      ...taxSettings,
                      vatNumber: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                  disabled={
                    !taxSettings.vatRegistered
                  }
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: 2,
                    },
                    mb: 2,
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography>
                    Tax Calculation Method
                  </Typography>
                  <Box>
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
                      size="small"
                      onClick={() =>
                        setTaxSettings({
                          ...taxSettings,
                          taxCalculationMethod:
                            'exclusive',
                        })
                      }
                      sx={{
                        borderRadius: '4px 0 0 4px',
                        textTransform: 'none',
                      }}
                    >
                      Exclusive
                    </Button>
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
                      size="small"
                      onClick={() =>
                        setTaxSettings({
                          ...taxSettings,
                          taxCalculationMethod:
                            'inclusive',
                        })
                      }
                      sx={{
                        borderRadius: '0 4px 4px 0',
                        textTransform: 'none',
                      }}
                    >
                      Inclusive
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography>
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
                    size="small"
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        displayTaxOnReceipts:
                          !taxSettings.displayTaxOnReceipts,
                      })
                    }
                    sx={{
                      minWidth: '100px',
                      borderRadius: 2,
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography>
                    Enable Tax Exemptions
                  </Typography>
                  <Button
                    variant={
                      taxSettings.enableTaxExemptions
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      taxSettings.enableTaxExemptions
                        ? 'primary'
                        : 'inherit'
                    }
                    size="small"
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        enableTaxExemptions:
                          !taxSettings.enableTaxExemptions,
                      })
                    }
                    sx={{
                      minWidth: '100px',
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    {taxSettings.enableTaxExemptions
                      ? 'Enabled'
                      : 'Disabled'}
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography>
                    Tax Reporting Period
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
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
                      size="small"
                      onClick={() =>
                        setTaxSettings({
                          ...taxSettings,
                          taxReportingPeriod:
                            'monthly',
                        })
                      }
                      sx={{
                        borderRadius: '4px 0 0 4px',
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
                      size="small"
                      onClick={() =>
                        setTaxSettings({
                          ...taxSettings,
                          taxReportingPeriod:
                            'quarterly',
                        })
                      }
                      sx={{
                        borderRadius: '0',
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
                      size="small"
                      onClick={() =>
                        setTaxSettings({
                          ...taxSettings,
                          taxReportingPeriod:
                            'annually',
                        })
                      }
                      sx={{
                        borderRadius: '0 4px 4px 0',
                        textTransform: 'none',
                      }}
                    >
                      Annually
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Default Tax Rate */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#173A79',
                    mb: 2,
                  }}
                >
                  Default Tax Rate
                </Typography>

                <TextField
                  label="Default Tax Rate (%)"
                  type="number"
                  value={taxSettings.defaultTaxRate}
                  onChange={(e) =>
                    setTaxSettings({
                      ...taxSettings,
                      defaultTaxRate:
                        parseFloat(
                          e.target.value
                        ) || 0,
                    })
                  }
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Typography>%</Typography>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  This is the default tax rate that
                  will be applied to all products
                  unless a specific tax category is
                  selected.
                </Typography>
              </Box>

              {/* Multiple Tax Rates */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#173A79',
                    }}
                  >
                    Multiple Tax Rates
                  </Typography>
                  <Button
                    variant={
                      taxSettings.enableMultipleTaxRates
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      taxSettings.enableMultipleTaxRates
                        ? 'primary'
                        : 'inherit'
                    }
                    size="small"
                    onClick={() =>
                      setTaxSettings({
                        ...taxSettings,
                        enableMultipleTaxRates:
                          !taxSettings.enableMultipleTaxRates,
                      })
                    }
                    sx={{
                      minWidth: '100px',
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    {taxSettings.enableMultipleTaxRates
                      ? 'Enabled'
                      : 'Disabled'}
                  </Button>
                </Box>

                {taxSettings.enableMultipleTaxRates && (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Configure different tax rates
                      for different types of
                      products or services.
                    </Typography>

                    {/* Tax Categories List */}
                    <List
                      sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        mb: 2,
                      }}
                    >
                      {taxSettings.taxCategories.map(
                        (category) => (
                          <Box
                            key={category.id}
                            sx={{
                              p: 2,
                              borderBottom:
                                '1px solid #e0e0e0',
                              '&:last-child': {
                                borderBottom:
                                  'none',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent:
                                  'space-between',
                                alignItems:
                                  'center',
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight:
                                    'bold',
                                }}
                              >
                                {category.name}
                                {category.isDefault && (
                                  <Typography
                                    component="span"
                                    sx={{
                                      ml: 1,
                                      fontSize:
                                        '0.75rem',
                                      color:
                                        'primary.main',
                                      bgcolor:
                                        'primary.light',
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                    }}
                                  >
                                    Default
                                  </Typography>
                                )}
                              </Typography>
                              <Typography>
                                {category.rate}%
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {category.description}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent:
                                  'flex-end',
                                mt: 1,
                                gap: 1,
                              }}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{
                                  textTransform:
                                    'none',
                                  borderRadius: 2,
                                }}
                                onClick={() => {
                                  // Set as default
                                  const updatedCategories =
                                    taxSettings.taxCategories.map(
                                      (cat) => ({
                                        ...cat,
                                        isDefault:
                                          cat.id ===
                                          category.id,
                                      })
                                    );
                                  setTaxSettings({
                                    ...taxSettings,
                                    taxCategories:
                                      updatedCategories,
                                    defaultTaxRate:
                                      category.rate,
                                  });
                                }}
                                disabled={
                                  category.isDefault
                                }
                              >
                                Set as Default
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                sx={{
                                  textTransform:
                                    'none',
                                  borderRadius: 2,
                                }}
                                onClick={() => {
                                  // Remove category
                                  if (
                                    category.isDefault
                                  )
                                    return; // Don't allow removing default
                                  const updatedCategories =
                                    taxSettings.taxCategories.filter(
                                      (cat) =>
                                        cat.id !==
                                        category.id
                                    );
                                  setTaxSettings({
                                    ...taxSettings,
                                    taxCategories:
                                      updatedCategories,
                                  });
                                }}
                                disabled={
                                  category.isDefault
                                }
                              >
                                Remove
                              </Button>
                            </Box>
                          </Box>
                        )
                      )}
                    </List>

                    {/* Add New Tax Category */}
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'bold',
                          mb: 2,
                        }}
                      >
                        Add New Tax Category
                      </Typography>
                      <TextField
                        label="Category Name"
                        value={newTaxCategory.name}
                        onChange={(e) =>
                          setNewTaxCategory({
                            ...newTaxCategory,
                            name: e.target.value,
                          })
                        }
                        fullWidth
                        margin="normal"
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        label="Tax Rate (%)"
                        type="number"
                        value={newTaxCategory.rate}
                        onChange={(e) =>
                          setNewTaxCategory({
                            ...newTaxCategory,
                            rate:
                              parseFloat(
                                e.target.value
                              ) || 0,
                          })
                        }
                        fullWidth
                        margin="normal"
                        InputProps={{
                          endAdornment: (
                            <Typography>
                              %
                            </Typography>
                          ),
                        }}
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        label="Description"
                        value={
                          newTaxCategory.description
                        }
                        onChange={(e) =>
                          setNewTaxCategory({
                            ...newTaxCategory,
                            description:
                              e.target.value,
                          })
                        }
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent:
                            'flex-end',
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                          }}
                          onClick={() => {
                            // Add new category
                            if (
                              !newTaxCategory.name
                            )
                              return;

                            const newId =
                              Math.max(
                                0,
                                ...taxSettings.taxCategories.map(
                                  (c) => c.id
                                )
                              ) + 1;
                            const newCategory: TaxCategory =
                            {
                              id: newId,
                              name: newTaxCategory.name,
                              rate: newTaxCategory.rate,
                              description:
                                newTaxCategory.description,
                              isDefault: false,
                            };

                            setTaxSettings({
                              ...taxSettings,
                              taxCategories: [
                                ...taxSettings.taxCategories,
                                newCategory,
                              ],
                            });

                            // Reset form
                            setNewTaxCategory({
                              name: '',
                              rate: 0,
                              description: '',
                            });
                          }}
                          disabled={
                            !newTaxCategory.name
                          }
                        >
                          Add Category
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>

              {/* Tax Exemptions */}
              {taxSettings.enableTaxExemptions && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      color: '#173A79',
                      mb: 2,
                    }}
                  >
                    Tax Exemptions
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Configure tax exemptions for
                    specific customers or
                    transactions. Tax-exempt
                    customers will not be charged
                    tax on their purchases.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: 'italic',
                      mb: 1,
                    }}
                  >
                    Tax exemption settings can be
                    configured for individual
                    customers in the Customer
                    Management section.
                  </Typography>
                </Box>
              )}

              {/* Tax Information */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    color: '#173A79',
                  }}
                >
                  Tax Configuration Information
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  These tax settings will be applied
                  to all transactions in your POS
                  system. Make sure your tax
                  settings comply with local tax
                  regulations.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {taxSettings.taxCalculationMethod ===
                    'exclusive'
                    ? 'Tax Exclusive: Tax will be added on top of the product price.'
                    : 'Tax Inclusive: Product prices already include tax.'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'medium',
                    color: '#173A79',
                  }}
                >
                  Default Tax Rate:{' '}
                  {taxSettings.defaultTaxRate}%
                </Typography>
              </Box>
            </Box>
          );
        case 'Currency & Regional Settings':
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxHeight: '70vh',
                overflow: 'auto',
                pr: 2,
                mr: -2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'transparent',
                },
                '&:hover::-webkit-scrollbar-thumb':
                {
                  background:
                    'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#173A79',
                  mb: 2,
                }}
              >
                Currency & Regional Settings
              </Typography>

              {/* Currency Settings */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#173A79',
                    mb: 2,
                  }}
                >
                  Currency Settings
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 'medium',
                    }}
                  >
                    Default Currency
                  </Typography>
                  <TextField
                    select
                    fullWidth
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
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    {availableCurrencies.length >
                      0 ? (
                      availableCurrencies.map(
                        (currency) => (
                          <MenuItem
                            key={currency.code}
                            value={currency.code}
                          >
                            {currency.name} (
                            {currency.code}){' '}
                            {currency.symbol}
                          </MenuItem>
                        )
                      )
                    ) : (
                      <>
                        <MenuItem value="ZAR">
                          South African Rand (ZAR)
                        </MenuItem>
                        <MenuItem value="USD">
                          US Dollar (USD)
                        </MenuItem>
                        <MenuItem value="EUR">
                          Euro (EUR)
                        </MenuItem>
                        <MenuItem value="GBP">
                          British Pound (GBP)
                        </MenuItem>
                      </>
                    )}
                  </TextField>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography>
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
                    size="small"
                    onClick={() =>
                      setRegionalSettings({
                        ...regionalSettings,
                        enableMultiCurrency:
                          !regionalSettings.enableMultiCurrency,
                      })
                    }
                    sx={{
                      minWidth: '100px',
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    {regionalSettings.enableMultiCurrency
                      ? 'Enabled'
                      : 'Disabled'}
                  </Button>
                </Box>

                {regionalSettings.enableMultiCurrency && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontWeight: 'medium',
                      }}
                    >
                      Supported Currencies
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {availableCurrencies.length >
                        0
                        ? availableCurrencies.map(
                          (currency) => (
                            <Button
                              key={currency.code}
                              variant={
                                regionalSettings.supportedCurrencies.includes(
                                  currency.code
                                )
                                  ? 'contained'
                                  : 'outlined'
                              }
                              color={
                                regionalSettings.supportedCurrencies.includes(
                                  currency.code
                                )
                                  ? 'primary'
                                  : 'inherit'
                              }
                              size="small"
                              onClick={() => {
                                const updatedCurrencies =
                                  regionalSettings.supportedCurrencies.includes(
                                    currency.code
                                  )
                                    ? regionalSettings.supportedCurrencies.filter(
                                      (c) =>
                                        c !==
                                        currency.code
                                    )
                                    : [
                                      ...regionalSettings.supportedCurrencies,
                                      currency.code,
                                    ];

                                setRegionalSettings(
                                  {
                                    ...regionalSettings,
                                    supportedCurrencies:
                                      updatedCurrencies,
                                  }
                                );
                              }}
                              sx={{
                                borderRadius: 2,
                                textTransform:
                                  'none',
                                minWidth: '80px',
                              }}
                            >
                              {currency.code}{' '}
                              {currency.symbol}
                            </Button>
                          )
                        )
                        : [
                          'ZAR',
                          'USD',
                          'EUR',
                          'GBP',
                          'AUD',
                          'CAD',
                          'JPY',
                          'CNY',
                        ].map((currency) => (
                          <Button
                            key={currency}
                            variant={
                              regionalSettings.supportedCurrencies.includes(
                                currency
                              )
                                ? 'contained'
                                : 'outlined'
                            }
                            color={
                              regionalSettings.supportedCurrencies.includes(
                                currency
                              )
                                ? 'primary'
                                : 'inherit'
                            }
                            size="small"
                            onClick={() => {
                              const updatedCurrencies =
                                regionalSettings.supportedCurrencies.includes(
                                  currency
                                )
                                  ? regionalSettings.supportedCurrencies.filter(
                                    (c) =>
                                      c !==
                                      currency
                                  )
                                  : [
                                    ...regionalSettings.supportedCurrencies,
                                    currency,
                                  ];

                              setRegionalSettings(
                                {
                                  ...regionalSettings,
                                  supportedCurrencies:
                                    updatedCurrencies,
                                }
                              );
                            }}
                            sx={{
                              borderRadius: 2,
                              textTransform:
                                'none',
                            }}
                          >
                            {currency}
                          </Button>
                        ))}
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Select the currencies you want
                      to support in your POS system.
                      The default currency will
                      always be supported.
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 'medium',
                    }}
                  >
                    Number Format
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={
                      regionalSettings.numberFormat
                    }
                    onChange={(e) =>
                      setRegionalSettings({
                        ...regionalSettings,
                        numberFormat:
                          e.target.value,
                      })
                    }
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="#,###.##">
                      1,234.56 (Comma as thousand
                      separator)
                    </MenuItem>
                    <MenuItem value="#.###,##">
                      1.234,56 (Period as thousand
                      separator)
                    </MenuItem>
                    <MenuItem value="# ###.##">
                      1 234.56 (Space as thousand
                      separator)
                    </MenuItem>
                  </TextField>
                </Box>
              </Box>

              {/* Date and Time Settings */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#173A79',
                    mb: 2,
                  }}
                >
                  Date and Time Settings
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 'medium',
                    }}
                  >
                    Date Format
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={
                      regionalSettings.dateFormat
                    }
                    onChange={(e) =>
                      setRegionalSettings({
                        ...regionalSettings,
                        dateFormat: e.target.value,
                      })
                    }
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="DD/MM/YYYY">
                      DD/MM/YYYY (31/12/2023)
                    </MenuItem>
                    <MenuItem value="MM/DD/YYYY">
                      MM/DD/YYYY (12/31/2023)
                    </MenuItem>
                    <MenuItem value="YYYY-MM-DD">
                      YYYY-MM-DD (2023-12-31)
                    </MenuItem>
                    <MenuItem value="DD-MMM-YYYY">
                      DD-MMM-YYYY (31-Dec-2023)
                    </MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 'medium',
                    }}
                  >
                    Time Format
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                    }}
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
                        textTransform: 'none',
                        borderRadius: 2,
                      }}
                    >
                      12-hour (2:30 PM)
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
                        textTransform: 'none',
                        borderRadius: 2,
                      }}
                    >
                      24-hour (14:30)
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 'medium',
                    }}
                  >
                    Timezone
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={
                      regionalSettings.timezone
                    }
                    onChange={(e) =>
                      setRegionalSettings({
                        ...regionalSettings,
                        timezone: e.target.value,
                      })
                    }
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="Africa/Johannesburg">
                      Africa/Johannesburg (SAST)
                    </MenuItem>
                    <MenuItem value="Europe/London">
                      Europe/London (GMT/BST)
                    </MenuItem>
                    <MenuItem value="America/New_York">
                      America/New_York (EST/EDT)
                    </MenuItem>
                    <MenuItem value="Asia/Dubai">
                      Asia/Dubai (GST)
                    </MenuItem>
                    <MenuItem value="Australia/Sydney">
                      Australia/Sydney (AEST/AEDT)
                    </MenuItem>
                  </TextField>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography>
                    Auto-detect Location
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
                    size="small"
                    onClick={() =>
                      setRegionalSettings({
                        ...regionalSettings,
                        autoDetectLocation:
                          !regionalSettings.autoDetectLocation,
                      })
                    }
                    sx={{
                      minWidth: '100px',
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    {regionalSettings.autoDetectLocation
                      ? 'Enabled'
                      : 'Disabled'}
                  </Button>
                </Box>
              </Box>

              {/* Language Settings */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#173A79',
                    mb: 2,
                  }}
                >
                  Language Settings
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      fontWeight: 'medium',
                    }}
                  >
                    Interface Language
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={
                      regionalSettings.language
                    }
                    onChange={(e) =>
                      setRegionalSettings({
                        ...regionalSettings,
                        language: e.target.value,
                      })
                    }
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="en-ZA">
                      English (South Africa)
                    </MenuItem>
                    <MenuItem value="en-US">
                      English (United States)
                    </MenuItem>
                    <MenuItem value="en-GB">
                      English (United Kingdom)
                    </MenuItem>
                    <MenuItem value="fr-FR">
                      French (France)
                    </MenuItem>
                    <MenuItem value="es-ES">
                      Spanish (Spain)
                    </MenuItem>
                    <MenuItem value="pt-PT">
                      Portuguese (Portugal)
                    </MenuItem>
                    <MenuItem value="de-DE">
                      German (Germany)
                    </MenuItem>
                  </TextField>
                </Box>
              </Box>

              {/* Regional Settings Information */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    color: '#173A79',
                  }}
                >
                  Regional Settings Information
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  These settings control how dates,
                  times, numbers, and currencies are
                  displayed throughout your POS
                  system.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Changes to these settings will be
                  applied immediately across all
                  parts of the application.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'medium',
                    color: '#173A79',
                  }}
                >
                  Default Currency:{' '}
                  {regionalSettings.defaultCurrency}
                </Typography>
              </Box>
            </Box>
          );
        case 'User & Role Management':
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxHeight: '70vh',
                overflow: 'auto',
                pr: 2,
                mr: -2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'transparent',
                },
                '&:hover::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#173A79',
                  mb: 2,
                }}
              >
                User & Role Management
              </Typography>

              {/* User Management Section */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#173A79',
                    mb: 2,
                  }}
                >
                  User Management
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Active Users
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {/* User List */}
                    {[
                      {
                        id: 1,
                        name: 'John Smith',
                        email: 'john.smith@pisvaltech.com',
                        role: 'Administrator',
                        status: 'Active',
                        lastLogin: '2023-10-15 14:30',
                      },
                      {
                        id: 2,
                        name: 'Sarah Johnson',
                        email: 'sarah.j@pisvaltech.com',
                        role: 'Manager',
                        status: 'Active',
                        lastLogin: '2023-10-14 09:15',
                      },
                      {
                        id: 3,
                        name: 'Michael Brown',
                        email: 'michael.b@pisvaltech.com',
                        role: 'Cashier',
                        status: 'Active',
                        lastLogin: '2023-10-15 08:45',
                      },
                      {
                        id: 4,
                        name: 'Emily Davis',
                        email: 'emily.d@pisvaltech.com',
                        role: 'Inventory Manager',
                        status: 'Inactive',
                        lastLogin: '2023-10-10 16:20',
                      },
                    ].map((user, index) => (
                      <Box
                        key={user.id}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: index < 3 ? '1px solid #e0e0e0' : 'none',
                          bgcolor: user.status === 'Inactive' ? 'rgba(0,0,0,0.03)' : 'white',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: user.status === 'Active' ? '#4caf50' : '#9e9e9e',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor:
                                user.role === 'Administrator'
                                  ? 'rgba(25, 118, 210, 0.1)'
                                  : user.role === 'Manager'
                                    ? 'rgba(156, 39, 176, 0.1)'
                                    : user.role === 'Inventory Manager'
                                      ? 'rgba(245, 124, 0, 0.1)'
                                      : 'rgba(76, 175, 80, 0.1)',
                              color:
                                user.role === 'Administrator'
                                  ? '#1976d2'
                                  : user.role === 'Manager'
                                    ? '#9c27b0'
                                    : user.role === 'Inventory Manager'
                                      ? '#f57c00'
                                      : '#4caf50',
                              fontWeight: 'medium',
                              fontSize: '0.75rem',
                            }}
                          >
                            {user.role}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                            Last login: {user.lastLogin}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              minWidth: 100,
                            }}
                          >
                            Edit User
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                    >
                      Add New User
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Role Management Section */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#173A79',
                    mb: 2,
                  }}
                >
                  Role Management
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    System Roles
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Role List */}
                    {[
                      {
                        id: 1,
                        name: 'Administrator',
                        description: 'Full system access with all permissions',
                        userCount: 1,
                        color: '#1976d2',
                      },
                      {
                        id: 2,
                        name: 'Manager',
                        description: 'Access to most features except system configuration',
                        userCount: 2,
                        color: '#9c27b0',
                      },
                      {
                        id: 3,
                        name: 'Cashier',
                        description: 'Limited access to sales and basic customer management',
                        userCount: 5,
                        color: '#4caf50',
                      },
                      {
                        id: 4,
                        name: 'Inventory Manager',
                        description: 'Access to inventory and product management',
                        userCount: 2,
                        color: '#f57c00',
                      },
                    ].map((role, index) => (
                      <Box
                        key={role.id}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: index < 3 ? '1px solid #e0e0e0' : 'none',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: `${role.color}20`,
                              color: role.color,
                              fontWeight: 'bold',
                            }}
                          >
                            {role.name.charAt(0)}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {role.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {role.description}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                            }}
                          >
                            Edit Permissions
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                    >
                      Create New Role
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Permission Management Section */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#173A79',
                    mb: 2,
                  }}
                >
                  Permission Management
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Module Access Control
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Module List */}
                    {[
                      { id: 1, name: 'Dashboard', description: 'View system dashboard and analytics' },
                      { id: 2, name: 'Sales', description: 'Process sales and manage transactions' },
                      { id: 3, name: 'Inventory', description: 'Manage products and stock levels' },
                      { id: 4, name: 'Customers', description: 'Customer management and loyalty programs' },
                      { id: 5, name: 'Reports', description: 'Generate and view system reports' },
                    ].map((module, index) => (
                      <Box
                        key={module.id}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: index < 4 ? '1px solid #e0e0e0' : 'none',
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {module.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {module.description}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                          }}
                        >
                          Configure Access
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Security Settings */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#173A79',
                    mb: 2,
                  }}
                >
                  Security Settings
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Password Policy
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography>Minimum Password Length</Typography>
                      <TextField
                        type="number"
                        size="small"
                        defaultValue={8}
                        InputProps={{ inputProps: { min: 6, max: 20 } }}
                        sx={{ width: 100 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography>Require Special Characters</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          minWidth: 100,
                        }}
                      >
                        Enabled
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography>Password Expiry (days)</Typography>
                      <TextField
                        type="number"
                        size="small"
                        defaultValue={90}
                        InputProps={{ inputProps: { min: 30, max: 365 } }}
                        sx={{ width: 100 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography>Two-Factor Authentication</Typography>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          minWidth: 100,
                        }}
                      >
                        Disabled
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Session Management
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography>Auto Logout After Inactivity (minutes)</Typography>
                      <TextField
                        type="number"
                        size="small"
                        defaultValue={30}
                        InputProps={{ inputProps: { min: 5, max: 120 } }}
                        sx={{ width: 100 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography>Maximum Concurrent Sessions</Typography>
                      <TextField
                        type="number"
                        size="small"
                        defaultValue={1}
                        InputProps={{ inputProps: { min: 1, max: 5 } }}
                        sx={{ width: 100 }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    Save Security Settings
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        case 'Email & Notification Settings':
          return (
            <Typography>
              Email & Notification Settings will be
              available soon.
            </Typography>
          );
        case 'System Backup & Restore':
          return (
            <Typography>
              System Backup & Restore options will
              be available soon.
            </Typography>
          );
        case 'API & Third-Party Integrations':
          return (
            <Typography>
              API & Third-Party Integrations
              settings will be available soon.
            </Typography>
          );
        default:
          return (
            <Typography>
              Select a setting from the sidebar.
            </Typography>
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
            padding: 2,
            width: '80%',
            maxWidth:
              '1000px' /* Custom max width */,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '14px 20px',
            color: '#173A79',
          }}
        >
          Pisval Tech Settings
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ display: 'flex', padding: 0 }}
        >
          {/* Settings Sidebar */}
          <Box
            sx={{
              width: '250px',
              borderRight: '1px solid #e0e0e0',
              overflowY: 'auto',
              bgcolor: '#f5f5f5',
            }}
          >
            <List
              component="nav"
              aria-label="settings categories"
            >
              {settingsItems.map((item) => (
                <ListItemButton
                  key={item.label}
                  onClick={() => {
                    setSelectedSetting(item.label);
                    if (
                      item.label ===
                      'Tax & VAT Configuration'
                    ) {
                      console.log(
                        'Tax & VAT Configuration selected, current settings:',
                        taxSettings
                      );
                    }
                  }}
                  selected={
                    selectedSetting === item.label
                  }
                  sx={{
                    borderLeft:
                      selectedSetting === item.label
                        ? '4px solid #173A79'
                        : '4px solid transparent',
                    bgcolor:
                      selectedSetting === item.label
                        ? 'rgba(23, 58, 121, 0.08)'
                        : 'transparent',
                    '&:hover': {
                      bgcolor:
                        'rgba(23, 58, 121, 0.04)',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Settings Content */}
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width:
                'calc(100% - 250px)' /* Ensure content takes remaining width */,
            }}
          >
            {isLoading && (
              <Typography>
                Loading customization...
              </Typography>
            )}
            {error && (
              <Typography color="error">
                {error.message}
              </Typography>
            )}
            {data && renderSettingContent()}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 0.75,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReset}
            variant="outlined"
            color="warning"
            sx={{
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderRadius: 2,
              px: 2,
              py: 0.75,
            }}
          >
            <MdRestore /> Reset
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
              borderRadius: 2,
              px: 3,
              py: 0.75,
              fontWeight: 'bold',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default SettingsModal;
