'use client';

import React, { memo, Suspense, useRef, useEffect } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './PackageSelectionModal.module.css';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { Package as CustomPackage } from '@/components/packages/custom-package-layout/types';
import CustomPackageLayoutContainer from '@/components/packages/custom-package-layout/CustomPackageLayoutContainer';
import StarterPackageLayout from '@/components/packages/starter-package-layout/StarterPackageLayout';
import GrowthPackageLayout from '@/components/packages/growth-package-layout/GrowthPackageLayout';
import EnterprisePackageLayout from '@/components/packages/enterprise-package-layout/EnterprisePackageLayout';
import PremiumPackageLayout from './premium-package-layout/PremiumPackageLayout';

const PackageSelectionModal: React.FC = memo(() => {
  const { selectedPackage, isModalOpen, closeModal } = usePackageSelection();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  if (!selectedPackage) return null;

  const renderPackageLayout = () => {
    const packageType = selectedPackage.type.toLowerCase();

    if (packageType.includes('custom')) {
      return (
        <CustomPackageLayoutContainer
          selectedPackage={selectedPackage as CustomPackage}
        />
      );
    } else {
      const adaptedPackage = {
        ...selectedPackage,
        type: packageType.includes('starter')
          ? ('starter' as const)
          : packageType.includes('growth')
            ? ('growth' as const)
            : packageType.includes('enterprise')
              ? ('enterprise' as const)
              : packageType.includes('premium')
                ? ('premium' as const)
                : ('starter' as const),
      };

      if (packageType.includes('starter')) {
        return <StarterPackageLayout selectedPackage={adaptedPackage} />;
      } else if (packageType.includes('growth')) {
        return <GrowthPackageLayout selectedPackage={adaptedPackage} />;
      } else if (packageType.includes('enterprise')) {
        return <EnterprisePackageLayout selectedPackage={adaptedPackage} />;
      } else if (packageType.includes('premium')) {
        return <PremiumPackageLayout selectedPackage={adaptedPackage} />;
      } else {
        console.warn(
          `Unknown package type: ${packageType}. Defaulting to Starter package layout.`
        );
        return <StarterPackageLayout selectedPackage={adaptedPackage} />;
      }
    }
  };

  console.log('Selected Package:', JSON.stringify(selectedPackage, null, 2));

  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      aria-modal="true"
      keepMounted={false}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
      disableEnforceFocus={false}
      disableAutoFocus={false}
    >
      <Box
        ref={modalRef}
        className={`${styles.modal} ${styles[`${selectedPackage.type}Modal`]}`}
        aria-labelledby="package-selection-modal-title"
        aria-describedby="package-selection-modal-description"
        role="dialog"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <Box
          className={styles.modalHeader}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            component="h2"
            fontWeight={600}
            id="package-selection-modal-title"
          >
            {selectedPackage.title || 'Package Selection'}
          </Typography>
          <IconButton
            onClick={closeModal}
            size="small"
            aria-label="Close modal"
            sx={{
              color: 'rgba(0, 0, 0, 0.54)',
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <div
          className={styles.modalContent}
          id="package-selection-modal-description"
        >
          {renderPackageLayout()}
        </div>
      </Box>
    </Modal>
  );
});

PackageSelectionModal.displayName = 'PackageSelectionModal';

const LazyPackageSelectionModal = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PackageSelectionModal />
  </Suspense>
);

export default LazyPackageSelectionModal;
