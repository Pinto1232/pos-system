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
import NotFound from '@/app/404';
import ProductEditContainer from "../productEdit/ProductEditContainer";

interface DashboardMainProps {
  activeSection: string;
}

const DashboardMain: React.FC<DashboardMainProps> = ({ activeSection }) => {
  const { authenticated } = React.useContext(AuthContext);
  const { setLoading } = useSpinner();

  const renderSection = () => {
    let sectionToRender;

    switch (activeSection) {
      case 'Dashboard':
        sectionToRender = (
          <Box>
            <Typography variant="h4" color='#000' gutterBottom>
              Dashboard
            </Typography>
            <SearchBarContainer />
            <SalesContainer />
            <AnalyticsCardContainer />
            <FullOverviewContainer />
            <SaleTableContainer />
          </Box>
        );
        break;
      case 'Products List':
        sectionToRender = (
          <Box>
            <ProductTableContainer />
          </Box>
        );
        break;
      case 'Add/Edit Product':
        sectionToRender = (
          <Box>
            <ProductEditContainer />
          </Box>
        );
        break;

      default:
        sectionToRender = <NotFound />;
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
