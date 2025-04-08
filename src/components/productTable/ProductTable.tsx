import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Rating,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  TablePagination,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import { FiEye, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { ProductTableProps } from './types';
import {
  containerStyles,
  titleStyles,
  filtersWrapperStyles,
  filtersContainerStyles,
  filtersBoxStyles,
  searchFieldStyles,
  selectStyles,
  inputLabelStyles,
  actionsBoxStyles,
  resetButtonStyles,
  exportButtonStyles,
  tableCellStyles,
  productImageStyles,
  statusTextStyles,
  switchStyles,
  modalPaperStyles,
  modalImageStyles,
  modalTitleStyles,
  noProductsStyles,
  noProductsTextStyles,
  noProductsSubtextStyles,
} from './styles';

const getColorStyles = (color: string) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    Black: { bg: '#000000', text: '#ffffff' },
    White: { bg: '#ffffff', text: '#000000' },
    Green: { bg: '#4caf50', text: '#ffffff' },
    Silver: { bg: '#c0c0c0', text: '#000000' },
    Gold: { bg: '#ffd700', text: '#000000' },
    'Space Gray': { bg: '#2f4f4f', text: '#ffffff' },
  };

  return colorMap[color] || { bg: '#f8fafc', text: '#64748b' };
};

const categories = ['All', 'Black', 'White', 'Green', 'Silver', 'Gold', 'Space Gray'];
const ratings = ['All', '5', '4', '3', '2', '1'];
const statuses = ['All', 'Available', 'Out of Stock'];
const prices = ['R10-R100', 'R100-R500', 'R500-R1000', 'R1000+'];

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  filteredProducts,
  selectedProduct,
  isViewModalOpen,
  page,
  rowsPerPage,
  searchQuery,
  categoryFilter,
  ratingFilter,
  statusFilter,
  priceFilter,
  onView,
  onCloseModal,
  onPriceChange,
  onSearchChange,
  onCategoryChange,
  onRatingChange,
  onStatusChange,
  onStatusToggle,
  onPageChange,
  onRowsPerPageChange,
  onResetFilters,
  onExportPDF,
}) => {
  const renderProductImage = (
    imageSrc: string | undefined,
    productName: string,
    width: number,
    height: number
  ) => {
    if (imageSrc) {
      return (
        <Image
          src={imageSrc}
          alt={`${productName} product image`}
          width={width}
          height={height}
          style={{
            objectFit: 'cover',
          }}
          priority
        />
      );
    } else {
      return (
        <Box
          sx={{
            width: width,
            height: height,
            bgcolor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption">No Image</Typography>
        </Box>
      );
    }
  };

  return (
    <Box sx={containerStyles}>
      <Typography variant="h5" sx={titleStyles}>
        Product List
      </Typography>
      {/* Filters Section */}
      <Box sx={filtersWrapperStyles}>
        <Box sx={filtersContainerStyles}>
          <Box sx={filtersBoxStyles}>
            <TextField
              placeholder="Search Product"
              size="small"
              value={searchQuery}
              onChange={onSearchChange}
              sx={searchFieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              size="small"
              sx={{ minWidth: { xs: '100%', sm: 180 } }}
            >
              <InputLabel sx={inputLabelStyles}>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={onCategoryChange}
                label="Category"
                sx={{ ...selectStyles }}
              >
                {categories.map((category) => (
                  <MenuItem key={`category-${category}`} value={category}>
                    {String(category)}
                  </MenuItem>

                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: { xs: '100%', sm: 180 } }}
            >
              <InputLabel sx={inputLabelStyles}>Rating</InputLabel>
              <Select
                value={ratingFilter}
                onChange={onRatingChange}
                label="Rating"
                sx={{ ...selectStyles }}
              >
                {ratings.map((rating) => (
                  <MenuItem key={`rating-${rating}`} value={rating}>
                    {typeof rating === 'string' && rating === 'All'
                      ? 'All'
                      : `${rating} Stars`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: { xs: '100%', sm: 180 } }}
            >
              <InputLabel sx={inputLabelStyles}>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={onStatusChange}
                label="Status"
                sx={{ ...selectStyles }}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: { xs: '100%', sm: 180 } }}
            >
              <InputLabel sx={inputLabelStyles}>Price Range</InputLabel>
              <Select
                value={priceFilter}
                onChange={onPriceChange}
                label="Price Range"
                sx={{ ...selectStyles }}
              >
                {prices.map((price) => (
                  <MenuItem key={price} value={price}>
                    {price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={actionsBoxStyles}>
            <IconButton onClick={onResetFilters} sx={resetButtonStyles}>
              <FiRefreshCw size={20} />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<FiDownload />}
              onClick={onExportPDF}
              sx={exportButtonStyles}
            >
              Export PDF
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableCellStyles}>Product Name</TableCell>
              <TableCell sx={tableCellStyles}>ID Code</TableCell>
              <TableCell sx={tableCellStyles}>SKU</TableCell>
              <TableCell sx={tableCellStyles}>Price</TableCell>
              <TableCell sx={tableCellStyles}>Status Product</TableCell>
              <TableCell sx={tableCellStyles}>Rating</TableCell>
              <TableCell sx={tableCellStyles}>Created At</TableCell>
              <TableCell align="center" sx={tableCellStyles}>
                View
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Box sx={noProductsStyles}>
                    <Typography variant="h6" sx={noProductsTextStyles}>
                      No products found
                    </Typography>
                    <Typography variant="body2" sx={noProductsSubtextStyles}>
                      Try adjusting your filters or search criteria
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => onView(product)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={productImageStyles}>
                        {renderProductImage(
                          product.image,
                          product.productName,
                          40,
                          40
                        )}
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">
                          {product.productName}
                        </Typography>
                        {product.color && (
                          <Chip
                            label={product.color}
                            size="small"
                            sx={{
                              height: 20,
                              minWidth: 60,
                              padding: '2px 4px',
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: getColorStyles(product.color).bg,
                              color: getColorStyles(product.color).text,
                              border: '1px solid #e2e8f0',
                            }}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell>{product.sku || '-'}</TableCell>
                  <TableCell>R{(product.price || 0).toFixed(2)}</TableCell>
                  <TableCell>
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
                        <Typography
                          sx={statusTextStyles(product.status ?? false)}
                        >
                          {product.status ? 'In Stock' : 'Out of Stock'}
                        </Typography>
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell>
                    <Rating
                      value={product.rating}
                      readOnly
                      precision={0.5}
                      size="medium"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="medium"
                        onClick={() => onView(product)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'primary.lighter' },
                        }}
                      >
                        <FiEye size={20} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[8]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{
            borderTop: '1px solid #e0e0e0',
            '& .MuiTablePagination-selectLabel': {
              fontSize: '0.875rem',
            },
            '& .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
            },
          }}
        />
      </TableContainer>

      {/* View Modal */}
      <Dialog
        open={isViewModalOpen}
        onClose={onCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: modalPaperStyles,
        }}
      >
        {selectedProduct && (
          <Box sx={modalImageStyles}>
            {renderProductImage(
              selectedProduct.image,
              selectedProduct.productName,
              120,
              120
            )}
          </Box>
        )}
        <DialogTitle sx={modalTitleStyles}>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Stack spacing={3} sx={{ px: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 0.5,
                  }}
                >
                  {selectedProduct.productName}
                </Typography>
                {selectedProduct.color && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                    }}
                  >
                    {selectedProduct.color}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  bgcolor: '#f8f9fa',
                  borderRadius: '12px',
                  p: 3,
                }}
              >
                <Stack spacing={2.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      pb: 2,
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                    >
                      ID Code
                    </Typography>
                    <Typography sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                      {selectedProduct.barcode}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      pb: 2,
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                    >
                      Price
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: '#1a1a1a',
                        fontSize: '1.1rem',
                      }}
                    >
                      R{(selectedProduct?.price || 0).toFixed(2)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      pb: 2,
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                    >
                      Status
                    </Typography>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '16px',
                        bgcolor: selectedProduct?.status
                          ? '#e8f5e9'
                          : '#ffebee',
                        color: selectedProduct?.status ? '#2e7d32' : '#c62828',
                      }}
                    >
                      <Typography
                        sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                      >
                        {selectedProduct?.status ? 'In Stock' : 'Out of Stock'}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                    >
                      Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={selectedProduct.rating}
                        readOnly
                        precision={0.5}
                        size="large"
                        sx={{ color: '#f59e0b' }}
                      />
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                      >
                        ({selectedProduct.rating}/5)
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button
            onClick={onCloseModal}
            variant="contained"
            sx={{
              bgcolor: '#3b82f6',
              color: 'white',
              px: 4,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                bgcolor: '#2563eb',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;
