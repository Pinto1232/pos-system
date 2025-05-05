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
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
} from '@mui/x-data-grid';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  ProductEditProps,
  Product,
} from './types';
import * as S from './styles';
import ProductEditModal from './ProductEditModal';
import { useProductContext } from '@/contexts/ProductContext';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  total, // Not used directly, we use totalProductsPrice instead
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  itemNo, // Not used directly, we use products.length instead
  onDeleteItem,
}) => {
  const [isModalOpen, setIsModalOpen] =
    React.useState(false);
  const [viewingProduct, setViewingProduct] =
    React.useState<Product | null>(null);
  const [editingProduct, setEditingProduct] =
    React.useState<Product | null>(null);
  const { updateProduct, addProduct } =
    useProductContext();

  // Pagination state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(9);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  // Handle page change
  const handleChangePage = (
    _: unknown, // Unused parameter
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated products
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

  const handleViewProduct = (
    product: Product
  ) => {
    setViewingProduct(product);
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (
    product: Product
  ) => {
    setEditingProduct(product);
    setViewingProduct(null);
    setIsModalOpen(true);
  };

  const handleSubmitProduct = (data: Product) => {
    console.log(
      'ProductEdit - Received data from modal:',
      data
    );

    const productWithStatus = {
      ...data,
      status: data.status,
      statusProduct: data.status
        ? 'Active'
        : 'Inactive',
    };

    if (editingProduct) {
      onUpdateItem(productWithStatus);
      updateProduct(productWithStatus);
    } else {
      onAddItem(
        productWithStatus,
        handleCloseModal
      );
      addProduct(productWithStatus);
    }
    handleCloseModal();
  };

  const columns: GridColDef[] = [
    {
      field: 'select',
      headerName: '',
      width: 70,
      renderHeader: () => (
        <Checkbox size="small" />
      ),
      renderCell: () => <Checkbox size="small" />,
      sortable: false,
      filterable: false,
    },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={
            params.value ||
            '/placeholder-image.png'
          }
          alt={params.row.productName}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '4px',
          }}
        />
      ),
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 2,
      minWidth: 90,
    },
    {
      field: 'sku',
      headerName: 'SKU',
      flex: 1,
      minWidth: 90,
    },
    {
      field: 'barcode',
      headerName: 'ID Code',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      minWidth: 90,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        const price =
          params.row.price !== undefined
            ? params.row.price
            : 0;
        return (
          <span>R{Number(price).toFixed(2)}</span>
        );
      },
    },
    {
      field: 'statusProduct',
      headerName: 'Status Product',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Switch
          checked={params.value === 'Active'}
          onChange={(e) => {
            const updatedProduct = {
              ...params.row,
              statusProduct: e.target.checked
                ? 'Active'
                : 'Inactive',
              status: e.target.checked,
            };
            onUpdateItem(updatedProduct);
            updateProduct(updatedProduct);
          }}
          color="primary"
          size="small"
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked':
            {
              color: '#52B788',
              '&:hover': {
                backgroundColor:
                  'rgba(82, 183, 136, 0.08)',
              },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
            {
              backgroundColor: '#52B788',
            },
          }}
        />
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 1,
      minWidth: 20,
      type: 'number',
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        try {
          const date = new Date(
            params.row.createdAt
          );
          return (
            <span>
              {date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          );
        } catch {
          return (
            <span>
              {params.row.createdAt || '-'}
            </span>
          );
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            sx={{
              '&:hover': {
                backgroundColor:
                  'rgba(25, 118, 210, 0.08)',
              },
            }}
            onClick={() =>
              handleViewProduct(params.row)
            }
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            sx={{
              '&:hover': {
                backgroundColor:
                  'rgba(25, 118, 210, 0.08)',
              },
            }}
            onClick={() =>
              handleEditProduct(params.row)
            }
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            sx={{
              '&:hover': {
                backgroundColor:
                  'rgba(211, 47, 47, 0.08)',
              },
            }}
            onClick={() =>
              onDeleteItem(params.row.id)
            }
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const totalProductsPrice = React.useMemo(() => {
    return products.reduce(
      (sum, product) =>
        sum + (product.price || 0),
      0
    );
  }, [products]);

  // We're now using products.length directly in the UI

  // Function to handle PDF export
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Add company logo/name
    doc.setFontSize(20);
    doc.setTextColor(23, 58, 121); // Dark blue color
    doc.text('Pisval Tech', 14, 15);

    // Add title
    doc.setFontSize(16);
    doc.setTextColor(30, 42, 59); // Reset to dark text
    doc.text('Product Inventory Report', 14, 25);

    // Add business information
    doc.setFontSize(10);
    doc.text('Pisval Tech Point of Sale System', 14, 35);
    doc.text('Business Information:', 14, 40);
    doc.text('Email: info@pisvaltech.com', 14, 45);
    doc.text('Website: www.pisvaltech.com', 14, 50);
    doc.text('Phone: +27 123 456 789', 14, 55);

    // Add date and time
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      14,
      65
    );

    // Prepare data for the table
    const tableData = products.map(
      (product) => [
        product.productName,
        product.sku || '-',
        product.barcode || '-',
        `R${(product.price || 0).toFixed(2)}`,
        product.status ? 'Active' : 'Inactive',
        product.rating?.toString() || '-',
        new Date(
          product.createdAt || new Date()
        ).toLocaleDateString(),
      ]
    );

    // Add the table
    autoTable(doc, {
      startY: 70,
      head: [
        [
          'Product Name',
          'SKU',
          'ID Code',
          'Price',
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
        0: { cellWidth: 50, overflow: 'linebreak' },
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

    // Show success notification
    setSnackbarMessage('PDF exported successfully!');
    setSnackbarOpen(true);
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Use the subTotal prop if provided, otherwise calculate from products
  const calculatedSubTotal = React.useMemo(() => {
    return subTotal !== undefined ? subTotal : totalProductsPrice;
  }, [totalProductsPrice, subTotal]);

  // We're now using totalProductsPrice directly for the total display

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
                  fontSize: '20px',
                  color: '#1E2A3B',
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

          <S.TableHeaderRow>
            <S.CheckboxCell>
              <Checkbox size="small" />
            </S.CheckboxCell>
            <S.StandardCell>Image</S.StandardCell>
            <S.ProductNameCell>
              Product Name
            </S.ProductNameCell>
            <S.StandardCell>SKU</S.StandardCell>
            <S.StandardCell>
              ID Code
            </S.StandardCell>
            <S.StandardCell>Price</S.StandardCell>
            <S.StandardCell>
              Status Product
            </S.StandardCell>
            <S.StandardCell>
              Rating
            </S.StandardCell>
            <S.StandardCell>
              Created At
            </S.StandardCell>
            <S.StandardCell>
              Actions
            </S.StandardCell>
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
              <Typography
                variant="body1"
                color="textSecondary"
              >
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
                  ...{
                    border: 'none',
                    '& .MuiDataGrid-root': {
                      border: 'none',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: '#F8F9FA',
                    },
                    '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                    '& .MuiDataGrid-row:last-child .MuiDataGrid-cell:first-of-type': {
                      borderBottomLeftRadius: 0,
                    },
                    '& .MuiDataGrid-row:last-child .MuiDataGrid-cell:last-of-type': {
                      borderBottomRightRadius: 0,
                    },
                    '& .MuiDataGrid-cell:focus': {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-columnHeader:focus':
                    {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-main': {
                      width: '100%',
                      overflow: 'visible',
                    },
                    '& .MuiDataGrid-virtualScroller':
                    {
                      overflow: 'auto !important',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '0px',
                      },
                      '&::-webkit-scrollbar-track':
                      {
                        background: '#f1f1f1',
                      },
                      '&::-webkit-scrollbar-thumb':
                      {
                        background: '#888',
                        borderRadius: '4px',
                      },
                    },
                  }
                }}
                hideFooter={true}
                disableRowSelectionOnClick
                checkboxSelection={false}
                disableColumnMenu
                rowHeight={60}
                columnHeaderHeight={56}
                getRowId={(row) => row.id}
                onStateChange={(state) => {
                  console.log(
                    'ProductEdit - DataGrid state:',
                    state
                  );
                  console.log(
                    'ProductEdit - Current products in DataGrid:',
                    products
                  );
                }}

                slotProps={{
                  basePopper: {
                    sx: {
                      zIndex: 1300,
                    },
                  },
                }}
                processRowUpdate={(
                  newRow,
                  oldRow
                ) => {
                  if (!newRow || !oldRow)
                    return oldRow;
                  console.log('Updating row:', {
                    newRow,
                    oldRow,
                  });
                  return newRow;
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
                  borderRadius: '0 0 10px 10px',
                  borderTop: '1px solid rgba(224, 224, 224, 0.5)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                  '& .MuiToolbar-root': {
                    padding: '0 20px',
                    minHeight: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    color: 'rgba(0, 0, 0, 0.7)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    margin: '0 8px',
                  },
                  '& .MuiTablePagination-select': {
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    marginRight: '8px',
                    '&:focus': {
                      backgroundColor: '#f0f2f5',
                    },
                  },
                  '& .MuiTablePagination-actions': {
                    marginLeft: '16px',
                    '& .MuiIconButton-root': {
                      padding: '6px',
                      color: 'rgba(0, 0, 0, 0.6)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                      '&.Mui-disabled': {
                        color: 'rgba(0, 0, 0, 0.26)',
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
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: '13px',
                  marginBottom: '8px',
                }}
              >
                Item No.
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '24px',
                  color: '#1E2A3B',
                }}
              >
                {products.length} Products
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: '13px',
                  marginBottom: '8px',
                }}
              >
                Total Products Price
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '24px',
                  color: '#1E2A3B',
                }}
              >
                R{totalProductsPrice.toFixed(2)}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: '13px',
                  marginBottom: '8px',
                }}
              >
                Sub Total (Incld. Tax)
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '24px',
                  color: '#1E2A3B',
                }}
              >
                R{calculatedSubTotal.toFixed(2)} (Subtotal)
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: '13px',
                  marginBottom: '8px',
                }}
              >
                Discount
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '24px',
                  color: '#1E2A3B',
                }}
              >
                R{discount.toFixed(2)}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{
                  fontSize: '13px',
                  marginBottom: '8px',
                }}
              >
                Total
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '24px',
                  color: '#1E2A3B',
                }}
              >
                R{totalProductsPrice.toFixed(2)} (Total Price)
              </Typography>
            </Box>

            <S.CollectPaymentButton
              variant="contained"
              onClick={onCollectPayment}
            >
              Collect Payment
            </S.CollectPaymentButton>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="inherit"
                fullWidth
                onClick={onAddDiscount}
                sx={{
                  textTransform: 'none',
                  fontSize: '14px',
                  flexWrap: 'nowrap',
                  backgroundColor: '#F8F9FA',
                  color: '#1E2A3B',
                  '&:hover': {
                    backgroundColor: '#E9ECEF',
                  },
                }}
              >
                Add Discount
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={onCancelSession}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#DC3545',
                  '&:hover': {
                    backgroundColor: '#C82333',
                  },
                }}
              >
                Cancel Session
              </Button>
            </Stack>
          </Stack>
        </S.TotalSection>

        <ProductEditModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitProduct}
          product={
            viewingProduct || editingProduct
          }
          mode={
            viewingProduct
              ? 'view'
              : editingProduct
                ? 'edit'
                : 'add'
          }
        />

        {/* Success notification */}
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
