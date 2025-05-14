'use client';

import React, { memo, Suspense, useRef, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './PackageSelectionModal.module.css';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { useSpinner } from '@/contexts/SpinnerContext';
import { Package as CustomPackage } from '@/components/packages/custom-package-layout/types';
import CustomPackageLayoutContainer from '@/components/packages/custom-package-layout/CustomPackageLayoutContainer';
import StarterPackageLayout from '@/components/packages/starter-package-layout/StarterPackageLayout';
import GrowthPackageLayout from '@/components/packages/growth-package-layout/GrowthPackageLayout';
import EnterprisePackageLayout from '@/components/packages/enterprise-package-layout/EnterprisePackageLayout';
import PremiumPackageLayout from './premium-package-layout/PremiumPackageLayout';

const PackageSelectionModal: React.FC = memo(
  () => {
    const {
      selectedPackage,
      isModalOpen,
      closeModal,
    } = usePackageSelection();
    const { loading } = useSpinner();
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus the modal content when it opens
    useEffect(() => {
      if (isModalOpen && modalRef.current) {
        modalRef.current.focus();
      }
    }, [isModalOpen]);

    // Handle keyboard events for accessibility
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    // Don't render the modal at all when loading
    if (!selectedPackage || loading) return null;

    const renderPackageLayout = () => {
      const packageType = selectedPackage.type.toLowerCase();

      // Handle new package types based on their prefix
      if (packageType.includes('custom')) {
        return (
          <CustomPackageLayoutContainer
            selectedPackage={
              selectedPackage as CustomPackage
            }
          />
        );
      } else if (packageType.includes('starter')) {
        return (
          <StarterPackageLayout
            selectedPackage={selectedPackage}
          />
        );
      } else if (packageType.includes('growth')) {
        return (
          <GrowthPackageLayout
            selectedPackage={selectedPackage}
          />
        );
      } else if (packageType.includes('enterprise')) {
        return (
          <EnterprisePackageLayout
            selectedPackage={selectedPackage}
          />
        );
      } else if (packageType.includes('premium')) {
        return (
          <PremiumPackageLayout
            selectedPackage={selectedPackage}
          />
        );
      } else {
        console.warn(`Unknown package type: ${packageType}. Defaulting to Starter package layout.`);
        return (
          <StarterPackageLayout
            selectedPackage={selectedPackage}
          />
        );
      }
    };

    console.log(
      'Selected Package:',
      selectedPackage
    );

    return (
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-modal="true"
        keepMounted={false}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor:
                'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
        // Let the Modal handle focus management
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
              {selectedPackage.title ||
                'Package Selection'}
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
  }
);

PackageSelectionModal.displayName =
  'PackageSelectionModal';

const LazyPackageSelectionModal = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PackageSelectionModal />
  </Suspense>
);

export default LazyPackageSelectionModal;
