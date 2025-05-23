'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import FeatureToggle from '../shared/FeatureToggle';
import NavigationButtons from '../shared/NavigationButtons';

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
    handleBack,
    loading,
    backLoading,
  } = usePackageContext();

  
  React.useEffect(() => {
    console.log('CoreFeaturesStep - Features:', features);
    console.log('CoreFeaturesStep - Features length:', features.length);
    console.log('CoreFeaturesStep - Selected features:', selectedFeatures);
  }, [features, selectedFeatures]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 0,
      }}
    >
      {}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" className={styles.sectionHeader}>
          Select Core Features
        </Typography>
        <Typography variant="body1" className={styles.sectionDescription}>
          Choose the modules and features that best meet your business needs.
          Each feature is designed to enhance your workflow and productivity.
        </Typography>
      </Box>

      {}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 4,
          flex: 1,
          alignItems: 'start',
        }}
      >
        {}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxHeight: { lg: '500px' },
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pr: { lg: 2 },
          }}
        >
          {features.length > 0 ? (
            features.map((feature) => (
              <Box
                key={feature.id}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: selectedFeatures.some((f) => f.id === feature.id)
                    ? '2px solid #2563eb'
                    : '1px solid rgba(226, 232, 240, 0.6)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    borderColor: '#3b82f6',
                  },
                }}
                onClick={() => handleFeatureToggle(feature)}
              >
                <FeatureToggle
                  feature={feature}
                  isSelected={selectedFeatures.some((f) => f.id === feature.id)}
                  onToggle={handleFeatureToggle}
                  currency={selectedCurrency}
                  formatPrice={formatPrice}
                />
              </Box>
            ))
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#64748b',
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                No features available
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#94a3b8',
                  mb: 3,
                }}
              >
                Continue to the next step to proceed with your package
                configuration.
              </Typography>
            </Box>
          )}
        </Box>

        {}
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            position: 'sticky',
            top: '20px',
            height: 'fit-content',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 1,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Purchase Summary
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              mb: 3,
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            Review your selected features and pricing.
          </Typography>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(226, 232, 240, 0.6)',
            }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(37, 99, 235, 0.05)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                Base Package
              </Typography>
              <Typography
                sx={{ fontWeight: 700, color: '#2563eb', fontSize: '1.1rem' }}
              >
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
                    sx={{
                      backgroundColor:
                        index % 2 === 0
                          ? 'rgba(59, 130, 246, 0.03)'
                          : 'rgba(255, 255, 255, 0.8)',
                      padding: '12px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom:
                        index < selectedFeatures.length - 1
                          ? '1px solid rgba(226, 232, 240, 0.4)'
                          : 'none',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#475569',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {feature.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#1e293b',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                      }}
                    >
                      {formatPrice(selectedCurrency, featurePrice)}
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  padding: '20px',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  color: '#64748b',
                }}
              >
                <Typography sx={{ fontSize: '0.9rem' }}>
                  No features selected yet
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'white',
                }}
              >
                Total
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  color: 'white',
                }}
              >
                {formatPrice(selectedCurrency, pricingState.totalPrice)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 4,
          pt: 3,
          borderTop: '1px solid rgba(226, 232, 240, 0.6)',
        }}
      >
        <NavigationButtons
          onNext={handleNext}
          onBack={handleBack}
          nextLabel="Continue"
          backLabel="Back"
          isNextDisabled={selectedFeatures.length === 0}
          isNextLoading={loading}
          isBackLoading={backLoading}
          showBackButton={true}
          showNextButton={true}
          showSaveButton={false}
        />
      </Box>
    </Box>
  );
};

export default React.memo(CoreFeaturesStep);
