import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
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
  IconButton,
  Stack,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { getColorStyles } from '@/utils/colorUtils';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    width: '650px',
    maxWidth: '95vw',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    background: '#FFFFFF',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease-in-out',
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  padding: '24px 32px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  background: '#ffffff',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '3px',
    background:
      'linear-gradient(90deg, #52B788 0%, #3B82F6 100%)',
    borderRadius: '8px',
  },
  '& .MuiTypography-root': {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1E293B',
    letterSpacing: '-0.3px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    '&::before': {
      content: '""',
      display: 'block',
      width: '4px',
      height: '24px',
      background:
        'linear-gradient(180deg, #52B788 0%, #3B82F6 100%)',
      borderRadius: '4px',
    },
  },
});

const StyledDialogContent = styled(DialogContent)(
  {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    background: '#FFFFFF',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#a8a8a8',
    },
    '& .MuiTextField-root': {
      marginBottom: '0',
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        '& fieldset': {
          border: 'none',
        },
        '&:hover': {
          backgroundColor: '#FFFFFF',
          border: '1px solid #3B82F6',
          boxShadow:
            '0 2px 8px rgba(59, 130, 246, 0.1)',
        },
        '&.Mui-focused': {
          backgroundColor: '#FFFFFF',
          border: '1px solid #3B82F6',
          boxShadow:
            '0 0 0 3px rgba(59, 130, 246, 0.15)',
        },
        '& input': {
          padding: '12px 16px',
          fontSize: '14px',
          '&::placeholder': {
            color: '#94A3B8',
            opacity: 1,
          },
        },
        '& .MuiInputAdornment-root': {
          marginLeft: '16px',
          marginRight: '-4px',
          '& .MuiTypography-root': {
            fontSize: '14px',
            color: '#64748B',
          },
        },
      },
      '& .MuiInputLabel-root': {
        color: '#475569',
        fontSize: '14px',
        fontWeight: 500,
        transform:
          'translate(16px, 13px) scale(1)',
        '&.Mui-focused': {
          color: '#3B82F6',
          transform:
            'translate(16px, -9px) scale(0.75)',
        },
        '&.MuiInputLabel-shrink': {
          transform:
            'translate(16px, -9px) scale(0.75)',
        },
      },
    },
    '& .MuiFormControl-root': {
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        '& fieldset': {
          border: 'none',
        },
        '&:hover': {
          backgroundColor: '#FFFFFF',
          border: '1px solid #3B82F6',
          boxShadow:
            '0 2px 8px rgba(59, 130, 246, 0.1)',
        },
        '&.Mui-focused': {
          backgroundColor: '#FFFFFF',
          border: '1px solid #3B82F6',
          boxShadow:
            '0 0 0 3px rgba(59, 130, 246, 0.15)',
        },
      },
      '& .MuiInputLabel-root': {
        color: '#475569',
        '&.Mui-focused': {
          color: '#3B82F6',
        },
      },
    },
    '& .MuiSelect-root': {
      backgroundColor: '#F8FAFC',
      borderRadius: '8px',
    },
    '& .MuiDatePicker-root .MuiOutlinedInput-root':
      {
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        '& fieldset': {
          border: 'none',
        },
        '&:hover': {
          backgroundColor: '#FFFFFF',
          border: '1px solid #3B82F6',
          boxShadow:
            '0 2px 8px rgba(59, 130, 246, 0.1)',
        },
        '&.Mui-focused': {
          backgroundColor: '#FFFFFF',
          border: '1px solid #3B82F6',
          boxShadow:
            '0 0 0 3px rgba(59, 130, 246, 0.15)',
        },
      },
    '& .MuiSwitch-root': {
      width: 42,
      height: 24,
      padding: 0,
      '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
          transform: 'translateX(18px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            background:
              'linear-gradient(90deg, #52B788 0%, #3B82F6 100%)',
            opacity: 1,
            border: 0,
          },
        },
      },
      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 20,
        height: 20,
        boxShadow:
          '0 2px 4px 0 rgba(0, 35, 11, 0.2)',
      },
      '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#E2E8F0',
        opacity: 1,
      },
    },
  }
);

const StyledDialogActions = styled(DialogActions)(
  {
    padding: '24px 32px',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
    gap: '16px',
    background: '#FFFFFF',
    justifyContent: 'flex-end',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '3px',
      background:
        'linear-gradient(90deg, #52B788 0%, #3B82F6 100%)',
      borderRadius: '8px',
      opacity: 0.5,
    },
  }
);

const ImageSection = styled(Box)({
  width: '100%',
  marginBottom: '16px',
  marginTop: '8px',
  display: 'flex',
  justifyContent: 'center',
});

const ImageUploadContainer = styled(Box)({
  border: '2px dashed rgba(59, 130, 246, 0.3)',
  borderRadius: '12px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  background: 'rgba(59, 130, 246, 0.02)',
  maxWidth: '200px',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.04)',
    transform: 'translateY(-2px)',
    boxShadow:
      '0 12px 28px rgba(59, 130, 246, 0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(82, 183, 136, 0.05) 100%)',
    opacity: 0.5,
    zIndex: 0,
  },
});

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '140px',
  marginTop: '12px',
  borderRadius: '8px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  objectFit: 'cover',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 1,
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
  },
});

const FormSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '8px 0',
});

const FormRow = styled(Box)({
  display: 'flex',
  gap: '20px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  '&:hover .MuiTextField-root .MuiOutlinedInput-root':
    {
      borderColor: '#3B82F6',
      boxShadow:
        '0 2px 8px rgba(59, 130, 246, 0.1)',
    },
  '&:hover .MuiFormControl-root .MuiOutlinedInput-root':
    {
      borderColor: '#3B82F6',
      boxShadow:
        '0 2px 8px rgba(59, 130, 246, 0.1)',
    },
});

const FormField = styled(Box)({
  flex: 1,
  position: 'relative',
  '& .MuiFormControl-root': {
    width: '100%',
  },
  '& .MuiFormControlLabel-root': {
    marginLeft: 0,
    marginRight: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#FFFFFF',
      borderColor: '#3B82F6',
      boxShadow:
        '0 2px 8px rgba(59, 130, 246, 0.1)',
    },
    '& .MuiFormControlLabel-label': {
      fontSize: '14px',
      fontWeight: 500,
      color: '#475569',
    },
  },
});

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Product) => void;
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

// Available colors for the color dropdown
const AVAILABLE_COLORS = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Purple',
  'Orange',
  'Pink',
  'Gray',
  'Brown',
  'Silver',
  'Gold',
  'Space Gray',
  'Navy',
  'Teal',
  'Maroon',
  'Olive',
  'Cyan',
  'Magenta',
  'Lime',
];

const ProductEditModal: React.FC<
  ProductEditModalProps
> = ({
  open,
  onClose,
  onSubmit,
  product,
  mode = 'add',
}) => {
  const defaultFormData = useMemo(
    () => ({
      productName: '',
      color: 'Black',
      idCode: '',
      sku: '',
      price: '',
      statusProduct: 'Active',
      rating: '',
      image: '',
      createdAt: new Date(),
    }),
    []
  );

  const [formData, setFormData] =
    useState<FormData>(defaultFormData);
  const [previewImage, setPreviewImage] =
    useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormData({
      ...defaultFormData,
      color: defaultFormData.color || 'Black',
    });
    setPreviewImage(null);
  }, [defaultFormData]);

  useEffect(() => {
    if (
      product &&
      (mode === 'view' || mode === 'edit')
    ) {
      setFormData({
        productName: product.productName || '',
        color: product.color || 'Black',
        idCode: product.barcode || '',
        sku: product.sku || '',
        price: product.price?.toString() || '',
        statusProduct: product.status
          ? 'Active'
          : 'Inactive',
        rating: product.rating?.toString() || '',
        image: product.image || '',
        createdAt: new Date(
          product.createdAt || new Date()
        ),
      });
      setPreviewImage(product.image || null);
    } else {
      resetForm();
    }
  }, [product, mode, open, resetForm]);

  const handleTextChange =
    (field: string) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String =
          reader.result as string;
        setPreviewImage(base64String);
        setFormData({
          ...formData,
          image: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (
    date: Date | null
  ) => {
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
      productName:
        formData.productName || 'Unnamed Product',
      color: formData.color || 'Black',
      barcode:
        formData.idCode || `BC-${Date.now()}`,
      sku: formData.sku || `SKU-${Date.now()}`,
      price: parseFloat(formData.price) || 0,
      status: formData.statusProduct === 'Active',
      rating: parseFloat(formData.rating) || 0,
      image:
        formData.image ||
        '/placeholder-image.png',
      createdAt: formData.createdAt.toISOString(),
      statusProduct:
        formData.statusProduct === 'Active'
          ? 'Active'
          : 'Inactive',
    };
    console.log(
      'ProductEditModal - Submitting product with complete data:',
      newProduct
    );
    onSubmit(newProduct);
    // Reset form data to defaults
    resetForm();
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
    >
      <StyledDialog
        open={open}
        onClose={() => {
          onClose();
          resetForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle id="product-dialog">
          {mode === 'view'
            ? 'View Product'
            : 'Add New Product'}
        </StyledDialogTitle>
        <StyledDialogContent>
          <ImageSection>
            <ImageUploadContainer>
              {mode === 'view' ? (
                previewImage && (
                  <Box position="relative">
                    <PreviewImage
                      src={previewImage}
                      alt="Product"
                    />
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
                    <Stack
                      direction="column"
                      alignItems="center"
                      spacing={0.25}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent:
                            'center',
                          background:
                            'linear-gradient(135deg, #3B82F6 0%, #52B788 100%)',
                          boxShadow:
                            '0 4px 12px rgba(59, 130, 246, 0.2)',
                          margin: '0 auto 12px',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <CloudUploadIcon
                          sx={{
                            fontSize: 22,
                            color: 'white',
                            transition:
                              'transform 0.3s ease',
                            '&:hover': {
                              transform:
                                'scale(1.1)',
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          lineHeight: 1.2,
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        Click to upload
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#94A3B8',
                          fontSize: '0.75rem',
                          lineHeight: 1.2,
                          marginTop: '4px',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        PNG, JPG or GIF
                      </Typography>
                    </Stack>
                  </label>
                  {previewImage && (
                    <Box position="relative">
                      <PreviewImage
                        src={previewImage}
                        alt="Preview"
                      />
                      <IconButton
                        onClick={
                          handleRemoveImage
                        }
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor:
                            'rgba(255, 255, 255, 0.95)',
                          boxShadow:
                            '0 4px 12px rgba(0, 0, 0, 0.15)',
                          padding: '6px',
                          '&:hover': {
                            backgroundColor:
                              '#FFFFFF',
                            transform:
                              'scale(1.1)',
                            boxShadow:
                              '0 6px 16px rgba(0, 0, 0, 0.2)',
                          },
                          transition:
                            'all 0.2s ease',
                          zIndex: 2,
                        }}
                        size="small"
                      >
                        <DeleteIcon
                          sx={{
                            color: '#EF4444',
                            fontSize: '18px',
                          }}
                        />
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
                  placeholder="Enter product name"
                  value={formData.productName}
                  onChange={handleTextChange(
                    'productName'
                  )}
                  variant="outlined"
                  disabled={mode === 'view'}
                />
              </FormField>
              <FormField>
                <TextField
                  fullWidth
                  label="ID Code"
                  placeholder="Enter ID code"
                  value={formData.idCode}
                  onChange={handleTextChange(
                    'idCode'
                  )}
                  variant="outlined"
                  disabled={mode === 'view'}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField>
                <FormControl
                  fullWidth
                  disabled={mode === 'view'}
                >
                  <InputLabel id="color-select-label">
                    Color
                  </InputLabel>
                  <Select
                    labelId="color-select-label"
                    id="color-select"
                    value={
                      formData.color || 'Black'
                    }
                    label="Color"
                    onChange={(e) => {
                      const selectedColor = e
                        .target.value as string;
                      setFormData({
                        ...formData,
                        color: selectedColor,
                      });
                    }}
                    renderValue={(selected) => {
                      const safeSelected =
                        selected || 'Black';
                      const colorStyles =
                        getColorStyles(
                          safeSelected
                        );

                      return (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              backgroundColor:
                                colorStyles.bg,
                              border:
                                '2px solid #fff',
                              boxShadow:
                                '0 2px 6px rgba(0,0,0,0.1)',
                              position:
                                'relative',
                              '&::after': {
                                content: '""',
                                position:
                                  'absolute',
                                top: -2,
                                left: -2,
                                right: -2,
                                bottom: -2,
                                borderRadius:
                                  '50%',
                                border:
                                  '1px solid #e0e0e0',
                                opacity: 0.5,
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: '#475569',
                              fontSize:
                                '0.875rem',
                            }}
                          >
                            {safeSelected}
                          </Typography>
                        </Box>
                      );
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 380,
                          width: 320,
                          borderRadius: '12px',
                          boxShadow:
                            '0 10px 30px rgba(0,0,0,0.15)',
                          padding: '10px',
                          '& .MuiList-root': {
                            padding: '8px',
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(4, 1fr)',
                            gap: '8px',
                            width: '100%',
                          },
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {AVAILABLE_COLORS.map(
                      (color) => (
                        <MenuItem
                          key={color}
                          value={color}
                          sx={{
                            borderRadius: '6px',
                            padding: '6px 8px',
                            minHeight: 'unset',
                            '&.Mui-selected': {
                              backgroundColor:
                                'rgba(59, 130, 246, 0.12)',
                              '&:hover': {
                                backgroundColor:
                                  'rgba(59, 130, 246, 0.16)',
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems:
                                'center',
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius:
                                  '50%',
                                backgroundColor:
                                  getColorStyles(
                                    color
                                  ).bg,
                                border:
                                  '2px solid #fff',
                                boxShadow:
                                  '0 2px 4px rgba(0,0,0,0.1)',
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 500,
                                color: '#475569',
                                fontSize:
                                  '0.75rem',
                                whiteSpace:
                                  'nowrap',
                                overflow:
                                  'hidden',
                                textOverflow:
                                  'ellipsis',
                              }}
                            >
                              {color}
                            </Typography>
                          </Box>
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </FormField>
              <FormField>
                <TextField
                  fullWidth
                  label="SKU"
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={handleTextChange(
                    'sku'
                  )}
                  variant="outlined"
                  disabled={mode === 'view'}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField>
                <TextField
                  fullWidth
                  label="Price"
                  placeholder="0.00"
                  type="number"
                  value={formData.price}
                  onChange={handleTextChange(
                    'price'
                  )}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Typography
                        sx={{
                          mr: 1,
                          color: '#6C757D',
                        }}
                      >
                        R
                      </Typography>
                    ),
                  }}
                  disabled={mode === 'view'}
                />
              </FormField>
              <FormField>
                <TextField
                  fullWidth
                  label="Rating"
                  type="number"
                  value={formData.rating}
                  onChange={handleTextChange(
                    'rating'
                  )}
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formData.statusProduct ===
                        'Active'
                      }
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          statusProduct: e.target
                            .checked
                            ? 'Active'
                            : 'Inactive',
                        });
                      }}
                      disabled={mode === 'view'}
                      color="primary"
                    />
                  }
                  label="Status Product"
                  sx={{
                    '& .MuiFormControlLabel-label':
                      {
                        color: '#6C757D',
                      },
                    '& .MuiSwitch-root': {
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
                          backgroundColor:
                            '#52B788',
                        },
                    },
                  }}
                />
              </FormField>
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
            variant="outlined"
            sx={{
              color: '#64748B',
              fontWeight: 500,
              borderColor: '#E2E8F0',
              borderRadius: '8px',
              padding: '8px 16px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#F8FAFC',
                borderColor: '#CBD5E1',
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
                background:
                  'linear-gradient(90deg, #3B82F6 0%, #52B788 100%)',
                fontWeight: 600,
                padding: '8px 24px',
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow:
                  '0 4px 12px rgba(59, 130, 246, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow:
                    '0 8px 16px rgba(59, 130, 246, 0.3)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow:
                    '0 2px 8px rgba(59, 130, 246, 0.2)',
                },
              }}
            >
              {mode === 'edit'
                ? 'Update Product'
                : 'Add Product'}
            </Button>
          )}
        </StyledDialogActions>
      </StyledDialog>
    </LocalizationProvider>
  );
};

export default ProductEditModal;
