import React, { useEffect } from "react";
import styles from "./dashboardMain.module.css";
import ProductTableContainer from "../productTable/ProductTableContainer";
import { Box } from "@mui/material";
import { useSpinner } from "@/contexts/SpinnerContext";

interface DashboardMainProps {
  activeSection: string;
}

const DashboardMain: React.FC<DashboardMainProps> = ({ activeSection }) => {
  const { setLoading } = useSpinner();

  useEffect(() => {
    setLoading(false); 
  }, [activeSection, setLoading]);

  return (
    <div className={styles.container}>
      {activeSection === "dashboard" && (
        <Box>
          <h1>Dashboard</h1>
        </Box>
      )}

      {activeSection === "Products" && (
        <Box>
          {/* Render Products Table */}
          <ProductTableContainer />
        </Box>
      )}
    </div>
  );
};

export default DashboardMain;
