"use client";

import React from "react";
import { Typography, Button } from "@mui/material";
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
    type: "starter" | "growth" | "enterprise" | "custom";
  };
}

const GrowthPackageLayout: React.FC<GrowthPackageLayoutProps> = ({ selectedPackage }) => {
  return (
    <div className={styles.growthLayout}>
      <Typography variant="h5" className={styles.title}>
        {selectedPackage.title}
      </Typography>
      <Typography className={styles.packageDetails}>
        {selectedPackage.description}
      </Typography>
      <Typography className={styles.packageDetails}>
        {selectedPackage.extraDescription}
      </Typography>
      <Typography className={styles.packagePrice}>
        ${selectedPackage.price}/mo
      </Typography>
      <Typography className={styles.packageDetails}>
        Test Period: {selectedPackage.testPeriodDays} days
      </Typography>
      <Button className={styles.checkoutButton}>Upgrade Now</Button>
    </div>
  );
};

export default GrowthPackageLayout;
