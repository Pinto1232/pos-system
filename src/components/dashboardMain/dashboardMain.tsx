'use client';

import React, {
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
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
import SalesContainer from '../sales/salesContainer';

interface DashboardMainProps {
  activeSection: string;
}

const DashboardMain: React.FC<
  DashboardMainProps
> = ({ activeSection }) => {
  const { authenticated } =
    React.useContext(AuthContext);
  const { stopLoading } = useSpinner();
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down('sm')
  );
  const [isDataLoaded, setIsDataLoaded] =
    useState(false);

  useEffect(() => {
    const dataLoadingTimer = setTimeout(() => {
      setIsDataLoaded(true);
      stopLoading();
    }, 1500);

    return () => clearTimeout(dataLoadingTimer);
  }, [stopLoading]);

  const renderSection = () => {
    let sectionToRender;

    switch (activeSection) {
      case 'Dashboard':
        sectionToRender = (
          <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            <Typography
              variant={isMobile ? 'h4' : 'h1'}
              color="#000"
              gutterBottom
              sx={{
                textAlign: isMobile
                  ? 'center'
                  : 'left',
                fontSize: isMobile
                  ? '1.25rem'
                  : '2.5rem',
                fontWeight: 600,
                mb: isMobile ? 2 : 3,
                px: isMobile ? 1 : 2,
              }}
            >
              Dashboard
            </Typography>
            <Box sx={{ mb: isMobile ? 2 : 3 }}>
              <SearchBarContainer />
            </Box>
            <Box sx={{ mb: isMobile ? 2 : 3 }}>
              <SalesContainer />
            </Box>
            <Box sx={{ mb: isMobile ? 2 : 3 }}>
              <AnalyticsCardContainer />
            </Box>
            <Box sx={{ mb: isMobile ? 2 : 3 }}>
              <FullOverviewContainer />
            </Box>
            <Box sx={{ mb: isMobile ? 2 : 3 }}>
              <SaleTableContainer />
            </Box>
          </Box>
        );
        break;
      case 'Products List':
        sectionToRender = (
          <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              px: isMobile ? 1 : 2,
            }}
          >
            <ProductTableContainer />
          </Box>
        );
        break;
      case 'Add/Edit Product':
        sectionToRender = (
          <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              px: isMobile ? 1 : 2,
            }}
          >
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
      {isDataLoaded ? (
        renderSection()
      ) : (
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            px: isMobile ? 1 : 2,
          }}
        >
          <Skeleton
            variant="text"
            sx={{
              fontSize: isMobile
                ? '1.5rem'
                : '2.5rem',
              width: isMobile ? '50%' : '30%',
              mb: 2,
            }}
          />
          <Skeleton
            variant="rectangular"
            height={isMobile ? 50 : 60}
            sx={{ mb: 2, borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            height={isMobile ? 200 : 300}
            sx={{ mb: 2, borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            height={isMobile ? 150 : 200}
            sx={{ mb: 2, borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            height={isMobile ? 150 : 200}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      )}
    </div>
  );
};

export default DashboardMain;
