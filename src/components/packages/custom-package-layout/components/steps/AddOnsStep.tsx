'use client';

import React from 'react';
import { Box, Typography, Chip, Fade, Grid } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import AddOnToggle from '../shared/AddOnToggle';
import NavigationButtons from '../shared/NavigationButtons';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';

const AddOnsStep: React.FC = () => {
  const {
    addOns,
    selectedAddOns,
    handleAddOnToggle,
    selectedCurrency,
    formatPrice,
    handleNext,
    handleBack,
    loading,
    backLoading,
  } = usePackageContext();

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
            borderRadius: '2px'
          }
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
            letterSpacing: '-0.01em'
          }}
        >
          Choose Add-Ons
        </Typography>
        <Typography 
          variant="body1" 
          className={styles.sectionDescription}
          sx={{
            fontSize: { xs: '0.95rem', md: '1rem' },
            color: '#64748b',
            lineHeight: 1.6,
            maxWidth: '800px'
          }}
        >
          Enhance your package with additional features and capabilities. Each
          add-on is carefully designed to extend your system&apos;s functionality.
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            icon={<FaPlus size={14} />} 
            label={`${addOns.length} add-ons available`} 
            size="small"
            sx={{ 
              bgcolor: 'rgba(37, 99, 235, 0.08)', 
              color: '#2563eb',
              fontWeight: 500,
              borderRadius: '6px',
              '& .MuiChip-icon': { color: '#2563eb' }
            }}
          />
          
          {selectedAddOns.length > 0 && (
            <Chip 
              icon={<FaCheckCircle size={14} />} 
              label={`${selectedAddOns.length} selected`} 
              size="small"
              sx={{ 
                bgcolor: 'rgba(16, 185, 129, 0.08)', 
                color: '#10b981',
                fontWeight: 500,
                borderRadius: '6px',
                '& .MuiChip-icon': { color: '#10b981' }
              }}
            />
          )}
        </Box>
      </Box>

      {}
      <Box sx={{ flex: 1, mb: 4 }}>
        {addOns.length > 0 ? (
          <Grid container spacing={3}>
            {addOns.map((addOn) => (
              <Grid item xs={12} md={6} key={addOn.id}>
                <Fade in={true} timeout={300}>
                  <Box>
                    <AddOnToggle
                      addOn={addOn}
                      isSelected={selectedAddOns.some((a) => a.id === addOn.id)}
                      onToggle={handleAddOnToggle}
                      currency={selectedCurrency}
                      formatPrice={formatPrice}
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              padding: '3rem',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
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
              No add-ons available
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
      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        nextLabel="Continue"
        backLabel="Back"
        isNextDisabled={false}
        isNextLoading={loading}
        isBackLoading={backLoading}
        showBackButton={true}
        showNextButton={true}
        showSaveButton={false}
      />
    </Box>
  );
};

export default React.memo(AddOnsStep);
