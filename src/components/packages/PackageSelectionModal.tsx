'use client';

import React, { memo, Suspense } from 'react';
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

    // Don't render the modal at all when loading
    if (!selectedPackage || loading) return null;

    const renderPackageLayout = () => {
      switch (selectedPackage.type) {
        case 'custom':
          return (
            <CustomPackageLayoutContainer
              selectedPackage={
                selectedPackage as CustomPackage
              }
            />
          );

        case 'starter':
          return (
            <StarterPackageLayout
              selectedPackage={selectedPackage}
            />
          );
        case 'growth':
          return (
            <GrowthPackageLayout
              selectedPackage={selectedPackage}
            />
          );
        case 'enterprise':
          return (
            <EnterprisePackageLayout
              selectedPackage={selectedPackage}
            />
          );
        case 'premium':
          return (
            <PremiumPackageLayout
              selectedPackage={selectedPackage}
            />
          );
        default:
          return assertUnreachable(
            selectedPackage.type
          );
      }
    };

    const assertUnreachable = (
      x: never
    ): never => {
      throw new Error('Unexpected value: ' + x);
    };

    console.log(
      'Selected Package:',
      selectedPackage
    );

    return (
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        slotProps={{
          backdrop: {
            style: {
              backgroundColor:
                'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
      >
        <Box
          className={`${styles.modal} ${styles[`${selectedPackage.type}Modal`]}`}
          aria-labelledby="package-selection-modal-title"
          aria-describedby="package-selection-modal-description"
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
            >
              {selectedPackage.title ||
                'Package Selection'}
            </Typography>
            <IconButton
              onClick={closeModal}
              size="small"
              sx={{
                color: 'rgba(0, 0, 0, 0.54)',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <div className={styles.modalContent}>
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
