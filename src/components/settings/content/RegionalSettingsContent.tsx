import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { RegionalSettings } from '../../../types/settingsTypes';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../../contexts/CurrencyContext';

interface RegionalSettingsContentProps {
  regionalSettings: RegionalSettings;
  setRegionalSettings: (settings: RegionalSettings) => void;
}

const RegionalSettingsContent: React.FC<RegionalSettingsContentProps> = ({
  regionalSettings,
  setRegionalSettings,
}) => {
  const { t: translate } = useTranslation();
  const [newCurrency, setNewCurrency] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {
    setCurrency,
    currency: currentCurrency,
    currencySymbol,
  } = useCurrency();

  const handleAddCurrency = () => {
    if (
      newCurrency &&
      !regionalSettings.supportedCurrencies.includes(newCurrency)
    ) {
      const updatedCurrencies = [
        ...regionalSettings.supportedCurrencies,
        newCurrency,
      ];

      const updatedSettings = {
        ...regionalSettings,
        supportedCurrencies: updatedCurrencies,
      };

      // If this is the first currency being added, also set it as default
      if (updatedCurrencies.length === 1) {
        updatedSettings.defaultCurrency = newCurrency;

        // Also update the system currency
        setCurrency(newCurrency);

        // Show notification
        setSnackbarMessage(
          `Currency ${newCurrency} added and set as system currency`
        );
        setSnackbarOpen(true);
      } else {
        // Just show added notification
        setSnackbarMessage(
          `Currency ${newCurrency} added to supported currencies`
        );
        setSnackbarOpen(true);
      }

      // Update state
      setRegionalSettings(updatedSettings);

      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        try {
          const savedCustomization = localStorage.getItem('userCustomization');
          if (savedCustomization) {
            try {
              const customization = JSON.parse(savedCustomization);

              if (!customization.regionalSettings) {
                customization.regionalSettings = {};
              }

              customization.regionalSettings = {
                ...customization.regionalSettings,
                ...updatedSettings,
                supportedCurrencies: updatedCurrencies,
              };

              if (updatedCurrencies.length === 1) {
                customization.regionalSettings.defaultCurrency = newCurrency;
              }

              localStorage.setItem(
                'userCustomization',
                JSON.stringify(customization)
              );
              console.log(
                'Saved updated currency settings to localStorage:',
                updatedCurrencies
              );

              localStorage.setItem(
                'preferredCurrency',
                customization.regionalSettings.defaultCurrency
              );
            } catch (parseError) {
              console.error('Error parsing userCustomization:', parseError);

              const newCustomization = {
                regionalSettings: updatedSettings,
              };
              localStorage.setItem(
                'userCustomization',
                JSON.stringify(newCustomization)
              );
              localStorage.setItem(
                'preferredCurrency',
                updatedSettings.defaultCurrency
              );
            }
          } else {
            const newCustomization = {
              regionalSettings: updatedSettings,
            };
            localStorage.setItem(
              'userCustomization',
              JSON.stringify(newCustomization)
            );
            localStorage.setItem(
              'preferredCurrency',
              updatedSettings.defaultCurrency
            );
            console.log(
              'Created new userCustomization with regional settings in localStorage'
            );
          }

          localStorage.setItem(
            'regionalSettings',
            JSON.stringify(updatedSettings)
          );
        } catch (error) {
          console.error(
            'Error saving currency settings to localStorage:',
            error
          );
        }
      }

      setNewCurrency('');
    }
  };

  const handleRemoveCurrency = (currency: string) => {
    // Don't allow removing the current system currency
    if (currency === currentCurrency) {
      setSnackbarMessage(
        `Cannot remove ${currency} as it's currently in use by the system`
      );
      setSnackbarOpen(true);
      return;
    }

    const updatedCurrencies = regionalSettings.supportedCurrencies.filter(
      (c) => c !== currency
    );

    const newDefaultCurrency =
      regionalSettings.defaultCurrency === currency
        ? updatedCurrencies[0] || 'USD'
        : regionalSettings.defaultCurrency;

    const updatedSettings = {
      ...regionalSettings,
      supportedCurrencies: updatedCurrencies,
      defaultCurrency: newDefaultCurrency,
    };

    setRegionalSettings(updatedSettings);

    if (regionalSettings.defaultCurrency === currency) {
      setCurrency(newDefaultCurrency);
    }

    if (typeof window !== 'undefined') {
      try {
        const savedCustomization = localStorage.getItem('userCustomization');
        if (savedCustomization) {
          try {
            const customization = JSON.parse(savedCustomization);

            if (!customization.regionalSettings) {
              customization.regionalSettings = {};
            }

            customization.regionalSettings = {
              ...customization.regionalSettings,
              ...updatedSettings,
              supportedCurrencies: updatedCurrencies,
              defaultCurrency: newDefaultCurrency,
            };

            localStorage.setItem(
              'userCustomization',
              JSON.stringify(customization)
            );
            console.log(
              'Saved updated currency settings to localStorage after removal:',
              updatedCurrencies
            );

            localStorage.setItem('preferredCurrency', newDefaultCurrency);
          } catch (parseError) {
            console.error(
              'Error parsing userCustomization during removal:',
              parseError
            );

            const newCustomization = {
              regionalSettings: updatedSettings,
            };
            localStorage.setItem(
              'userCustomization',
              JSON.stringify(newCustomization)
            );
            localStorage.setItem('preferredCurrency', newDefaultCurrency);
          }
        } else {
          const newCustomization = {
            regionalSettings: updatedSettings,
          };
          localStorage.setItem(
            'userCustomization',
            JSON.stringify(newCustomization)
          );
          localStorage.setItem('preferredCurrency', newDefaultCurrency);
          console.log(
            'Created new userCustomization with regional settings in localStorage after removal'
          );
        }

        localStorage.setItem(
          'regionalSettings',
          JSON.stringify(updatedSettings)
        );
      } catch (error) {
        console.error(
          'Error saving currency settings to localStorage after removal:',
          error
        );
      }
    }

    setSnackbarMessage(
      `Currency ${currency} removed from supported currencies`
    );
    setSnackbarOpen(true);
  };

  const handleSelectCurrency = (currency: string) => {
    const updatedSettings = {
      ...regionalSettings,
      defaultCurrency: currency,
    };

    setRegionalSettings(updatedSettings);

    setCurrency(currency);

    if (typeof window !== 'undefined') {
      try {
        const savedCustomization = localStorage.getItem('userCustomization');
        if (savedCustomization) {
          try {
            const customization = JSON.parse(savedCustomization);

            if (!customization.regionalSettings) {
              customization.regionalSettings = {};
            }

            customization.regionalSettings = updatedSettings;
            customization.regionalSettings.defaultCurrency = currency;

            localStorage.setItem(
              'userCustomization',
              JSON.stringify(customization)
            );
            console.log(
              'Saved updated currency settings to localStorage after selection:',
              currency
            );

            localStorage.setItem('preferredCurrency', currency);
          } catch (parseError) {
            console.error(
              'Error parsing userCustomization during selection:',
              parseError
            );

            const newCustomization = {
              regionalSettings: updatedSettings,
            };
            localStorage.setItem(
              'userCustomization',
              JSON.stringify(newCustomization)
            );
            localStorage.setItem('preferredCurrency', currency);
          }
        } else {
          const newCustomization = {
            regionalSettings: updatedSettings,
          };
          localStorage.setItem(
            'userCustomization',
            JSON.stringify(newCustomization)
          );
          localStorage.setItem('preferredCurrency', currency);
          console.log(
            'Created new userCustomization with regional settings in localStorage after selection'
          );
        }

        localStorage.setItem(
          'regionalSettings',
          JSON.stringify(updatedSettings)
        );
      } catch (error) {
        console.error(
          'Error saving currency settings to localStorage after selection:',
          error
        );
      }
    }

    setSnackbarMessage(
      `System currency changed to ${currency} (${currencySymbol}). All prices will now be displayed in ${currency}.`
    );
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {translate('settings.currencyRegional')}
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
          <Typography variant="subtitle1">Default Currency</Typography>
          <TextField
            select
            value={regionalSettings.defaultCurrency}
            onChange={(e) =>
              setRegionalSettings({
                ...regionalSettings,
                defaultCurrency: e.target.value,
              })
            }
            size="small"
            fullWidth
          >
            {regionalSettings.supportedCurrencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="subtitle1">Supported Currencies</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 1,
            }}
          >
            {regionalSettings.supportedCurrencies.map((currency) => (
              <Tooltip
                key={currency}
                title={`Click to set ${currency} as system currency`}
                placement="top"
              >
                <Chip
                  label={currency}
                  onDelete={() => handleRemoveCurrency(currency)}
                  color={
                    currentCurrency === currency
                      ? 'success'
                      : regionalSettings.defaultCurrency === currency
                        ? 'primary'
                        : 'default'
                  }
                  deleteIcon={
                    regionalSettings.defaultCurrency === currency ||
                    regionalSettings.supportedCurrencies.length <=
                      1 ? undefined : (
                      <CloseIcon />
                    )
                  }
                  onClick={() => handleSelectCurrency(currency)}
                  sx={{
                    borderRadius: 1,
                    cursor: 'pointer',
                    fontWeight:
                      currentCurrency === currency ? 'bold' : 'normal',
                    border:
                      currentCurrency === currency
                        ? '1px solid #2e7d32'
                        : 'none',
                    '&:hover': {
                      backgroundColor:
                        currentCurrency === currency
                          ? '#e8f5e9'
                          : regionalSettings.defaultCurrency === currency
                            ? '#e3f2fd'
                            : '#f5f5f5',
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <TextField
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value.toUpperCase())}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCurrency();
                }
              }}
              size="small"
              placeholder="Add currency (e.g. USD, EU)"
              helperText="Enter 2 or 3-letter currency code (e.g. USD, EU)"
              sx={{ flex: 1 }}
              inputProps={{
                maxLength: 3,
                style: { textTransform: 'uppercase' },
              }}
              error={newCurrency.length > 0 && newCurrency.length < 2}
            />
            <Tooltip title="Add currency to system">
              <span>
                <IconButton
                  color="primary"
                  onClick={handleAddCurrency}
                  disabled={!newCurrency.trim() || newCurrency.length < 2}
                >
                  <AddIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="subtitle1">Date Format</Typography>
          <TextField
            select
            value={regionalSettings.dateFormat}
            onChange={(e) =>
              setRegionalSettings({
                ...regionalSettings,
                dateFormat: e.target.value,
              })
            }
            size="small"
            fullWidth
          >
            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
          </TextField>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="subtitle1">Time Format</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={
                regionalSettings.timeFormat === '12h' ? 'contained' : 'outlined'
              }
              color={
                regionalSettings.timeFormat === '12h' ? 'primary' : 'inherit'
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
              12-hour (AM/PM)
            </Button>
            <Button
              variant={
                regionalSettings.timeFormat === '24h' ? 'contained' : 'outlined'
              }
              color={
                regionalSettings.timeFormat === '24h' ? 'primary' : 'inherit'
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
          <Typography variant="subtitle1">Timezone</Typography>
          <TextField
            select
            value={regionalSettings.timezone}
            onChange={(e) =>
              setRegionalSettings({
                ...regionalSettings,
                timezone: e.target.value,
              })
            }
            size="small"
            fullWidth
          >
            <MenuItem value="Africa/Johannesburg">
              Africa/Johannesburg (GMT+2)
            </MenuItem>
            <MenuItem value="Europe/London">Europe/London (GMT+0/+1)</MenuItem>
            <MenuItem value="America/New_York">
              America/New_York (GMT-5/-4)
            </MenuItem>
            <MenuItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</MenuItem>
            <MenuItem value="Australia/Sydney">
              Australia/Sydney (GMT+10/+11)
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
          <Typography variant="subtitle1">Number Format</Typography>
          <TextField
            select
            value={regionalSettings.numberFormat}
            onChange={(e) =>
              setRegionalSettings({
                ...regionalSettings,
                numberFormat: e.target.value,
              })
            }
            size="small"
            fullWidth
          >
            <MenuItem value="#,###.##">
              1,234.56 (comma as thousands separator)
            </MenuItem>
            <MenuItem value="#.###,##">
              1.234,56 (dot as thousands separator)
            </MenuItem>
            <MenuItem value="# ###.##">
              1 234.56 (space as thousands separator)
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
          <Typography variant="subtitle1">Language</Typography>
          <TextField
            select
            value={regionalSettings.language}
            onChange={(e) =>
              setRegionalSettings({
                ...regionalSettings,
                language: e.target.value,
              })
            }
            size="small"
            fullWidth
          >
            <MenuItem value="en-ZA">English (South Africa)</MenuItem>
            <MenuItem value="en-US">English (United States)</MenuItem>
            <MenuItem value="en-GB">English (United Kingdom)</MenuItem>
            <MenuItem value="fr-FR">French (France)</MenuItem>
            <MenuItem value="es-ES">Spanish (Spain)</MenuItem>
          </TextField>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1">Auto-detect Location</Typography>
          <Button
            variant={
              regionalSettings.autoDetectLocation ? 'contained' : 'outlined'
            }
            color={regionalSettings.autoDetectLocation ? 'primary' : 'inherit'}
            onClick={() =>
              setRegionalSettings({
                ...regionalSettings,
                autoDetectLocation: !regionalSettings.autoDetectLocation,
              })
            }
            sx={{
              minWidth: '100px',
              borderRadius: 1,
              textTransform: 'none',
            }}
          >
            {regionalSettings.autoDetectLocation ? 'Enabled' : 'Disabled'}
          </Button>
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
              regionalSettings.enableMultiCurrency ? 'contained' : 'outlined'
            }
            color={regionalSettings.enableMultiCurrency ? 'primary' : 'inherit'}
            onClick={() =>
              setRegionalSettings({
                ...regionalSettings,
                enableMultiCurrency: !regionalSettings.enableMultiCurrency,
              })
            }
            sx={{
              minWidth: '100px',
              borderRadius: 1,
              textTransform: 'none',
            }}
          >
            {regionalSettings.enableMultiCurrency ? 'Enabled' : 'Disabled'}
          </Button>
        </Box>
      </Box>

      {}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegionalSettingsContent;
