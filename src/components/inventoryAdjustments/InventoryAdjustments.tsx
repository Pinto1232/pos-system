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
  Grid,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  TrendingUp as IncreaseIcon,
  TrendingDown as DecreaseIcon,
  Settings as SetIcon,
  Warning as DamageIcon,
  QuestionMark as LossIcon,
  FindInPage as FoundIcon,
  Edit as CorrectionIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  InventoryAdjustment,
  InventoryAdjustmentFormData,
  AdjustmentFilters,
  InventoryAdjustmentsProps,
  AdjustmentReason,
} from './types';

const mockAdjustmentReasons: AdjustmentReason[] = [
  { id: 'damaged', label: 'Damaged Goods', type: ['damage'] },
  { id: 'expired', label: 'Expired Products', type: ['decrease'] },
  { id: 'theft', label: 'Theft/Loss', type: ['loss'] },
  { id: 'found', label: 'Found Items', type: ['found'] },
  { id: 'recount', label: 'Inventory Recount', type: ['correction'] },
  {
    id: 'supplier_adjustment',
    label: 'Supplier Adjustment',
    type: ['increase', 'decrease'],
  },
  {
    id: 'system_error',
    label: 'System Error Correction',
    type: ['correction'],
  },
  { id: 'promotion', label: 'Promotional Giveaway', type: ['decrease'] },
  { id: 'return_from_customer', label: 'Customer Return', type: ['increase'] },
  { id: 'transfer_in', label: 'Transfer In', type: ['increase'] },
  { id: 'transfer_out', label: 'Transfer Out', type: ['decrease'] },
];

const mockInventoryAdjustments: InventoryAdjustment[] = [
  {
    adjustmentId: 1,
    productId: 1,
    variantId: 1,
    adjustmentType: 'decrease',
    quantityBefore: 100,
    quantityAfter: 95,
    quantityAdjusted: -5,
    reason: 'Damaged Goods',
    notes: 'Items damaged during transport',
    adjustmentDate: '2024-12-20T10:30:00.000Z',
    createdBy: 1,
    batchNumber: 'BATCH001',
    location: 'Warehouse A',
    cost: 25.0,
    isApproved: true,
    approvedBy: 2,
    approvedAt: '2024-12-20T11:00:00.000Z',
    isDeleted: false,
    product: {
      productId: 1,
      name: 'Organic Milk',
      brand: 'FreshDairy',
      sku: 'FD-MILK-001',
      currentStock: 95,
    },
    productVariant: {
      variantId: 1,
      variantName: '1L Bottle',
      sku: 'FD-MILK-001-1L',
      currentStock: 95,
    },
    createdByUser: {
      userId: 1,
      username: 'john.doe',
      fullName: 'John Doe',
    },
    approvedByUser: {
      userId: 2,
      username: 'jane.smith',
      fullName: 'Jane Smith',
    },
  },
  {
    adjustmentId: 2,
    productId: 2,
    variantId: 2,
    adjustmentType: 'increase',
    quantityBefore: 50,
    quantityAfter: 75,
    quantityAdjusted: 25,
    reason: 'Found Items',
    notes: 'Items found during inventory check',
    adjustmentDate: '2024-12-19T14:15:00.000Z',
    createdBy: 3,
    isApproved: false,
    isDeleted: false,
    product: {
      productId: 2,
      name: 'Whole Wheat Bread',
      brand: 'BreadCo',
      sku: 'BC-BREAD-001',
      currentStock: 50,
    },
    productVariant: {
      variantId: 2,
      variantName: 'Standard Loaf',
      sku: 'BC-BREAD-001-STD',
      currentStock: 50,
    },
    createdByUser: {
      userId: 3,
      username: 'mike.wilson',
      fullName: 'Mike Wilson',
    },
  },
  {
    adjustmentId: 3,
    productId: 3,
    adjustmentType: 'correction',
    quantityBefore: 30,
    quantityAfter: 28,
    quantityAdjusted: -2,
    reason: 'Inventory Recount',
    notes: 'Correcting count after physical inventory',
    adjustmentDate: '2024-12-18T09:00:00.000Z',
    createdBy: 1,
    isApproved: true,
    approvedBy: 2,
    approvedAt: '2024-12-18T09:30:00.000Z',
    isDeleted: false,
    product: {
      productId: 3,
      name: 'Greek Yogurt',
      brand: 'YogurtPlus',
      sku: 'YP-YOGURT-001',
      currentStock: 28,
    },
    createdByUser: {
      userId: 1,
      username: 'john.doe',
      fullName: 'John Doe',
    },
    approvedByUser: {
      userId: 2,
      username: 'jane.smith',
      fullName: 'Jane Smith',
    },
  },
];

const InventoryAdjustments: React.FC<InventoryAdjustmentsProps> = ({
  showTitle = true,
  compact = false,
  maxItems,
  showApprovalActions = true,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAdjustment, setEditingAdjustment] =
    useState<InventoryAdjustment | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(compact ? 5 : 10);
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const [filters, setFilters] = useState<AdjustmentFilters>({
    searchTerm: '',
    adjustmentType: 'all',
    dateRange: {
      startDate: '',
      endDate: '',
    },
    approvalStatus: 'all',
    sortBy: 'adjustmentDate',
    sortOrder: 'desc',
  });

  const [formData, setFormData] = useState<InventoryAdjustmentFormData>({
    productId: 0,
    variantId: 0,
    adjustmentType: 'correction',
    quantity: 0,
    adjustmentMethod: 'adjust',
    reason: '',
    notes: '',
    batchNumber: '',
    location: '',
    cost: 0,
  });

  // Simulate API call
  useEffect(() => {
    const loadAdjustments = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAdjustments(mockInventoryAdjustments);
      } catch {
        setError('Failed to load inventory adjustments');
      } finally {
        setLoading(false);
      }
    };

    loadAdjustments();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setAdjustments([...mockInventoryAdjustments]);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getAdjustmentTypeIcon = (
    type: InventoryAdjustment['adjustmentType']
  ) => {
    switch (type) {
      case 'increase':
        return <IncreaseIcon fontSize="small" color="success" />;
      case 'decrease':
        return <DecreaseIcon fontSize="small" color="error" />;
      case 'set':
        return <SetIcon fontSize="small" color="info" />;
      case 'damage':
        return <DamageIcon fontSize="small" color="warning" />;
      case 'loss':
        return <LossIcon fontSize="small" color="error" />;
      case 'found':
        return <FoundIcon fontSize="small" color="success" />;
      case 'correction':
        return <CorrectionIcon fontSize="small" color="info" />;
      default:
        return <CorrectionIcon fontSize="small" />;
    }
  };

  const getAdjustmentTypeColor = (
    type: InventoryAdjustment['adjustmentType']
  ) => {
    switch (type) {
      case 'increase':
      case 'found':
        return 'success' as const;
      case 'decrease':
      case 'loss':
        return 'error' as const;
      case 'damage':
        return 'warning' as const;
      case 'set':
      case 'correction':
        return 'info' as const;
      default:
        return 'default' as const;
    }
  };

  const filteredAndSortedAdjustments = useMemo(() => {
    const filtered = adjustments.filter((adjustment) => {
      const matchesSearch =
        !filters.searchTerm ||
        adjustment.product?.name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        adjustment.product?.sku
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        adjustment.reason
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        adjustment.batchNumber
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesType =
        filters.adjustmentType === 'all' ||
        filters.adjustmentType === adjustment.adjustmentType;

      const matchesApproval =
        filters.approvalStatus === 'all' ||
        (filters.approvalStatus === 'approved' && adjustment.isApproved) ||
        (filters.approvalStatus === 'pending' && !adjustment.isApproved);

      const adjustmentDate = new Date(adjustment.adjustmentDate);
      const matchesDateRange =
        (!filters.dateRange.startDate ||
          adjustmentDate >= new Date(filters.dateRange.startDate)) &&
        (!filters.dateRange.endDate ||
          adjustmentDate <= new Date(filters.dateRange.endDate));

      return (
        matchesSearch && matchesType && matchesApproval && matchesDateRange
      );
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case 'adjustmentDate':
          aValue = new Date(a.adjustmentDate).getTime();
          bValue = new Date(b.adjustmentDate).getTime();
          break;
        case 'productName':
          aValue = a.product?.name || '';
          bValue = b.product?.name || '';
          break;
        case 'quantityAdjusted':
          aValue = Math.abs(a.quantityAdjusted);
          bValue = Math.abs(b.quantityAdjusted);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return maxItems ? filtered.slice(0, maxItems) : filtered;
  }, [adjustments, filters, maxItems]);

  const handleOpenDialog = (adjustment?: InventoryAdjustment) => {
    if (adjustment) {
      setEditingAdjustment(adjustment);
      setFormData({
        productId: adjustment.productId,
        variantId: adjustment.variantId || 0,
        adjustmentType: adjustment.adjustmentType,
        quantity: Math.abs(adjustment.quantityAdjusted),
        adjustmentMethod: 'adjust',
        reason: adjustment.reason,
        notes: adjustment.notes || '',
        batchNumber: adjustment.batchNumber || '',
        location: adjustment.location || '',
        cost: adjustment.cost || 0,
      });
    } else {
      setEditingAdjustment(null);
      setFormData({
        productId: 0,
        variantId: 0,
        adjustmentType: 'correction',
        quantity: 0,
        adjustmentMethod: 'adjust',
        reason: '',
        notes: '',
        batchNumber: '',
        location: '',
        cost: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAdjustment(null);
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingAdjustment) {
        // Update existing
        setAdjustments((prev) =>
          prev.map((adj) =>
            adj.adjustmentId === editingAdjustment.adjustmentId
              ? {
                  ...adj,
                  ...formData,
                  quantityAdjusted:
                    formData.adjustmentType === 'increase'
                      ? formData.quantity
                      : -formData.quantity,
                }
              : adj
          )
        );
      } else {
        const newAdjustment: InventoryAdjustment = {
          adjustmentId: Date.now(),
          ...formData,
          quantityBefore: 100,
          quantityAfter:
            formData.adjustmentMethod === 'set'
              ? formData.quantity
              : 100 +
                (formData.adjustmentType === 'increase'
                  ? formData.quantity
                  : -formData.quantity),
          quantityAdjusted:
            formData.adjustmentType === 'increase'
              ? formData.quantity
              : -formData.quantity,
          adjustmentDate: new Date().toISOString(),
          createdBy: 1,
          isApproved: false,
          isDeleted: false,
          product: {
            productId: formData.productId,
            name: 'New Product',
            brand: 'Unknown',
            sku: 'NEW-PROD-001',
            currentStock: 100,
          },
          createdByUser: {
            userId: 1,
            username: 'current.user',
            fullName: 'Current User',
          },
        };
        setAdjustments((prev) => [...prev, newAdjustment]);
      }

      handleCloseDialog();
    } catch {
      setError('Failed to save inventory adjustment');
    }
  };

  const handleApprove = async (adjustmentId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAdjustments((prev) =>
        prev.map((adj) =>
          adj.adjustmentId === adjustmentId
            ? {
                ...adj,
                isApproved: true,
                approvedBy: 2,
                approvedAt: new Date().toISOString(),
                approvedByUser: {
                  userId: 2,
                  username: 'current.approver',
                  fullName: 'Current Approver',
                },
              }
            : adj
        )
      );
    } catch {
      setError('Failed to approve adjustment');
    }
  };

  const handleDelete = async (adjustmentId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAdjustments((prev) =>
        prev.filter((adj) => adj.adjustmentId !== adjustmentId)
      );
    } catch {
      setError('Failed to delete adjustment');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setAdjustments([...mockInventoryAdjustments]);
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2 }}>
        {showTitle && (
          <Typography variant="h4" component="h1" gutterBottom>
            {t('inventory.inventoryAdjustments', 'Inventory Adjustments')}
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
              'Search products, SKU, reason, or batch...'
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
              endAdornment: filters.searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, searchTerm: '' }))
                    }
                    edge="end"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  size="small"
                />
              }
              label={t('common.autoRefresh', 'Auto Refresh')}
              sx={{ mr: 1 }}
            />
            <Tooltip title={t('common.showFilters', 'Show Filters')}>
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                color={showFilters ? 'primary' : 'default'}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
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
              {t('inventory.addAdjustment', 'Add Adjustment')}
            </Button>
          </Box>
        </Box>

        {}
        {showFilters && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('common.advancedFilters', 'Advanced Filters')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {t('inventory.adjustmentType', 'Adjustment Type')}
                    </InputLabel>
                    <Select
                      value={filters.adjustmentType}
                      label={t('inventory.adjustmentType', 'Adjustment Type')}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          adjustmentType: e.target
                            .value as AdjustmentFilters['adjustmentType'],
                        }))
                      }
                    >
                      <MenuItem value="all">{t('common.all', 'All')}</MenuItem>
                      <MenuItem value="increase">
                        {t('inventory.increase', 'Increase')}
                      </MenuItem>
                      <MenuItem value="decrease">
                        {t('inventory.decrease', 'Decrease')}
                      </MenuItem>
                      <MenuItem value="set">
                        {t('inventory.set', 'Set')}
                      </MenuItem>
                      <MenuItem value="damage">
                        {t('inventory.damage', 'Damage')}
                      </MenuItem>
                      <MenuItem value="loss">
                        {t('inventory.loss', 'Loss')}
                      </MenuItem>
                      <MenuItem value="found">
                        {t('inventory.found', 'Found')}
                      </MenuItem>
                      <MenuItem value="correction">
                        {t('inventory.correction', 'Correction')}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {t('inventory.approvalStatus', 'Approval Status')}
                    </InputLabel>
                    <Select
                      value={filters.approvalStatus}
                      label={t('inventory.approvalStatus', 'Approval Status')}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          approvalStatus: e.target
                            .value as AdjustmentFilters['approvalStatus'],
                        }))
                      }
                    >
                      <MenuItem value="all">{t('common.all', 'All')}</MenuItem>
                      <MenuItem value="pending">
                        {t('inventory.pending', 'Pending')}
                      </MenuItem>
                      <MenuItem value="approved">
                        {t('inventory.approved', 'Approved')}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label={t('common.startDate', 'Start Date')}
                    value={
                      filters.dateRange.startDate
                        ? parseISO(filters.dateRange.startDate)
                        : null
                    }
                    onChange={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          startDate: date ? date.toISOString() : '',
                        },
                      }))
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label={t('common.endDate', 'End Date')}
                    value={
                      filters.dateRange.endDate
                        ? parseISO(filters.dateRange.endDate)
                        : null
                    }
                    onChange={(date) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          endDate: date ? date.toISOString() : '',
                        },
                      }))
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        )}

        {/* Adjustments Table */}
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size={compact ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>{t('inventory.product', 'Product')}</TableCell>
                {!isMobile && (
                  <TableCell>{t('inventory.adjustmentType', 'Type')}</TableCell>
                )}
                <TableCell align="right">
                  {t('inventory.quantityAdjusted', 'Qty Adjusted')}
                </TableCell>
                <TableCell>{t('inventory.reason', 'Reason')}</TableCell>
                <TableCell>{t('inventory.adjustmentDate', 'Date')}</TableCell>
                <TableCell>{t('inventory.status', 'Status')}</TableCell>
                {!compact && (
                  <TableCell align="center">
                    {t('common.actions', 'Actions')}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedAdjustments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((adjustment) => (
                  <TableRow key={adjustment.adjustmentId}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {adjustment.product?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {adjustment.product?.sku}
                        </Typography>
                        {adjustment.productVariant && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {adjustment.productVariant.variantName}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {getAdjustmentTypeIcon(adjustment.adjustmentType)}
                          <Chip
                            label={adjustment.adjustmentType}
                            color={getAdjustmentTypeColor(
                              adjustment.adjustmentType
                            )}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color={
                          adjustment.quantityAdjusted > 0
                            ? 'success.main'
                            : 'error.main'
                        }
                      >
                        {adjustment.quantityAdjusted > 0 ? '+' : ''}
                        {adjustment.quantityAdjusted}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {adjustment.quantityBefore} → {adjustment.quantityAfter}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {adjustment.reason}
                      </Typography>
                      {adjustment.notes && (
                        <Typography variant="caption" color="text.secondary">
                          {adjustment.notes}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(
                          parseISO(adjustment.adjustmentDate),
                          'MMM dd, yyyy'
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(parseISO(adjustment.adjustmentDate), 'hh:mm a')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          adjustment.isApproved
                            ? t('inventory.approved', 'Approved')
                            : t('inventory.pending', 'Pending')
                        }
                        color={adjustment.isApproved ? 'success' : 'warning'}
                        size="small"
                      />
                      {adjustment.isApproved && adjustment.approvedByUser && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          by {adjustment.approvedByUser.fullName}
                        </Typography>
                      )}
                    </TableCell>
                    {!compact && (
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {showApprovalActions && !adjustment.isApproved && (
                            <Tooltip title={t('inventory.approve', 'Approve')}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() =>
                                  handleApprove(adjustment.adjustmentId)
                                }
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={t('common.edit', 'Edit')}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDialog(adjustment)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete', 'Delete')}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDelete(adjustment.adjustmentId)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {}
        <TablePagination
          rowsPerPageOptions={compact ? [5, 10] : [5, 10, 25, 50]}
          component="div"
          count={filteredAndSortedAdjustments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />

        {}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingAdjustment
              ? t('inventory.editAdjustment', 'Edit Adjustment')
              : t('inventory.addAdjustment', 'Add Adjustment')}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('inventory.productId', 'Product ID')}
                  type="number"
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      productId: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>
                    {t('inventory.adjustmentType', 'Adjustment Type')}
                  </InputLabel>
                  <Select
                    value={formData.adjustmentType}
                    label={t('inventory.adjustmentType', 'Adjustment Type')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        adjustmentType: e.target
                          .value as InventoryAdjustmentFormData['adjustmentType'],
                      }))
                    }
                  >
                    <MenuItem value="increase">
                      {t('inventory.increase', 'Increase')}
                    </MenuItem>
                    <MenuItem value="decrease">
                      {t('inventory.decrease', 'Decrease')}
                    </MenuItem>
                    <MenuItem value="set">{t('inventory.set', 'Set')}</MenuItem>
                    <MenuItem value="damage">
                      {t('inventory.damage', 'Damage')}
                    </MenuItem>
                    <MenuItem value="loss">
                      {t('inventory.loss', 'Loss')}
                    </MenuItem>
                    <MenuItem value="found">
                      {t('inventory.found', 'Found')}
                    </MenuItem>
                    <MenuItem value="correction">
                      {t('inventory.correction', 'Correction')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('inventory.quantity', 'Quantity')}
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>
                    {t('inventory.adjustmentMethod', 'Method')}
                  </InputLabel>
                  <Select
                    value={formData.adjustmentMethod}
                    label={t('inventory.adjustmentMethod', 'Method')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        adjustmentMethod: e.target
                          .value as InventoryAdjustmentFormData['adjustmentMethod'],
                      }))
                    }
                  >
                    <MenuItem value="adjust">
                      {t('inventory.adjust', 'Adjust (+/-)')}
                    </MenuItem>
                    <MenuItem value="set">
                      {t('inventory.setTo', 'Set To')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('inventory.reason', 'Reason')}</InputLabel>
                  <Select
                    value={formData.reason}
                    label={t('inventory.reason', 'Reason')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                  >
                    {mockAdjustmentReasons
                      .filter((reason) =>
                        reason.type.includes(formData.adjustmentType)
                      )
                      .map((reason) => (
                        <MenuItem key={reason.id} value={reason.label}>
                          {reason.label}
                        </MenuItem>
                      ))}
                    <MenuItem value="">
                      {t('inventory.customReason', 'Custom Reason')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {!mockAdjustmentReasons.some(
                (r) => r.label === formData.reason
              ) &&
                formData.reason !== '' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('inventory.customReason', 'Custom Reason')}
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      placeholder={t(
                        'inventory.enterCustomReason',
                        'Enter custom reason...'
                      )}
                    />
                  </Grid>
                )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('inventory.notes', 'Notes')}
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('inventory.batchNumber', 'Batch Number')}
                  value={formData.batchNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      batchNumber: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('inventory.location', 'Location')}
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleSave} variant="contained">
              {t('common.save', 'Save')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default InventoryAdjustments;
