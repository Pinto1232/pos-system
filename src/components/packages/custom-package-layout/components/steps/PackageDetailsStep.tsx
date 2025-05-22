'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Checkbox, Button } from '@mui/material';
import { FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import PriceDisplay from '../shared/PriceDisplay';
import NavigationButtons from '../shared/NavigationButtons';

const PackageDetailsStep: React.FC = () => {
  const {
    packageDetails,
    basePrice,
    isCustomizable,
    pricingState,
    selectedCurrency,
    formatPrice,
    addOns,
    checkboxStates,
    handleCheckboxChange,
    isAnyCheckboxSelected,
    handleSave,
    loading,
    backLoading,
    handleBack,
  } = usePackageContext();

  
  React.useEffect(() => {
    console.log('PackageDetailsStep - addOns data:', {
      addOnsLength: addOns?.length || 0,
      addOns: addOns,
      isCustomizable,
    });
  }, [addOns, isCustomizable]);

  const formattedDescription = useMemo(() => {
    return packageDetails.description
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/business needs/g, 'business needs.');
  }, [packageDetails.description]);

  return (
    <Box className={styles.packageDetails}>
      <Typography
        variant="h4"
        className={styles.packageTitle}
        sx={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#173a79',
        }}
      >
        {isCustomizable ? 'Customize Your Package' : 'Package Details'}
      </Typography>
      <Typography variant="body1" className={styles.packageDescription}>
        {formattedDescription}
      </Typography>

      <PriceDisplay
        basePrice={basePrice}
        totalPrice={pricingState.totalPrice}
        totalFeaturePrice={pricingState.totalFeaturePrice}
        supportPrice={pricingState.supportPrice}
        planDiscount={pricingState.planDiscount}
        currency={selectedCurrency}
        formatPrice={formatPrice}
        isCustomizable={isCustomizable}
      />

      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: '400px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Box className={styles.featuresTable}>
          <Box className={styles.tableHeader}>
            <Box className={styles.featureColumn}></Box>
            <Box className={styles.planColumn}>Business</Box>
            <Box className={styles.planColumn}>Startup</Box>
            <Box className={styles.planColumn}>Personal</Box>
          </Box>

          <Box
            className={styles.tableRow}
            sx={{
              borderBottom: '2px solid #e0e0e0',
            }}
          >
            <Box className={styles.featureColumn}>Billing Period</Box>
            <Box className={styles.planColumn}>
              <Button
                variant="contained"
                className={styles.priceTabActive}
                sx={{
                  minWidth: '100px',
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                }}
                startIcon={<FaCalendarAlt />}
                aria-label="Monthly billing period"
              >
                Monthly
              </Button>
            </Box>
            <Box className={styles.planColumn}>
              <Button
                variant="outlined"
                className={styles.priceTab}
                sx={{
                  minWidth: '60px',
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    backgroundColor: '#f8fafc',
                  },
                }}
                startIcon={<FaCalendarCheck />}
                aria-label="Yearly billing period with 20% discount"
              >
                yrs
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    marginLeft: '8px',
                  }}
                >
                  -20%
                </span>
              </Button>
            </Box>
            <Box className={styles.planColumn}>
              <Button
                variant="outlined"
                className={styles.priceTab}
                sx={{
                  minWidth: '60px',
                  borderColor: '#e2e8f0',
                  flexWrap: 'nowrap',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    backgroundColor: '#f8fafc',
                  },
                }}
                startIcon={<FaCalendarCheck />}
                aria-label="2-year billing period with 30% discount"
              >
                2yrs
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    marginLeft: '8px',
                  }}
                >
                  -30%
                </span>
              </Button>
            </Box>
          </Box>

          {addOns && addOns.length > 0 ? (
            addOns.map((addOn) => {
              const businessKey = `business-${addOn.id}`;
              const startupKey = `startup-${addOn.id}`;
              const personalKey = `personal-${addOn.id}`;

              const addOnPrice =
                pricingState.featurePrices[addOn.id] ||
                (addOn.multiCurrencyPrices &&
                addOn.multiCurrencyPrices[selectedCurrency]
                  ? addOn.multiCurrencyPrices[selectedCurrency]
                  : addOn.price);

              return (
                <Box className={styles.tableRow} key={addOn.id}>
                  <Box className={styles.featureColumn}>
                    {addOn.name}
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                      }}
                    >
                      {formatPrice(selectedCurrency, addOnPrice)}
                    </Typography>
                  </Box>
                  <Box
                    className={styles.planColumn}
                    data-label="Business"
                    sx={{
                      backgroundColor: checkboxStates[businessKey]
                        ? 'rgba(76, 175, 80, 0.1)'
                        : 'transparent',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={checkboxStates[businessKey] || false}
                      onChange={() => handleCheckboxChange(businessKey)}
                      aria-label={`Select ${addOn.name} for Business plan`}
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    data-label="Startup"
                    sx={{
                      backgroundColor: checkboxStates[startupKey]
                        ? 'rgba(76, 175, 80, 0.1)'
                        : 'transparent',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={checkboxStates[startupKey] || false}
                      onChange={() => handleCheckboxChange(startupKey)}
                      aria-label={`Select ${addOn.name} for Startup plan`}
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    data-label="Personal"
                    sx={{
                      backgroundColor: checkboxStates[personalKey]
                        ? 'rgba(76, 175, 80, 0.1)'
                        : 'transparent',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={checkboxStates[personalKey] || false}
                      onChange={() => handleCheckboxChange(personalKey)}
                      aria-label={`Select ${addOn.name} for Personal plan`}
                    />
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box className={styles.tableRow}>
              <Box className={styles.featureColumn}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    padding: '2rem',
                  }}
                >
                  No add-ons available at the moment. Please try again later.
                </Typography>
              </Box>
              <Box className={styles.planColumn}></Box>
              <Box className={styles.planColumn}></Box>
              <Box className={styles.planColumn}></Box>
            </Box>
          )}
        </Box>
      </Box>

      <NavigationButtons
        onBack={handleBack}
        onSave={handleSave}
        backLabel="Back"
        saveLabel="Continue"
        isBackDisabled={backLoading}
        isSaveDisabled={
          loading ||
          !isAnyCheckboxSelected() ||
          (isCustomizable && pricingState.totalFeaturePrice === 0)
        }
        isBackLoading={backLoading}
        isSaveLoading={loading}
        showBackButton={true}
        showNextButton={false}
        showSaveButton={true}
      />
    </Box>
  );
};

export default React.memo(PackageDetailsStep);
