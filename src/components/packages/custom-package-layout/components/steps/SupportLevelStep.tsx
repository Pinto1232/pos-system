'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  FaCheck,
  FaHeadset,
  FaCrown,
  FaRocket,
  FaPhone,
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
      <Box className={styles.sectionHeader}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#173a79' }}>
          Choose Support Level
        </Typography>
        <Typography variant="body2" className={styles.sectionDescription}>
          Select the level of support that best fits your business needs
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
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
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#f8fafc' : 'white',
                transition: 'all 0.3s ease',
                height: 'fit-content',
                '&:hover': {
                  borderColor: '#2563eb',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                },
              }}
              onClick={() => handleSupportSelect(support.id)}
            >
              {support.popular && (
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
                    {support.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {support.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {support.description}
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

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#173a79' }}
                  >
                    {support.multiplier === 0
                      ? 'Free'
                      : `+${formatPrice(selectedCurrency, supportPrice)}`}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {support.multiplier === 0 ? 'included' : '/ month'}
                    </Typography>
                  </Typography>

                  {support.multiplier > 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {Math.round(support.multiplier * 100)}% of base package
                      price
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FaClock
                      size={14}
                      style={{ marginRight: 8, color: '#16a34a' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Response Time: {support.responseTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaUsers
                      size={14}
                      style={{ marginRight: 8, color: '#16a34a' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Availability: {support.availability}
                    </Typography>
                  </Box>
                </Box>

                <List dense sx={{ p: 0 }}>
                  {support.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <FaCheck size={12} style={{ color: '#16a34a' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontSize: '0.875rem' },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box sx={{ mt: 4, p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Support Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Base Package + Features:</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatPrice(
              selectedCurrency,
              basePrice + pricingState.totalFeaturePrice
            )}
          </Typography>
        </Box>
        {pricingState.supportPrice > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Support Level:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              +{formatPrice(selectedCurrency, pricingState.supportPrice)}
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
            Total Monthly:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#173a79' }}>
            {formatPrice(selectedCurrency, pricingState.totalPrice)}
          </Typography>
        </Box>
      </Box>

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
