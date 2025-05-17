import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor,
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
    background: 'linear-gradient(90deg, #52B788 0%, #3B82F6 100%)',
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
      background: 'linear-gradient(180deg, #52B788 0%, #3B82F6 100%)',
      borderRadius: '4px',
    },
  },
});

const StyledDialogContent = styled(DialogContent)({
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
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
      },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        border: '1px solid #3B82F6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
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
      transform: 'translate(16px, 13px) scale(1)',
      '&.Mui-focused': {
        color: '#3B82F6',
        transform: 'translate(16px, -9px) scale(0.75)',
      },
      '&.MuiInputLabel-shrink': {
        transform: 'translate(16px, -9px) scale(0.75)',
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
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
      },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        border: '1px solid #3B82F6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
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
  '& .MuiDatePicker-root .MuiOutlinedInput-root': {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: '#FFFFFF',
      border: '1px solid #3B82F6',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      border: '1px solid #3B82F6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
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
          background: 'linear-gradient(90deg, #52B788 0%, #3B82F6 100%)',
          opacity: 1,
          border: 0,
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 20,
      height: 20,
      boxShadow: '0 2px 4px 0 rgba(0, 35, 11, 0.2)',
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: '#E2E8F0',
      opacity: 1,
    },
  },
});

const StyledDialogActions = styled(DialogActions)({
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
    background: 'linear-gradient(90deg, #52B788 0%, #3B82F6 100%)',
    borderRadius: '8px',
    opacity: 0.5,
  },
});

const ImageSection = styled(Box)({
  width: '100%',
  marginBottom: '16px',
  marginTop: '8px',
  display: 'flex',
  justifyContent: 'center',
});

const ImageUploadContainer = styled(Box)({
  border: '2px dashed rgba(59, 130, 246, 0.3)',
  borderRadius: '8px',
  padding: '8px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  background: 'rgba(59, 130, 246, 0.02)',
  width: '140px',
  height: '140px',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.04)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.12)',
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
  width: '50px',
  height: '50px',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  objectFit: 'cover',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  zIndex: 1,
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
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
  '&:hover .MuiTextField-root .MuiOutlinedInput-root': {
    borderColor: '#3B82F6',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
  },
  '&:hover .MuiFormControl-root .MuiOutlinedInput-root': {
    borderColor: '#3B82F6',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
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
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
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

const ProductEditModal: React.FC<ProductEditModalProps> = ({
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

  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const resetForm = useCallback(() => {
    setFormData({
      ...defaultFormData,
      color: defaultFormData.color || 'Black',
    });
    setPreviewImage(null);
  }, [defaultFormData]);

  const showNotification = (message: string, severity: AlertColor) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

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
    } else {
      resetForm();
    }
  }, [product, mode, open, resetForm]);

  const handleTextChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Set uploading state to true
      setIsUploading(true);

      // We'll read the file but not set the preview image yet

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 5MB limit');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const formData = new FormData();
      formData.append('file', file);

      formData.append('quality', '85');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          signal: controller.signal,

          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const result = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }));
          throw new Error(result.error || `Server error: ${response.status}`);
        }

        const result = await response.json();

        setFormData((prevData) => ({
          ...prevData,
          image: result.filePath,
        }));

        setPreviewImage(result.filePath);

        console.log(
          'Image uploaded successfully:',
          result.filePath,
          'Dimensions: 100x100px',
          'Size:',
          result.size,
          'bytes'
        );

        showNotification('Image uploaded successfully!', 'success');
      } catch (fetchError) {
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            throw new Error(
              'Upload timed out. Please try a smaller image or check your connection.'
            );
          } else {
            throw fetchError;
          }
        }
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);

      let errorMessage = 'Failed to upload image. Please try again.';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage =
            'Upload timed out. Please try a smaller image or check your connection.';
        } else if (error.message.includes('size exceeds')) {
          errorMessage = 'Image is too large. Maximum size is 5MB.';
        } else {
          errorMessage = error.message;
        }
      }

      showNotification(errorMessage, 'error');

      if (previewImage && !formData.image) {
        setPreviewImage(null);
      }
    } finally {
      setIsUploading(false);
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
    showNotification('Image removed', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      previewImage &&
      !formData.image &&
      previewImage.startsWith('data:image')
    ) {
      try {
        setIsUploading(true);
        showNotification('Uploading image before saving product...', 'info');

        const base64Response = await fetch(previewImage);
        const blob = await base64Response.blob();
        const file = new File([blob], 'product-image.jpg', { type: blob.type });

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('quality', '85');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to upload image before saving product');
        }

        const result = await response.json();

        setFormData((prevData) => ({
          ...prevData,
          image: result.filePath,
        }));

        showNotification('Image uploaded successfully!', 'success');

        submitProductWithImage(result.filePath);
      } catch (error) {
        console.error('Error uploading image before submit:', error);
        showNotification(
          'Failed to upload image. Using placeholder instead.',
          'error'
        );

        submitProductWithImage('/placeholder-image.png');
      } finally {
        setIsUploading(false);
      }
    } else {
      submitProductWithImage(formData.image);
    }
  };

  const submitProductWithImage = (imagePath: string) => {
    const newProduct: Product = {
      id: product?.id || Date.now(),
      productName: formData.productName || 'Unnamed Product',
      color: formData.color || 'Black',
      barcode: formData.idCode || `BC-${Date.now()}`,
      sku: formData.sku || `SKU-${Date.now()}`,
      price: parseFloat(formData.price) || 0,
      status: formData.statusProduct === 'Active',
      rating: parseFloat(formData.rating) || 0,
      image: imagePath || '/placeholder-image.png',
      createdAt: formData.createdAt.toISOString(),
      statusProduct:
        formData.statusProduct === 'Active' ? 'Active' : 'Inactive',
    };

    console.log(
      'ProductEditModal - Submitting product with complete data:',
      JSON.stringify(newProduct, null, 2)
    );

    onSubmit(newProduct);
    resetForm();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '& .MuiAlert-icon': {
              fontSize: '1.2rem',
            },
            '& .MuiAlert-message': {
              fontSize: '0.9rem',
              fontWeight: 500,
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

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
                  <label htmlFor={isUploading ? undefined : 'image-upload'}>
                    <Stack
                      direction="column"
                      alignItems="center"
                      spacing={0.25}
                      sx={{
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        opacity: isUploading ? 0.7 : 1,
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background:
                            'linear-gradient(135deg, #3B82F6 0%, #52B788 100%)',
                          boxShadow: '0 3px 8px rgba(59, 130, 246, 0.2)',
                          margin: '0 auto 8px',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <CloudUploadIcon
                          sx={{
                            fontSize: 16,
                            color: 'white',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: isUploading ? 'not-allowed' : 'pointer',
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
                          fontSize: '0.65rem',
                          lineHeight: 1.2,
                          marginTop: '2px',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        PNG, JPG or GIF (100×100px)
                      </Typography>
                    </Stack>
                  </label>
                  {isUploading ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                      }}
                    >
                      <CircularProgress
                        size={40}
                        sx={{
                          color: '#3B82F6',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#3B82F6',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                        }}
                      >
                        Uploading...
                      </Typography>
                    </Box>
                  ) : (
                    previewImage && (
                      <Box position="relative">
                        <PreviewImage
                          src={previewImage}
                          alt="Preview"
                          sx={{
                            transition: 'opacity 0.3s ease',
                          }}
                        />
                        <IconButton
                          onClick={handleRemoveImage}
                          sx={{
                            position: 'absolute',
                            top: -3,
                            right: -3,
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.18)',
                            padding: '3px',
                            width: '20px',
                            height: '20px',
                            '&:hover': {
                              backgroundColor: '#FFFFFF',
                              transform: 'scale(1.08)',
                              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.22)',
                            },
                            transition: 'all 0.2s ease',
                            zIndex: 6,
                          }}
                          size="small"
                        >
                          <DeleteIcon
                            sx={{
                              color: '#EF4444',
                              fontSize: '14px',
                            }}
                          />
                        </IconButton>
                      </Box>
                    )
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
                  onChange={handleTextChange('productName')}
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
                  onChange={handleTextChange('idCode')}
                  variant="outlined"
                  disabled={mode === 'view'}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField>
                <FormControl fullWidth disabled={mode === 'view'}>
                  <InputLabel id="color-select-label">Color</InputLabel>
                  <Select
                    labelId="color-select-label"
                    id="color-select"
                    value={formData.color || 'Black'}
                    label="Color"
                    onChange={(e) => {
                      const selectedColor = e.target.value as string;
                      setFormData({
                        ...formData,
                        color: selectedColor,
                      });
                    }}
                    renderValue={(selected) => {
                      const safeSelected = selected || 'Black';
                      const colorStyles = getColorStyles(safeSelected);

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
                              backgroundColor: colorStyles.bg,
                              border: '2px solid #fff',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: -2,
                                left: -2,
                                right: -2,
                                bottom: -2,
                                borderRadius: '50%',
                                border: '1px solid #e0e0e0',
                                opacity: 0.5,
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: '#475569',
                              fontSize: '0.875rem',
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
                          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                          padding: '10px',
                          '& .MuiList-root': {
                            padding: '8px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
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
                    {AVAILABLE_COLORS.map((color) => (
                      <MenuItem
                        key={color}
                        value={color}
                        sx={{
                          borderRadius: '6px',
                          padding: '6px 8px',
                          minHeight: 'unset',
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(59, 130, 246, 0.12)',
                            '&:hover': {
                              backgroundColor: 'rgba(59, 130, 246, 0.16)',
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: getColorStyles(color).bg,
                              border: '2px solid #fff',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: '#475569',
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {color}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormField>
              <FormField>
                <TextField
                  fullWidth
                  label="SKU"
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={handleTextChange('sku')}
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
                  onChange={handleTextChange('price')}
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.statusProduct === 'Active'}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          statusProduct: e.target.checked
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
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          backgroundColor: '#52B788',
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
              disabled={isUploading}
              sx={{
                background: isUploading
                  ? 'rgba(203, 213, 225, 0.8)'
                  : 'linear-gradient(90deg, #3B82F6 0%, #52B788 100%)',
                fontWeight: 600,
                padding: '8px 24px',
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                transition: 'all 0.3s ease',
                minWidth: '160px',
                position: 'relative',
                '&:hover': {
                  boxShadow: isUploading
                    ? 'none'
                    : '0 8px 16px rgba(59, 130, 246, 0.3)',
                  transform: isUploading ? 'none' : 'translateY(-2px)',
                },
                '&:active': {
                  transform: isUploading ? 'none' : 'translateY(0)',
                  boxShadow: isUploading
                    ? 'none'
                    : '0 2px 8px rgba(59, 130, 246, 0.2)',
                },
              }}
            >
              {isUploading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Uploading...
                  </Typography>
                </Box>
              ) : mode === 'edit' ? (
                'Update Product'
              ) : (
                'Add Product'
              )}
            </Button>
          )}
        </StyledDialogActions>
      </StyledDialog>
    </LocalizationProvider>
  );
};

export default ProductEditModal;
