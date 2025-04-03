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
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddIcon from '@mui/icons-material/Add';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ProductEditProps, Product } from './types';
import * as S from './styles';
import ProductEditModal from './ProductEditModal';

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
    total,
    itemNo,
    onDeleteItem,
}) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [viewingProduct, setViewingProduct] = React.useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

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
        console.log('ProductEdit - Received data from modal:', data);
        if (editingProduct) {
            onUpdateItem(data);
        } else {
            onAddItem(data);
        }
        handleCloseModal();
    };

    const columns: GridColDef[] = [
        {
            field: 'select',
            headerName: '',
            width: 70,
            renderHeader: () => <Checkbox size="small" />,
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
                    src={params.value || '/placeholder-image.png'}
                    alt={params.row.productName}
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '4px'
                    }}
                />
            ),
        },
        {
            field: 'productName',
            headerName: 'Product Name',
            flex: 2,
            minWidth: 200,
        },
        {
            field: 'sku',
            headerName: 'SKU',
            flex: 1,
            minWidth: 120,
        },
        {
            field: 'barcode',
            headerName: 'ID Code',
            flex: 1,
            minWidth: 130,
        },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1,
            minWidth: 100,
            type: 'number',
            align: 'left',
            headerAlign: 'left',
            valueFormatter: (params: GridRenderCellParams) => {
                const value = params.value;
                if (typeof value === 'number') {
                    return `R${value.toFixed(2)}`;
                }
                return 'R0.00';
            },
            valueGetter: (params: GridRenderCellParams) => {
                if (!params || !params.row) return 0;
                const row = params.row as Product;
                return row?.price ?? 0;
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
                            statusProduct: e.target.checked ? 'Active' : 'Inactive'
                        };
                        onUpdateItem(updatedProduct);
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
            ),
        },
        {
            field: 'rating',
            headerName: 'Rating',
            flex: 1,
            minWidth: 100,
            type: 'number',
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            flex: 1,
            minWidth: 150,
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
                        sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}
                        onClick={() => handleViewProduct(params.row)}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="primary"
                        sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}
                        onClick={() => handleEditProduct(params.row)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' } }}
                        onClick={() => onDeleteItem(params.row.id)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <S.Container>
            <S.ProductListSection>
                <S.HeaderSection>
                    <S.HeaderWrapper>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            fontSize: '20px',
                            color: '#1E2A3B'
                        }}>
                            Inventory
                        </Typography>
                        <S.ExportButton
                            variant="outlined"
                            startIcon={<QrCodeScannerIcon />}
                        >
                            Export Product
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
                    <S.StandardCell>Status Product</S.StandardCell>
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
                    <S.QrCodeButton
                        variant="contained"
                    >
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
                            rows={products}
                            columns={columns}
                            autoHeight
                            hideFooter
                            disableRowSelectionOnClick
                            checkboxSelection={false}
                            disableColumnMenu
                            rowHeight={60}
                            columnHeaderHeight={56}
                            getRowId={(row) => row.id}
                            onStateChange={(state) => {
                                console.log('ProductEdit - DataGrid state:', state);
                                console.log('ProductEdit - Current products in DataGrid:', products);
                            }}
                            sx={{
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: '#F8F9FA',
                                },
                                '& .MuiDataGrid-cell:focus': {
                                    outline: 'none',
                                },
                                '& .MuiDataGrid-columnHeader:focus': {
                                    outline: 'none',
                                },
                                '& .MuiDataGrid-main': {
                                    position: 'relative',
                                    zIndex: 0,
                                },
                            }}
                            slotProps={{
                                basePopper: {
                                    sx: {
                                        zIndex: 1300,
                                    },
                                },
                            }}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            processRowUpdate={(newRow, oldRow) => {
                                if (!newRow || !oldRow) return oldRow;
                                console.log('Updating row:', { newRow, oldRow });
                                return newRow;
                            }}
                            aria-label="Product inventory table"
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
                            sx={{ fontSize: '13px', marginBottom: '8px' }}
                        >
                            Item No.
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            fontSize: '24px',
                            color: '#1E2A3B'
                        }}>
                            {itemNo}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ fontSize: '13px', marginBottom: '8px' }}
                        >
                            Sub Total (Incld. Tax)
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            fontSize: '24px',
                            color: '#1E2A3B'
                        }}>
                            R{subTotal.toFixed(2)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ fontSize: '13px', marginBottom: '8px' }}
                        >
                            Discount
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            fontSize: '24px',
                            color: '#1E2A3B'
                        }}>
                            ${discount.toFixed(2)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ fontSize: '13px', marginBottom: '8px' }}
                        >
                            Total
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            fontSize: '24px',
                            color: '#1E2A3B'
                        }}>
                            ${total.toFixed(2)}
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
                product={viewingProduct || editingProduct}
                mode={viewingProduct ? 'view' : editingProduct ? 'edit' : 'add'}
            />
        </S.Container>
    );
};

export default ProductEdit; 