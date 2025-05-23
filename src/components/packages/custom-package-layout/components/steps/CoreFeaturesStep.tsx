'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import FeatureToggle from '../shared/FeatureToggle';

const CoreFeaturesStep: React.FC = () => {
  const {
    features,
    selectedFeatures,
    handleFeatureToggle,
    selectedCurrency,
    formatPrice,
    pricingState,
    basePrice,
    handleNext,
  } = usePackageContext();

  return (
    <Box
      className={styles.container}
      sx={{
        maxHeight: '600px',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <Box>
        <Typography variant="h6" className={styles.sectionHeader}>
          Select Core Features
        </Typography>
        <Typography variant="body2" className={styles.sectionDescription}>
          Select the modules and features that best meet your needs.
        </Typography>
        <Box className={styles.featuresContainer}>
          {features.length > 0 ? (
            features.map((feature) => (
              <FeatureToggle
                key={feature.id}
                feature={feature}
                isSelected={selectedFeatures.some((f) => f.id === feature.id)}
                onToggle={handleFeatureToggle}
                currency={selectedCurrency}
                formatPrice={formatPrice}
              />
            ))
          ) : (
            <Box className={styles.emptyState}>
              <Typography variant="h5">No features available</Typography>
              <Button variant="outlined">Continue</Button>
            </Box>
          )}
        </Box>

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
            disabled={selectedFeatures.length === 0}
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
      <Box>
        <Typography variant="h6" className={styles.title}>
          Purchase Summary
        </Typography>
        <Typography variant="body2" className={styles.sectionDescription}>
          Brief summary of your purchase.
        </Typography>
        <Box className={styles.purchaseSummaryContainer}>
          <Box
            className={styles.billingItem}
            sx={{
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '12px 16px',
            }}
          >
            <Typography className={styles.itemLabel} sx={{ fontWeight: 600 }}>
              Base Package
            </Typography>
            <Typography className={styles.itemPrice} sx={{ fontWeight: 600 }}>
              {formatPrice(selectedCurrency, basePrice)}
            </Typography>
          </Box>

          {selectedFeatures.length > 0 ? (
            selectedFeatures.map((feature, index) => {
              const featurePrice = feature.multiCurrencyPrices
                ? feature.multiCurrencyPrices[selectedCurrency]
                : feature.basePrice;
              return (
                <Box
                  key={feature.id}
                  className={styles.billingItem}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#3b82f65e' : '#ffffff',
                  }}
                >
                  <Typography className={styles.itemLabel}>
                    {feature.name}
                  </Typography>
                  <Typography className={styles.itemPrice}>
                    {formatPrice(selectedCurrency, featurePrice)}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Box
              className={styles.billingItem}
              sx={{
                backgroundColor: '#ffffff',
                padding: '12px 16px',
                fontStyle: 'italic',
                color: '#64748b',
              }}
            >
              <Typography className={styles.itemLabel}>
                No features selected
              </Typography>
              <Typography className={styles.itemPrice}>
                {formatPrice(selectedCurrency, 0)}
              </Typography>
            </Box>
          )}

          <Box
            className={styles.totalContainer}
            sx={{
              backgroundColor: '#f1f5f9',
              padding: '16px',
              borderRadius: '0 0 8px 8px',
              marginTop: '16px',
              borderTop: '2px solid #e2e8f0',
            }}
          >
            <Typography
              variant="subtitle1"
              className={styles.totalLabel}
              sx={{
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              Total
            </Typography>
            <Typography
              variant="subtitle1"
              className={styles.totalPrice}
              sx={{
                fontWeight: 700,
                fontSize: '1.2rem',
                color: '#2563eb',
              }}
            >
              {formatPrice(selectedCurrency, pricingState.totalPrice)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(CoreFeaturesStep);
