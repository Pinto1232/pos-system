'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Checkbox, Button } from '@mui/material';
import { FaCalendarCheck } from 'react-icons/fa';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import PriceDisplay from '../shared/PriceDisplay';
import NavigationButtons from '../shared/NavigationButtons';
import type { PaymentPlan } from '@/app/api/payment-plans/route';

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
    handleNext,
    loading,
    backLoading,
    handleBack,
    paymentPlans,
    paymentPlansLoading,
    selectedPlanIndex,
    handlePlanSelect,
  } = usePackageContext();

  React.useEffect(() => {
    console.log(
      '[PACKAGE_DETAILS_STEP] Add-Ons Debug:',
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          addOnsLength: addOns?.length || 0,
          addOns: addOns,
          isCustomizable,
          checkboxStatesKeys: Object.keys(checkboxStates),
          checkboxStatesCount: Object.keys(checkboxStates).length,
          checkboxStatesValues: checkboxStates,
          isAnySelected: isAnyCheckboxSelected(),
        },
        null,
        2
      )
    );
  }, [addOns, isCustomizable, checkboxStates, isAnyCheckboxSelected]);

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
            <Box className={styles.planColumn}>Monthly</Box>
            <Box className={styles.planColumn}>Quarterly</Box>
            <Box className={styles.planColumn}>Annual</Box>
          </Box>

          <Box
            className={styles.tableRow}
            sx={{
              borderBottom: '2px solid #e0e0e0',
            }}
          >
            <Box className={styles.featureColumn}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#173a79',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FaCalendarCheck />
                Billing Period
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                }}
              >
                Choose your preferred billing cycle
              </Typography>
            </Box>
            {paymentPlansLoading ? (
              <>
                <Box className={styles.planColumn}>
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </Box>
                <Box className={styles.planColumn}>
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </Box>
                <Box className={styles.planColumn}>
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </Box>
              </>
            ) : (
              (paymentPlans || []).slice(0, 3).map((plan: PaymentPlan) => (
                <Box
                  key={plan.id}
                  className={styles.planColumn}
                  data-label={plan.name}
                  sx={{
                    backgroundColor:
                      selectedPlanIndex === plan.id
                        ? 'rgba(76, 175, 80, 0.1)'
                        : 'transparent',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <Button
                    variant={
                      selectedPlanIndex === plan.id ? 'contained' : 'outlined'
                    }
                    size="small"
                    onClick={() => handlePlanSelect(plan.id)}
                    startIcon={<FaCalendarCheck />}
                    aria-label={`${plan.name} billing period${plan.discountLabel ? ` with ${plan.discountLabel}` : ''}`}
                    sx={{
                      minWidth: '80px',
                      ...(selectedPlanIndex === plan.id
                        ? {
                            backgroundColor: '#2563eb',
                            '&:hover': {
                              backgroundColor: '#1d4ed8',
                            },
                          }
                        : {
                            borderColor: '#e2e8f0',
                            color: '#64748b',
                            '&:hover': {
                              borderColor: '#cbd5e1',
                              backgroundColor: '#f8fafc',
                            },
                          }),
                    }}
                  >
                    {plan.period
                      .replace(' month', 'mo')
                      .replace(' months', 'mo')
                      .replace('12 mo', '1yr')}
                    {plan.discountLabel && (
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
                        {plan.discountLabel}
                      </span>
                    )}
                  </Button>
                </Box>
              ))
            )}
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
        onNext={handleNext}
        backLabel="Back"
        nextLabel="Continue"
        isBackDisabled={backLoading}
        isNextDisabled={loading || !isAnyCheckboxSelected()}
        isBackLoading={backLoading}
        isNextLoading={loading}
        showBackButton={true}
        showNextButton={true}
        showSaveButton={false}
      />
    </Box>
  );
};

export default React.memo(PackageDetailsStep);
