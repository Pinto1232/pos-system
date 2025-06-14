'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Alert,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Warning,
  Error,
  NotificationImportant,
  Inventory,
  Refresh,
  Settings,
  TrendingDown,
  ShoppingCart,
  Email,
  Visibility,
} from '@mui/icons-material';
import { useProductContext } from '@/contexts/ProductContext';
import { Product } from '../productEdit/types';
import { useTranslation } from 'react-i18next';

interface LowStockItem {
  id: number;
  productName: string;
  currentStock: number;
  minThreshold: number;
  reorderPoint: number;
  reorderQuantity: number;
  status: 'low' | 'critical' | 'out_of_stock';
  category: string;
  lastUpdated: Date;

  salesVelocity: number;
  daysUntilOutOfStock: number;
  stockValue: number;
  urgencyScore: number;
  supplierName?: string;
  lastRestockDate?: Date;
  avgDailySales: number;
}

interface LowStockWarningsProps {
  maxItems?: number;
  showTitle?: boolean;
  compact?: boolean;
}

const LowStockWarnings: React.FC<LowStockWarningsProps> = ({
  maxItems = 10,
  showTitle = true,
  compact = false,
}) => {
  const { products } = useProductContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const lowStockItems = useMemo((): LowStockItem[] => {
    const items: LowStockItem[] = [];

    products.forEach((product: Product) => {
      const currentStock = Math.floor(Math.random() * 50);
      const minThreshold = Math.floor(Math.random() * 20) + 5;
      const reorderPoint = Math.floor(minThreshold * 1.5);
      const reorderQuantity = Math.floor(minThreshold * 3);

      const avgDailySales = Math.floor(Math.random() * 8) + 1;
      const salesVelocity = avgDailySales;
      const daysUntilOutOfStock =
        currentStock > 0 ? Math.floor(currentStock / avgDailySales) : 0;
      const stockValue = currentStock * product.price;

      let urgencyScore = 0;
      if (currentStock === 0) urgencyScore = 100;
      else if (currentStock <= minThreshold * 0.3) urgencyScore = 90;
      else if (currentStock <= minThreshold * 0.5) urgencyScore = 75;
      else if (currentStock <= minThreshold) urgencyScore = 50;

      if (salesVelocity > 5) urgencyScore += 10;
      if (daysUntilOutOfStock <= 3) urgencyScore += 15;

      urgencyScore = Math.min(urgencyScore, 100);

      let status: 'low' | 'critical' | 'out_of_stock' = 'low';

      if (currentStock === 0) {
        status = 'out_of_stock';
      } else if (
        currentStock <= minThreshold * 0.5 ||
        daysUntilOutOfStock <= 3
      ) {
        status = 'critical';
      } else if (currentStock <= minThreshold) {
        status = 'low';
      } else {
        return;
      }

      const suppliers = [
        'ABC Supply Co.',
        'Global Distributors',
        'Local Supplier',
        'Premium Goods Inc.',
        'Fast Stock Ltd.',
      ];
      const supplierName =
        suppliers[Math.floor(Math.random() * suppliers.length)];

      const lastRestockDate = new Date();
      lastRestockDate.setDate(
        lastRestockDate.getDate() - Math.floor(Math.random() * 30)
      );

      items.push({
        id: product.id,
        productName: product.productName,
        currentStock,
        minThreshold,
        reorderPoint,
        reorderQuantity,
        status,
        category: product.category || 'Uncategorized',
        lastUpdated: new Date(),
        salesVelocity,
        daysUntilOutOfStock,
        stockValue,
        urgencyScore,
        supplierName,
        lastRestockDate,
        avgDailySales,
      });
    });

    return items
      .sort((a, b) => {
        if (a.urgencyScore !== b.urgencyScore) {
          return b.urgencyScore - a.urgencyScore;
        }

        const statusOrder = { out_of_stock: 3, critical: 2, low: 1 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[b.status] - statusOrder[a.status];
        }

        return a.daysUntilOutOfStock - b.daysUntilOutOfStock;
      })
      .slice(0, maxItems);
  }, [products, maxItems]);

  const getStatusColor = (status: string): 'warning' | 'error' => {
    switch (status) {
      case 'critical':
      case 'out_of_stock':
        return 'error';
      case 'low':
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'out_of_stock':
        return <Error color="error" />;
      case 'critical':
        return <Warning color="error" />;
      case 'low':
        return <NotificationImportant color="warning" />;
      default:
        return <Warning color="warning" />;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'out_of_stock':
        return 'Out of Stock';
      case 'critical':
        return 'Critical';
      case 'low':
        return 'Low Stock';
      default:
        return 'Low Stock';
    }
  };

  const criticalCount = lowStockItems.filter(
    (item) => item.status === 'critical' || item.status === 'out_of_stock'
  ).length;
  const lowCount = lowStockItems.filter((item) => item.status === 'low').length;
  const totalStockValue = lowStockItems.reduce(
    (sum, item) => sum + item.stockValue,
    0
  );
  const highUrgencyCount = lowStockItems.filter(
    (item) => item.urgencyScore >= 80
  ).length;
  const runningOutSoon = lowStockItems.filter(
    (item) => item.daysUntilOutOfStock <= 7
  ).length;

  if (lowStockItems.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          {showTitle && !compact && (
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Inventory color="success" />
              {t('stock.lowStockWarnings', 'Low Stock Warnings')}
            </Typography>
          )}
          <Alert severity="success" sx={{ mt: compact ? 0 : 2 }}>
            All products have adequate stock levels!
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ pb: compact ? 1 : 2 }}>
        {showTitle && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant={compact ? 'subtitle1' : 'h6'}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <TrendingDown color="warning" />
              {t('stock.lowStockWarnings', 'Low Stock Warnings')}
              <Chip
                label={lowStockItems.length}
                size="small"
                color="warning"
                sx={{ height: 20, fontSize: '0.75rem' }}
              />
            </Typography>
            {!compact && (
              <Stack direction="row" spacing={1}>
                <Tooltip title="Refresh">
                  <IconButton size="small">
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Settings">
                  <IconButton size="small">
                    <Settings />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Box>
        )}

        {}
        {!compact && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  p: 1,
                  bgcolor: 'error.light',
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="error.contrastText"
                  fontWeight="bold"
                >
                  {criticalCount}
                </Typography>
                <Typography variant="caption" color="error.contrastText">
                  Critical/Out of Stock
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  p: 1,
                  bgcolor: 'warning.light',
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="warning.contrastText"
                  fontWeight="bold"
                >
                  {lowCount}
                </Typography>
                <Typography variant="caption" color="warning.contrastText">
                  Low Stock
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  p: 1,
                  bgcolor: 'info.light',
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="info.contrastText"
                  fontWeight="bold"
                >
                  {runningOutSoon}
                </Typography>
                <Typography variant="caption" color="info.contrastText">
                  Out in 7 Days
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Box
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  p: 1,
                  bgcolor: 'success.light',
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="success.contrastText"
                  fontWeight="bold"
                >
                  ${totalStockValue.toFixed(0)}
                </Typography>
                <Typography variant="caption" color="success.contrastText">
                  Total Stock Value
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  p: 1,
                  bgcolor: 'secondary.light',
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="secondary.contrastText"
                  fontWeight="bold"
                >
                  {highUrgencyCount}
                </Typography>
                <Typography variant="caption" color="secondary.contrastText">
                  High Priority
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {}
        <List
          dense={compact}
          sx={{ maxHeight: compact ? 300 : 400, overflow: 'auto' }}
        >
          {lowStockItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem
                sx={{
                  px: compact ? 1 : 2,
                  py: compact ? 0.5 : 1,
                  bgcolor:
                    item.status === 'out_of_stock'
                      ? 'error.light'
                      : item.status === 'critical'
                        ? 'warning.light'
                        : 'background.default',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: compact ? 30 : 40 }}>
                  {getStatusIcon(item.status)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Stack
                      direction={isMobile ? 'column' : 'row'}
                      spacing={1}
                      alignItems={isMobile ? 'flex-start' : 'center'}
                    >
                      <Typography
                        variant={compact ? 'body2' : 'subtitle2'}
                        fontWeight="medium"
                        sx={{ flex: 1 }}
                      >
                        {item.productName}
                      </Typography>
                      <Chip
                        label={getStatusText(item.status)}
                        color={getStatusColor(item.status)}
                        size="small"
                        sx={{
                          height: compact ? 18 : 20,
                          fontSize: compact ? '0.7rem' : '0.75rem',
                        }}
                      />
                    </Stack>
                  }
                  secondary={
                    <Box component="div">
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          Stock:{' '}
                          <strong
                            style={{
                              color:
                                item.currentStock === 0
                                  ? theme.palette.error.main
                                  : theme.palette.text.primary,
                            }}
                          >
                            {item.currentStock}
                          </strong>
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          Min: <strong>{item.minThreshold}</strong>
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          Reorder: <strong>{item.reorderQuantity}</strong>
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          Value: <strong>${item.stockValue.toFixed(2)}</strong>
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {item.daysUntilOutOfStock <= 7 ? (
                            <span style={{ color: theme.palette.error.main }}>
                              <strong>
                                {item.daysUntilOutOfStock} days left
                              </strong>
                            </span>
                          ) : (
                            `${item.daysUntilOutOfStock} days left`
                          )}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          Velocity: <strong>{item.salesVelocity}/day</strong>
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          Supplier: <strong>{item.supplierName}</strong>
                        </Typography>
                        <Chip
                          label={`${item.urgencyScore}% Urgent`}
                          size="small"
                          color={
                            item.urgencyScore >= 80
                              ? 'error'
                              : item.urgencyScore >= 60
                                ? 'warning'
                                : 'default'
                          }
                          sx={{ height: 16, fontSize: '0.65rem' }}
                        />
                      </Box>
                    </Box>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                />
                {!compact && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      ml: 1,
                    }}
                  >
                    <Tooltip title={`Reorder ${item.reorderQuantity} units`}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          console.log(
                            `Reordering ${item.reorderQuantity} units of ${item.productName}`
                          );
                        }}
                      >
                        <ShoppingCart fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Contact Supplier">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => {
                          console.log(
                            `Contacting supplier ${item.supplierName} for ${item.productName}`
                          );
                        }}
                      >
                        <Email fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => {
                          console.log(
                            `Viewing details for ${item.productName}`
                          );
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </ListItem>
              {index < lowStockItems.length - 1 && !compact && (
                <Divider sx={{ my: 0.5 }} />
              )}
            </React.Fragment>
          ))}
        </List>

        {}
        {!compact && lowStockItems.length > 0 && (
          <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption" color="text.secondary">
                Showing {lowStockItems.length} of {lowStockItems.length} items
              </Typography>
              <Button size="small" variant="outlined">
                View All Stock Levels
              </Button>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockWarnings;
