import React from "react";
import styles from "./dashboardMain.module.css";
import ProductTableContainer from "../productTable/ProductTableContainer";

export const DashboardMain: React.FC = () => {
  return (
    <div className={styles.container}>
      <ProductTableContainer />
    </div>
  );
};

export default DashboardMain;
