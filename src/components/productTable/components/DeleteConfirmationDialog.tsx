import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Block as BlockIcon,
  ShoppingCart as TransactionIcon,
  Inventory as InventoryIcon,
  TrendingUp as SalesIcon,
} from '@mui/icons-material';
import { Product } from '../types';
import {
  DeletionCheck,
  validateProductDeletion,
} from '@/utils/stockManagement';

interface DeleteConfirmationDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (product: Product) => Promise<void>;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  product,
  onClose,
  onConfirm,
}) => {
  const [deletionCheck, setDeletionCheck] = useState<DeletionCheck | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const validateDeletion = useCallback(async () => {
    if (!product) return;

    setLoading(true);
    try {
      const check = await validateProductDeletion(
        product.id,
        product.stock || 0
      );
      setDeletionCheck(check);
    } catch (error) {
      console.error('Error validating deletion:', error);
      setDeletionCheck({
        canDelete: false,
        reason: 'Unable to validate deletion',
        restrictions: ['System error during validation'],
      });
    } finally {
      setLoading(false);
    }
  }, [product]);

  useEffect(() => {
    if (open && product) {
      validateDeletion();
    } else {
      setDeletionCheck(null);
    }
  }, [open, product, validateDeletion]);

  const handleConfirm = async () => {
    if (!product || !deletionCheck?.canDelete) return;

    setDeleting(true);
    try {
      await onConfirm(product);
      onClose();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getRestrictionIcon = (restriction: string) => {
    if (restriction.includes('transaction')) return <TransactionIcon />;
    if (restriction.includes('inventory')) return <InventoryIcon />;
    if (restriction.includes('sales')) return <SalesIcon />;
    if (restriction.includes('stock')) return <InventoryIcon />;
    return <BlockIcon />;
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Delete Product Confirmation
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete the following product?
        </Typography>

        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200',
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {product.productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            SKU: {product.sku} | Barcode: {product.barcode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current Stock: {product.stock || 0} units
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">
              Validating deletion requirements...
            </Typography>
          </Box>
        )}

        {deletionCheck && !loading && (
          <>
            {deletionCheck.canDelete ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                This product can be safely deleted. No business restrictions
                found.
              </Alert>
            ) : (
              <>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Cannot Delete Product
                  </Typography>
                  {deletionCheck.reason}
                </Alert>

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Deletion Restrictions:
                </Typography>

                <List dense>
                  {deletionCheck.restrictions.map((restriction, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getRestrictionIcon(restriction)}
                      </ListItemIcon>
                      <ListItemText
                        primary={restriction}
                        primaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.secondary',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box
                  sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}
                >
                  <Typography variant="body2" color="info.dark">
                    <strong>What you can do:</strong>
                    <br />• Wait for ongoing transactions to complete • Reduce
                    stock to zero through sales or inventory adjustments •
                    Contact administrator for manual override
                  </Typography>
                </Box>
              </>
            )}
          </>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        {deletionCheck?.canDelete && (
          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={16} /> : <ErrorIcon />
            }
          >
            {deleting ? 'Deleting...' : 'Delete Product'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
