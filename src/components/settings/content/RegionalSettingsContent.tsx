import React from 'react';
import { Box, Typography, Button, TextField, MenuItem, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { RegionalSettings } from '../../../types/settingsTypes';

interface RegionalSettingsContentProps {
  regionalSettings: RegionalSettings;
  setRegionalSettings: (settings: RegionalSettings) => void;
}

const RegionalSettingsContent: React.FC<RegionalSettingsContentProps> = ({ regionalSettings, setRegionalSettings }) => {
  const [newCurrency, setNewCurrency] = React.useState('');

  const handleAddCurrency = () => {
    if (newCurrency && !regionalSettings.supportedCurrencies.includes(newCurrency)) {
      setRegionalSettings({
        ...regionalSettings,
        supportedCurrencies: [...regionalSettings.supportedCurrencies, newCurrency],
      });
      setNewCurrency('');
    }
  };

  const handleRemoveCurrency = (currency: string) => {
    setRegionalSettings({
      ...regionalSettings,
      supportedCurrencies: regionalSettings.supportedCurrencies.filter((c) => c !== currency),
      // If removing the default currency, set a new default
      defaultCurrency:
        regionalSettings.defaultCurrency === currency
          ? regionalSettings.supportedCurrencies.filter((c) => c !== currency)[0] || 'USD'
          : regionalSettings.defaultCurrency,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Currency & Regional Settings
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
              <Chip
                key={currency}
                label={currency}
                onDelete={() => handleRemoveCurrency(currency)}
                color={regionalSettings.defaultCurrency === currency ? 'primary' : 'default'}
                deleteIcon={
                  regionalSettings.defaultCurrency === currency || regionalSettings.supportedCurrencies.length <= 1 ? undefined : (
                    <CloseIcon />
                  )
                }
                onDoubleClick={() =>
                  setRegionalSettings({
                    ...regionalSettings,
                    defaultCurrency: currency,
                  })
                }
                sx={{
                  borderRadius: 1,
                }}
              />
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
              onChange={(e) => setNewCurrency(e.target.value)}
              size="small"
              placeholder="Add currency (e.g. USD)"
              sx={{ flex: 1 }}
            />
            <IconButton color="primary" onClick={handleAddCurrency} disabled={!newCurrency.trim()}>
              <AddIcon />
            </IconButton>
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
              variant={regionalSettings.timeFormat === '12h' ? 'contained' : 'outlined'}
              color={regionalSettings.timeFormat === '12h' ? 'primary' : 'inherit'}
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
              variant={regionalSettings.timeFormat === '24h' ? 'contained' : 'outlined'}
              color={regionalSettings.timeFormat === '24h' ? 'primary' : 'inherit'}
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
            <MenuItem value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</MenuItem>
            <MenuItem value="Europe/London">Europe/London (GMT+0/+1)</MenuItem>
            <MenuItem value="America/New_York">America/New_York (GMT-5/-4)</MenuItem>
            <MenuItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</MenuItem>
            <MenuItem value="Australia/Sydney">Australia/Sydney (GMT+10/+11)</MenuItem>
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
            <MenuItem value="#,###.##">1,234.56 (comma as thousands separator)</MenuItem>
            <MenuItem value="#.###,##">1.234,56 (dot as thousands separator)</MenuItem>
            <MenuItem value="# ###.##">1 234.56 (space as thousands separator)</MenuItem>
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
            variant={regionalSettings.autoDetectLocation ? 'contained' : 'outlined'}
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
          <Typography variant="subtitle1">Enable Multi-Currency Support</Typography>
          <Button
            variant={regionalSettings.enableMultiCurrency ? 'contained' : 'outlined'}
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
    </Box>
  );
};

export default RegionalSettingsContent;
