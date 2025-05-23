'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { FaCheck, FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import NavigationButtons from '../shared/NavigationButtons';
import type { PaymentPlan } from '@/app/api/payment-plans/route';

const PaymentPlanStep: React.FC = () => {
  const {
    basePrice,
    pricingState,
    selectedCurrency,
    formatPrice,
    selectedPlanIndex,
    paymentPlans,
    paymentPlansLoading,
    handlePlanSelect,
    handleNext,
    handleBack,
    loading,
    backLoading,
  } = usePackageContext();

  const getIconForPlan = (planName: string) => {
    return planName === 'Monthly' ? <FaCalendarAlt /> : <FaCalendarCheck />;
  };

  const calculatePlanPrice = (discountPercentage: number) => {
    const subtotal =
      basePrice + pricingState.totalFeaturePrice + pricingState.supportPrice;
    const discountAmount = subtotal * discountPercentage;
    return subtotal - discountAmount;
  };

  const calculateMonthlySavings = (discountPercentage: number) => {
    const monthlyPrice = calculatePlanPrice(0);
    const discountedPrice = calculatePlanPrice(discountPercentage);
    return monthlyPrice - discountedPrice;
  };

  return (
    <Box className={styles.featuresContainer}>
      <Box className={styles.sectionHeader}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#173a79' }}>
          Select Payment Plan
        </Typography>
        <Typography variant="body2" className={styles.sectionDescription}>
          Choose your billing cycle and save with longer commitments
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        }}
      >
        {paymentPlansLoading ? (
          <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Loading payment plans...
            </Typography>
          </Box>
        ) : paymentPlans && paymentPlans.length > 0 ? (
          paymentPlans.map((plan: PaymentPlan) => {
            const isSelected = selectedPlanIndex === plan.id;
            const planPrice = calculatePlanPrice(plan.discountPercentage);
            const monthlySavings =
              plan.discountPercentage > 0
                ? calculateMonthlySavings(plan.discountPercentage)
                : 0;

            return (
              <Card
                key={plan.id}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  border: isSelected
                    ? '2px solid #2563eb'
                    : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#f8fafc' : 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#2563eb',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                  },
                }}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.isPopular && (
                  <Chip
                    label="Most Popular"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontWeight: 600,
                      zIndex: 1,
                    }}
                  />
                )}

                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2, color: '#2563eb', fontSize: '1.5rem' }}>
                      {getIconForPlan(plan.name)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.description}
                      </Typography>
                    </Box>
                    {isSelected && (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        <FaCheck size={12} />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: '#173a79' }}
                    >
                      {formatPrice(selectedCurrency, planPrice)}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        / {plan.period}
                      </Typography>
                    </Typography>

                    {plan.discountPercentage > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {plan.discountLabel && (
                          <Chip
                            label={plan.discountLabel}
                            size="small"
                            sx={{
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              fontWeight: 600,
                              mr: 1,
                            }}
                          />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          Save {formatPrice(selectedCurrency, monthlySavings)}{' '}
                          per month
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <FaCheck
                        size={12}
                        style={{ marginRight: 8, color: '#16a34a' }}
                      />
                      Billed every {plan.period}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <FaCheck
                        size={12}
                        style={{ marginRight: 8, color: '#16a34a' }}
                      />
                      Cancel anytime
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <FaCheck
                        size={12}
                        style={{ marginRight: 8, color: '#16a34a' }}
                      />
                      Full feature access
                    </Typography>
                    {plan.discountPercentage > 0 && (
                      <Typography
                        variant="body2"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <FaCheck
                          size={12}
                          style={{ marginRight: 8, color: '#16a34a' }}
                        />
                        {Math.round(plan.discountPercentage * 100)}% discount
                        applied
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error">
              No payment plans available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please try refreshing the page or contact support if the issue
              persists.
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 4, p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Billing Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Base Package:</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatPrice(selectedCurrency, basePrice)}
          </Typography>
        </Box>
        {pricingState.totalFeaturePrice > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Features & Add-ons:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatPrice(selectedCurrency, pricingState.totalFeaturePrice)}
            </Typography>
          </Box>
        )}
        {pricingState.supportPrice > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Support:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatPrice(selectedCurrency, pricingState.supportPrice)}
            </Typography>
          </Box>
        )}
        {pricingState.planDiscount > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
              color: '#16a34a',
            }}
          >
            <Typography variant="body2">Plan Discount:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              -
              {formatPrice(
                selectedCurrency,
                (basePrice +
                  pricingState.totalFeaturePrice +
                  pricingState.supportPrice) *
                  pricingState.planDiscount
              )}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: 2,
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Total:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#173a79' }}>
            {formatPrice(selectedCurrency, pricingState.totalPrice)}
          </Typography>
        </Box>
      </Box>

      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        isNextDisabled={selectedPlanIndex === null}
        isNextLoading={loading}
        isBackLoading={backLoading}
        nextLabel="Continue"
        backLabel="Back"
      />
    </Box>
  );
};

export default PaymentPlanStep;
