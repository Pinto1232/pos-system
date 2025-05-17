import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { TaxSettings } from '../../../types/settingsTypes';

interface TaxSettingsContentProps {
  taxSettings: TaxSettings;
  setTaxSettings: (settings: TaxSettings) => void;
}

const TaxSettingsContent: React.FC<TaxSettingsContentProps> = ({ taxSettings, setTaxSettings }) => {
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
          <Typography variant="subtitle1">Enable Tax Calculation</Typography>
          <Button
            variant={taxSettings.enableTaxCalculation ? 'contained' : 'outlined'}
            color={taxSettings.enableTaxCalculation ? 'primary' : 'inherit'}
            onClick={() =>
              setTaxSettings({
                ...taxSettings,
                enableTaxCalculation: !taxSettings.enableTaxCalculation,
              })
            }
            sx={{
              minWidth: '100px',
              borderRadius: 1,
              textTransform: 'none',
            }}
          >
            {taxSettings.enableTaxCalculation ? 'Enabled' : 'Disabled'}
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="subtitle1">Default Tax Rate (%)</Typography>
          <Box sx={{ position: 'relative' }}>
            <TextField
              type="number"
              value={taxSettings.defaultTaxRate || 0}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
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
                transform: 'translateY(-50%)',
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
          <Typography variant="subtitle1">Tax Calculation Method</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={taxSettings.taxCalculationMethod === 'inclusive' ? 'contained' : 'outlined'}
              color={taxSettings.taxCalculationMethod === 'inclusive' ? 'primary' : 'inherit'}
              onClick={() =>
                setTaxSettings({
                  ...taxSettings,
                  taxCalculationMethod: 'inclusive',
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
              variant={taxSettings.taxCalculationMethod === 'exclusive' ? 'contained' : 'outlined'}
              color={taxSettings.taxCalculationMethod === 'exclusive' ? 'primary' : 'inherit'}
              onClick={() =>
                setTaxSettings({
                  ...taxSettings,
                  taxCalculationMethod: 'exclusive',
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
          <Typography variant="subtitle1">VAT Registered</Typography>
          <Button
            variant={taxSettings.vatRegistered ? 'contained' : 'outlined'}
            color={taxSettings.vatRegistered ? 'primary' : 'inherit'}
            onClick={() =>
              setTaxSettings({
                ...taxSettings,
                vatRegistered: !taxSettings.vatRegistered,
              })
            }
            sx={{
              minWidth: '100px',
              borderRadius: 1,
              textTransform: 'none',
            }}
          >
            {taxSettings.vatRegistered ? 'Yes' : 'No'}
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
            <Typography variant="subtitle1">VAT Number</Typography>
            <TextField
              value={taxSettings.vatNumber || ''}
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
          <Typography variant="subtitle1">Display Tax on Receipts</Typography>
          <Button
            variant={taxSettings.displayTaxOnReceipts ? 'contained' : 'outlined'}
            color={taxSettings.displayTaxOnReceipts ? 'primary' : 'inherit'}
            onClick={() =>
              setTaxSettings({
                ...taxSettings,
                displayTaxOnReceipts: !taxSettings.displayTaxOnReceipts,
              })
            }
            sx={{
              minWidth: '100px',
              borderRadius: 1,
              textTransform: 'none',
            }}
          >
            {taxSettings.displayTaxOnReceipts ? 'Yes' : 'No'}
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="subtitle1">Tax Reporting Period</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={taxSettings.taxReportingPeriod === 'monthly' ? 'contained' : 'outlined'}
              color={taxSettings.taxReportingPeriod === 'monthly' ? 'primary' : 'inherit'}
              onClick={() =>
                setTaxSettings({
                  ...taxSettings,
                  taxReportingPeriod: 'monthly',
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
              variant={taxSettings.taxReportingPeriod === 'quarterly' ? 'contained' : 'outlined'}
              color={taxSettings.taxReportingPeriod === 'quarterly' ? 'primary' : 'inherit'}
              onClick={() =>
                setTaxSettings({
                  ...taxSettings,
                  taxReportingPeriod: 'quarterly',
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
              variant={taxSettings.taxReportingPeriod === 'annually' ? 'contained' : 'outlined'}
              color={taxSettings.taxReportingPeriod === 'annually' ? 'primary' : 'inherit'}
              onClick={() =>
                setTaxSettings({
                  ...taxSettings,
                  taxReportingPeriod: 'annually',
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
};

export default TaxSettingsContent;
