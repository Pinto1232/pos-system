'use client';

import React, { useEffect, useState, Suspense, lazy } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import { AuthContext } from '@/contexts/AuthContext';
import styles from './dashboardMain.module.css';
import { useSpinner } from '@/contexts/SpinnerContext';
import NotFound from '@/app/404';
import FeatureGuard from '../feature-access/FeatureGuard';
import { useTranslation } from 'react-i18next';
import RealTimeStockDemo from '../demo/RealTimeStockDemo';

const ProductTableContainer = lazy(
  () => import('../productTable/ProductTableContainer')
);
const AnalyticsCardContainer = lazy(
  () => import('../analyticsCard/AnalyticsCardContainer')
);
const SearchBarContainer = lazy(
  () => import('../searchBar/SearchBarContainer')
);
const FullOverviewContainer = lazy(
  () => import('../fullOverview/FullOverviewContainer')
);
const SaleTableContainer = lazy(() => import('../saleTable'));
const ProductEditContainer = lazy(
  () => import('../productEdit/ProductEditContainer')
);
const SalesContainer = lazy(() => import('../sales/containers/SalesContainer'));

const PricingPackagesClient = lazy(
  () => import('@/app/pricing-packages/PricingPackagesClient')
);

const ProductCategoriesContainer = lazy(
  () => import('../productCategories/ProductCategoriesContainer')
);

const StockLevelsAlertsContainer = lazy(
  () => import('../stockManagement/StockLevelsAlertsContainer')
);

const LowStockWarnings = lazy(
  () => import('../stockManagement/LowStockWarnings')
);

const BulkImportExportContainer = lazy(
  () => import('../bulkImportExport/BulkImportExportContainer')
);

const ProductExpiryTrackingContainer = lazy(
  () => import('../productExpiry/ProductExpiryTrackingContainer')
);

const InventoryAdjustmentsContainer = lazy(
  () => import('../inventoryAdjustments/InventoryAdjustmentsContainer')
);

interface DashboardMainProps {
  activeSection: string;
}

const DashboardMain: React.FC<DashboardMainProps> = ({ activeSection }) => {
  const { authenticated } = React.useContext(AuthContext);
  const { stopLoading } = useSpinner();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const [isDataLoaded, setIsDataLoaded] = useState(
    activeSection === 'Dashboard'
  );

  useEffect(() => {
    if (activeSection === 'Dashboard') {
      setIsDataLoaded(true);
      stopLoading();
      return;
    }

    const dataLoadingTimer = setTimeout(() => {
      setIsDataLoaded(true);
      stopLoading();
    }, 1500);

    return () => clearTimeout(dataLoadingTimer);
  }, [stopLoading, activeSection]);

  const renderSection = React.useCallback(() => {
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
                textAlign: isMobile ? 'center' : 'left',
                fontSize: isMobile ? '1.25rem' : '2.5rem',
                fontWeight: 600,
                mb: isMobile ? 2 : 3,
                px: isMobile ? 1 : 2,
              }}
            >
              {t('navigation.dashboard')}
            </Typography>

            <Box sx={{ mb: isMobile ? 2 : 3, width: '100%' }}>
              <Suspense
                fallback={
                  <Skeleton variant="rectangular" height={60} width="100%" />
                }
              >
                <SearchBarContainer />
              </Suspense>
            </Box>
            <Box sx={{ mb: isMobile ? 2 : 3, width: '100%' }}>
              <Suspense
                fallback={
                  <Skeleton variant="rectangular" height={300} width="100%" />
                }
              >
                <SalesContainer />
              </Suspense>
            </Box>
            <Box sx={{ mb: isMobile ? 2 : 3, width: '100%' }}>
              <Suspense
                fallback={
                  <Skeleton variant="rectangular" height={200} width="100%" />
                }
              >
                <AnalyticsCardContainer />
              </Suspense>
            </Box>
            <Box sx={{ mb: isMobile ? 2 : 3, width: '100%' }}>
              <Suspense
                fallback={
                  <Skeleton variant="rectangular" height={300} width="100%" />
                }
              >
                <LowStockWarnings />
              </Suspense>
            </Box>
            <Box sx={{ mb: isMobile ? 2 : 3, width: '100%' }}>
              <Suspense
                fallback={
                  <Skeleton variant="rectangular" height={200} width="100%" />
                }
              >
                <FullOverviewContainer />
              </Suspense>
            </Box>
            <Box sx={{ mb: isMobile ? 2 : 3, width: '100%' }}>
              <Suspense
                fallback={
                  <Skeleton variant="rectangular" height={400} width="100%" />
                }
              >
                <SaleTableContainer />
              </Suspense>
            </Box>
          </Box>
        );
        break;
      case 'Products List':
        sectionToRender = (
          <FeatureGuard featureName={t('products.productsList')}>
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
          </FeatureGuard>
        );
        break;
      case 'Add/Edit Product':
        sectionToRender = (
          <FeatureGuard featureName={t('products.addEditProduct')}>
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
          </FeatureGuard>
        );
        break;
      case 'Pricing Packages':
        sectionToRender = (
          <FeatureGuard featureName={t('sidebar.pricingPackages')}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                px: isMobile ? 1 : 2,
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                    }}
                  >
                    <Skeleton variant="rectangular" height={400} />
                  </Box>
                }
              >
                <PricingPackagesClient initialPackages={[]} />
              </Suspense>
            </Box>
          </FeatureGuard>
        );
        break;
      case 'Product Categories':
        sectionToRender = (
          <FeatureGuard featureName={t('sidebar.productCategories')}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                px: isMobile ? 1 : 2,
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                    }}
                  >
                    <Skeleton variant="rectangular" height={400} />
                  </Box>
                }
              >
                <ProductCategoriesContainer />
              </Suspense>
            </Box>
          </FeatureGuard>
        );
        break;
      case 'Stock Levels & Alerts':
        sectionToRender = (
          <FeatureGuard
            featureName={t(
              'sidebar.stockLevelsAlerts',
              'Stock Levels & Alerts'
            )}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                px: isMobile ? 1 : 2,
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      px: 2,
                    }}
                  >
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={60}
                      sx={{ mb: 2, mx: 'auto' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={200}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="rectangular" width="100%" height={400} />
                  </Box>
                }
              >
                <StockLevelsAlertsContainer />
              </Suspense>
            </Box>
          </FeatureGuard>
        );
        break;

      case 'Low Stock Warnings':
        sectionToRender = (
          <FeatureGuard
            featureName={t('stock.lowStockWarnings', 'Low Stock Warnings')}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                px: isMobile ? 1 : 2,
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      px: 2,
                    }}
                  >
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={60}
                      sx={{ mb: 2, mx: 'auto' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={300}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  </Box>
                }
              >
                <LowStockWarnings
                  showTitle={true}
                  compact={false}
                  maxItems={50}
                />
              </Suspense>
            </Box>
          </FeatureGuard>
        );
        break;

      case 'Real-Time Stock Demo':
        sectionToRender = (
          <Box
            sx={{
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              px: isMobile ? 1 : 2,
            }}
          >
            <RealTimeStockDemo key="real-time-stock-demo" />
          </Box>
        );
        break;
      case 'Bulk Import/Export':
        sectionToRender = (
          <FeatureGuard
            featureName={t('sidebar.bulkImportExport', 'Bulk Import/Export')}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                px: isMobile ? 1 : 2,
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      px: 2,
                    }}
                  >
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={60}
                      sx={{ mb: 2, mx: 'auto' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={300}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="rectangular" width="100%" height={400} />
                  </Box>
                }
              >
                <BulkImportExportContainer />
              </Suspense>
            </Box>
          </FeatureGuard>
        );
        break;
      case 'Product Expiry Tracking':
        sectionToRender = (
          <FeatureGuard
            featureName={t(
              'inventory.productExpiryTracking',
              'Product Expiry Tracking'
            )}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                px: isMobile ? 1 : 2,
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      px: 2,
                    }}
                  >
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={60}
                      sx={{ mb: 2, mx: 'auto' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={300}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="rectangular" width="100%" height={400} />
                  </Box>
                }
              >
                <ProductExpiryTrackingContainer />
              </Suspense>
            </Box>
          </FeatureGuard>
        );
        break;
      case 'Inventory Adjustments':
        sectionToRender = (
          <FeatureGuard
            featureName={t(
              'inventory.inventoryAdjustments',
              'Inventory Adjustments'
            )}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                px: isMobile ? 1 : 2,
              }}
            >
              <Suspense
                fallback={
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      px: 2,
                    }}
                  >
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={60}
                      sx={{ mb: 2, mx: 'auto' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={300}
                      sx={{ mb: 2 }}
                    />
                    <Skeleton variant="rectangular" width="100%" height={400} />
                  </Box>
                }
              >
                <InventoryAdjustmentsContainer />
              </Suspense>
            </Box>
          </FeatureGuard>
        );
        break;
      default:
        sectionToRender = <NotFound />;
    }

    return sectionToRender;
  }, [activeSection, isMobile, t]);

  if (!authenticated) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('dashboard.loginRequired', 'Please log in to view the dashboard')}
        </Typography>
      </Box>
    );
  }

  const isHomePage =
    typeof window !== 'undefined' && window.location.pathname === '/';

  if (isHomePage) {
    return <div className={styles.container}>{renderSection()}</div>;
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
              fontSize: isMobile ? '1.5rem' : '2.5rem',
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
