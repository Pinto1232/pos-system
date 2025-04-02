import React, { useEffect } from "react";
import styles from "./dashboardMain.module.css";
import ProductTableContainer from "../productTable/ProductTableContainer";
import { Box } from "@mui/material";
import { useSpinner } from "@/contexts/SpinnerContext";
import AnalyticsCardContainer from "../analyticsCard/AnalyticsCardContainer";
import SearchBarContainer from "../searchBar/SearchBarContainer";
import FullOverviewContainer from "../fullOverview/FullOverviewContainer";
import { SalesContainer } from "../sales";
import SaleTableContainer from "../saleTable";

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
          <SalesContainer
            imageUrl="/images/sales.jpg"
            title="Sales Overview"
            description="View your sales performance and analytics"
          />
          <AnalyticsCardContainer />
          <FullOverviewContainer />
          <SaleTableContainer />
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
