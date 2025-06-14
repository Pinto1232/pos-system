import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Stack,
  Box,
  Rating,
  FormControlLabel,
  Switch,
  IconButton,
  Chip,
  Tooltip,
  Badge,
} from '@mui/material';
import { FiEye, FiTrash2, FiShoppingCart, FiLock } from 'react-icons/fi';
import { Product } from '../types';
import { getColorStyles } from '@/utils/colorUtils';
import { productImageStyles, statusTextStyles, switchStyles } from '../styles';
import { renderProductImage } from '../utils';
import StockWarning from './StockWarning';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { getStockLevel } from '@/utils/stockManagement';
import { useRealTimeStock } from '@/hooks/useRealTimeStock';

interface ProductTableRowProps {
  product: Product;
  index: number;
  onView: (product: Product) => void;
  onStatusToggle: (product: Product) => void;
  onDeleteProduct?: (product: Product) => Promise<void>;
  onAddToCart?: (product: Product, quantity: number) => void;
  showStockWarnings?: boolean;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  index,
  onView,
  onStatusToggle,
  onDeleteProduct,
  onAddToCart,
  showStockWarnings = true,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { stockInfo } = useRealTimeStock(product.id);

  const currentStock = stockInfo?.totalStock ?? product.stock ?? 0;
  const availableStock = stockInfo?.availableQuantity ?? currentStock;
  const lockedStock = stockInfo?.lockedQuantity ?? 0;
  const stockLevel = getStockLevel(currentStock);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (product: Product) => {
    if (onDeleteProduct) {
      await onDeleteProduct(product);
    }
    setDeleteDialogOpen(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && availableStock > 0) {
      onAddToCart(product, 1);
    }
  };

  return (
    <>
      <TableRow
        key={product.id || index}
        hover
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#F8F9FA',
          },
          '& td': {
            borderBottom: '1px solid #E0E0E0',
            color: '#1E2A3B',
            fontSize: { xs: '12px', sm: '14px' },
            padding: { xs: '12px 8px', sm: '16px 12px', md: '16px' },
            verticalAlign: 'top',
          },
        }}
      >
        <TableCell sx={{ minWidth: 200, maxWidth: 250 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={productImageStyles}>
              {renderProductImage(
                product.image,
                product.productName || '',
                40,
                40
              )}
            </Box>
            <Stack
              direction="column"
              spacing={0.5}
              sx={{ minWidth: 0, flex: 1 }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                {product.productName}
              </Typography>
              {product.color && (
                <Chip
                  label={product.color}
                  size="small"
                  sx={{
                    height: 18,
                    minWidth: 50,
                    maxWidth: 80,
                    padding: '1px 3px',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    bgcolor: getColorStyles(product.color).bg,
                    color: getColorStyles(product.color).text,
                    border: '1px solid #e2e8f0',
                    '& .MuiChip-label': {
                      padding: '0 4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  }}
                />
              )}
            </Stack>
          </Stack>
        </TableCell>
        <TableCell sx={{ minWidth: 120, maxWidth: 150 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}
          >
            {product.barcode || 'N/A'}
          </Typography>
        </TableCell>
        <TableCell sx={{ minWidth: 100, maxWidth: 120 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}
          >
            {product.sku || '-'}
          </Typography>
        </TableCell>
        <TableCell sx={{ minWidth: 100, maxWidth: 120 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#1E2A3B',
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
            }}
          >
            R{(product.price || 0).toFixed(2)}
          </Typography>
        </TableCell>
        <TableCell sx={{ minWidth: 120, maxWidth: 150 }}>
          <Stack direction="column" spacing={1} alignItems="flex-start">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color:
                    stockLevel.level === 'out_of_stock' ? '#f44336' : '#1E2A3B',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                }}
              >
                {currentStock} units
              </Typography>
              {lockedStock > 0 && (
                <Tooltip title={`${lockedStock} units reserved`}>
                  <Badge badgeContent={lockedStock} color="warning" max={999}>
                    <FiLock size={14} />
                  </Badge>
                </Tooltip>
              )}
            </Stack>
            <Typography
              variant="caption"
              sx={{
                color: availableStock > 0 ? '#059669' : '#f44336',
                fontSize: '0.7rem',
              }}
            >
              {availableStock} available
            </Typography>
            {showStockWarnings && (
              <StockWarning
                stockLevel={stockLevel}
                variant="chip"
                size="small"
              />
            )}
          </Stack>
        </TableCell>
        <TableCell sx={{ minWidth: 120, maxWidth: 150 }}>
          <Stack direction="column" spacing={1} alignItems="flex-start">
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#1E2A3B',
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
              }}
            >
              {product.salesCount || 0} sales
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontSize: '0.7rem',
              }}
            >
              {product.returnCount || 0} returns
            </Typography>
          </Stack>
        </TableCell>
        <TableCell sx={{ minWidth: 130, maxWidth: 150 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: product.lastSoldDate ? '#1E2A3B' : '#94a3b8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}
          >
            {product.lastSoldDate
              ? new Date(product.lastSoldDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Never sold'}
          </Typography>
        </TableCell>
        <TableCell sx={{ minWidth: 130, maxWidth: 150 }}>
          <FormControlLabel
            control={
              <Switch
                checked={product.status ?? false}
                onChange={(e) => {
                  e.stopPropagation();
                  onStatusToggle(product);
                }}
                sx={switchStyles}
                size="small"
              />
            }
            label={
              <Typography sx={statusTextStyles(product.status ?? false)}>
                {product.status ? 'Available' : 'Unavailable'}
              </Typography>
            }
            onClick={(e) => e.stopPropagation()}
          />
        </TableCell>
        <TableCell sx={{ minWidth: 120, maxWidth: 150 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Rating
              value={product.rating || 0}
              readOnly
              precision={0.5}
              size="small"
              sx={{
                color: '#f59e0b',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                color: '#64748b',
                fontSize: '0.75rem',
              }}
            >
              ({product.rating || 0})
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ minWidth: 120, maxWidth: 150 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}
          >
            {product.createdAt
              ? new Date(product.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '-'}
          </Typography>
        </TableCell>
        <TableCell sx={{ minWidth: 120, maxWidth: 140 }}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(
                  'ProductTable - View icon clicked for product:',
                  JSON.stringify(product.productName, null, 2)
                );
                onView(product);
              }}
              sx={{
                color: '#3b82f6',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '8px',
                '&:hover': {
                  backgroundColor: '#f0f2f5',
                  borderColor: '#3b82f6',
                },
              }}
            >
              <FiEye size={20} />
            </IconButton>

            {onAddToCart && (
              <Tooltip
                title={availableStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              >
                <IconButton
                  size="small"
                  onClick={handleAddToCart}
                  disabled={availableStock <= 0}
                  sx={{
                    color: availableStock > 0 ? '#059669' : '#94a3b8',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    padding: '8px',
                    '&:hover': {
                      backgroundColor:
                        availableStock > 0 ? '#f0fdf4' : '#f8f9fa',
                      borderColor: availableStock > 0 ? '#059669' : '#e0e0e0',
                    },
                    '&:disabled': {
                      color: '#94a3b8',
                      backgroundColor: '#f8f9fa',
                    },
                  }}
                >
                  <FiShoppingCart size={16} />
                </IconButton>
              </Tooltip>
            )}

            {onDeleteProduct && (
              <IconButton
                size="small"
                onClick={handleDeleteClick}
                sx={{
                  color: '#f44336',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: '#ffebee',
                    borderColor: '#f44336',
                  },
                }}
              >
                <FiTrash2 size={16} />
              </IconButton>
            )}
          </Stack>
        </TableCell>
      </TableRow>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        product={product}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default ProductTableRow;
