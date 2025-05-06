import React, {
  useEffect,
  useState,
  useMemo,
} from 'react';
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
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import {
  FiEye,
  FiDownload,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  ProductTableProps,
  Product,
} from './types';
import { useProductContext } from '@/contexts/ProductContext';
import { getColorStyles } from '@/utils/colorUtils';
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

const categories = [
  'All',
  'Black',
  'White',
  'Green',
  'Silver',
  'Gold',
  'Space Gray',
];
const ratings = ['All', '5', '4', '3', '2', '1'];
const statuses = [
  'All',
  'Available',
  'Out of Stock',
];
const prices = [
  'All',
  'R10-R100',
  'R100-R500',
  'R500-R1000',
  'R1000+',
];

const ProductTable: React.FC<
  ProductTableProps
> = ({
  products: propProducts,
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
    const { products: contextProducts } =
      useProductContext();
    const [displayProducts, setDisplayProducts] =
      useState<Product[]>([]);

    useEffect(() => {
      let localStorageProducts: Product[] = [];
      try {
        const storedData =
          localStorage.getItem('products');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (
            Array.isArray(parsedData) &&
            parsedData.length > 0
          ) {
            localStorageProducts = parsedData;
            console.log(
              'ProductTable - Loaded products from localStorage:',
              localStorageProducts.length
            );
          }
        }
      } catch (error) {
        console.error(
          'Failed to load products from localStorage:',
          error
        );
      }
      const sourceProducts =
        localStorageProducts.length > 0
          ? localStorageProducts
          : contextProducts &&
            contextProducts.length > 0
            ? contextProducts
            : propProducts || [];
      const updatedFilteredProducts = sourceProducts
        .map((product) => ({
          ...product,
          id: product.id || 0,
          productName:
            product.productName ||
            'Unknown Product',
          barcode: product.barcode || 'N/A',
          sku: product.sku || '-',
          price:
            typeof product.price === 'number'
              ? product.price
              : 0,
          status:
            typeof product.status === 'boolean'
              ? product.status
              : false,
          rating:
            typeof product.rating === 'number'
              ? product.rating
              : 0,
          createdAt:
            product.createdAt ||
            new Date().toISOString(),
          color: product.color || 'N/A',
          statusProduct: product.status
            ? 'Active'
            : 'Inactive',
          image:
            product.image ||
            '/placeholder-image.png',
        }))
        .filter((product) => {
          if (
            searchQuery &&
            (!product.productName ||
              !product.productName
                .toLowerCase()
                .includes(
                  searchQuery.toLowerCase()
                ))
          )
            return false;
          if (
            categoryFilter !== 'All' &&
            product.color !== categoryFilter
          )
            return false;
          if (
            ratingFilter !== 'All' &&
            Math.floor(product.rating || 0) !==
            parseInt(ratingFilter, 10)
          )
            return false;
          if (statusFilter !== 'All') {
            const currentStatus = product.status
              ? 'Available'
              : 'Out of Stock';
            if (currentStatus !== statusFilter)
              return false;
          }
          if (priceFilter !== 'All') {
            const price = product.price || 0;
            switch (priceFilter) {
              case 'R10-R100':
                if (price < 10 || price > 100)
                  return false;
                break;
              case 'R100-R500':
                if (price < 100 || price > 500)
                  return false;
                break;
              case 'R500-R1000':
                if (price < 500 || price > 1000)
                  return false;
                break;
              case 'R1000+':
                if (price < 1000) return false;
                break;
            }
          }
          return true;
        });
      setDisplayProducts(updatedFilteredProducts);
    }, [
      contextProducts,
      propProducts,
      searchQuery,
      categoryFilter,
      ratingFilter,
      statusFilter,
      priceFilter,
    ]);

    const paginatedProducts = useMemo(() => {
      const startIndex = page * rowsPerPage;
      return displayProducts.slice(
        startIndex,
        startIndex + rowsPerPage
      );
    }, [displayProducts, page, rowsPerPage]);

    useEffect(() => {
      console.log(
        'Modal state changed - isViewModalOpen:',
        isViewModalOpen,
        'selectedProduct:',
        selectedProduct
      );
      if (isViewModalOpen) {
        if (selectedProduct) {
          console.log(
            'MODAL DEBUG: Product data available for modal:',
            JSON.stringify(selectedProduct, null, 2)
          );
          console.log(
            'MODAL DEBUG: Product ID:',
            selectedProduct.id
          );
          console.log(
            'MODAL DEBUG: Product Name:',
            selectedProduct.productName
          );
          console.log(
            'MODAL DEBUG: Product Barcode:',
            selectedProduct.barcode
          );
          console.log(
            'MODAL DEBUG: Product SKU:',
            selectedProduct.sku
          );
          console.log(
            'MODAL DEBUG: Product Price:',
            selectedProduct.price
          );
          console.log(
            'MODAL DEBUG: Product Status:',
            selectedProduct.status
          );
          console.log(
            'MODAL DEBUG: Product Rating:',
            selectedProduct.rating
          );
          console.log(
            'MODAL DEBUG: Product Color:',
            selectedProduct.color
          );
          console.log(
            'MODAL DEBUG: Product Image:',
            selectedProduct.image
              ? 'Image exists'
              : 'No image'
          );
        } else {
          console.error(
            'MODAL DEBUG: Product data missing when modal opened'
          );
        }
      }
    }, [isViewModalOpen, selectedProduct]);

    const renderProductImage = (
      imageSrc: string | undefined,
      productName: string,
      width: number,
      height: number
    ) => {
      console.log(
        'ProductTable - Rendering image for product:',
        productName,
        'Image source:',
        imageSrc ? 'Image exists' : 'No image'
      );

      if (imageSrc) {
        try {
          return (
            <Image
              src={imageSrc}
              alt={`${productName} product image`}
              width={width}
              height={height}
              style={{
                objectFit: 'cover',
                display: 'block',
                visibility: 'visible',
                opacity: 1,
              }}
              priority
            />
          );
        } catch (error) {
          console.error(
            'ProductTable - Error rendering image:',
            error
          );
          return (
            <Box
              sx={{
                width,
                height,
                bgcolor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption">
                Image Error
              </Typography>
            </Box>
          );
        }
      } else {
        return (
          <Box
            sx={{
              width,
              height,
              bgcolor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption">
              No Image
            </Typography>
          </Box>
        );
      }
    };

    return (
      <Box sx={containerStyles}>
        <Typography variant="h5" sx={titleStyles}>
          Product List
        </Typography>
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
                      <SearchIcon
                        sx={{ color: '#64748b' }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: '100%', sm: 180 },
                }}
              >
                <InputLabel sx={inputLabelStyles}>
                  Category
                </InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={onCategoryChange}
                  label="Category"
                  sx={selectStyles}
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={`category-${category}`}
                      value={category}
                    >
                      {String(category)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: '100%', sm: 180 },
                }}
              >
                <InputLabel sx={inputLabelStyles}>
                  Rating
                </InputLabel>
                <Select
                  value={ratingFilter}
                  onChange={onRatingChange}
                  label="Rating"
                  sx={selectStyles}
                >
                  {ratings.map((rating) => (
                    <MenuItem
                      key={`rating-${rating}`}
                      value={rating}
                    >
                      {rating === 'All'
                        ? 'All'
                        : `${rating} Stars`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: '100%', sm: 180 },
                }}
              >
                <InputLabel sx={inputLabelStyles}>
                  Status
                </InputLabel>
                <Select
                  value={statusFilter}
                  onChange={onStatusChange}
                  label="Status"
                  sx={selectStyles}
                >
                  {statuses.map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                size="small"
                sx={{
                  minWidth: { xs: '100%', sm: 180 },
                }}
              >
                <InputLabel sx={inputLabelStyles}>
                  Price Range
                </InputLabel>
                <Select
                  value={priceFilter}
                  onChange={onPriceChange}
                  label="Price Range"
                  sx={selectStyles}
                >
                  {prices.map((price) => (
                    <MenuItem
                      key={price}
                      value={price}
                    >
                      {price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={actionsBoxStyles}>
              <IconButton
                onClick={onResetFilters}
                sx={resetButtonStyles}
              >
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
        <TableContainer sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={tableCellStyles}>
                  Product
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  ID Code
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  SKU
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  Price
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  Status
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  Rating
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  Created
                </TableCell>
                <TableCell sx={tableCellStyles}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <Box sx={noProductsStyles}>
                      <Typography
                        variant="h6"
                        sx={noProductsTextStyles}
                      >
                        No products found
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={noProductsSubtextStyles}
                      >
                        Try adjusting your filters
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map(
                  (product, index) => (
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
                          fontSize: '14px',
                          padding: '16px',
                        },
                      }}
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          <Box
                            sx={productImageStyles}
                          >
                            {renderProductImage(
                              product.image,
                              product.productName ||
                              '',
                              40,
                              40
                            )}
                          </Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
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
                                  bgcolor: getColorStyles(product.color).bg,
                                  color: getColorStyles(product.color).text,
                                  border: '1px solid #e2e8f0',
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.barcode || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.sku || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#1E2A3B',
                          }}
                        >
                          R{(product.price || 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                product.status ??
                                false
                              }
                              onChange={(e) => {
                                e.stopPropagation();
                                onStatusToggle(
                                  product
                                );
                              }}
                              sx={switchStyles}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              sx={statusTextStyles(
                                product.status ??
                                false
                              )}
                            >
                              {product.status
                                ? 'In Stock'
                                : 'Out of Stock'}
                            </Typography>
                          }
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating
                            value={product.rating || 0}
                            readOnly
                            precision={0.5}
                            size="small"
                            sx={{ color: '#f59e0b' }}
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
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
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
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(
                                'ProductTable - View icon clicked for product:',
                                product.productName
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
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
          {displayProducts.length > rowsPerPage && (
            <TablePagination
              rowsPerPageOptions={[9, 18, 27]}
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
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
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
        <Dialog
          open={isViewModalOpen}
          onClose={onCloseModal}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                ...modalPaperStyles,
                zIndex: 1400,
                position: 'relative',
                margin: '32px',
                borderRadius: '16px',
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.2)',
                backgroundColor:
                  '#ffffff !important',
                display: 'block !important',
                opacity: 1,
                visibility: 'visible',
              },
            },
          }}
          aria-labelledby="product-details-title"
          aria-describedby="product-details-content"
          disableEnforceFocus
          disableAutoFocus
          keepMounted
          sx={{
            zIndex: 1300,
            '& .MuiDialog-container': {
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& .MuiDialogContent-root': {
              display: 'block !important',
              padding: '16px',
              overflowY: 'auto',
            },
            '& .MuiBackdrop-root': {
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          {!selectedProduct ? (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: '16px',
              }}
            >
              <Alert
                severity="error"
                sx={{ mb: 2 }}
              >
                Product data could not be loaded
              </Alert>
              <Typography>
                There was a problem loading the
                product details. Please try again.
              </Typography>
              <Box
                sx={{ mt: 3, textAlign: 'center' }}
              >
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(
                      'ProductTable - Error close button clicked'
                    );
                    onCloseModal();
                  }}
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
                    display:
                      'inline-flex !important',
                    visibility: 'visible',
                    opacity: 1,
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Box sx={modalImageStyles}>
                {renderProductImage(
                  selectedProduct.image,
                  selectedProduct.productName ||
                  'Product',
                  120,
                  120
                )}
              </Box>
              <DialogTitle
                sx={{
                  ...modalTitleStyles,
                  display: 'block !important',
                  backgroundColor: '#ffffff',
                  opacity: 1,
                  visibility: 'visible',
                  padding: '16px 24px 0 24px',
                }}
                id="product-details-title"
              >
                Product Details
              </DialogTitle>
              <DialogContent
                id="product-details-content"
                sx={{
                  display: 'block !important',
                  padding: '16px 24px',
                  overflowY: 'auto',
                  backgroundColor: '#ffffff',
                  opacity: 1,
                  visibility: 'visible',
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: '#1a1a1a',
                      mb: 0.5,
                    }}
                  >
                    {selectedProduct.productName ||
                      'Unknown Product'}
                  </Typography>
                  {selectedProduct.color && (
                    <Chip
                      label={selectedProduct.color}
                      size="small"
                      sx={{
                        mt: 1,
                        fontSize: '0.75rem',
                        height: '24px',
                        backgroundColor:
                          getColorStyles(
                            selectedProduct.color
                          ).bg,
                        color: getColorStyles(
                          selectedProduct.color
                        ).text,
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: '8px',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    Product Information
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: '250px',
                      overflowY: 'auto',
                      pr: 1,
                      '&::-webkit-scrollbar': {
                        width: '0px',
                        background: 'transparent',
                      },
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom:
                          '1px solid #e0e0e0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        ID Code:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        {selectedProduct.barcode ||
                          'N/A'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom:
                          '1px solid #e0e0e0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        SKU:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        {selectedProduct.sku || '-'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom:
                          '1px solid #e0e0e0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        Price:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '1rem',
                        }}
                      >
                        R
                        {(
                          selectedProduct.price || 0
                        ).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom:
                          '1px solid #e0e0e0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        Status:
                      </Typography>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: '16px',
                          display: 'inline-block',
                          bgcolor:
                            selectedProduct.status
                              ? '#e8f5e9'
                              : '#ffebee',
                          color:
                            selectedProduct.status
                              ? '#2e7d32'
                              : '#c62828',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                        >
                          {selectedProduct.status
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom:
                          '1px solid #e0e0e0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        Rating:
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Rating
                          value={
                            selectedProduct.rating ||
                            0
                          }
                          readOnly
                          precision={0.5}
                          size="small"
                          sx={{ color: '#f59e0b' }}
                        />
                        <Typography
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.8rem',
                          }}
                        >
                          (
                          {selectedProduct.rating ||
                            0}
                          /5)
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        mb: 1.5,
                        pb: 1.5,
                        borderBottom:
                          '1px solid #e0e0e0',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        Status Product:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        {selectedProduct.statusProduct ||
                          (selectedProduct.status
                            ? 'Active'
                            : 'Inactive')}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        Created:
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        {selectedProduct.createdAt
                          ? new Date(
                            selectedProduct.createdAt
                          ).toLocaleDateString()
                          : '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3,
                  justifyContent: 'center',
                  display: 'flex !important',
                  backgroundColor: '#ffffff',
                  opacity: 1,
                  visibility: 'visible',
                  borderBottomLeftRadius: '16px',
                  borderBottomRightRadius: '16px',
                }}
              >
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(
                      'ProductTable - Close button clicked'
                    );
                    onCloseModal();
                  }}
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
                    display:
                      'inline-flex !important',
                    visibility: 'visible',
                    opacity: 1,
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    );
  };

export default ProductTable;
