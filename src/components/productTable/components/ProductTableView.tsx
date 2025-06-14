import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from '@mui/material';
import { Product } from '../types';
import { tableCellStyles } from '../styles';
import ProductTableRow from './ProductTableRow';
import NoProductsFound from './NoProductsFound';

interface ProductTableViewProps {
  paginatedProducts: Product[];
  displayProducts: Product[];
  page: number;
  rowsPerPage: number;
  onView: (product: Product) => void;
  onStatusToggle: (product: Product) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteProduct?: (product: Product) => Promise<void>;
  onAddToCart?: (product: Product, quantity: number) => void;
  showStockWarnings?: boolean;
}

const ProductTableView: React.FC<ProductTableViewProps> = ({
  paginatedProducts,
  displayProducts,
  page,
  rowsPerPage,
  onView,
  onStatusToggle,
  onPageChange,
  onRowsPerPageChange,
  onDeleteProduct,
  onAddToCart,
  showStockWarnings = true,
}) => {
  return (
    <TableContainer
      sx={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
        overflow: 'auto',
        maxWidth: '100%',
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f3f4',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#bdc3c7',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#95a5a6',
          },
        },
      }}
    >
      <Table sx={{ minWidth: 1200 }}>
        <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
          <TableRow>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 200, maxWidth: 250 }}
            >
              Product
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 120, maxWidth: 150 }}
            >
              ID Code
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 100, maxWidth: 120 }}
            >
              SKU
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 100, maxWidth: 120 }}
            >
              Price
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 120, maxWidth: 150 }}
            >
              Stock
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 120, maxWidth: 150 }}
            >
              Sales Count
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 130, maxWidth: 150 }}
            >
              Last Sold Date
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 130, maxWidth: 150 }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 120, maxWidth: 150 }}
            >
              Rating
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 120, maxWidth: 150 }}
            >
              Created
            </TableCell>
            <TableCell
              sx={{ ...tableCellStyles, minWidth: 120, maxWidth: 140 }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedProducts.length === 0 ? (
            <NoProductsFound />
          ) : (
            paginatedProducts.map((product, index) => (
              <ProductTableRow
                key={product.id || index}
                product={product}
                index={index}
                onView={onView}
                onStatusToggle={onStatusToggle}
                onDeleteProduct={onDeleteProduct}
                onAddToCart={onAddToCart}
                showStockWarnings={showStockWarnings}
              />
            ))
          )}
        </TableBody>
      </Table>
      {displayProducts.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[8, 16, 24, 32]}
          component="div"
          count={displayProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '0 0 12px 12px',
            borderTop: '1px solid rgba(224, 224, 224, 0.5)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
            '& .MuiToolbar-root': {
              padding: '0 24px',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
              {
                color: '#1E2A3B',
                fontSize: '0.875rem',
                fontWeight: 500,
                margin: '0 12px',
              },
            '& .MuiTablePagination-select': {
              paddingTop: '4px',
              paddingBottom: '4px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              marginRight: '8px',
              border: '1px solid #e0e0e0',
              '&:focus': {
                backgroundColor: '#f0f2f5',
                borderColor: '#3b82f6',
              },
            },
            '& .MuiTablePagination-actions': {
              marginLeft: '16px',
              '& .MuiIconButton-root': {
                padding: '8px',
                color: '#1E2A3B',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                margin: '0 2px',
                '&:hover': {
                  backgroundColor: '#f0f2f5',
                  borderColor: '#3b82f6',
                },
                '&.Mui-disabled': {
                  color: 'rgba(0, 0, 0, 0.26)',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                },
              },
            },
          }}
        />
      )}
    </TableContainer>
  );
};

export default ProductTableView;
