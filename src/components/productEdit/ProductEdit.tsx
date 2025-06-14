import React from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Stack,
  IconButton,
  Avatar,
  Switch,
  TablePagination,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ProductEditProps, Product } from './types';
import * as S from './styles';
import ProductEditModal from './ProductEditModal';
import { useProductContext } from '@/contexts/ProductContext';
import { getColorStyles } from '@/utils/colorUtils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import StockSummary from '@/components/productTable/components/StockSummary';
import StockWarning from '@/components/productTable/components/StockWarning';
import { getStockLevel } from '@/utils/stockManagement';

const ProductEdit: React.FC<ProductEditProps> = ({
  products,
  onAddItem,
  onUpdateItem,
  onNewSession,
  onCollectPayment,
  onAddDiscount,
  onCancelSession,
  subTotal,
  discount,
  onDeleteItem,
  showStockWarnings = true,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [viewingProduct, setViewingProduct] = React.useState<Product | null>(
    null
  );
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null
  );
  const { updateProduct, addProduct } = useProductContext();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(9);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProducts = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return products.slice(startIndex, startIndex + rowsPerPage);
  }, [products, page, rowsPerPage]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setViewingProduct(null);
    setEditingProduct(null);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setViewingProduct(null);
    setIsModalOpen(true);
  };

  const handleSubmitProduct = (data: Product) => {
    console.log(
      'ProductEdit - Received data from modal:',
      JSON.stringify(data, null, 2)
    );

    // Ensure the image path is properly formatted
    let imagePath = data.image || '/placeholder-image.png';

    if (imagePath.startsWith('data:image')) {
      console.warn(
        'Image is still in base64 format. It should have been uploaded to the server.'
      );

      imagePath = '/placeholder-image.png';
    }

    const productWithStatus = {
      ...data,
      id: data.id || Date.now(),
      productName: data.productName || 'Unnamed Product',
      color: data.color || 'Black',
      barcode: data.barcode || `BC-${Date.now()}`,
      sku: data.sku || `SKU-${Date.now()}`,
      price: typeof data.price === 'number' ? data.price : 0,
      stock: typeof data.stock === 'number' ? data.stock : 0,
      status: Boolean(data.status),
      rating: typeof data.rating === 'number' ? data.rating : 0,
      createdAt: data.createdAt || new Date().toISOString(),
      image: imagePath,
      statusProduct: Boolean(data.status) ? 'Active' : 'Inactive',

      salesCount: typeof data.salesCount === 'number' ? data.salesCount : 0,
      returnCount: typeof data.returnCount === 'number' ? data.returnCount : 0,
      lastSoldDate: data.lastSoldDate || null,
      totalRevenue:
        typeof data.totalRevenue === 'number' ? data.totalRevenue : 0,
    };

    console.log(
      'ProductEdit - Enhanced product data:',
      JSON.stringify(productWithStatus, null, 2)
    );

    if (editingProduct) {
      onUpdateItem(productWithStatus);
      updateProduct(productWithStatus);

      setSnackbarMessage('Product updated successfully!');
      setSnackbarOpen(true);
    } else {
      onAddItem(productWithStatus, handleCloseModal);
      addProduct(productWithStatus);

      setSnackbarMessage('Product added successfully!');
      setSnackbarOpen(true);
    }

    try {
      const existingProducts = JSON.parse(
        localStorage.getItem('products') || '[]'
      );
      const updatedProducts = editingProduct
        ? existingProducts.map((p: Product) =>
            p.id === productWithStatus.id ? productWithStatus : p
          )
        : [...existingProducts, productWithStatus];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error(
        'Error saving product to localStorage:',
        JSON.stringify(error, null, 2)
      );
    }

    handleCloseModal();
  };

  const columns: GridColDef[] = [
    {
      field: 'image',
      headerName: 'Icon',
      width: 70,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Avatar
            src={params.value || '/placeholder-image.png'}
            alt={params.row.productName || 'Product'}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
              backgroundColor: '#F8FAFC',
            }}
            variant="rounded"
          />
        </Box>
      ),
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 1.8,
      minWidth: 180,
      renderCell: (params) => (
        <Stack
          direction="column"
          spacing={0.5}
          sx={{
            width: '100%',
            py: 0.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              color: '#1E293B',
              fontSize: '0.875rem',
              lineHeight: 1.3,
              maxWidth: '100%',
            }}
            title={params.value || 'Unnamed Product'}
          >
            {params.value || 'Unnamed Product'}
          </Typography>
          {params.row.color && (
            <Chip
              label={params.row.color}
              size="small"
              sx={{
                height: 18,
                maxWidth: 'fit-content',
                fontSize: '0.65rem',
                fontWeight: 500,
                bgcolor: getColorStyles(params.row.color).bg,
                color: getColorStyles(params.row.color).text,
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                '& .MuiChip-label': {
                  px: 0.75,
                  py: 0,
                },
                '@media (max-width: 768px)': {
                  fontSize: '0.6rem',
                  height: 16,
                },
              }}
            />
          )}
        </Stack>
      ),
    },
    {
      field: 'sku',
      headerName: 'SKU',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            color: params.value ? '#475569' : '#94A3B8',
            fontWeight: params.value ? 500 : 400,
            fontSize: '0.8rem',
            fontFamily: 'monospace',
          }}
          title={params.value || 'No SKU'}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'barcode',
      headerName: 'ID Code',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            color: params.value ? '#475569' : '#94A3B8',
            fontWeight: params.value ? 500 : 400,
            fontSize: '0.8rem',
            fontFamily: 'monospace',
          }}
          title={params.value || 'No ID Code'}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.8,
      minWidth: 90,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const price = params.row.price !== undefined ? params.row.price : 0;
        const isZero = price === 0;
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isZero ? '#94A3B8' : '#059669',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
              }}
            >
              R{Number(price).toFixed(2)}
            </Typography>
            {isZero && (
              <Typography
                variant="caption"
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.65rem',
                }}
              >
                No price set
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'stock',
      headerName: 'Stock',
      flex: 0.9,
      minWidth: 110,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const stock = params.row.stock || 0;
        const stockLevel = getStockLevel(stock);
        const isOutOfStock = stockLevel.level === 'out_of_stock';
        const isLowStock = stockLevel.level === 'low_stock';

        return (
          <Stack
            direction="column"
            spacing={0.5}
            alignItems="center"
            sx={{ py: 0.5 }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: isOutOfStock
                  ? '#DC2626'
                  : isLowStock
                    ? '#D97706'
                    : '#059669',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                textAlign: 'center',
              }}
            >
              {stock} units
            </Typography>
            {showStockWarnings && (
              <StockWarning
                stockLevel={stockLevel}
                variant="chip"
                size="small"
              />
            )}
          </Stack>
        );
      },
    },
    {
      field: 'salesCount',
      headerName: 'Sales Count',
      flex: 0.8,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const salesCount = params.row.salesCount || 0;
        const returnCount = params.row.returnCount || 0;
        const returnRate =
          salesCount > 0
            ? ((returnCount / salesCount) * 100).toFixed(1)
            : '0.0';

        return (
          <Stack
            direction="column"
            spacing={0.5}
            alignItems="center"
            sx={{ py: 0.5 }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color:
                  salesCount > 50
                    ? '#059669'
                    : salesCount > 10
                      ? '#D97706'
                      : '#6B7280',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                textAlign: 'center',
              }}
            >
              {salesCount} sales
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.65rem',
                color: '#94A3B8',
                textAlign: 'center',
              }}
            >
              {returnCount} returns ({returnRate}%)
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'lastSoldDate',
      headerName: 'Last Sold',
      flex: 1,
      minWidth: 110,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const lastSoldDate = params.row.lastSoldDate;

        return (
          <Stack direction="column" spacing={0.25} alignItems="center">
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.8rem',
                fontWeight: 500,
                color: lastSoldDate ? '#475569' : '#94A3B8',
              }}
            >
              {lastSoldDate
                ? new Date(lastSoldDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Never sold'}
            </Typography>
            {lastSoldDate && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  color: '#94A3B8',
                }}
              >
                {new Date(lastSoldDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            )}
          </Stack>
        );
      },
    },
    {
      field: 'statusProduct',
      headerName: 'Status',
      flex: 0.9,
      minWidth: 110,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const isActive = params.value === 'Active';
        return (
          <Stack
            direction="column"
            spacing={0.5}
            alignItems="center"
            sx={{ py: 0.5 }}
          >
            <Switch
              checked={isActive}
              onChange={(e) => {
                const updatedProduct = {
                  ...params.row,
                  statusProduct: e.target.checked ? 'Active' : 'Inactive',
                  status: e.target.checked,
                };
                onUpdateItem(updatedProduct);
                updateProduct(updatedProduct);
              }}
              color="primary"
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#059669',
                  '&:hover': {
                    backgroundColor: 'rgba(5, 150, 105, 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#059669',
                },
                '& .MuiSwitch-track': {
                  backgroundColor: isActive ? '#059669' : '#E5E7EB',
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.7rem',
                fontWeight: 500,
                color: isActive ? '#059669' : '#6B7280',
                textAlign: 'center',
                '@media (max-width: 768px)': {
                  display: 'none',
                },
              }}
            >
              {params.value}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 0.7,
      minWidth: 80,
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const rating = params.value || 0;
        const stars = Math.round(rating);

        return (
          <Stack direction="column" spacing={0.5} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Box
                  key={star}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: star <= stars ? '#F59E0B' : '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '8px',
                      color: star <= stars ? 'white' : '#9CA3AF',
                      lineHeight: 1,
                    }}
                  >
                    ★
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.7rem',
                color: '#6B7280',
                fontWeight: 500,
              }}
            >
              {rating.toFixed(1)}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        try {
          const date = new Date(params.row.createdAt);
          const isValidDate = !isNaN(date.getTime());

          return (
            <Stack direction="column" spacing={0.25} alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: isValidDate ? '#475569' : '#94A3B8',
                }}
              >
                {isValidDate
                  ? date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Invalid Date'}
              </Typography>
              {isValidDate && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.65rem',
                    color: '#94A3B8',
                  }}
                >
                  {date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              )}
            </Stack>
          );
        } catch {
          return (
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.8rem',
                color: '#94A3B8',
              }}
            >
              {params.row.createdAt || '-'}
            </Typography>
          );
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.9,
      minWidth: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            py: 0.5,
          }}
        >
          <IconButton
            size="small"
            sx={{
              padding: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              color: '#3B82F6',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={() => handleViewProduct(params.row)}
            title="View Product"
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              padding: '6px',
              backgroundColor: 'rgba(5, 150, 105, 0.08)',
              color: '#059669',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(5, 150, 105, 0.15)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={() => handleEditProduct(params.row)}
            title="Edit Product"
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              padding: '6px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              color: '#DC2626',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={() => onDeleteItem(params.row.id)}
            title="Delete Product"
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const totalProductsPrice = React.useMemo(() => {
    return products.reduce((sum, product) => sum + (product.price || 0), 0);
  }, [products]);

  const selectedProductsPrice = React.useMemo(() => {
    if (selectedRows.length === 0) return 0;

    return products
      .filter((product) => selectedRows.includes(product.id.toString()))
      .reduce((sum, product) => sum + (product.price || 0), 0);
  }, [products, selectedRows]);

  const selectedProducts = React.useMemo(() => {
    return products.filter((product) =>
      selectedRows.includes(product.id.toString())
    );
  }, [products, selectedRows]);

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFontSize(20);
    doc.setTextColor(23, 58, 121);
    doc.text('Pisval Tech', 14, 15);

    doc.setFontSize(16);
    doc.setTextColor(30, 42, 59);
    doc.text('Product Inventory Report', 14, 25);

    doc.setFontSize(10);
    doc.text('Pisval Tech Point of Sale System', 14, 35);
    doc.text('Business Information:', 14, 40);
    doc.text('Email: info@pisvaltech.com', 14, 45);
    doc.text('Website: www.pisvaltech.com', 14, 50);
    doc.text('Phone: +27 123 456 789', 14, 55);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 65);

    const tableData = products.map((product) => [
      product.productName || 'Unnamed Product',
      product.sku || '-',
      product.barcode || '-',
      `R${(product.price || 0).toFixed(2)}`,
      `${product.stock || 0} units`,
      product.status ? 'Active' : 'Inactive',
      product.rating ? `${product.rating.toFixed(1)} ★` : '-',
      new Date(product.createdAt || new Date()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    ]);

    autoTable(doc, {
      startY: 70,
      head: [
        [
          'Product Name',
          'SKU',
          'ID Code',
          'Price',
          'Stock',
          'Status',
          'Rating',
          'Created At',
        ],
      ],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 42, 59],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        cellPadding: 3,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      columnStyles: {
        0: {
          cellWidth: 45,
          overflow: 'linebreak',
        },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 18 },
        4: { cellWidth: 18 },
        5: { cellWidth: 18 },
        6: { cellWidth: 15 },
        7: { cellWidth: 22 },
      },
      margin: { left: 10, right: 10 },
      tableWidth: 'auto',
      horizontalPageBreak: true,
      showHead: 'everyPage',
      pageBreak: 'auto',
    });

    doc.save('product-inventory.pdf');

    setSnackbarMessage('PDF exported successfully!');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const calculatedSubTotal = React.useMemo(() => {
    return subTotal !== undefined ? subTotal : totalProductsPrice;
  }, [totalProductsPrice, subTotal]);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <S.Container>
        <S.ProductListSection>
          <S.HeaderSection>
            <S.HeaderWrapper>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '22px',
                  color: '#1E2A3B',
                  letterSpacing: '0.2px',
                }}
              >
                Inventory
              </Typography>
              <S.ExportButton
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportPDF}
              >
                Export as PDF
              </S.ExportButton>
            </S.HeaderWrapper>
          </S.HeaderSection>

          {}
          {showStockWarnings && (
            <Box sx={{ mb: 2 }}>
              <StockSummary products={products} />
            </Box>
          )}

          <S.TableHeaderRow>
            <S.CheckboxCell>
              <Checkbox size="small" />
            </S.CheckboxCell>
            <S.StandardCell>Image</S.StandardCell>
            <S.ProductNameCell>Product Name</S.ProductNameCell>
            <S.StandardCell>SKU</S.StandardCell>
            <S.StandardCell>ID Code</S.StandardCell>
            <S.StandardCell>Price</S.StandardCell>
            <S.StandardCell>Stock</S.StandardCell>
            <S.StandardCell>Status</S.StandardCell>
            <S.StandardCell>Rating</S.StandardCell>
            <S.StandardCell>Created At</S.StandardCell>
            <S.StandardCell>Actions</S.StandardCell>
          </S.TableHeaderRow>

          <S.ButtonGroup>
            <S.AddItemButton
              variant="contained"
              onClick={handleOpenModal}
              startIcon={<AddIcon />}
            >
              Add item manually
            </S.AddItemButton>
            <S.QrCodeButton variant="contained">
              <QrCodeScannerIcon />
            </S.QrCodeButton>
            <S.NewSessionButton
              variant="contained"
              onClick={onNewSession}
              startIcon={<StorefrontIcon />}
            >
              New Session
            </S.NewSessionButton>
          </S.ButtonGroup>

          {products.length === 0 ? (
            <S.EmptyStateWrapper>
              <S.EmptyStateIcon>
                <StorefrontIcon />
              </S.EmptyStateIcon>
              <Typography variant="body1" color="textSecondary">
                No items added yet.
              </Typography>
            </S.EmptyStateWrapper>
          ) : (
            <S.ProductTable>
              <DataGrid
                rows={paginatedProducts}
                columns={columns}
                sx={{
                  height: 'auto',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.06)',
                  position: 'relative',
                  zIndex: 1,
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',

                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  '& .MuiDataGrid-main': {
                    width: '100%',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#F8FAFC',
                    borderBottom: '2px solid #E2E8F0',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#475569',
                    '& .MuiDataGrid-columnHeader': {
                      padding: '16px 12px',
                      '&:focus': {
                        outline: 'none',
                      },
                      '&:focus-within': {
                        outline: 'none',
                      },
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    },
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #F1F5F9',
                    padding: '12px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:focus-within': {
                      outline: 'none',
                    },
                  },
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      backgroundColor: '#F8FAFC',
                      '& .MuiDataGrid-cell': {
                        borderBottomColor: '#E2E8F0',
                      },
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(59, 130, 246, 0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      },
                    },
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  },
                  '& .MuiDataGrid-virtualScrollerContent': {
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  },
                  '& .MuiDataGrid-virtualScrollerRenderZone': {
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  },
                  '& .MuiCheckbox-root': {
                    color: '#CBD5E1',
                    '&.Mui-checked': {
                      color: '#3B82F6',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    },
                  },
                  '@media (max-width: 768px)': {
                    '& .MuiDataGrid-columnHeaders': {
                      fontSize: '0.75rem',
                      '& .MuiDataGrid-columnHeaderTitle': {
                        fontSize: '0.75rem',
                      },
                    },
                    '& .MuiDataGrid-cell': {
                      fontSize: '0.75rem',
                      padding: '8px 6px',
                    },
                  },
                }}
                hideFooter={true}
                checkboxSelection
                onRowSelectionModelChange={(newSelectionModel) => {
                  setSelectedRows(newSelectionModel as string[]);
                }}
                rowSelectionModel={selectedRows}
                disableColumnMenu
                rowHeight={70}
                columnHeaderHeight={60}
                getRowId={(row) => row.id}
                density="standard"
                disableColumnFilter
                disableRowSelectionOnClick={false}
                slotProps={{
                  basePopper: {
                    sx: {
                      zIndex: 1500,
                    },
                  },
                }}
                aria-label="Product inventory table"
              />
              <TablePagination
                component="div"
                count={products.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[9, 18, 27]}
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
                    '@media (max-width: 768px)': {
                      padding: '0 16px',
                      minHeight: '50px',
                    },
                    '@media (max-width: 480px)': {
                      padding: '0 8px',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    },
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
                    {
                      color: '#1E2A3B',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      margin: '0 12px',
                      '@media (max-width: 768px)': {
                        fontSize: '0.8rem',
                        margin: '0 8px',
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '0.75rem',
                        margin: '0 4px',
                      },
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
                    '@media (max-width: 480px)': {
                      marginLeft: '8px',
                    },
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
                      '@media (max-width: 480px)': {
                        padding: '6px',
                      },
                    },
                  },
                }}
              />
            </S.ProductTable>
          )}
        </S.ProductListSection>

        <S.TotalSection>
          <Stack spacing={3}>
            <Box
              sx={{
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                paddingBottom: '16px',
                marginBottom: '8px',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#1E2A3B',
                  marginBottom: '4px',
                }}
              >
                {selectedRows.length > 0 ? 'Selected Items' : 'Order Summary'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '14px',
                }}
              >
                {selectedRows.length > 0
                  ? `${selectedRows.length} of ${products.length} items selected`
                  : `${products.length} ${products.length === 1 ? 'item' : 'items'} in cart`}
              </Typography>
            </Box>

            {selectedRows.length > 0 && (
              <Box
                sx={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                    height: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#c1c1c1',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#a8a8a8',
                    },
                  },
                }}
              >
                {selectedProducts.map((product) => (
                  <Box
                    key={product.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1,
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        width: '70%',
                      }}
                    >
                      <Avatar
                        src={product.image || '/placeholder-image.png'}
                        alt={product.productName}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '4px',
                          border: '1px solid #f0f0f0',
                        }}
                        variant="rounded"
                      />
                      <Box
                        sx={{
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#1E2A3B',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.productName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748B',
                            fontSize: '12px',
                          }}
                        >
                          {product.sku}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#1E2A3B',
                      }}
                    >
                      R{(product.price || 0).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: '15px',
                  color: '#64748B',
                }}
              >
                {selectedRows.length > 0 ? 'Selected Items' : 'Items'} (
                {selectedRows.length > 0
                  ? selectedRows.length
                  : products.length}
                )
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#1E2A3B',
                }}
              >
                R
                {(selectedRows.length > 0
                  ? selectedProductsPrice
                  : totalProductsPrice
                ).toFixed(2)}
              </Typography>
            </Box>

            {!selectedRows.length && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '15px',
                      color: '#64748B',
                    }}
                  >
                    Sub Total (Incl. Tax)
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#1E2A3B',
                    }}
                  >
                    R{calculatedSubTotal.toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '15px',
                      color: discount > 0 ? '#52B788' : '#64748B',
                    }}
                  >
                    Discount
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: '16px',
                      color: discount > 0 ? '#52B788' : '#1E2A3B',
                    }}
                  >
                    {discount > 0 ? '-' : ''}R{discount.toFixed(2)}
                  </Typography>
                </Box>
              </>
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                paddingTop: '16px',
                paddingBottom: '16px',
                marginTop: '8px',
                marginBottom: '8px',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#1E2A3B',
                }}
              >
                {selectedRows.length > 0 ? 'Selected Total' : 'Total'}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '24px',
                  color: '#1E2A3B',
                }}
              >
                R
                {(selectedRows.length > 0
                  ? selectedProductsPrice
                  : totalProductsPrice
                ).toFixed(2)}
              </Typography>
            </Box>

            {selectedRows.length > 0 ? (
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setSelectedRows([])}
                  sx={{
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: 600,
                    padding: '12px',
                    backgroundColor: '#1E2A3B',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#2C3E50',
                    },
                  }}
                >
                  Clear Selection
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSnackbarMessage(
                      `${selectedRows.length} items added to cart`
                    );
                    setSnackbarOpen(true);
                  }}
                  sx={{
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: 500,
                    padding: '12px',
                    borderColor: '#1E2A3B',
                    color: '#1E2A3B',
                    '&:hover': {
                      backgroundColor: 'rgba(30, 42, 59, 0.04)',
                    },
                  }}
                >
                  Add Selected to Cart
                </Button>
              </Stack>
            ) : (
              <>
                <S.CollectPaymentButton
                  variant="contained"
                  onClick={onCollectPayment}
                >
                  Collect Payment
                </S.CollectPaymentButton>

                <Stack direction="row" spacing={2} sx={{ marginTop: '8px' }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={onAddDiscount}
                    sx={{
                      textTransform: 'none',
                      fontSize: '15px',
                      fontWeight: 500,
                      padding: '10px',
                      borderColor: '#E0E0E0',
                      color: '#1E2A3B',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        borderColor: '#1E2A3B',
                      },
                    }}
                  >
                    Add Discount
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={onCancelSession}
                    sx={{
                      textTransform: 'none',
                      fontSize: '15px',
                      fontWeight: 500,
                      padding: '10px',
                      borderColor: '#DC3545',
                      color: '#DC3545',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(220, 53, 69, 0.04)',
                        borderColor: '#C82333',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </S.TotalSection>

        <ProductEditModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitProduct}
          product={viewingProduct || editingProduct}
          mode={viewingProduct ? 'view' : editingProduct ? 'edit' : 'add'}
        />

        {}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </S.Container>
    </Box>
  );
};

export default ProductEdit;
