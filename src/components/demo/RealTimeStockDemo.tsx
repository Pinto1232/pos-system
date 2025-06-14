import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Alert,
  Paper,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Skeleton,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Refresh,
  ShoppingCart as CartIcon,
  Inventory,
  Analytics,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalOffer,
  TrendingUp,
  Warning,
  CheckCircle,
  Close as CloseIcon,
  Timeline,
  Store,
  AttachMoney,
  Speed,
} from '@mui/icons-material';
import ShoppingCart from '@/components/cart/ShoppingCart';
import { Product } from '@/components/productEdit/types';
import { stockManager } from '@/utils/realTimeStockManager';
import { useRealTimeStockBatch } from '@/hooks/useRealTimeStock';

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
      id={`demo-tabpanel-${index}`}
      aria-labelledby={`demo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RealTimeStockDemo: React.FC = () => {
  console.log('RealTimeStockDemo component rendering...');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentTab, setCurrentTab] = useState(0);
  const [demoProducts, setDemoProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [simulationDialogOpen, setSimulationDialogOpen] = useState(false);
  const [simulationType, setSimulationType] = useState<
    'sale' | 'return' | 'restock'
  >('sale');
  const [simulationProduct, setSimulationProduct] = useState<number>(0);
  const [simulationQuantity, setSimulationQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info'
  >('success');
  const [isInitialized, setIsInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { stockData, refreshAllStockInfo } =
    useRealTimeStockBatch(selectedProducts);

  const stockMetrics = useMemo(() => {
    const totalValue = demoProducts.reduce(
      (sum, p) => sum + (p.price || 0) * (p.stock || 0),
      0
    );
    const lowStockCount = demoProducts.filter(
      (p) => (p.stock || 0) < 10
    ).length;
    const totalReservations = Array.from(stockData.values()).reduce(
      (sum, stock) => sum + stock.reservations.length,
      0
    );
    const totalReservedUnits = Array.from(stockData.values()).reduce(
      (sum, stock) => sum + stock.lockedQuantity,
      0
    );

    return {
      totalValue,
      lowStockCount,
      totalReservations,
      totalReservedUnits,
    };
  }, [demoProducts, stockData]);

  useEffect(() => {
    const initializeDemoData = async () => {
      setLoading(true);

      const products: Product[] = [
        {
          id: 1,
          productName: 'iPhone 14 Pro',
          color: 'Space Gray',
          barcode: 'IP14P-SG-128',
          sku: 'APL-IP14P-SG',
          price: 12999,
          stock: 45,
          status: true,
          rating: 4.8,
          createdAt: new Date().toISOString(),
          salesCount: 67,
          returnCount: 3,
          lastSoldDate: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          totalRevenue: 869933,
        },
        {
          id: 2,
          productName: 'Samsung Galaxy S23 Ultra',
          color: 'Black',
          barcode: 'SGS23U-B-256',
          sku: 'SAM-GS23U-B',
          price: 18999,
          stock: 23,
          status: true,
          rating: 4.7,
          createdAt: new Date().toISOString(),
          salesCount: 34,
          returnCount: 1,
          lastSoldDate: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          totalRevenue: 645966,
        },
        {
          id: 3,
          productName: 'MacBook Air M2',
          color: 'Silver',
          barcode: 'MBA-M2-S-512',
          sku: 'APL-MBA-M2-S',
          price: 21999,
          stock: 12,
          status: true,
          rating: 4.9,
          createdAt: new Date().toISOString(),
          salesCount: 18,
          returnCount: 0,
          lastSoldDate: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          totalRevenue: 395982,
        },
        {
          id: 4,
          productName: 'AirPods Pro 2',
          color: 'White',
          barcode: 'APP2-W',
          sku: 'APL-APP2-W',
          price: 3499,
          stock: 78,
          status: true,
          rating: 4.6,
          createdAt: new Date().toISOString(),
          salesCount: 124,
          returnCount: 8,
          lastSoldDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          totalRevenue: 433876,
        },
        {
          id: 5,
          productName: 'iPad Pro 11" M2',
          color: 'Space Gray',
          barcode: 'IPP11-M2-SG-128',
          sku: 'APL-IPP11-M2',
          price: 14999,
          stock: 5,
          status: true,
          rating: 4.8,
          createdAt: new Date().toISOString(),
          salesCount: 29,
          returnCount: 2,
          lastSoldDate: new Date(
            Date.now() - 4 * 24 * 60 * 60 * 1000
          ).toISOString(),
          totalRevenue: 434971,
        },
      ];

      setDemoProducts(products);
      setSelectedProducts(products.map((p) => p.id));
      localStorage.setItem('products', JSON.stringify(products));

      setIsInitialized(true);
      setLoading(false);

      setTimeout(() => {
        setSnackbarMessage('Demo data initialized successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }, 100);
    };

    initializeDemoData();
  }, []);

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue);
    },
    []
  );

  const handleAddToCart = useCallback((product: Product, quantity: number) => {
    setSnackbarMessage(`Added ${quantity}x ${product.productName} to cart`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    console.log(`Adding ${quantity} x ${product.productName} to cart`);
  }, []);

  const handleSimulation = useCallback(async () => {
    if (!simulationProduct || simulationQuantity <= 0) return;

    setLoading(true);

    try {
      const orderId = `SIM-${Date.now()}`;
      const productName =
        demoProducts.find((p) => p.id === simulationProduct)?.productName ||
        'Unknown';

      switch (simulationType) {
        case 'sale':
          await stockManager.processSale({
            productId: simulationProduct,
            quantity: simulationQuantity,
            orderId,
            timestamp: new Date(),
            unitPrice:
              demoProducts.find((p) => p.id === simulationProduct)?.price || 0,
            totalAmount:
              (demoProducts.find((p) => p.id === simulationProduct)?.price ||
                0) * simulationQuantity,
          });
          setSnackbarMessage(
            `Sale processed: ${simulationQuantity}x ${productName}`
          );
          break;
        case 'return':
          await stockManager.processReturn(
            simulationProduct,
            simulationQuantity,
            orderId
          );
          setSnackbarMessage(
            `Return processed: ${simulationQuantity}x ${productName}`
          );
          break;
        case 'restock':
          await stockManager.processReturn(
            simulationProduct,
            simulationQuantity,
            `RESTOCK-${Date.now()}`,
            'Inventory restock'
          );
          setSnackbarMessage(
            `Restock completed: ${simulationQuantity}x ${productName}`
          );
          break;
      }

      setSimulationDialogOpen(false);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      refreshAllStockInfo();
    } catch (error) {
      console.error('Simulation failed:', error);
      setSnackbarMessage('Simulation failed. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [
    simulationProduct,
    simulationQuantity,
    simulationType,
    demoProducts,
    refreshAllStockInfo,
  ]);

  const clearAllData = useCallback(() => {
    stockManager.clearAllData();
    refreshAllStockInfo();
    setSnackbarMessage('All stock management data has been cleared!');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  }, [refreshAllStockInfo]);

  const handleQuantityChange = useCallback(
    (productId: number, delta: number) => {
      setDemoProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) }
            : p
        )
      );
    },
    []
  );

  const getStockStatusColor = useCallback((stock: number) => {
    if (stock === 0) return 'error';
    if (stock < 10) return 'warning';
    return 'success';
  }, []);

  const getStockStatusIcon = useCallback((stock: number) => {
    if (stock === 0) return <Warning />;
    if (stock < 10) return <Warning />;
    return <CheckCircle />;
  }, []);

  if (!mounted) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ mb: 2 }}
        />
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {loading && !isInitialized ? (
        <Box>
          <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ mb: 2 }}
          />
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Box>
      ) : (
        <Fade in={!loading} timeout={150}>
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
              }}
            >
              <Stack
                direction={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems={isMobile ? 'flex-start' : 'center'}
                spacing={2}
              >
                <Box>
                  <Typography
                    variant={isSmallScreen ? 'h5' : 'h4'}
                    gutterBottom
                  >
                    📊 Real-Time Stock Management Demo
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Experience live stock synchronization and reservation
                    management
                  </Typography>
                </Box>
                <Stack direction={isMobile ? 'column' : 'row'} spacing={1}>
                  <Tooltip title="Refresh all stock data">
                    <Button
                      variant="contained"
                      size={isSmallScreen ? 'small' : 'medium'}
                      startIcon={<Refresh />}
                      onClick={refreshAllStockInfo}
                      disabled={loading}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.3)',
                        },
                      }}
                    >
                      Refresh
                    </Button>
                  </Tooltip>
                  <Button
                    variant="contained"
                    size={isSmallScreen ? 'small' : 'medium'}
                    startIcon={<Speed />}
                    onClick={() => setSimulationDialogOpen(true)}
                    disabled={loading}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    Simulate
                  </Button>
                  <Button
                    variant="text"
                    size={isSmallScreen ? 'small' : 'medium'}
                    onClick={clearAllData}
                    disabled={loading}
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Clear Data
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Store color="primary" />
                    <Typography variant="h6" color="primary">
                      {demoProducts.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Products
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <Stack alignItems="center" spacing={1}>
                    <AttachMoney color="success" />
                    <Typography variant="h6" color="success.main">
                      R{stockMetrics.totalValue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Badge
                      badgeContent={stockMetrics.lowStockCount}
                      color="error"
                    >
                      <Warning
                        color={
                          stockMetrics.lowStockCount > 0 ? 'warning' : 'action'
                        }
                      />
                    </Badge>
                    <Typography
                      variant="h6"
                      color={
                        stockMetrics.lowStockCount > 0
                          ? 'warning.main'
                          : 'text.primary'
                      }
                    >
                      {stockMetrics.lowStockCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low Stock
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <Stack alignItems="center" spacing={1}>
                    <Timeline color="info" />
                    <Typography variant="h6" color="info.main">
                      {stockMetrics.totalReservedUnits}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reserved
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            {}
            <Alert
              severity="info"
              sx={{
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
              }}
              icon={<Analytics />}
            >
              <Typography variant="body2">
                <strong>Demo Features:</strong> Real-time stock synchronization,
                automatic reservations, transaction simulation, and live data
                updates. Interact with the tabs below to explore all features.
              </Typography>
            </Alert>

            {}
            <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant={isMobile ? 'scrollable' : 'fullWidth'}
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 72,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                <Tab
                  icon={<Inventory />}
                  label="Stock Status"
                  iconPosition="start"
                  sx={{
                    flexDirection: 'row',
                    gap: 1,
                  }}
                />
                <Tab
                  icon={<CartIcon />}
                  label="Shopping Cart"
                  iconPosition="start"
                  sx={{
                    flexDirection: 'row',
                    gap: 1,
                  }}
                />
                <Tab
                  icon={<Analytics />}
                  label="Analytics"
                  iconPosition="start"
                  sx={{
                    flexDirection: 'row',
                    gap: 1,
                  }}
                />
              </Tabs>

              {loading && <LinearProgress />}

              <TabPanel value={currentTab} index={0}>
                <Grow in={currentTab === 0} timeout={500}>
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Inventory color="primary" />
                        Real-Time Stock Information
                      </Typography>
                      <Chip
                        label={`${demoProducts.length} Products`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Stack>

                    <Grid container spacing={3}>
                      {demoProducts.map((product, index) => {
                        const stockInfo = stockData.get(product.id);
                        const stockLevel =
                          stockInfo?.totalStock ?? product.stock ?? 0;
                        const available =
                          stockInfo?.availableQuantity ?? product.stock ?? 0;
                        const reserved = stockInfo?.lockedQuantity ?? 0;

                        return (
                          <Grid item xs={12} lg={6} key={product.id}>
                            <Grow in timeout={300 + index * 100}>
                              <Card
                                sx={{
                                  borderRadius: 3,
                                  border: `2px solid ${theme.palette.divider}`,
                                  '&:hover': {
                                    boxShadow: theme.shadows[8],
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.3s ease',
                                  },
                                }}
                              >
                                <CardContent>
                                  <Stack spacing={2}>
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="flex-start"
                                    >
                                      <Box>
                                        <Typography variant="h6" noWrap>
                                          {product.productName}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          SKU: {product.sku} • {product.color}
                                        </Typography>
                                      </Box>
                                      <Chip
                                        icon={getStockStatusIcon(stockLevel)}
                                        label={
                                          stockLevel > 0
                                            ? 'In Stock'
                                            : 'Out of Stock'
                                        }
                                        color={getStockStatusColor(stockLevel)}
                                        size="small"
                                      />
                                    </Stack>

                                    <Box>
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ mb: 1 }}
                                      >
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          Stock Level
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                        >
                                          {stockLevel} units
                                        </Typography>
                                      </Stack>
                                      <LinearProgress
                                        variant="determinate"
                                        value={Math.min(
                                          (stockLevel / 100) * 100,
                                          100
                                        )}
                                        color={getStockStatusColor(stockLevel)}
                                        sx={{ height: 8, borderRadius: 4 }}
                                      />
                                    </Box>

                                    <Grid container spacing={2}>
                                      <Grid item xs={4}>
                                        <Stack alignItems="center">
                                          <Typography
                                            variant="h6"
                                            color="success.main"
                                          >
                                            {available}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            Available
                                          </Typography>
                                        </Stack>
                                      </Grid>
                                      <Grid item xs={4}>
                                        <Stack alignItems="center">
                                          <Typography
                                            variant="h6"
                                            color="warning.main"
                                          >
                                            {reserved}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            Reserved
                                          </Typography>
                                        </Stack>
                                      </Grid>
                                      <Grid item xs={4}>
                                        <Stack alignItems="center">
                                          <Typography
                                            variant="h6"
                                            color="primary"
                                          >
                                            R
                                            {(
                                              product.price || 0
                                            ).toLocaleString()}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                          >
                                            Price
                                          </Typography>
                                        </Stack>
                                      </Grid>
                                    </Grid>

                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      justifyContent="center"
                                    >
                                      <Tooltip title="Decrease stock">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleQuantityChange(product.id, -1)
                                          }
                                          disabled={stockLevel <= 0}
                                          color="error"
                                        >
                                          <RemoveIcon />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Increase stock">
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleQuantityChange(product.id, 1)
                                          }
                                          color="success"
                                        >
                                          <AddIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Stack>
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Grow>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Grow>
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                <Grow in={currentTab === 1} timeout={500}>
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <CartIcon color="primary" />
                        Shopping Cart with Stock Reservations
                      </Typography>
                      <Chip
                        label="Live Reservations"
                        color="success"
                        variant="outlined"
                        size="small"
                        icon={<CheckCircle />}
                      />
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 2, borderRadius: 3, minHeight: 400 }}>
                          <ShoppingCart
                            userId={`DEMO-USER-${Date.now()}`}
                            onCheckout={(items) => {
                              console.log(
                                'Checkout completed with items:',
                                items
                              );
                              setSnackbarMessage(
                                `Order completed! ${items.length} items purchased.`
                              );
                              setSnackbarSeverity('success');
                              setSnackbarOpen(true);
                            }}
                          />
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                          <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <LocalOffer color="primary" />
                                Quick Add to Cart
                              </Typography>
                              <Stack spacing={2}>
                                {demoProducts.map((product) => {
                                  const stockInfo = stockData.get(product.id);
                                  const available =
                                    stockInfo?.availableQuantity ??
                                    product.stock ??
                                    0;

                                  return (
                                    <Button
                                      key={product.id}
                                      variant="outlined"
                                      fullWidth
                                      onClick={() =>
                                        handleAddToCart(product, 1)
                                      }
                                      startIcon={<CartIcon />}
                                      disabled={available <= 0}
                                      sx={{
                                        justifyContent: 'flex-start',
                                        textAlign: 'left',
                                        p: 1.5,
                                        borderRadius: 2,
                                      }}
                                    >
                                      <Stack sx={{ width: '100%' }}>
                                        <Typography variant="body2" noWrap>
                                          {product.productName}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          Available: {available} • R
                                          {(
                                            product.price || 0
                                          ).toLocaleString()}
                                        </Typography>
                                      </Stack>
                                    </Button>
                                  );
                                })}
                              </Stack>
                            </CardContent>
                          </Card>

                          <Card
                            sx={{
                              borderRadius: 3,
                              background:
                                'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            }}
                          >
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                💡 Cart Features
                              </Typography>
                              <Stack spacing={1}>
                                <Typography variant="body2">
                                  • Automatic stock reservation
                                </Typography>
                                <Typography variant="body2">
                                  • Real-time availability check
                                </Typography>
                                <Typography variant="body2">
                                  • Quantity validation
                                </Typography>
                                <Typography variant="body2">
                                  • Auto-release on timeout
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Grow>
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                <Grow in={currentTab === 2} timeout={500}>
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 3 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Analytics color="primary" />
                        Stock Analytics & Real-Time Data
                      </Typography>
                      <Chip
                        label="Live Data"
                        color="info"
                        variant="outlined"
                        size="small"
                        icon={<TrendingUp />}
                      />
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={8}>
                        <Card sx={{ borderRadius: 3, mb: 3 }}>
                          <CardContent>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <Timeline color="primary" />
                              Detailed Stock Summary
                            </Typography>
                            <Stack spacing={3}>
                              {demoProducts.map((product, index) => {
                                const stockInfo = stockData.get(product.id);
                                const totalStock =
                                  stockInfo?.totalStock ?? product.stock ?? 0;
                                const available =
                                  stockInfo?.availableQuantity ??
                                  product.stock ??
                                  0;
                                const reserved = stockInfo?.lockedQuantity ?? 0;
                                const utilizationRate =
                                  totalStock > 0
                                    ? ((totalStock - available) / totalStock) *
                                      100
                                    : 0;

                                return (
                                  <Grow
                                    in
                                    timeout={300 + index * 100}
                                    key={product.id}
                                  >
                                    <Paper
                                      sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        border: `1px solid ${theme.palette.divider}`,
                                      }}
                                    >
                                      <Stack spacing={2}>
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                          alignItems="center"
                                        >
                                          <Box>
                                            <Typography
                                              variant="subtitle1"
                                              fontWeight="bold"
                                            >
                                              {product.productName}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              {product.sku} • Rating: ⭐{' '}
                                              {product.rating}
                                            </Typography>
                                          </Box>
                                          <Stack alignItems="flex-end">
                                            <Typography
                                              variant="h6"
                                              color="primary"
                                            >
                                              R
                                              {(
                                                product.price || 0
                                              ).toLocaleString()}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                            >
                                              Unit Price
                                            </Typography>
                                          </Stack>
                                        </Stack>

                                        <Grid container spacing={2}>
                                          <Grid item xs={3}>
                                            <Stack
                                              alignItems="center"
                                              spacing={1}
                                            >
                                              <Typography
                                                variant="h5"
                                                color="primary"
                                              >
                                                {totalStock}
                                              </Typography>
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                textAlign="center"
                                              >
                                                Total Stock
                                              </Typography>
                                            </Stack>
                                          </Grid>
                                          <Grid item xs={3}>
                                            <Stack
                                              alignItems="center"
                                              spacing={1}
                                            >
                                              <Typography
                                                variant="h5"
                                                color="success.main"
                                              >
                                                {available}
                                              </Typography>
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                textAlign="center"
                                              >
                                                Available
                                              </Typography>
                                            </Stack>
                                          </Grid>
                                          <Grid item xs={3}>
                                            <Stack
                                              alignItems="center"
                                              spacing={1}
                                            >
                                              <Typography
                                                variant="h5"
                                                color="warning.main"
                                              >
                                                {reserved}
                                              </Typography>
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                textAlign="center"
                                              >
                                                Reserved
                                              </Typography>
                                            </Stack>
                                          </Grid>
                                          <Grid item xs={3}>
                                            <Stack
                                              alignItems="center"
                                              spacing={1}
                                            >
                                              <Typography
                                                variant="h5"
                                                color="info.main"
                                              >
                                                {utilizationRate.toFixed(0)}%
                                              </Typography>
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                textAlign="center"
                                              >
                                                Utilization
                                              </Typography>
                                            </Stack>
                                          </Grid>
                                        </Grid>

                                        <Box>
                                          <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{ mb: 1 }}
                                          >
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              Stock Utilization
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              fontWeight="bold"
                                            >
                                              {utilizationRate.toFixed(1)}%
                                            </Typography>
                                          </Stack>
                                          <LinearProgress
                                            variant="determinate"
                                            value={Math.min(
                                              utilizationRate,
                                              100
                                            )}
                                            color={
                                              utilizationRate > 80
                                                ? 'error'
                                                : utilizationRate > 50
                                                  ? 'warning'
                                                  : 'success'
                                            }
                                            sx={{ height: 8, borderRadius: 4 }}
                                          />
                                        </Box>

                                        <Grid container spacing={2}>
                                          <Grid item xs={6}>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              Sales: {product.salesCount} •
                                              Returns: {product.returnCount}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                              textAlign="right"
                                            >
                                              Revenue: R
                                              {(
                                                product.totalRevenue || 0
                                              ).toLocaleString()}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Stack>
                                    </Paper>
                                  </Grow>
                                );
                              })}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} lg={4}>
                        <Stack spacing={3}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              background:
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                            }}
                          >
                            <CardContent>
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Store />
                                System Overview
                              </Typography>
                              <Stack spacing={2}>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ opacity: 0.8 }}
                                  >
                                    Active Products
                                  </Typography>
                                  <Typography variant="h4">
                                    {demoProducts.length}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ opacity: 0.8 }}
                                  >
                                    Total Stock Value
                                  </Typography>
                                  <Typography variant="h5">
                                    R{stockMetrics.totalValue.toLocaleString()}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ opacity: 0.8 }}
                                  >
                                    Low Stock Alerts
                                  </Typography>
                                  <Typography
                                    variant="h5"
                                    color={
                                      stockMetrics.lowStockCount > 0
                                        ? '#ffeb3b'
                                        : 'inherit'
                                    }
                                  >
                                    {stockMetrics.lowStockCount}
                                  </Typography>
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>

                          <Card sx={{ borderRadius: 3 }}>
                            <CardContent>
                              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Timeline color="info" />
                                Real-Time Activity
                              </Typography>
                              <Stack spacing={2}>
                                <Box>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <Typography variant="body2">
                                      Active Reservations
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="bold"
                                      color="info.main"
                                    >
                                      {stockMetrics.totalReservations}
                                    </Typography>
                                  </Stack>
                                </Box>
                                <Box>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <Typography variant="body2">
                                      Reserved Units
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="bold"
                                      color="warning.main"
                                    >
                                      {stockMetrics.totalReservedUnits}
                                    </Typography>
                                  </Stack>
                                </Box>
                                <Box>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <Typography variant="body2">
                                      System Status
                                    </Typography>
                                    <Chip
                                      label="Online"
                                      color="success"
                                      size="small"
                                    />
                                  </Stack>
                                </Box>
                                <Box>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <Typography variant="body2">
                                      Last Updated
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {new Date().toLocaleTimeString()}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>

                          <Card sx={{ borderRadius: 3, background: '#f8f9fa' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                📈 Performance Metrics
                              </Typography>
                              <Stack spacing={1}>
                                <Typography variant="body2">
                                  • Average response time: <strong>0.2s</strong>
                                </Typography>
                                <Typography variant="body2">
                                  • Data sync rate: <strong>99.9%</strong>
                                </Typography>
                                <Typography variant="body2">
                                  • Reservation accuracy: <strong>100%</strong>
                                </Typography>
                                <Typography variant="body2">
                                  • System uptime: <strong>99.98%</strong>
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Grow>
              </TabPanel>
            </Paper>

            {}
            <Dialog
              open={simulationDialogOpen}
              onClose={() => setSimulationDialogOpen(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: { borderRadius: 3 },
              }}
            >
              <DialogTitle sx={{ pb: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="h6"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Speed color="primary" />
                    Simulate Stock Transaction
                  </Typography>
                  <IconButton
                    onClick={() => setSimulationDialogOpen(false)}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </DialogTitle>

              <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Test the real-time stock management system by simulating
                    different transaction types.
                  </Alert>

                  <FormControl fullWidth>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={simulationType}
                      onChange={(e) =>
                        setSimulationType(
                          e.target.value as 'sale' | 'return' | 'restock'
                        )
                      }
                      label="Transaction Type"
                    >
                      <MenuItem value="sale">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TrendingUp color="error" />
                          <Box>
                            <Typography>Sale</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Reduces stock quantity
                            </Typography>
                          </Box>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="return">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TrendingUp
                            color="success"
                            sx={{ transform: 'rotate(180deg)' }}
                          />
                          <Box>
                            <Typography>Return</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Increases stock quantity
                            </Typography>
                          </Box>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="restock">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AddIcon color="primary" />
                          <Box>
                            <Typography>Restock</Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Inventory replenishment
                            </Typography>
                          </Box>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={simulationProduct}
                      onChange={(e) =>
                        setSimulationProduct(e.target.value as number)
                      }
                      label="Product"
                    >
                      {demoProducts.map((product) => {
                        const stockInfo = stockData.get(product.id);
                        const currentStock =
                          stockInfo?.totalStock ?? product.stock ?? 0;
                        const available =
                          stockInfo?.availableQuantity ?? product.stock ?? 0;

                        return (
                          <MenuItem key={product.id} value={product.id}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ width: '100%' }}
                            >
                              <Box>
                                <Typography>{product.productName}</Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {product.sku} • R
                                  {(product.price || 0).toLocaleString()}
                                </Typography>
                              </Box>
                              <Stack alignItems="flex-end">
                                <Typography variant="body2" color="primary">
                                  Stock: {currentStock}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="success.main"
                                >
                                  Available: {available}
                                </Typography>
                              </Stack>
                            </Stack>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Quantity"
                    type="number"
                    value={simulationQuantity}
                    onChange={(e) =>
                      setSimulationQuantity(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    fullWidth
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                    helperText={`Enter the number of units for this ${simulationType}`}
                  />

                  {simulationProduct > 0 && (
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: 'background.neutral',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        Transaction Preview
                      </Typography>
                      {(() => {
                        const product = demoProducts.find(
                          (p) => p.id === simulationProduct
                        );
                        const stockInfo = stockData.get(simulationProduct);
                        const currentStock =
                          stockInfo?.totalStock ?? product?.stock ?? 0;
                        const newStock =
                          simulationType === 'sale'
                            ? Math.max(0, currentStock - simulationQuantity)
                            : currentStock + simulationQuantity;

                        return (
                          <Stack spacing={1}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography variant="body2">
                                Current Stock:
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {currentStock}
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography variant="body2">
                                After {simulationType}:
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color={
                                  newStock < currentStock
                                    ? 'error.main'
                                    : 'success.main'
                                }
                              >
                                {newStock}
                              </Typography>
                            </Stack>
                            {simulationType === 'sale' && (
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography variant="body2">
                                  Total Value:
                                </Typography>
                                <Typography
                                  variant="body2"
                                  fontWeight="bold"
                                  color="primary"
                                >
                                  R
                                  {(
                                    (product?.price || 0) * simulationQuantity
                                  ).toLocaleString()}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        );
                      })()}
                    </Paper>
                  )}
                </Stack>
              </DialogContent>

              <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                  onClick={() => setSimulationDialogOpen(false)}
                  color="inherit"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSimulation}
                  variant="contained"
                  disabled={!simulationProduct || loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Speed />
                  }
                  sx={{ minWidth: 140 }}
                >
                  {loading ? 'Processing...' : `Simulate ${simulationType}`}
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert
                onClose={() => setSnackbarOpen(false)}
                severity={snackbarSeverity}
                variant="filled"
                sx={{ borderRadius: 2 }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default RealTimeStockDemo;
