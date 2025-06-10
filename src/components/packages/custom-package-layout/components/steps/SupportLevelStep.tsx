'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import {
  FaCheck,
  FaHeadset,
  FaCrown,
  FaEnvelope,
  FaClock,
  FaUsers,
} from 'react-icons/fa';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import NavigationButtons from '../shared/NavigationButtons';

const SupportLevelStep: React.FC = () => {
  const {
    basePrice,
    pricingState,
    selectedCurrency,
    formatPrice,
    selectedSupportIndex,
    handleSupportSelect,
    handleNext,
    handleBack,
    loading,
    backLoading,
  } = usePackageContext();

  const supportLevels = [
    {
      id: 0,
      name: 'Basic Support',
      multiplier: 0,
      description: 'Standard email support during business hours',
      icon: <FaEnvelope />,
      popular: false,
      features: [
        'Email support (24-48h response)',
        'Knowledge base access',
        'Community forum access',
        'Basic troubleshooting guides',
        'Business hours only (9AM-5PM)',
      ],
      responseTime: '24-48 hours',
      availability: 'Business Hours',
    },
    {
      id: 1,
      name: 'Priority Support',
      multiplier: 0.2,
      description: 'Faster response times with phone and email support',
      icon: <FaHeadset />,
      popular: true,
      features: [
        'Priority email support (4-8h response)',
        'Phone support during business hours',
        'Live chat support',
        'Advanced troubleshooting',
        'Setup assistance',
        'Training resources',
      ],
      responseTime: '4-8 hours',
      availability: 'Extended Hours',
    },
    {
      id: 2,
      name: 'Premium Support',
      multiplier: 0.4,
      description: '24/7 dedicated support with account manager',
      icon: <FaCrown />,
      popular: false,
      features: [
        '24/7 phone and email support',
        'Dedicated account manager',
        'Priority escalation',
        'Custom training sessions',
        'Implementation assistance',
        'Quarterly business reviews',
        'Direct developer access',
      ],
      responseTime: '1-2 hours',
      availability: '24/7',
    },
  ];

  const calculateSupportPrice = (multiplier: number) => {
    const baseForSupport = basePrice + pricingState.totalFeaturePrice;
    return baseForSupport * multiplier;
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
          Choose Support Level
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
          Select the level of support that best fits your business needs and
          ensures your success
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 3, md: 4 },
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          maxWidth: '1200px',
          mx: 'auto',
          mb: 5,
        }}
      >
        {supportLevels.map((support) => {
          const isSelected = selectedSupportIndex === support.id;
          const supportPrice = calculateSupportPrice(support.multiplier);

          return (
            <Card
              key={support.id}
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
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  borderColor: isSelected ? '#2563eb' : '#94a3b8',
                },
              }}
              onClick={() => handleSupportSelect(support.id)}
            >
              {support.popular && (
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

              <CardContent
                sx={{
                  p: 0,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {}
                <Box
                  sx={{
                    p: { xs: 2, md: 3 },
                    pb: { xs: 1.5, md: 2 },
                    position: 'relative',
                    zIndex: 1,
                    borderBottom: '1px dashed rgba(226, 232, 240, 0.8)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        color: '#2563eb',
                        fontSize: '1.25rem',
                        width: { xs: 40, md: 48 },
                        height: { xs: 40, md: 48 },
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        flexShrink: 0,
                        mr: 2,
                      }}
                    >
                      {support.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                          color: '#1e293b',
                          fontSize: { xs: '1rem', md: '1.1rem' },
                        }}
                      >
                        {support.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: '0.8rem',
                          lineHeight: 1.4,
                        }}
                      >
                        {support.description}
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
                  </Box>

                  {}
                  <Box
                    sx={{
                      mb: 2,
                      p: { xs: 2, md: 2.5 },
                      backgroundColor: 'rgba(248, 250, 252, 0.8)',
                      borderRadius: '12px',
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
                      {support.multiplier === 0
                        ? 'Free'
                        : `+${formatPrice(selectedCurrency, supportPrice)}`}
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
                        {support.multiplier === 0 ? 'included' : '/ month'}
                      </Typography>
                    </Typography>

                    {support.multiplier > 0 && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: '#64748b',
                          fontSize: '0.75rem',
                        }}
                      >
                        {Math.round(support.multiplier * 100)}% of base package
                        price
                      </Typography>
                    )}
                  </Box>
                </Box>

                {}
                <Box
                  sx={{
                    p: { xs: 2, md: 3 },
                    pt: { xs: 1.5, md: 2 },
                    pb: { xs: 1, md: 1.5 },
                    borderBottom: '1px dashed rgba(226, 232, 240, 0.8)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        borderRadius: '8px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        textAlign: 'center',
                      }}
                    >
                      <FaClock
                        size={16}
                        style={{ color: '#10b981', marginBottom: '6px' }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#1e293b',
                          fontSize: '0.7rem',
                          lineHeight: 1.2,
                        }}
                      >
                        Response Time
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          fontSize: '0.7rem',
                          mt: 0.5,
                        }}
                      >
                        {support.responseTime}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 1.5,
                        backgroundColor: 'rgba(248, 250, 252, 0.8)',
                        borderRadius: '8px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        textAlign: 'center',
                      }}
                    >
                      <FaUsers
                        size={16}
                        style={{ color: '#10b981', marginBottom: '6px' }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#1e293b',
                          fontSize: '0.7rem',
                          lineHeight: 1.2,
                        }}
                      >
                        Availability
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          fontSize: '0.7rem',
                          mt: 0.5,
                        }}
                      >
                        {support.availability}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {}
                <Box
                  sx={{
                    p: { xs: 2, md: 3 },
                    pt: { xs: 1.5, md: 2 },
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1.5,
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '0.8rem',
                    }}
                  >
                    What&apos;s included:
                  </Typography>
                  <List dense disablePadding>
                    {support.features.map((feature, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          px: 0,
                          py: 0.75,
                          alignItems: 'flex-start',
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 24,
                            mt: '2px',
                          }}
                        >
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <FaCheck size={8} style={{ color: '#10b981' }} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: {
                              fontSize: '0.75rem',
                              color: '#475569',
                              lineHeight: 1.4,
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Card
        sx={{
          mt: 4,
          mb: 3,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          maxWidth: '900px',
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FaHeadset size={16} style={{ color: '#2563eb' }} />
            Support Summary
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: '#64748b', fontSize: '0.875rem' }}
              >
                Base Package + Features:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}
              >
                {formatPrice(
                  selectedCurrency,
                  basePrice + pricingState.totalFeaturePrice
                )}
              </Typography>
            </Box>

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
                  sx={{ color: '#64748b', fontSize: '0.875rem' }}
                >
                  Support Level:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    fontSize: '0.875rem',
                  }}
                >
                  +{formatPrice(selectedCurrency, pricingState.supportPrice)}
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
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <FaCheck size={12} />
                  Plan Discount:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: '0.875rem' }}
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
                pt: 2,
                mt: 1,
                borderTop: '1px dashed rgba(226, 232, 240, 0.8)',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}
              >
                Total Monthly:
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: '#2563eb',
                  background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.25rem',
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
        isNextDisabled={false}
        isNextLoading={loading}
        isBackLoading={backLoading}
        nextLabel="Continue"
        backLabel="Back"
      />
    </Box>
  );
};

export default SupportLevelStep;
