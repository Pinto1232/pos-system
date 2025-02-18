"use client";

import React from "react";
import { Modal, Box } from "@mui/material";
import styles from "./PackageSelectionModal.module.css";
import { usePackageSelection } from "@/contexts/PackageSelectionContext";

// Import the container component instead of the layout directly
import { Package as CustomPackage } from "@/components/package-modal/layouts/custom-package-layout/types";
import CustomPackageLayoutContainer from "@/components/package-modal/layouts/custom-package-layout/CustomPackageLayoutContainer";
import StarterPackageLayout from "@/components/package-modal/layouts/starter-package-layout/StarterPackageLayout";
import GrowthPackageLayout from "@/components/package-modal/layouts/growth-package-layout/GrowthPackageLayout";
import EnterprisePackageLayout from "@/components/package-modal/layouts/enterprise-package-layout/EnterprisePackageLayout";
import PremiumPackageLayout from "./layouts/premium-package-layout/PremiumPackageLayout";

const PackageSelectionModal: React.FC = () => {
  const { selectedPackage, isModalOpen, closeModal } = usePackageSelection();

  if (!selectedPackage) return null;

  const renderPackageLayout = () => {
    switch (selectedPackage.type) {
      case "custom":
        return (
          <CustomPackageLayoutContainer
            selectedPackage={selectedPackage as CustomPackage}
          />
        );

      case "starter":
        return <StarterPackageLayout selectedPackage={selectedPackage} />;
      case "growth":
        return <GrowthPackageLayout selectedPackage={selectedPackage} />;
      case "enterprise":
        return <EnterprisePackageLayout selectedPackage={selectedPackage} />;
      case "premium":
        return <PremiumPackageLayout selectedPackage={selectedPackage} />;
      default:
        return assertUnreachable(selectedPackage.type);
    }
  };

  const assertUnreachable = (x: never): never => {
    throw new Error("Unexpected value: " + x);
  };

  console.log("Selected Package:", selectedPackage);

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
