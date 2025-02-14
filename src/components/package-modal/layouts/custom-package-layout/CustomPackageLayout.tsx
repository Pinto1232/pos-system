"use client";

import React from "react";
import { Typography, Button } from "@mui/material";
import styles from "./CustomPackageLayout.module.css";

interface CustomPackageLayoutProps {
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

const CustomPackageLayout: React.FC<CustomPackageLayoutProps> = ({ selectedPackage }) => {

  console.log('Custom Package Layout:', selectedPackage); 
  return (
    <div className={styles.customLayout}>
      <Typography variant="h5" className={styles.Customtitle}>
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
      <Button className={styles.checkoutButton}>Continue Customization</Button>
    </div>
  );
};

export default CustomPackageLayout;
