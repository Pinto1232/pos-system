import React from "react";
import styles from "./dashboardMain.module.css";
import ProductTableContainer from "../productTable/ProductTableContainer";
import { Box } from "@mui/material";

export const DashboardMain: React.FC = () => {
  return (
    <div className={styles.container}>
      <Box>
        {/* Dashboard */}
      </Box>
      <Box>
        {/* Products */}
        <ProductTableContainer />
      </Box>
    </div>
  );
};

export default DashboardMain;
