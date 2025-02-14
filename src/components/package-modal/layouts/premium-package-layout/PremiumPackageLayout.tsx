import React from "react";
import styles from "./PremiumPackageLayout.module.css";

interface PremiumPackageLayoutProps {
  selectedPackage: { price: number }; // Replace with the actual type
}

const PremiumPackageLayout: React.FC<PremiumPackageLayoutProps> = ({ selectedPackage }) => {
  return (
    <div className={styles.premiumLayout}>
      <h1 className={styles.premiumTitle}>Premium Package</h1>
      <div className={styles.premiumPackageDetails}>Details about the premium package...</div>
      <div className={styles.premiumPrice}>${selectedPackage.price}</div>
      <button className={styles.premiumCheckoutButton}>Checkout</button>
    </div>
  );
};

export default PremiumPackageLayout;
