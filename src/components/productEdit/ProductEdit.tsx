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
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [viewingProduct, setViewingProduct] = React.useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const { updateProduct, addProduct } = useProductContext();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(9);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    console.log('ProductEdit - Received data from modal:', JSON.stringify(data, null, 2));
    const productWithStatus = {
      ...data,
      id: data.id || Date.now(),
      productName: data.productName || 'Unnamed Product',
      color: data.color || 'Black',
      barcode: data.barcode || `BC-${Date.now()}`,
      sku: data.sku || `SKU-${Date.now()}`,
      price: typeof data.price === 'number' ? data.price : 0,
      status: Boolean(data.status),
      rating: typeof data.rating === 'number' ? data.rating : 0,
      createdAt: data.createdAt || new Date().toISOString(),
      image: data.image || '/placeholder-image.png',
      statusProduct: Boolean(data.status) ? 'Active' : 'Inactive',
    };

    console.log('ProductEdit - Enhanced product data:', JSON.stringify(productWithStatus, null, 2));

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
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const updatedProducts = editingProduct
        ? existingProducts.map((p: Product) => (p.id === productWithStatus.id ? productWithStatus : p))
        : [...existingProducts, productWithStatus];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error saving product to localStorage:', JSON.stringify(error, null, 2));
    }

    handleCloseModal();
  };

  const columns: GridColDef[] = [
    {
      field: 'image',
      headerName: 'Icon',
      width: 70,
      renderCell: (params) => (
        <Avatar
          src={params.value || '/placeholder-image.png'}
          alt={params.row.productName}
          sx={{
            width: 36,
            height: 36,
            borderRadius: '4px',
            border: '1px solid #f0f0f0',
          }}
          variant="rounded"
        />
      ),
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 1.8,
      minWidth: 160,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}
          >
            {params.value}
          </Typography>
          {params.row.color && (
            <Chip
              label={params.row.color}
              size="small"
              sx={{
                height: 20,
                minWidth: 60,
                padding: '2px 4px',
                fontSize: '0.7rem',
                fontWeight: 500,
                bgcolor: getColorStyles(params.row.color).bg,
                color: getColorStyles(params.row.color).text,
                border: '1px solid #e2e8f0',
                flexShrink: 0,
                '@media (max-width: 768px)': {
                  minWidth: 40,
                  fontSize: '0.65rem',
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
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'barcode',
      headerName: 'ID Code',
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.8,
      minWidth: 80,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        const price = params.row.price !== undefined ? params.row.price : 0;
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: '#1E2A3B',
            }}
          >
            R{Number(price).toFixed(2)}
          </Typography>
        );
      },
    },
    {
      field: 'statusProduct',
      headerName: 'Status',
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Switch
            checked={params.value === 'Active'}
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
                color: '#52B788',
                '&:hover': {
                  backgroundColor: 'rgba(82, 183, 136, 0.08)',
                },
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#52B788',
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              ml: 0.5,
              fontSize: '0.75rem',
              color: params.value === 'Active' ? '#52B788' : '#9e9e9e',
              '@media (max-width: 768px)': {
                display: 'none',
              },
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 0.6,
      minWidth: 70,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
          }}
        >
          {params.value || '0'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 0.9,
      minWidth: 110,
      renderCell: (params) => {
        try {
          const date = new Date(params.row.createdAt);
          return (
            <Typography variant="body2">
              {date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
          );
        } catch {
          return <Typography variant="body2">{params.row.createdAt || '-'}</Typography>;
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 110,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <IconButton
            size="small"
            color="primary"
            sx={{
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
            onClick={() => handleViewProduct(params.row)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            sx={{
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
            onClick={() => handleEditProduct(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            sx={{
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
              },
            }}
            onClick={() => onDeleteItem(params.row.id)}
          >
            <DeleteIcon fontSize="small" />
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
    return products.filter((product) => selectedRows.includes(product.id.toString()));
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
      product.productName,
      product.sku || '-',
      product.barcode || '-',
      `R${(product.price || 0).toFixed(2)}`,
      product.status ? 'Active' : 'Inactive',
      product.rating?.toString() || '-',
      new Date(product.createdAt || new Date()).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Product Name', 'SKU', 'ID Code', 'Price', 'Status', 'Rating', 'Created At']],
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
          cellWidth: 50,
          overflow: 'linebreak',
        },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 25 },
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

  const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
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
              <S.ExportButton startIcon={<PictureAsPdfIcon />} onClick={handleExportPDF}>
                Export as PDF
              </S.ExportButton>
            </S.HeaderWrapper>
          </S.HeaderSection>

          <S.TableHeaderRow>
            <S.CheckboxCell>
              <Checkbox size="small" />
            </S.CheckboxCell>
            <S.StandardCell>Image</S.StandardCell>
            <S.ProductNameCell>Product Name</S.ProductNameCell>
            <S.StandardCell>SKU</S.StandardCell>
            <S.StandardCell>ID Code</S.StandardCell>
            <S.StandardCell>Price</S.StandardCell>
            <S.StandardCell>Status</S.StandardCell>
            <S.StandardCell>Rating</S.StandardCell>
            <S.StandardCell>Created At</S.StandardCell>
            <S.StandardCell>Actions</S.StandardCell>
          </S.TableHeaderRow>

          <S.ButtonGroup>
            <S.AddItemButton variant="contained" onClick={handleOpenModal} startIcon={<AddIcon />}>
              Add item manually
            </S.AddItemButton>
            <S.QrCodeButton variant="contained">
              <QrCodeScannerIcon />
            </S.QrCodeButton>
            <S.NewSessionButton variant="contained" onClick={onNewSession} startIcon={<StorefrontIcon />}>
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
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  zIndex: 1,
                  '& .MuiDataGrid-main': {
                    width: '100%',
                    overflow: 'auto',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #E0E0E0',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #E0E0E0',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#c1c1c1',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#a8a8a8',
                    },
                  },
                  '@media (max-width: 768px)': {
                    '& .MuiDataGrid-columnHeaders': {
                      fontSize: '0.8rem',
                    },
                    '& .MuiDataGrid-cell': {
                      fontSize: '0.8rem',
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
                rowHeight={60}
                columnHeaderHeight={56}
                getRowId={(row) => row.id}
                density="standard"
                disableColumnFilter
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
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
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
                {selectedRows.length > 0 ? 'Selected Items' : 'Items'} ({selectedRows.length > 0 ? selectedRows.length : products.length})
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#1E2A3B',
                }}
              >
                R{(selectedRows.length > 0 ? selectedProductsPrice : totalProductsPrice).toFixed(2)}
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
                R{(selectedRows.length > 0 ? selectedProductsPrice : totalProductsPrice).toFixed(2)}
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
                    setSnackbarMessage(`${selectedRows.length} items added to cart`);
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
                <S.CollectPaymentButton variant="contained" onClick={onCollectPayment}>
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
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </S.Container>
    </Box>
  );
};

export default ProductEdit;
