'use client';

import React, { memo, Suspense } from 'react';
import { Modal, Box } from '@mui/material';
import styles from './PackageSelectionModal.module.css';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
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

    if (!selectedPackage) return null;

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
      >
        <Box
          className={`${styles.modal} ${styles[`${selectedPackage.type}Modal`]}`}
        >
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
