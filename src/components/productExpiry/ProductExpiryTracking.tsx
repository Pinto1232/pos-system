'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  TablePagination,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  ProductExpiry,
  ProductExpiryFormData,
  ExpiryFilters,
  ProductExpiryTrackingProps,
} from './types';

const mockProductExpiries: ProductExpiry[] = [
  {
    expiryId: 1,
    variantId: 1,
    productId: 1,
    batchNumber: 'BATCH001',
    expiryDate: '2024-12-31T00:00:00.000Z',
    isDeleted: false,
    isExpired: false,
    product: {
      productId: 1,
      name: 'Organic Milk',
      brand: 'FreshDairy',
      sku: 'FD-MILK-001',
    },
    productVariant: {
      variantId: 1,
      variantName: '1L Bottle',
      sku: 'FD-MILK-001-1L',
    },
  },
  {
    expiryId: 2,
    variantId: 2,
    productId: 2,
    batchNumber: 'BATCH002',
    expiryDate: '2024-12-25T00:00:00.000Z',
    isDeleted: false,
    isExpired: false,
    product: {
      productId: 2,
      name: 'Whole Wheat Bread',
      brand: 'BreadCo',
      sku: 'BC-BREAD-001',
    },
    productVariant: {
      variantId: 2,
      variantName: 'Standard Loaf',
      sku: 'BC-BREAD-001-STD',
    },
  },
  {
    expiryId: 3,
    variantId: 3,
    productId: 3,
    batchNumber: 'BATCH003',
    expiryDate: '2024-12-20T00:00:00.000Z',
    isDeleted: false,
    isExpired: true,
    product: {
      productId: 3,
      name: 'Greek Yogurt',
      brand: 'YogurtPlus',
      sku: 'YP-YOGURT-001',
    },
    productVariant: {
      variantId: 3,
      variantName: '500g Container',
      sku: 'YP-YOGURT-001-500G',
    },
  },
];

const ProductExpiryTracking: React.FC<ProductExpiryTrackingProps> = ({
  showTitle = true,
  compact = false,
  maxItems,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [expiries, setExpiries] = useState<ProductExpiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpiry, setEditingExpiry] = useState<ProductExpiry | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(compact ? 5 : 10);

  const [filters, setFilters] = useState<ExpiryFilters>({
    searchTerm: '',
    expiryStatus: 'all',
    sortBy: 'expiryDate',
    sortOrder: 'asc',
  });

  const [formData, setFormData] = useState<ProductExpiryFormData>({
    variantId: 0,
    productId: 0,
    batchNumber: '',
    expiryDate: '',
  });

  // Simulate API call
  useEffect(() => {
    const loadExpiries = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setExpiries(mockProductExpiries);
      } catch {
        setError('Failed to load product expiry data');
      } finally {
        setLoading(false);
      }
    };

    loadExpiries();
  }, []);

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = differenceInDays(expiry, today);

    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'error' as const, label: 'Expired' };
    } else if (daysUntilExpiry <= 7) {
      return {
        status: 'expiring-soon',
        color: 'warning' as const,
        label: 'Expires Soon',
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        status: 'expiring-month',
        color: 'info' as const,
        label: 'Expires This Month',
      };
    } else {
      return { status: 'fresh', color: 'success' as const, label: 'Fresh' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired':
        return <ErrorIcon fontSize="small" />;
      case 'expiring-soon':
        return <WarningIcon fontSize="small" />;
      case 'fresh':
        return <CheckCircleIcon fontSize="small" />;
      default:
        return <CheckCircleIcon fontSize="small" />;
    }
  };

  const filteredAndSortedExpiries = useMemo(() => {
    const filtered = expiries.filter((expiry) => {
      const matchesSearch =
        !filters.searchTerm ||
        expiry.product?.name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        expiry.batchNumber
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        expiry.product?.sku
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const { status } = getExpiryStatus(expiry.expiryDate);
      const matchesStatus =
        filters.expiryStatus === 'all' ||
        filters.expiryStatus === status ||
        (filters.expiryStatus === 'expiring-soon' &&
          (status === 'expiring-soon' || status === 'expiring-month'));

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case 'expiryDate':
          aValue = new Date(a.expiryDate).getTime();
          bValue = new Date(b.expiryDate).getTime();
          break;
        case 'batchNumber':
          aValue = a.batchNumber;
          bValue = b.batchNumber;
          break;
        case 'productName':
          aValue = a.product?.name || '';
          bValue = b.product?.name || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return maxItems ? filtered.slice(0, maxItems) : filtered;
  }, [expiries, filters, maxItems]);

  const handleOpenDialog = (expiry?: ProductExpiry) => {
    if (expiry) {
      setEditingExpiry(expiry);
      setFormData({
        variantId: expiry.variantId,
        productId: expiry.productId,
        batchNumber: expiry.batchNumber,
        expiryDate: expiry.expiryDate,
      });
    } else {
      setEditingExpiry(null);
      setFormData({
        variantId: 0,
        productId: 0,
        batchNumber: '',
        expiryDate: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpiry(null);
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingExpiry) {
        // Update existing
        setExpiries((prev) =>
          prev.map((exp) =>
            exp.expiryId === editingExpiry.expiryId
              ? { ...exp, ...formData }
              : exp
          )
        );
      } else {
        // Add new
        const newExpiry: ProductExpiry = {
          expiryId: Date.now(),
          ...formData,
          isDeleted: false,
          isExpired: new Date(formData.expiryDate) < new Date(),
          product: {
            productId: formData.productId,
            name: 'New Product',
            brand: 'Unknown',
            sku: 'NEW-PROD-001',
          },
        };
        setExpiries((prev) => [...prev, newExpiry]);
      }

      handleCloseDialog();
    } catch {
      setError('Failed to save product expiry');
    }
  };

  const handleDelete = async (expiryId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setExpiries((prev) => prev.filter((exp) => exp.expiryId !== expiryId));
    } catch {
      setError('Failed to delete product expiry');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setExpiries([...mockProductExpiries]);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        {showTitle && (
          <Skeleton
            variant="text"
            sx={{ fontSize: '2rem', mb: 2, width: '300px' }}
          />
        )}
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {showTitle && (
        <Typography variant="h4" component="h1" gutterBottom>
          {t('inventory.productExpiryTracking', 'Product Expiry Tracking')}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          mb: 3,
          alignItems: isMobile ? 'stretch' : 'center',
        }}
      >
        <TextField
          placeholder={t(
            'common.search',
            'Search products, SKU, or batch number...'
          )}
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, minWidth: 200 }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>{t('inventory.status', 'Status')}</InputLabel>
          <Select
            value={filters.expiryStatus}
            label={t('inventory.status', 'Status')}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                expiryStatus: e.target.value as ExpiryFilters['expiryStatus'],
              }))
            }
          >
            <MenuItem value="all">{t('common.all', 'All')}</MenuItem>
            <MenuItem value="expired">
              {t('inventory.expired', 'Expired')}
            </MenuItem>
            <MenuItem value="expiring-soon">
              {t('inventory.expiringSoon', 'Expiring Soon')}
            </MenuItem>
            <MenuItem value="fresh">{t('inventory.fresh', 'Fresh')}</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>{t('common.sortBy', 'Sort By')}</InputLabel>
          <Select
            value={filters.sortBy}
            label={t('common.sortBy', 'Sort By')}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as ExpiryFilters['sortBy'],
              }))
            }
          >
            <MenuItem value="expiryDate">
              {t('inventory.expiryDate', 'Expiry Date')}
            </MenuItem>
            <MenuItem value="productName">
              {t('inventory.productName', 'Product Name')}
            </MenuItem>
            <MenuItem value="batchNumber">
              {t('inventory.batchNumber', 'Batch Number')}
            </MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('common.refresh', 'Refresh')}>
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size={isMobile ? 'small' : 'medium'}
          >
            {t('inventory.addExpiry', 'Add Expiry')}
          </Button>
        </Box>
      </Box>

      {}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size={compact ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>{t('inventory.product', 'Product')}</TableCell>
              {!isMobile && (
                <TableCell>{t('inventory.variant', 'Variant')}</TableCell>
              )}
              <TableCell>{t('inventory.batchNumber', 'Batch #')}</TableCell>
              <TableCell>{t('inventory.expiryDate', 'Expiry Date')}</TableCell>
              <TableCell>{t('inventory.status', 'Status')}</TableCell>
              {!compact && (
                <TableCell align="center">
                  {t('common.actions', 'Actions')}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedExpiries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((expiry) => {
                const { status, color, label } = getExpiryStatus(
                  expiry.expiryDate
                );
                const daysUntilExpiry = differenceInDays(
                  new Date(expiry.expiryDate),
                  new Date()
                );

                return (
                  <TableRow key={expiry.expiryId}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {expiry.product?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {expiry.product?.sku}
                        </Typography>
                      </Box>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography variant="body2">
                          {expiry.productVariant?.variantName}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {expiry.batchNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {format(new Date(expiry.expiryDate), 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {daysUntilExpiry >= 0
                            ? `${daysUntilExpiry} days left`
                            : `${Math.abs(daysUntilExpiry)} days ago`}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(status)}
                        label={label}
                        color={color}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    {!compact && (
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'center',
                          }}
                        >
                          <Tooltip title={t('common.edit', 'Edit')}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(expiry)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete', 'Delete')}>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(expiry.expiryId)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {}
      {!maxItems && (
        <TablePagination
          component="div"
          count={filteredAndSortedExpiries.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}

      {}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingExpiry
            ? t('inventory.editProductExpiry', 'Edit Product Expiry')
            : t('inventory.addProductExpiry', 'Add Product Expiry')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('inventory.batchNumber', 'Batch Number')}
              value={formData.batchNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  batchNumber: e.target.value,
                }))
              }
              required
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('inventory.expiryDate', 'Expiry Date')}
                value={
                  formData.expiryDate ? new Date(formData.expiryDate) : null
                }
                onChange={(newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    expiryDate: newValue ? newValue.toISOString() : '',
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.batchNumber || !formData.expiryDate}
          >
            {t('common.save', 'Save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductExpiryTracking;
