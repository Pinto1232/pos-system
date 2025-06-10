'use client';

import React from 'react';
import { Box, Typography, Chip, Tooltip, Fade } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import FeatureToggle from '../shared/FeatureToggle';
import NavigationButtons from '../shared/NavigationButtons';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

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
      <Box
        sx={{
          mb: 4,
          position: 'relative',
          pb: 2,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
            borderRadius: '2px',
          },
        }}
      >
        <Typography
          variant="h5"
          className={styles.sectionHeader}
          sx={{
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 700,
            color: '#1e293b',
            mb: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          Select Core Features
        </Typography>
        <Typography
          variant="body1"
          className={styles.sectionDescription}
          sx={{
            fontSize: { xs: '0.95rem', md: '1rem' },
            color: '#64748b',
            lineHeight: 1.6,
            maxWidth: '800px',
          }}
        >
          Choose the modules and features that best meet your business needs.
          Each feature is designed to enhance your workflow and productivity.
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<FaInfoCircle size={14} />}
            label={`${features.length} features available`}
            size="small"
            sx={{
              bgcolor: 'rgba(37, 99, 235, 0.08)',
              color: '#2563eb',
              fontWeight: 500,
              borderRadius: '6px',
              '& .MuiChip-icon': { color: '#2563eb' },
            }}
          />

          {selectedFeatures.length > 0 && (
            <Chip
              icon={<FaCheckCircle size={14} />}
              label={`${selectedFeatures.length} selected`}
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.08)',
                color: '#10b981',
                fontWeight: 500,
                borderRadius: '6px',
                '& .MuiChip-icon': { color: '#10b981' },
              }}
            />
          )}
        </Box>
      </Box>

      {}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr', lg: '3fr 2fr' },
          gap: { xs: 3, md: 4 },
          flex: 1,
          alignItems: 'start',
        }}
      >
        {}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(280px, 1fr))',
            },
            gap: 3,
            maxHeight: { lg: '600px' },
            overflowY: 'auto',
            pr: { lg: 2 },
            pb: 2,
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 transparent',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e1',
              borderRadius: '6px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#94a3b8',
            },
          }}
        >
          {features.length > 0 ? (
            features.map((feature) => {
              const isSelected = selectedFeatures.some(
                (f) => f.id === feature.id
              );
              return (
                <Fade key={feature.id} in={true} timeout={300}>
                  <Box
                    sx={{
                      height: '100%',
                      background: 'white',
                      border: isSelected
                        ? '2px solid #2563eb'
                        : '1px solid rgba(226, 232, 240, 0.8)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected
                        ? '0 8px 20px rgba(37, 99, 235, 0.12)'
                        : '0 2px 10px rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                        borderColor: isSelected ? '#2563eb' : '#94a3b8',
                      },
                      ...(isSelected && {
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background:
                            'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, transparent 100%)',
                          borderRadius: '10px',
                          pointerEvents: 'none',
                        },
                      }),
                    }}
                    onClick={() => handleFeatureToggle(feature)}
                  >
                    <FeatureToggle
                      feature={feature}
                      isSelected={isSelected}
                      onToggle={handleFeatureToggle}
                      currency={selectedCurrency}
                      formatPrice={formatPrice}
                    />
                  </Box>
                </Fade>
              );
            })
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                padding: '3rem',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                gridColumn: '1 / -1',
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
            background: 'white',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            position: 'sticky',
            top: '20px',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 1,
                fontSize: '1.25rem',
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
                mb: 1,
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              Review your selected features and pricing.
            </Typography>
          </Box>

          <Box
            sx={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(37, 99, 235, 0.05)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
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

            <Box sx={{ maxHeight: '240px', overflowY: 'auto' }}>
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
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(59, 130, 246, 0.06)',
                        },
                      }}
                    >
                      <Tooltip
                        title={feature.description}
                        placement="left"
                        arrow
                      >
                        <Typography
                          sx={{
                            color: '#475569',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'help',
                          }}
                        >
                          {feature.name}
                          <FaInfoCircle size={12} color="#94a3b8" />
                        </Typography>
                      </Tooltip>
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
            </Box>

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
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {formatPrice(selectedCurrency, pricingState.totalPrice)}
              </Typography>
            </Box>
          </Box>

          {selectedFeatures.length > 0 && (
            <Box
              sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <FaCheckCircle size={16} color="#10b981" />
              <Typography
                sx={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 500 }}
              >
                {selectedFeatures.length} feature
                {selectedFeatures.length !== 1 ? 's' : ''} selected
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {}
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
  );
};

export default React.memo(CoreFeaturesStep);
