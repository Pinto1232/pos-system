import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Product } from '../types';
import { getStockStatusBatch } from '@/utils/stockManagement';

interface StockSummaryProps {
  products: Product[];
  showProgress?: boolean;
}

interface StockSummaryData {
  outOfStock: number;
  lowStock: number;
  normal: number;
  highStock: number;
  total: number;
  totalValue: number;
}

const StockSummary: React.FC<StockSummaryProps> = ({
  products,
  showProgress = true,
}) => {
  const calculateSummary = (): StockSummaryData => {
    const stockMap = getStockStatusBatch(products);
    const summary = {
      outOfStock: 0,
      lowStock: 0,
      normal: 0,
      highStock: 0,
      total: products.length,
      totalValue: 0,
    };

    products.forEach((product) => {
      const stockLevel = stockMap.get(product.id);
      const stock = product.stock || 0;
      const price = product.price || 0;

      switch (stockLevel?.level) {
        case 'out_of_stock':
          summary.outOfStock++;
          break;
        case 'low_stock':
          summary.lowStock++;
          break;
        case 'normal':
          summary.normal++;
          break;
        case 'high_stock':
          summary.highStock++;
          break;
      }

      summary.totalValue += stock * price;
    });

    return summary;
  };

  const summary = calculateSummary();

  const getHealthPercentage = () => {
    if (summary.total === 0) return 100;
    return Math.round(
      ((summary.normal + summary.highStock) / summary.total) * 100
    );
  };

  const getHealthColor = () => {
    const percentage = getHealthPercentage();
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(value);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Stock Summary
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Tooltip title="Products with no stock remaining">
              <Chip
                icon={<ErrorIcon />}
                label={`${summary.outOfStock} Out of Stock`}
                color="error"
                variant={summary.outOfStock > 0 ? 'filled' : 'outlined'}
                sx={{ mb: 1, minWidth: 140 }}
              />
            </Tooltip>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {summary.total > 0
                ? Math.round((summary.outOfStock / summary.total) * 100)
                : 0}
              % of total
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Tooltip title="Products with low stock levels">
              <Chip
                icon={<WarningIcon />}
                label={`${summary.lowStock} Low Stock`}
                color="warning"
                variant={summary.lowStock > 0 ? 'filled' : 'outlined'}
                sx={{ mb: 1, minWidth: 140 }}
              />
            </Tooltip>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {summary.total > 0
                ? Math.round((summary.lowStock / summary.total) * 100)
                : 0}
              % of total
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Tooltip title="Products with adequate stock">
              <Chip
                icon={<CheckCircleIcon />}
                label={`${summary.normal} Normal Stock`}
                color="success"
                variant={summary.normal > 0 ? 'filled' : 'outlined'}
                sx={{ mb: 1, minWidth: 140 }}
              />
            </Tooltip>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {summary.total > 0
                ? Math.round((summary.normal / summary.total) * 100)
                : 0}
              % of total
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Tooltip title="Products with high stock levels">
              <Chip
                icon={<InfoIcon />}
                label={`${summary.highStock} High Stock`}
                color="info"
                variant={summary.highStock > 0 ? 'filled' : 'outlined'}
                sx={{ mb: 1, minWidth: 140 }}
              />
            </Tooltip>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {summary.total > 0
                ? Math.round((summary.highStock / summary.total) * 100)
                : 0}
              % of total
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {showProgress && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Overall Stock Health
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getHealthPercentage()}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getHealthPercentage()}
            color={getHealthColor()}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Total Products: <strong>{summary.total}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Inventory Value: <strong>{formatCurrency(summary.totalValue)}</strong>
        </Typography>
      </Box>
    </Paper>
  );
};

export default StockSummary;
