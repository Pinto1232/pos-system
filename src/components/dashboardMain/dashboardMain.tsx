'use client';

import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { AuthContext } from '@/contexts/AuthContext';
import styles from './dashboardMain.module.css';
import ProductTableContainer from '../productTable/ProductTableContainer';
import { useSpinner } from '@/contexts/SpinnerContext';
import AnalyticsCardContainer from '../analyticsCard/AnalyticsCardContainer';
import SearchBarContainer from '../searchBar/SearchBarContainer';
import FullOverviewContainer from '../fullOverview/FullOverviewContainer';
import SaleTableContainer from '../saleTable';
import NotFound from '@/app/404';
import ProductEditContainer from '../productEdit/ProductEditContainer';
import SalesContainer from '../sales/SalesContainer';

interface DashboardMainProps {
  activeSection: string;
}

const DashboardMain: React.FC<DashboardMainProps> = ({ activeSection }) => {
  const { authenticated } = React.useContext(AuthContext);
  useSpinner();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderSection = () => {
    let sectionToRender;

    switch (activeSection) {
      case 'Dashboard':
        sectionToRender = (
          <Box>
            <Typography
              variant={isMobile ? 'h4' : 'h1'}
              color="#000"
              gutterBottom
              sx={{
                textAlign: isMobile ? 'center' : 'left',
                fontSize: isMobile ? '1rem' : '2.5rem',
                fontWeight: 600,
              }}
            >
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

  return <div className={styles.container}>{renderSection()}</div>;
};

export default DashboardMain;
