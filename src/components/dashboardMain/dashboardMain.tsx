import React, { useEffect } from "react";
import styles from "./dashboardMain.module.css";
import ProductTableContainer from "../productTable/ProductTableContainer";
import { Box } from "@mui/material";
import { useSpinner } from "@/contexts/SpinnerContext";
import AnalyticsCardContainer from "../analyticsCard/AnalyticsCardContainer";
import SearchBarContainer from "../searchBar/SearchBarContainer";
import FullOverviewContainer from "../fullOverview/FullOverviewContainer";
import TransactionsContainer from "../transactionTable/TransactionsContainer";

interface DashboardMainProps {
  activeSection: string;
}

const DashboardMain: React.FC<DashboardMainProps> = ({ activeSection = "Dashboard" }) => {
  const { setLoading } = useSpinner();

  useEffect(() => {
    setLoading(false);
  }, [activeSection, setLoading]);

  const sectionToRender = activeSection || "Dashboard";

  return (
    <div className={styles.container}>
      {sectionToRender === "Dashboard" && (
        <Box>
          <SearchBarContainer />
          <AnalyticsCardContainer />
          <FullOverviewContainer />
          <TransactionsContainer />
        </Box>
      )}

      {sectionToRender === "Products" && (
        <Box>
          <ProductTableContainer />
        </Box>
      )}
    </div>
  );
};

export default DashboardMain;
