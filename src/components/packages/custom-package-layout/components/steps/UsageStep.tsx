'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import UsageInput from '../shared/UsageInput';

const UsageStep: React.FC = () => {
  const {
    usagePricing,
    usageQuantities,
    handleUsageUpdate,
    selectedCurrency,
    formatPrice,
    pricingState,
    handleNext,
  } = usePackageContext();

  return (
    <Box className={styles.featuresContainer}>
      <Box className={styles.sectionHeader}>
        <Typography variant="h5">Configure Usage</Typography>
        <Typography variant="body2" className={styles.sectionDescription}>
          Adjust the usage metrics to fit your business needs. Ensure the values
          are within the allowed range.
        </Typography>
      </Box>
      {usagePricing.length > 0 ? (
        usagePricing.map((usage) => {
          const currentValue = usageQuantities[usage.id] ?? usage.defaultValue;

          return (
            <UsageInput
              key={usage.id}
              usage={usage}
              currentValue={currentValue}
              onUpdate={handleUsageUpdate}
              currency={selectedCurrency}
              formatPrice={formatPrice}
            />
          );
        })
      ) : (
        <Box className={styles.emptyState}>
          <Typography variant="h6">No usage metrics to configure</Typography>
          <Button
            variant="outlined"
            onClick={handleNext}
            aria-label="Continue to next step"
          >
            Continue
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 3,
          pt: 2,
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{
            minWidth: '200px',
            backgroundColor: '#2563eb',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px',
          }}
          aria-label="Continue to next step"
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Continue
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 8px',
              borderRadius: '4px',
              marginLeft: '8px',
            }}
          >
            {formatPrice(selectedCurrency, pricingState.totalPrice)}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(UsageStep);
