"use client";

import React from "react";
import { Typography, Button } from "@mui/material";
import styles from "./EnterprisePackageLayout.module.css";

interface EnterprisePackageLayoutProps {
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

const EnterprisePackageLayout: React.FC<EnterprisePackageLayoutProps> = ({ selectedPackage }) => {
  return (
    <div className={styles.enterpriseLayout}>
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
      <Button className={styles.checkoutButton}>Contact Sales</Button>
    </div>
  );
};

export default EnterprisePackageLayout;
