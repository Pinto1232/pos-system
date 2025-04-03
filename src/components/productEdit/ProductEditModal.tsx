import React, { useState, useEffect } from 'react';
import { Product } from './types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    IconButton,
    Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '600px',
        maxWidth: '90vw',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        background: '#FFFFFF',
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    padding: '24px 32px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    background: '#F8F9FA',
    '& .MuiTypography-root': {
        fontSize: '24px',
        fontWeight: 600,
        color: '#1E2A3B',
        letterSpacing: '-0.5px',
    },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    '& .MuiTextField-root': {
        marginBottom: '0',
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#52B788',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#52B788',
                borderWidth: '2px',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#6C757D',
            '&.Mui-focused': {
                color: '#52B788',
            },
        },
    },
    '& .MuiSelect-root': {
        borderRadius: '12px',
    },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: '24px 32px',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
    gap: '16px',
    background: '#F8F9FA',
}));

const ImageSection = styled(Box)(({ theme }) => ({
    width: '100%',
    marginBottom: '8px',
    marginTop: '16px',
}));

const ImageUploadContainer = styled(Box)(({ theme }) => ({
    border: '2px dashed rgba(0, 0, 0, 0.12)',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    background: '#FFFFFF',
    maxWidth: '160px',
    margin: '0 auto',
    '&:hover': {
        borderColor: '#52B788',
        backgroundColor: 'rgba(82, 183, 136, 0.04)',
        transform: 'translateY(-2px)',
    },
}));

const PreviewImage = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    maxHeight: '100px',
    marginTop: '8px',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    objectFit: 'cover',
}));

const FormSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
}));

const FormRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '24px',
}));

const FormField = styled(Box)(({ theme }) => ({
    flex: 1,
}));

interface ProductEditModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    product?: Product | null;
    mode?: 'view' | 'add' | 'edit';
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
    open,
    onClose,
    onSubmit,
    product,
    mode = 'add'
}) => {
    const [formData, setFormData] = useState({
        productName: '',
        idCode: '',
        sku: '',
        price: '',
        statusProduct: '',
        rating: '',
        image: '',
        createdAt: new Date(),
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (product && mode === 'view') {
            setFormData({
                productName: product.productName || '',
                idCode: product.barcode || '',
                sku: product.sku || '',
                price: product.price?.toString() || '',
                statusProduct: product.statusProduct || '',
                rating: product.rating?.toString() || '',
                image: product.image || '',
                createdAt: new Date(product.createdAt || new Date()),
            });
            setPreviewImage(product.image || null);
        }
    }, [product, mode]);

    const handleTextChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setFormData({
            ...formData,
            statusProduct: event.target.value,
        });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewImage(base64String);
                setFormData({
                    ...formData,
                    image: base64String,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setFormData({
                ...formData,
                createdAt: date,
            });
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setFormData({
            ...formData,
            image: '',
        });
    };

    const handleSubmit = () => {
        console.log('Modal - Form data before submit:', formData);
        onSubmit({
            ...formData,
            createdAt: formData.createdAt.toISOString().split('T')[0],
        });
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StyledDialog open={open} onClose={onClose} aria-labelledby="product-dialog">
                <StyledDialogTitle id="product-dialog">
                    {mode === 'view' ? 'View Product' : 'Add New Product'}
                </StyledDialogTitle>
                <StyledDialogContent>
                    <ImageSection>
                        <ImageUploadContainer>
                            {mode === 'view' ? (
                                previewImage && (
                                    <Box position="relative">
                                        <PreviewImage src={previewImage} alt="Product" />
                                    </Box>
                                )
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="image-upload"
                                        onChange={handleImageUpload}
                                    />
                                    <label htmlFor="image-upload">
                                        <Stack direction="column" alignItems="center" spacing={0.5}>
                                            <CloudUploadIcon sx={{
                                                fontSize: 24,
                                                color: '#52B788',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                }
                                            }} />
                                            <Typography variant="body2" sx={{
                                                color: '#6C757D',
                                                fontWeight: 500,
                                                fontSize: '0.75rem',
                                            }}>
                                                Click to upload
                                            </Typography>
                                            <Typography variant="caption" sx={{
                                                color: '#ADB5BD',
                                                fontSize: '0.65rem',
                                            }}>
                                                PNG, JPG or GIF
                                            </Typography>
                                        </Stack>
                                    </label>
                                    {previewImage && (
                                        <Box position="relative">
                                            <PreviewImage src={previewImage} alt="Preview" />
                                            <IconButton
                                                onClick={handleRemoveImage}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                    '&:hover': {
                                                        backgroundColor: '#FFFFFF',
                                                        transform: 'scale(1.1)',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </>
                            )}
                        </ImageUploadContainer>
                    </ImageSection>

                    <FormSection>
                        <FormRow>
                            <FormField>
                                <TextField
                                    fullWidth
                                    label="Product Name"
                                    value={formData.productName}
                                    onChange={handleTextChange('productName')}
                                    variant="outlined"
                                    disabled={mode === 'view'}
                                />
                            </FormField>
                            <FormField>
                                <TextField
                                    fullWidth
                                    label="ID Code"
                                    value={formData.idCode}
                                    onChange={handleTextChange('idCode')}
                                    variant="outlined"
                                    disabled={mode === 'view'}
                                />
                            </FormField>
                        </FormRow>

                        <FormRow>
                            <FormField>
                                <TextField
                                    fullWidth
                                    label="SKU"
                                    value={formData.sku}
                                    onChange={handleTextChange('sku')}
                                    variant="outlined"
                                    disabled={mode === 'view'}
                                />
                            </FormField>
                            <FormField>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleTextChange('price')}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1, color: '#6C757D' }}>$</Typography>,
                                    }}
                                    disabled={mode === 'view'}
                                />
                            </FormField>
                        </FormRow>

                        <FormRow>
                            <FormField>
                                <FormControl fullWidth>
                                    <InputLabel>Status Product</InputLabel>
                                    <Select
                                        value={formData.statusProduct}
                                        onChange={handleSelectChange}
                                        label="Status Product"
                                        disabled={mode === 'view'}
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                        <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                                    </Select>
                                </FormControl>
                            </FormField>
                            <FormField>
                                <TextField
                                    fullWidth
                                    label="Rating"
                                    type="number"
                                    value={formData.rating}
                                    onChange={handleTextChange('rating')}
                                    variant="outlined"
                                    inputProps={{
                                        min: 0,
                                        max: 5,
                                        step: 0.1,
                                    }}
                                    disabled={mode === 'view'}
                                />
                            </FormField>
                        </FormRow>

                        <FormRow>
                            <FormField>
                                <DatePicker
                                    label="Created At"
                                    value={formData.createdAt}
                                    onChange={handleDateChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined',
                                        },
                                    }}
                                    disabled={mode === 'view'}
                                />
                            </FormField>
                        </FormRow>
                    </FormSection>
                </StyledDialogContent>
                <StyledDialogActions>
                    <Button
                        onClick={onClose}
                        sx={{
                            color: '#6C757D',
                            fontWeight: 500,
                            '&:hover': {
                                backgroundColor: 'rgba(108, 117, 125, 0.04)',
                            },
                        }}
                    >
                        {mode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                    {mode !== 'view' && (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{
                                backgroundColor: '#52B788',
                                fontWeight: 600,
                                padding: '8px 24px',
                                borderRadius: '12px',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#429670',
                                    boxShadow: '0 4px 12px rgba(82, 183, 136, 0.2)',
                                },
                            }}
                        >
                            {mode === 'edit' ? 'Update Product' : 'Add Product'}
                        </Button>
                    )}
                </StyledDialogActions>
            </StyledDialog>
        </LocalizationProvider>
    );
};

export default ProductEditModal;