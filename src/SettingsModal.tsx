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
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useUpdateCustomization } from '@/api/axiosClient';
import Image from 'next/image';
import { MdRestore } from 'react-icons/md';
import {
  SketchPicker,
  ColorResult,
} from 'react-color';
import { FaPaintBrush } from 'react-icons/fa';
import {
  mockFetchCustomization,
  mockUpdateCustomization,
} from '@/api/mockUserCustomization';

export interface UserCustomization {
  id: number;
  userId: string;
  sidebarColor: string;
  logoUrl: string;
  navbarColor: string;
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

const fetchCustomization = async (
  userId: string
): Promise<UserCustomization> => {
  return mockFetchCustomization(userId);
};

const SettingsModal: React.FC<
  SettingsModalProps
> = ({
  open,
  onClose,
  userId,
  onCustomizationUpdated,
}) => {
    const { data, isLoading, error } = useQuery<
      UserCustomization,
      Error
    >({
      queryKey: ['userCustomization', userId],
      queryFn: () => fetchCustomization(userId),
      enabled: open,
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

    useEffect(() => {
      if (data) {
        setSidebarColor(data.sidebarColor);
        setNavbarColor(data.navbarColor);
        setLogoPreview(data.logoUrl);
      } else {
        setSidebarColor(DEFAULT_SIDEBAR_COLOR);
        setNavbarColor(DEFAULT_NAVBAR_COLOR);
        setLogoPreview(DEFAULT_LOGO_URL);
      }
    }, [data, open]);

    // Add effect for file handling
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
      useUpdateCustomization();

    const handleSave = () => {
      mockUpdateCustomization({
        userId,
        sidebarColor,
        navbarColor,
        logoUrl: logoPreview,
      } as UserCustomization).then(
        (updatedData) => {
          onCustomizationUpdated(updatedData);
          onClose();
          window.location.reload();
        }
      );
    };

    const handleReset = () => {
      setSidebarColor(DEFAULT_SIDEBAR_COLOR);
      setNavbarColor(DEFAULT_NAVBAR_COLOR);
      setLogoPreview(DEFAULT_LOGO_URL);
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
                '&:hover::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#173A79', mb: 2 }}>
                Pisval Tech Business Information
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Box>
                  <Image
                    src={logoPreview || DEFAULT_LOGO_URL}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Company Logo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Upload your company logo for receipts, invoices and the POS interface
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
                        backgroundColor: 'rgba(23, 58, 121, 0.04)',
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
              </Box>

              <TextField
                label="Company Name"
                defaultValue="Pisval Tech"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Business Registration Number"
                defaultValue="REG123456789"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="VAT/Tax Number"
                defaultValue="VAT2023456789"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Contact Email"
                defaultValue="info@pisvaltech.com"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Contact Phone"
                defaultValue="+27 123 456 789"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Business Address"
                defaultValue="123 Tech Street, Innovation District, Johannesburg, 2000, South Africa"
                fullWidth
                multiline
                rows={2}
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Website"
                defaultValue="www.pisvaltech.com"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Industry"
                defaultValue="Point of Sale Solutions & Technology"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Currency"
                defaultValue="ZAR (South African Rand)"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Business Slogan"
                defaultValue="Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#173A79', mt: 2, mb: 1 }}>
                Additional Business Details
              </Typography>

              <TextField
                label="Business Type"
                defaultValue="Corporation"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Year Established"
                defaultValue="2018"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Number of Employees"
                defaultValue="25-50"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Operating Hours"
                defaultValue="Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 2:00 PM"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Social Media"
                defaultValue="Twitter: @PisvalTech, Facebook: PisvalTechSA, LinkedIn: pisval-tech"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#173A79', mt: 2, mb: 1 }}>
                Banking Information
              </Typography>

              <TextField
                label="Bank Name"
                defaultValue="First National Bank"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Account Number"
                defaultValue="XXXX-XXXX-XXXX-4567"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Branch Code"
                defaultValue="250655"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#173A79', mt: 2, mb: 1 }}>
                Legal Information
              </Typography>

              <TextField
                label="Legal Representative"
                defaultValue="John Smith"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Legal Representative Position"
                defaultValue="Chief Executive Officer"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Legal Representative Contact"
                defaultValue="john.smith@pisvaltech.com"
                fullWidth
                margin="normal"
                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
              />

              <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#173A79' }}>
                  Pisval Tech Business Information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  This business information will appear on invoices, receipts, and other documents generated by the POS system.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Your company details are also used for tax reporting, customer communications, and legal compliance.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#173A79' }}>
                  Pisval Tech - Empower Your Business with Fast, Secure, and Seamless Point of Sale Solutions
                </Typography>
              </Box>
            </Box>
          );
        case 'Tax & VAT Configuration':
          return (
            <Typography>
              Tax & VAT Configuration settings will
              be available soon.
            </Typography>
          );
        case 'Currency & Regional Settings':
          return (
            <Typography>
              Currency & Regional Settings will be
              available soon.
            </Typography>
          );
        case 'User & Role Management':
          return (
            <Typography>
              User & Role Management settings will
              be available soon.
            </Typography>
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
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 8,
            padding: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Settings
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
                  onClick={() =>
                    setSelectedSetting(item.label)
                  }
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
          }}
        >
          <Button
            onClick={onClose}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReset}
            sx={{
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <MdRestore /> Reset to Default
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
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default SettingsModal;
