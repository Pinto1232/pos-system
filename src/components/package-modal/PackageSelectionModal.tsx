"use client";

import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import styles from "./PackageSelectionModal.module.css";
import { usePackageSelection } from "@/contexts/PackageSelectionContext";

const PackageSelectionModal: React.FC = () => {
  const { selectedPackage, isModalOpen, closeModal } = usePackageSelection();

  if (!selectedPackage) return null;

  const handleProceedToCheckout = () => {
    console.log(`Proceeding to checkout with package: ${selectedPackage.title}`);
    closeModal();
  };

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box className={`${styles.modal} ${styles[selectedPackage.type]}`}>
        <Typography variant="h5" className={styles.title}>
          {selectedPackage.type === "custom" ? "Customize Your Package" : "Review Your Package"}
        </Typography>

        <Typography className={styles.packageTitle}>{selectedPackage.title}</Typography>
        <Typography className={styles.packageDetails}>{selectedPackage.description}</Typography>
        <Typography className={styles.packagePrice}>${selectedPackage.price}/mo</Typography>

        {selectedPackage.type === "custom" && (
          <Typography className={styles.customInstructions}>
            Please ensure all selected modules match your business needs.
          </Typography>
        )}

        <Button onClick={handleProceedToCheckout} variant="contained" className={styles.checkoutButton}>
          {selectedPackage.type === "custom" ? "Proceed to Customization" : "Proceed to Checkout"}
        </Button>

        <Button onClick={closeModal} className={styles.cancelButton}>Cancel</Button>
      </Box>
    </Modal>
  );
};

export default PackageSelectionModal;
