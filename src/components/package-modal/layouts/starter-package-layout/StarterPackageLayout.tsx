"use client";

import React from "react";
import { Typography, Button } from "@mui/material";
import styles from "./StarterPackageLayout.module.css";

interface StarterPackageLayoutProps {
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

const StarterPackageLayout: React.FC<StarterPackageLayoutProps> = ({ selectedPackage }) => {
  return (
    <div className={styles.starterLayout}>
      <Typography variant="h5" className={styles.starterTitle}>
        {selectedPackage.title}
      </Typography>
      <Typography className={styles.starterPackageDetails}>
        {selectedPackage.description}
      </Typography>
      <Typography className={styles.starterPackageDetails}>
        {selectedPackage.extraDescription}
      </Typography>
      <Typography className={styles.starterPrice}>
        ${selectedPackage.price}/mo
      </Typography>
      <Typography className={styles.starterPackageDetails}>
        Test Period: {selectedPackage.testPeriodDays} days
      </Typography>
      <Button className={styles.starterCheckoutButton}>Get Started</Button>
    </div>
  );
};

export default StarterPackageLayout;
