'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Product } from '@/components/productTable/types';

interface VirtualizedProductTableProps {
  products: Product[];
  selectedProduct: Product | null;
  isViewModalOpen: boolean;
  searchQuery: string;
  categoryFilter: string;
  ratingFilter: number;
  statusFilter: string;
  priceFilter: [number, number];
  onView: (product: Product) => void;
  isLoading?: boolean;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    products: Product[];
    onView: (product: Product) => void;
  };
}

const Row = React.memo(({ index, style, data }: RowProps) => {
  const { products, onView } = data;
  const product = products[index];

  if (!product) return null;

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
      }}
    >
      <Box width="25%" sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component="img"
          src={product.image || '/placeholder-product.jpg'}
          alt={product.productName || 'Product'}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '4px',
            marginRight: 2,
            objectFit: 'cover',
          }}
        />
        <Typography variant="body2" fontWeight="medium">
          {product.productName}
        </Typography>
      </Box>

      <Box width="15%">
        <Typography variant="body2" color="text.secondary">
          {product.barcode}
        </Typography>
      </Box>

      <Box width="15%">
        <Typography variant="body2" color="text.secondary">
          {product.sku}
        </Typography>
      </Box>

      <Box width="10%">
        <Typography variant="body2" fontWeight="medium">
          ${product.price.toFixed(2)}
        </Typography>
      </Box>

      <Box width="10%">
        <Chip
          label={
            product.statusProduct || (product.status ? 'Active' : 'Inactive')
          }
          size="small"
          sx={{
            backgroundColor: product.status
              ? 'rgba(46, 204, 113, 0.1)'
              : 'rgba(231, 76, 60, 0.1)',
            color: product.status ? 'rgb(46, 204, 113)' : 'rgb(231, 76, 60)',
            fontWeight: 500,
            fontSize: '0.7rem',
          }}
        />
      </Box>

      <Box width="15%">
        <Rating
          value={product.rating}
          precision={0.5}
          size="small"
          readOnly
          sx={{ fontSize: '0.9rem' }}
        />
      </Box>

      <Box width="10%" sx={{ textAlign: 'right' }}>
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={() => onView(product)}
            sx={{
              color: 'primary.main',
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
});

Row.displayName = 'ProductTableRow';

const TableHeader = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
      backgroundColor: '#f5f5f5',
      fontWeight: 'bold',
    }}
  >
    <Box width="25%">
      <Typography variant="subtitle2">Product</Typography>
    </Box>
    <Box width="15%">
      <Typography variant="subtitle2">ID Code</Typography>
    </Box>
    <Box width="15%">
      <Typography variant="subtitle2">SKU</Typography>
    </Box>
    <Box width="10%">
      <Typography variant="subtitle2">Price</Typography>
    </Box>
    <Box width="10%">
      <Typography variant="subtitle2">Status</Typography>
    </Box>
    <Box width="15%">
      <Typography variant="subtitle2">Rating</Typography>
    </Box>
    <Box width="10%" sx={{ textAlign: 'right' }}>
      <Typography variant="subtitle2">Actions</Typography>
    </Box>
  </Box>
);

const VirtualizedProductTable: React.FC<VirtualizedProductTableProps> = ({
  products,
  onView,
  isLoading = false,
}) => {
  const displayProducts = useMemo(() => products || [], [products]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      <TableHeader />
      <Box sx={{ height: 500 }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={displayProducts.length}
              itemSize={56}
              itemData={{ products: displayProducts, onView }}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </Box>
    </Paper>
  );
};

export default React.memo(VirtualizedProductTable);
