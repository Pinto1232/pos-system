'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { SalesContainer } from '../sales';
import { AuthContext } from '@/contexts/AuthContext';
import { sidebarItems } from '@/settings';
import styles from "./dashboardMain.module.css";
import ProductTableContainer from "../productTable/ProductTableContainer";
import { useSpinner } from "@/contexts/SpinnerContext";
import AnalyticsCardContainer from "../analyticsCard/AnalyticsCardContainer";
import SearchBarContainer from "../searchBar/SearchBarContainer";
import FullOverviewContainer from "../fullOverview/FullOverviewContainer";
import SaleTableContainer from "../saleTable";
import TransactionsContainer from "../transactionTable/TransactionsContainer";

const DashboardMain: React.FC = () => {
  const { authenticated } = React.useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('dashboard');
  const { setLoading } = useSpinner();

  const renderSection = () => {
    let sectionToRender;

    switch (activeSection) {
      case 'dashboard':
        sectionToRender = (
          <Box>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <SearchBarContainer />
            <SalesContainer />
            <AnalyticsCardContainer />
            <FullOverviewContainer />
            <SaleTableContainer />
            <TransactionsContainer />
          </Box>
        );
        break;
      case 'products':
        sectionToRender = (
          <Box>
            <ProductTableContainer />
          </Box>
        );
        break;
      default:
        sectionToRender = (
          <Box>
            <Typography variant="h4" gutterBottom>
              {activeSection}
            </Typography>
          </Box>
        );
    }

    return sectionToRender;
  };

  if (!authenticated) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Please log in to view the dashboard
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.container}>
      {renderSection()}
    </div>
  );
};

export default DashboardMain;
