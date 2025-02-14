"use client";

import React from "react";
import { Modal, Box } from "@mui/material";
import styles from "./PackageSelectionModal.module.css";
import { usePackageSelection } from "@/contexts/PackageSelectionContext";

import CustomPackageLayout from "@/components/package-modal/layouts/custom-package-layout/CustomPackageLayout";
import StarterPackageLayout from "@/components/package-modal/layouts/starter-package-layout/StarterPackageLayout";
import GrowthPackageLayout from "@/components/package-modal/layouts/growth-package-layout/GrowthPackageLayout";
import EnterprisePackageLayout from "@/components/package-modal/layouts/enterprise-package-layout/EnterprisePackageLayout";

const PackageSelectionModal: React.FC = () => {
  const { selectedPackage, isModalOpen, closeModal } = usePackageSelection();

  if (!selectedPackage) return null;

  const renderPackageLayout = () => {
    switch (selectedPackage.type) {
      case "custom":
        return <CustomPackageLayout selectedPackage={selectedPackage} />;
      case "starter":
        return <StarterPackageLayout selectedPackage={selectedPackage} />;
      case "growth":
        return <GrowthPackageLayout selectedPackage={selectedPackage} />;
      case "enterprise":
        return <EnterprisePackageLayout selectedPackage={selectedPackage} />;
      default:
        console.warn("Unknown package type:", selectedPackage.type);
        return null;
    }
  };

  console.log('🪟 Modal open state:', isModalOpen);
  console.log('📦 Selected package:', selectedPackage?.type);

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box className={`${styles.modal} ${styles[`${selectedPackage.type}Modal`]}`}>
        <div className={styles.modalContent}>
          {renderPackageLayout()}
        </div>
      </Box>
    </Modal>
  );
};

export default PackageSelectionModal;
