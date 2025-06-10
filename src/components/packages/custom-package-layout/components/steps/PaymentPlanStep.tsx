'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Stack } from '@mui/material';
import {
  FaCheck,
  FaCalendarAlt,
  FaCalendarCheck,
  FaShieldAlt,
  FaRegClock,
} from 'react-icons/fa';
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
    if (planName.toLowerCase().includes('monthly')) return <FaCalendarAlt />;
    if (
      planName.toLowerCase().includes('annual') ||
      planName.toLowerCase().includes('yearly')
    )
      return <FaCalendarCheck />;
    if (planName.toLowerCase().includes('quarterly')) return <FaRegClock />;
    return <FaCalendarCheck />;
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
      <Box className={styles.sectionHeader} sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 1.5,
            background: 'linear-gradient(90deg, #1e293b, #334155)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.5rem',
          }}
        >
          Select Your Payment Plan
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#64748b',
            maxWidth: '700px',
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: '1.05rem',
          }}
        >
          Choose the billing cycle that works best for your business. Longer
          commitments offer greater savings.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          mb: 4,
          maxWidth: '900px',
          mx: 'auto',
        }}
      >
        {paymentPlansLoading ? (
          <Box
            sx={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              py: 6,
              bgcolor: 'rgba(248, 250, 252, 0.8)',
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <span className="loading-pulse"></span>
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
                    : '1px solid rgba(226, 232, 240, 0.8)',
                  borderRadius: '16px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isSelected ? 'translateY(-8px)' : 'none',
                  backgroundColor: isSelected
                    ? 'rgba(248, 250, 252, 0.8)'
                    : 'white',
                  overflow: 'hidden',
                  boxShadow: isSelected
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow:
                      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    borderColor: isSelected ? '#2563eb' : '#94a3b8',
                  },

                  maxWidth: '100%',
                }}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.isPopular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '150px',
                      height: '150px',
                      overflow: 'hidden',
                      zIndex: 0,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        transform: 'translate(50%, -50%) rotate(45deg)',
                        transformOrigin: 'bottom right',
                        width: '200px',
                        backgroundColor: '#2563eb',
                        padding: '8px 0',
                        textAlign: 'center',
                        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        zIndex: 1,
                      }}
                    >
                      MOST POPULAR
                    </Box>
                  </Box>
                )}

                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      pb: { xs: 1, md: 1.5 },
                      position: 'relative',
                      zIndex: 1,
                      borderBottom: '1px dashed rgba(226, 232, 240, 0.8)',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ mb: 1.5 }}
                    >
                      <Box
                        sx={{
                          color: '#2563eb',
                          fontSize: '1rem',
                          width: { xs: 32, md: 36 },
                          height: { xs: 32, md: 36 },
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          flexShrink: 0,
                        }}
                      >
                        {getIconForPlan(plan.name)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 0.25,
                            color: '#1e293b',
                            fontSize: { xs: '0.95rem', md: '1.1rem' },
                          }}
                        >
                          {plan.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.75rem',
                            lineHeight: 1.4,
                          }}
                        >
                          {plan.description}
                        </Typography>
                      </Box>
                      {isSelected && (
                        <Box
                          sx={{
                            width: { xs: 22, md: 24 },
                            height: { xs: 22, md: 24 },
                            borderRadius: '50%',
                            backgroundColor: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                            border: '1px solid white',
                            flexShrink: 0,
                          }}
                        >
                          <FaCheck size={10} />
                        </Box>
                      )}
                    </Stack>

                    <Box
                      sx={{
                        mb: 1.5,
                        p: { xs: 1.5, md: 2 },
                        backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        borderRadius: '8px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: '#1e293b',
                          lineHeight: 1.1,
                          letterSpacing: '-0.02em',
                          fontSize: { xs: '1.4rem', md: '1.6rem' },
                        }}
                      >
                        {formatPrice(selectedCurrency, planPrice)}
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            ml: 0.5,
                            fontWeight: 500,
                            verticalAlign: 'middle',
                            fontSize: { xs: '0.7rem', md: '0.8rem' },
                          }}
                        >
                          / {plan.period}
                        </Typography>
                      </Typography>

                      {plan.discountPercentage > 0 && (
                        <Box
                          sx={{
                            mt: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          {plan.discountLabel && (
                            <Chip
                              label={plan.discountLabel}
                              size="small"
                              sx={{
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                fontWeight: 600,
                                px: 0.5,
                                height: 20,
                                fontSize: '0.65rem',
                                borderRadius: '4px',
                              }}
                            />
                          )}
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            sx={{
                              color: '#10b981',
                              fontWeight: 600,
                              fontSize: '0.65rem',
                            }}
                          >
                            <FaShieldAlt size={10} />
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600, fontSize: '0.65rem' }}
                            >
                              Save{' '}
                              {formatPrice(selectedCurrency, monthlySavings)}{' '}
                              per month
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      pt: { xs: 1, md: 1.5 },
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <FaCheck
                          size={10}
                          style={{
                            color: '#10b981',
                            marginTop: '3px',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#475569',
                            fontSize: '0.75rem',
                          }}
                        >
                          Billed every {plan.period}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <FaCheck
                          size={10}
                          style={{
                            color: '#10b981',
                            marginTop: '3px',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#475569',
                            fontSize: '0.75rem',
                          }}
                        >
                          Cancel anytime
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <FaCheck
                          size={10}
                          style={{
                            color: '#10b981',
                            marginTop: '3px',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#475569',
                            fontSize: '0.75rem',
                          }}
                        >
                          Full feature access
                        </Typography>
                      </Stack>

                      {plan.discountPercentage > 0 && (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <FaCheck
                            size={10}
                            style={{
                              color: '#10b981',
                              marginTop: '3px',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#475569',
                              fontSize: '0.75rem',
                            }}
                          >
                            {Math.round(plan.discountPercentage * 100)}%
                            discount applied
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Box
            sx={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              py: 6,
              px: 3,
              bgcolor: 'rgba(254, 242, 242, 0.6)',
              borderRadius: 3,
              border: '1px solid rgba(252, 165, 165, 0.2)',
            }}
          >
            <Typography
              variant="h6"
              color="error"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              No payment plans available
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: '500px', mx: 'auto' }}
            >
              Please try refreshing the page or contact support if the issue
              persists.
            </Typography>
          </Box>
        )}
      </Box>

      <Card
        sx={{
          mb: 3,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          width: '100%',
        }}
      >
        <Box
          sx={{
            p: 1.5,
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}
          >
            Billing Summary
          </Typography>
        </Box>

        <CardContent sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: '#64748b', fontSize: '0.75rem' }}
              >
                Base Package:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.75rem' }}
              >
                {formatPrice(selectedCurrency, basePrice)}
              </Typography>
            </Box>

            {pricingState.totalFeaturePrice > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: '#64748b', fontSize: '0.75rem' }}
                >
                  Features & Add-ons:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    fontSize: '0.75rem',
                  }}
                >
                  {formatPrice(
                    selectedCurrency,
                    pricingState.totalFeaturePrice
                  )}
                </Typography>
              </Box>
            )}

            {pricingState.supportPrice > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: '#64748b', fontSize: '0.75rem' }}
                >
                  Support:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    fontSize: '0.75rem',
                  }}
                >
                  {formatPrice(selectedCurrency, pricingState.supportPrice)}
                </Typography>
              </Box>
            )}

            {pricingState.planDiscount > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#10b981',
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Plan Discount:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                >
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
                alignItems: 'center',
                pt: 1.5,
                mt: 0.5,
                borderTop: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}
              >
                Total:
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: '#2563eb',
                  background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1rem',
                }}
              >
                {formatPrice(selectedCurrency, pricingState.totalPrice)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        isNextDisabled={selectedPlanIndex === null}
        isNextLoading={loading}
        isBackLoading={backLoading}
        nextLabel="Continue"
        backLabel="Back"
      />

      <style jsx global>{`
        .loading-pulse {
          display: inline-block;
          position: relative;
          width: 20px;
          height: 20px;
        }
        .loading-pulse:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #2563eb;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }
      `}</style>
    </Box>
  );
};

export default React.memo(PaymentPlanStep);
