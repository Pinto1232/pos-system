'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  Refresh,
  NotificationImportant,
  Search,
} from '@mui/icons-material';
import { useProductContext } from '@/contexts/ProductContext';
import { Product } from '../productEdit/types';
import { useTranslation } from 'react-i18next';

interface StockAlert {
  id: string;
  productId: number;
  productName: string;
  alertType: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  currentStock: number;
  threshold: number;
  createdAt: Date;
}

interface StockLevel {
  productId: number;
  productName: string;
  currentStock: number;
  minThreshold: number;
  maxThreshold: number;
  status: 'optimal' | 'low' | 'critical' | 'out_of_stock' | 'overstock';
  lastUpdated: Date;
  category: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stock-tabpanel-${index}`}
      aria-labelledby={`stock-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StockLevelsAlertsContainer: React.FC = () => {
  const { products } = useProductContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alertsPage, setAlertsPage] = useState(0);
  const [alertsRowsPerPage, setAlertsRowsPerPage] = useState(5);

  const stockLevels = useMemo((): StockLevel[] => {
    return products.map((product: Product) => {
      const currentStock = Math.floor(Math.random() * 100);
      const minThreshold = Math.floor(Math.random() * 20) + 5;
      const maxThreshold = minThreshold + Math.floor(Math.random() * 50) + 20;

      let status: StockLevel['status'] = 'optimal';
      if (currentStock === 0) status = 'out_of_stock';
      else if (currentStock <= minThreshold * 0.5) status = 'critical';
      else if (currentStock <= minThreshold) status = 'low';
      else if (currentStock >= maxThreshold) status = 'overstock';

      return {
        productId: product.id,
        productName: product.productName,
        currentStock,
        minThreshold,
        maxThreshold,
        status,
        lastUpdated: new Date(),
        category: product.category || 'Uncategorized',
      };
    });
  }, [products]);

  const stockAlerts = useMemo((): StockAlert[] => {
    const alerts: StockAlert[] = [];

    stockLevels.forEach((level) => {
      if (level.status === 'out_of_stock') {
        alerts.push({
          id: `alert-${level.productId}-oos`,
          productId: level.productId,
          productName: level.productName,
          alertType: 'out_of_stock',
          severity: 'critical',
          message: 'Product is out of stock',
          currentStock: level.currentStock,
          threshold: level.minThreshold,
          createdAt: new Date(),
        });
      } else if (level.status === 'critical') {
        alerts.push({
          id: `alert-${level.productId}-critical`,
          productId: level.productId,
          productName: level.productName,
          alertType: 'low_stock',
          severity: 'high',
          message: `Stock critically low (${level.currentStock} units remaining)`,
          currentStock: level.currentStock,
          threshold: level.minThreshold,
          createdAt: new Date(),
        });
      } else if (level.status === 'low') {
        alerts.push({
          id: `alert-${level.productId}-low`,
          productId: level.productId,
          productName: level.productName,
          alertType: 'low_stock',
          severity: 'medium',
          message: `Stock running low (${level.currentStock} units remaining)`,
          currentStock: level.currentStock,
          threshold: level.minThreshold,
          createdAt: new Date(),
        });
      } else if (level.status === 'overstock') {
        alerts.push({
          id: `alert-${level.productId}-over`,
          productId: level.productId,
          productName: level.productName,
          alertType: 'overstock',
          severity: 'low',
          message: `Stock levels exceed maximum threshold`,
          currentStock: level.currentStock,
          threshold: level.maxThreshold,
          createdAt: new Date(),
        });
      }
    });

    return alerts;
  }, [stockLevels]);

  const filteredStockLevels = useMemo(() => {
    return stockLevels.filter((level) => {
      const matchesSearch = level.productName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'All' || level.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'All' || level.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [stockLevels, searchQuery, categoryFilter, statusFilter]);

  const categories = [
    'All',
    ...Array.from(new Set(stockLevels.map((level) => level.category))),
  ];
  const statuses = [
    'All',
    'optimal',
    'low',
    'critical',
    'out_of_stock',
    'overstock',
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (
    status: string
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'optimal':
        return 'success';
      case 'low':
        return 'warning';
      case 'critical':
        return 'error';
      case 'out_of_stock':
        return 'error';
      case 'overstock':
        return 'info';
      default:
        return 'default';
    }
  };

  const getSeverityColor = (
    severity: string
  ): 'info' | 'warning' | 'error' | 'default' => {
    switch (severity) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'out_of_stock':
        return <Error />;
      case 'low_stock':
        return <Warning />;
      case 'overstock':
        return <Info />;
      case 'expiring':
        return <NotificationImportant />;
      default:
        return <Info />;
    }
  };

  const stockSummary = useMemo(() => {
    const total = stockLevels.length;
    const critical = stockLevels.filter(
      (l) => l.status === 'critical' || l.status === 'out_of_stock'
    ).length;
    const low = stockLevels.filter((l) => l.status === 'low').length;
    const optimal = stockLevels.filter((l) => l.status === 'optimal').length;
    const overstock = stockLevels.filter(
      (l) => l.status === 'overstock'
    ).length;

    return { total, critical, low, optimal, overstock };
  }, [stockLevels]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
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
        {t('sidebar.stockLevelsAlerts', 'Stock Levels & Alerts')}
      </Typography>

      {}
      <Grid container spacing={2} sx={{ mb: 3, px: isMobile ? 1 : 2 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {stockSummary.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Products
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {stockSummary.critical}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Critical/Out of Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {stockSummary.low}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {stockSummary.optimal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Optimal Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        sx={{
          width: '100%',
          mx: isMobile ? 1 : 2,
          maxWidth: `calc(100% - ${isMobile ? 16 : 32}px)`,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="stock management tabs"
        >
          <Tab label="Stock Levels" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Alerts
                {stockAlerts.length > 0 && (
                  <Chip
                    label={stockAlerts.length}
                    size="small"
                    color="error"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {}
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <TextField
              label="Search products"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e: SelectChangeEvent) =>
                  setCategoryFilter(e.target.value)
                }
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e: SelectChangeEvent) =>
                  setStatusFilter(e.target.value)
                }
                label="Status"
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status
                      .replace('_', ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton size="small">
              <Refresh />
            </IconButton>
          </Stack>

          {}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Current Stock</TableCell>
                  <TableCell align="right">Min Threshold</TableCell>
                  <TableCell align="right">Max Threshold</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStockLevels
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((level) => (
                    <TableRow key={level.productId}>
                      <TableCell component="th" scope="row">
                        {level.productName}
                      </TableCell>
                      <TableCell>{level.category}</TableCell>
                      <TableCell align="right">{level.currentStock}</TableCell>
                      <TableCell align="right">{level.minThreshold}</TableCell>
                      <TableCell align="right">{level.maxThreshold}</TableCell>
                      <TableCell>
                        <Chip
                          label={level.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(level.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {level.lastUpdated.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStockLevels.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {stockAlerts.length === 0 ? (
            <Alert severity="success" icon={<CheckCircle />}>
              No active stock alerts. All products have optimal stock levels.
            </Alert>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Active Alerts ({stockAlerts.length})
              </Typography>

              <List>
                {stockAlerts
                  .slice(
                    alertsPage * alertsRowsPerPage,
                    alertsPage * alertsRowsPerPage + alertsRowsPerPage
                  )
                  .map((alert) => (
                    <ListItem key={alert.id} divider>
                      <ListItemIcon>
                        {getAlertIcon(alert.alertType)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography variant="subtitle1">
                              {alert.productName}
                            </Typography>
                            <Chip
                              label={alert.severity.toUpperCase()}
                              color={getSeverityColor(alert.severity)}
                              size="small"
                            />
                          </Stack>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              display="block"
                            >
                              {alert.message}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Created: {alert.createdAt.toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
              </List>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={stockAlerts.length}
                rowsPerPage={alertsRowsPerPage}
                page={alertsPage}
                onPageChange={(event, newPage) => setAlertsPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setAlertsRowsPerPage(parseInt(event.target.value, 10));
                  setAlertsPage(0);
                }}
              />
            </>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default StockLevelsAlertsContainer;
