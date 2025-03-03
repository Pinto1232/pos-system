"use client";

import React, { useState } from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import iconMap from "../../../../utils/icons";
import SuccessMessage from "../../../ui/success-message/SuccessMessage";
import styles from "./GrowthPackageLayout.module.css";

interface GrowthPackageLayoutProps {
  selectedPackage: {
    id: number;
    title: string;
    description: string;
    icon: string;
    extraDescription: string;
    price: number;
    testPeriodDays: number;
    type: "starter" | "growth" | "enterprise" | "custom" | "premium";
  };
}

const GrowthPackageLayout: React.FC<GrowthPackageLayoutProps> = ({
  selectedPackage,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const IconComponent = iconMap[selectedPackage.icon] || iconMap["MUI:DefaultIcon"];

  const handleSelectedGrowthPackage = async () => {
    setLoading(true);
    console.log("Selected package", selectedPackage);

    // Simulate backend call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setSuccess(true);
  };

  const handleCloseSuccessMessage = () => {
    setSuccess(false);
  };

  const handleConfirmSuccessMessage = (isSignup: boolean) => {
    console.log("Confirmed", isSignup);
    setSuccess(false);
  };

  const handleReturnSuccessMessage = () => {
    console.log("Return");
    setSuccess(false);
  };

  return (
    <Box className={styles.container}>
      
      {success && (
        <SuccessMessage
          open={success}
          onClose={handleCloseSuccessMessage}
          onConfirm={handleConfirmSuccessMessage}
          onReturn={handleReturnSuccessMessage}
        />
      )}
      {!loading && !success && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box className={styles.leftColumn}>
              {selectedPackage.icon && (
                <IconComponent className={styles.packageIcon} />
              )}
              <Typography variant="h6" className={styles.heading}>
                {selectedPackage.title}
              </Typography>

              <Typography variant="body1" className={styles.description}>
                {selectedPackage.description.replace(/[^\w\s.,!?]/g, '')}
              </Typography>

              <Typography variant="body2" className={styles.description}>
                {selectedPackage.extraDescription}
              </Typography>

              <Box className={styles.growthBox}>
                <Typography variant="subtitle2" className={styles.growthBoxLabel}>
                  YOUR TOTAL PREMIUMS
                </Typography>
                <Typography variant="h4" className={styles.growthBoxAmount}>
                  ${selectedPackage.price}/mo
                </Typography>
              </Box>

              <Typography
                variant="subtitle2"
                className={styles.testPeriod}
              >
                Test Period: {selectedPackage.testPeriodDays} days
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box className={styles.rightColumn}>
              <Typography variant="h6" className={styles.heading}>
                Package summary
              </Typography>

              <Typography variant="body2" className={styles.summaryItem}>
                Package Type: {selectedPackage.type}
              </Typography>

              <Typography variant="body2" className={styles.summaryItem}>
                Package ID: {selectedPackage.id}
              </Typography>

              <Typography variant="body2" className={styles.summaryItem}>
                Monthly Price: ${selectedPackage.price}
              </Typography>

              <Typography variant="body2" className={styles.summaryItem}>
                Test Period: {selectedPackage.testPeriodDays} days
              </Typography>

              <Button
                variant="contained"
                className={styles.continueButton}
                fullWidth
                onClick={handleSelectedGrowthPackage}
              >
                Upgrade Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default GrowthPackageLayout;
