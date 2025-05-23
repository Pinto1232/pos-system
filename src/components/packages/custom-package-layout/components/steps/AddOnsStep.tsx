'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import AddOnToggle from '../shared/AddOnToggle';
import NavigationButtons from '../shared/NavigationButtons';

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
    <Box>
      <Typography variant="h5" className={styles.sectionHeader}>
        Choose Add-Ons
      </Typography>
      <Typography variant="body1" className={styles.sectionDescription}>
        Enhance your package with additional features and capabilities. Each
        add-on is carefully designed to extend your system&apos;s functionality.
      </Typography>

      <Box className={styles.featuresContainer}>
        {addOns.length > 0 ? (
          addOns.map((addOn) => (
            <AddOnToggle
              key={addOn.id}
              addOn={addOn}
              isSelected={selectedAddOns.some((a) => a.id === addOn.id)}
              onToggle={handleAddOnToggle}
              currency={selectedCurrency}
              formatPrice={formatPrice}
            />
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
