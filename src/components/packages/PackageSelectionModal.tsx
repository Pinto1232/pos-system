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
  const modalRef = useRef<HTMLDialogElement>(null);

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

  const getPackageTypeFromString = (
    packageType: string
  ): 'starter' | 'growth' | 'enterprise' | 'premium' => {
    if (packageType.includes('starter')) return 'starter';
    if (packageType.includes('growth')) return 'growth';
    if (packageType.includes('enterprise')) return 'enterprise';
    if (packageType.includes('premium')) return 'premium';
    return 'starter';
  };

  const renderPackageLayout = () => {
    const packageType = selectedPackage.type.toLowerCase();

    if (packageType.includes('custom')) {
      return (
        <CustomPackageLayoutContainer
          selectedPackage={selectedPackage as CustomPackage}
        />
      );
    }

    const normalizedType = getPackageTypeFromString(packageType);
    const adaptedPackage = {
      ...selectedPackage,
      type: normalizedType,
    };

    switch (normalizedType) {
      case 'starter':
        return <StarterPackageLayout selectedPackage={adaptedPackage} />;
      case 'growth':
        return <GrowthPackageLayout selectedPackage={adaptedPackage} />;
      case 'enterprise':
        return <EnterprisePackageLayout selectedPackage={adaptedPackage} />;
      case 'premium':
        return <PremiumPackageLayout selectedPackage={adaptedPackage} />;
      default:
        console.warn(
          `Unknown package type: ${packageType}. Defaulting to Starter package layout.`
        );
        return <StarterPackageLayout selectedPackage={adaptedPackage} />;
    }
  };

  console.log('Selected Package:', JSON.stringify(selectedPackage, null, 2));

  const modalClassName = `${styles.modal} ${styles[selectedPackage.type + 'Modal']}`;

  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      aria-modal="true"
      keepMounted={false}
      onKeyDown={handleKeyDown}
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
      <dialog
        ref={modalRef}
        className={modalClassName}
        aria-labelledby="package-selection-modal-title"
        aria-describedby="package-selection-modal-description"
        tabIndex={-1}
        open={isModalOpen}
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
      </dialog>
    </Modal>
  );
});

PackageSelectionModal.displayName = 'PackageSelectionModal';

const LazyPackageSelectionModal = () => (
  <Suspense
    fallback={
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          fontSize: '16px',
          color: '#666',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px',
            }}
          />
          Preparing package...
        </div>
        <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    }
  >
    <PackageSelectionModal />
  </Suspense>
);

export default LazyPackageSelectionModal;
