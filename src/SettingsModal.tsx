'use client';

import React, { useState } from 'react';
import UserManagementContainer from '@/components/userManagement/UserManagementContainer';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { UserManagementProvider } from '@/contexts/UserManagementContext';
import { KeycloakRolesProvider } from '@/contexts/KeycloakRolesContext';
import {
  Settings as SettingsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  Api as ApiIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<
  SettingsModalProps
> = ({ open, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } =
    useSettings();
  const [selectedSetting, setSelectedSetting] =
    useState('General Settings');
  const [generalSettings, setGeneralSettings] =
    useState({
      companyName: settings.companyName,
      dateFormat: settings.dateFormat,
      timeFormat: settings.timeFormat,
      defaultLanguage: settings.defaultLanguage,
    });
  const [regionalSettings, setRegionalSettings] =
    useState({
      defaultCurrency: settings.defaultCurrency,
      defaultCountry: settings.defaultCountry,
      defaultTimezone: settings.defaultTimezone,
    });

  const handleGeneralSettingsChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    if (name) {
      setGeneralSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
      updateSettings({ [name]: value });
    }
  };

  const handleRegionalSettingsChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    if (name) {
      setRegionalSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
      updateSettings({ [name]: value });
    }
  };

  const settingsOptions = [
    {
      name: 'General Settings',
      icon: <SettingsIcon />,
    },
    {
      name: 'Theme & Appearance',
      icon: <PaletteIcon />,
    },
    {
      name: 'Regional Settings',
      icon: <LanguageIcon />,
    },
    {
      name: 'User & Role Management',
      icon: <PersonIcon />,
    },
    {
      name: 'Email & Notification Settings',
      icon: <NotificationsIcon />,
    },
    {
      name: 'System Backup & Restore',
      icon: <BackupIcon />,
    },
    {
      name: 'API & Third-Party Integrations',
      icon: <ApiIcon />,
    },
    {
      name: 'Security Settings',
      icon: <SecurityIcon />,
    },
  ];

  const renderSettingContent = () => {
    switch (selectedSetting) {
      case 'General Settings':
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
              General Settings
            </Typography>

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
                Company Information
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={
                    generalSettings.companyName
                  }
                  onChange={
                    handleGeneralSettingsChange
                  }
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>

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
                Date & Time Format
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <FormControl
                  fullWidth
                  size="small"
                >
                  <InputLabel id="date-format-label">
                    Date Format
                  </InputLabel>
                  <Select
                    labelId="date-format-label"
                    name="dateFormat"
                    value={
                      generalSettings.dateFormat
                    }
                    onChange={
                      handleGeneralSettingsChange
                    }
                    label="Date Format"
                  >
                    <MenuItem value="MM/DD/YYYY">
                      MM/DD/YYYY
                    </MenuItem>
                    <MenuItem value="DD/MM/YYYY">
                      DD/MM/YYYY
                    </MenuItem>
                    <MenuItem value="YYYY-MM-DD">
                      YYYY-MM-DD
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  size="small"
                >
                  <InputLabel id="time-format-label">
                    Time Format
                  </InputLabel>
                  <Select
                    labelId="time-format-label"
                    name="timeFormat"
                    value={
                      generalSettings.timeFormat
                    }
                    onChange={
                      handleGeneralSettingsChange
                    }
                    label="Time Format"
                  >
                    <MenuItem value="12h">
                      12-hour (AM/PM)
                    </MenuItem>
                    <MenuItem value="24h">
                      24-hour
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

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
                Language Settings
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <FormControl
                  fullWidth
                  size="small"
                >
                  <InputLabel id="language-label">
                    Default Language
                  </InputLabel>
                  <Select
                    labelId="language-label"
                    name="defaultLanguage"
                    value={
                      generalSettings.defaultLanguage
                    }
                    onChange={
                      handleGeneralSettingsChange
                    }
                    label="Default Language"
                  >
                    <MenuItem value="en">
                      English
                    </MenuItem>
                    <MenuItem value="es">
                      Spanish
                    </MenuItem>
                    <MenuItem value="fr">
                      French
                    </MenuItem>
                    <MenuItem value="de">
                      German
                    </MenuItem>
                    <MenuItem value="pt">
                      Portuguese
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        );
      case 'Theme & Appearance':
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
              Theme & Appearance
            </Typography>

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
                Theme Mode
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {theme === 'light' ? (
                    <LightModeIcon color="primary" />
                  ) : (
                    <DarkModeIcon color="primary" />
                  )}
                  <Typography>
                    {theme === 'light'
                      ? 'Light Mode'
                      : 'Dark Mode'}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={theme === 'dark'}
                      onChange={toggleTheme}
                      color="primary"
                    />
                  }
                  label=""
                />
              </Box>
            </Box>
          </Box>
        );
      case 'Regional Settings':
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
              Regional Settings
            </Typography>

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
                Currency & Country
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <FormControl
                  fullWidth
                  size="small"
                >
                  <InputLabel id="currency-label">
                    Default Currency
                  </InputLabel>
                  <Select
                    labelId="currency-label"
                    name="defaultCurrency"
                    value={
                      regionalSettings.defaultCurrency
                    }
                    onChange={
                      handleRegionalSettingsChange
                    }
                    label="Default Currency"
                  >
                    <MenuItem value="USD">
                      US Dollar (USD)
                    </MenuItem>
                    <MenuItem value="EUR">
                      Euro (EUR)
                    </MenuItem>
                    <MenuItem value="GBP">
                      British Pound (GBP)
                    </MenuItem>
                    <MenuItem value="JPY">
                      Japanese Yen (JPY)
                    </MenuItem>
                    <MenuItem value="CAD">
                      Canadian Dollar (CAD)
                    </MenuItem>
                    <MenuItem value="AUD">
                      Australian Dollar (AUD)
                    </MenuItem>
                    <MenuItem value="BRL">
                      Brazilian Real (BRL)
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  size="small"
                >
                  <InputLabel id="country-label">
                    Default Country
                  </InputLabel>
                  <Select
                    labelId="country-label"
                    name="defaultCountry"
                    value={
                      regionalSettings.defaultCountry
                    }
                    onChange={
                      handleRegionalSettingsChange
                    }
                    label="Default Country"
                  >
                    <MenuItem value="US">
                      United States
                    </MenuItem>
                    <MenuItem value="GB">
                      United Kingdom
                    </MenuItem>
                    <MenuItem value="CA">
                      Canada
                    </MenuItem>
                    <MenuItem value="AU">
                      Australia
                    </MenuItem>
                    <MenuItem value="DE">
                      Germany
                    </MenuItem>
                    <MenuItem value="FR">
                      France
                    </MenuItem>
                    <MenuItem value="BR">
                      Brazil
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

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
                Time Zone
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <FormControl
                  fullWidth
                  size="small"
                >
                  <InputLabel id="timezone-label">
                    Default Time Zone
                  </InputLabel>
                  <Select
                    labelId="timezone-label"
                    name="defaultTimezone"
                    value={
                      regionalSettings.defaultTimezone
                    }
                    onChange={
                      handleRegionalSettingsChange
                    }
                    label="Default Time Zone"
                  >
                    <MenuItem value="UTC-8">
                      Pacific Time (UTC-8)
                    </MenuItem>
                    <MenuItem value="UTC-7">
                      Mountain Time (UTC-7)
                    </MenuItem>
                    <MenuItem value="UTC-6">
                      Central Time (UTC-6)
                    </MenuItem>
                    <MenuItem value="UTC-5">
                      Eastern Time (UTC-5)
                    </MenuItem>
                    <MenuItem value="UTC+0">
                      Greenwich Mean Time (UTC+0)
                    </MenuItem>
                    <MenuItem value="UTC+1">
                      Central European Time
                      (UTC+1)
                    </MenuItem>
                    <MenuItem value="UTC+8">
                      China Standard Time (UTC+8)
                    </MenuItem>
                    <MenuItem value="UTC+9">
                      Japan Standard Time (UTC+9)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
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
              overflow: 'hidden',
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
            <KeycloakRolesProvider>
              <UserManagementProvider>
                <UserManagementContainer />
              </UserManagementProvider>
            </KeycloakRolesProvider>
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
          maxWidth: '1000px',
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
        Settings
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) =>
              theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '220px',
            borderRight: '1px solid #e0e0e0',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <List sx={{ padding: 0 }}>
            {settingsOptions.map((option) => (
              <ListItem
                key={option.name}
                disablePadding
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  selected={
                    selectedSetting ===
                    option.name
                  }
                  onClick={() =>
                    setSelectedSetting(
                      option.name
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor:
                        '#173A7920',
                      color: '#173A79',
                      '&:hover': {
                        backgroundColor:
                          '#173A7930',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color:
                        selectedSetting ===
                        option.name
                          ? '#173A79'
                          : 'inherit',
                    }}
                  >
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.name}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight:
                        selectedSetting ===
                        option.name
                          ? 'bold'
                          : 'normal',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            padding: 3,
            overflow: 'auto',
          }}
        >
          {renderSettingContent()}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
