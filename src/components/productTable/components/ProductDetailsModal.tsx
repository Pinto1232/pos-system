import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Rating,
  Alert,
} from '@mui/material';
import { Product } from '../types';
import { getColorStyles } from '@/utils/colorUtils';
import {
  modalPaperStyles,
  modalImageStyles,
  modalTitleStyles,
} from '../styles';
import { renderProductImage } from '../utils';

interface ProductDetailsModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  product,
  onClose,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            backgroundColor: '#ffffff !important',
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
      {!product ? (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            borderRadius: '16px',
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            Product data could not be loaded
          </Alert>
          <Typography>
            There was a problem loading the product details. Please try again.
          </Typography>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('ProductTable - Error close button clicked');
                onClose();
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
                display: 'inline-flex !important',
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
              product.image,
              product.productName || 'Product',
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
                {product.productName || 'Unknown Product'}
              </Typography>
              {product.color && (
                <Chip
                  label={product.color}
                  size="small"
                  sx={{
                    mt: 1,
                    fontSize: '0.75rem',
                    height: '24px',
                    backgroundColor: getColorStyles(product.color).bg,
                    color: getColorStyles(product.color).text,
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
                    justifyContent: 'space-between',
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom: '1px solid #e0e0e0',
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
                    {product.barcode || 'N/A'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom: '1px solid #e0e0e0',
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
                    {product.sku || '-'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom: '1px solid #e0e0e0',
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
                    R{(product.price || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom: '1px solid #e0e0e0',
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
                      bgcolor: product.status ? '#e8f5e9' : '#ffebee',
                      color: product.status ? '#2e7d32' : '#c62828',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    >
                      {product.status ? 'In Stock' : 'Out of Stock'}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom: '1px solid #e0e0e0',
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
                      value={product.rating || 0}
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
                      ({product.rating || 0}
                      /5)
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom: '1px solid #e0e0e0',
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
                    {product.statusProduct ||
                      (product.status ? 'Active' : 'Inactive')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
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
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
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
                console.log('ProductTable - Close button clicked');
                onClose();
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
                display: 'inline-flex !important',
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
  );
};

export default ProductDetailsModal;
