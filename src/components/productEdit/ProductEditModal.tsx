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
  Switch,
  FormControlLabel,
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
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    background: '#FFFFFF',
    backdropFilter: 'blur(10px)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: '28px 32px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  background: 'linear-gradient(to right, #F8F9FA, #FFFFFF)',
  '& .MuiTypography-root': {
    fontSize: '26px',
    fontWeight: 600,
    color: '#1E2A3B',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    '&::before': {
      content: '""',
      display: 'block',
      width: '4px',
      height: '24px',
      backgroundColor: '#52B788',
      borderRadius: '2px',
    },
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  background: '#FFFFFF',
  '& .MuiTextField-root': {
    marginBottom: '0',
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
      transition: 'all 0.2s ease-in-out',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#52B788',
        borderWidth: '1.5px',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#52B788',
        borderWidth: '2px',
        boxShadow: '0 0 0 4px rgba(82, 183, 136, 0.1)',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#6C757D',
      transition: 'all 0.2s ease-in-out',
      '&.Mui-focused': {
        color: '#52B788',
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
  },
  '& .MuiSelect-root': {
    borderRadius: '12px',
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: '24px 32px',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  gap: '16px',
  background: 'linear-gradient(to right, #FFFFFF, #F8F9FA)',
}));

const ImageSection = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: '8px',
  marginTop: '16px',
}));

const ImageUploadContainer = styled(Box)(({ theme }) => ({
  border: '2px dashed rgba(82, 183, 136, 0.3)',
  borderRadius: '16px',
  padding: '16px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  background: 'rgba(82, 183, 136, 0.02)',
  maxWidth: '180px',
  margin: '0 auto',
  '&:hover': {
    borderColor: '#52B788',
    backgroundColor: 'rgba(82, 183, 136, 0.04)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(82, 183, 136, 0.1)',
  },
}));

const PreviewImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '120px',
  marginTop: '12px',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  objectFit: 'cover',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
  padding: '8px 0',
}));

const FormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  '&:hover .MuiTextField-root .MuiOutlinedInput-root': {
    borderColor: '#52B788',
  },
}));

const FormField = styled(Box)(({ theme }) => ({
  flex: 1,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '100%',
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(82, 183, 136, 0.1), transparent)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  product?: Product | null;
  mode?: 'view' | 'add' | 'edit';
}

interface FormData {
  productName: string;
  color: string;
  idCode: string;
  sku: string;
  price: string;
  statusProduct: string;
  rating: string;
  image: string;
  createdAt: Date;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  open,
  onClose,
  onSubmit,
  product,
  mode = 'add',
}) => {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    color: 'Black',
    idCode: '',
    sku: '',
    price: '',
    statusProduct: 'Active',
    rating: '',
    image: '',
    createdAt: new Date(),
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (product && (mode === 'view' || mode === 'edit')) {
      setFormData({
        productName: product.productName || '',
        color: product.color || 'Black',
        idCode: product.barcode || '',
        sku: product.sku || '',
        price: product.price?.toString() || '',
        statusProduct: product.status ? 'Active' : 'Inactive',
        rating: product.rating?.toString() || '',
        image: product.image || '',
        createdAt: new Date(product.createdAt || new Date()),
      });
      setPreviewImage(product.image || null);
    }
  }, [product, mode]);

  const handleTextChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: product?.id || Date.now(),
      productName: formData.productName,
      color: formData.color,
      barcode: formData.idCode,
      sku: formData.sku,
      price: parseFloat(formData.price) || 0,
      status: formData.statusProduct === 'Active',
      rating: parseFloat(formData.rating) || 0,
      image: formData.image || '/placeholder-image.png',
      createdAt: new Date().toISOString(),
    };
    onSubmit(newProduct);
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
                    <Stack direction="column" alignItems="center" spacing={0.25}>
                      <CloudUploadIcon
                        sx={{
                          fontSize: 20,
                          color: '#52B788',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6C757D',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          lineHeight: 1.2,
                        }}
                      >
                        Click to upload
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#ADB5BD',
                          fontSize: '0.65rem',
                          lineHeight: 1.2,
                        }}
                      >
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
                    startAdornment: <Typography sx={{ mr: 1, color: '#6C757D' }}>R</Typography>,
                  }}
                  disabled={mode === 'view'}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.statusProduct === 'Active'}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          statusProduct: e.target.checked ? 'Active' : 'Inactive',
                        });
                      }}
                      disabled={mode === 'view'}
                      color="primary"
                    />
                  }
                  label="Status Product"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: '#6C757D',
                    },
                    '& .MuiSwitch-root': {
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#52B788',
                        '&:hover': {
                          backgroundColor: 'rgba(82, 183, 136, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#52B788',
                      },
                    },
                  }}
                />
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
