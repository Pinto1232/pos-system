import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart as CartIcon,
  Lock,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import {
  stockManager,
  EventData,
  ReservationExpiredEventData,
} from '@/utils/realTimeStockManager';
import { Product } from '@/components/productEdit/types';

interface CartItem {
  product: Product;
  quantity: number;
  reservationId?: string;
  reservationStatus: 'pending' | 'reserved' | 'failed' | 'expired';
}

interface ShoppingCartProps {
  userId?: string;
  onCheckout?: (items: CartItem[]) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  userId = `USER-${Date.now()}`,
  onCheckout,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });

  // Update item quantity
  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const itemIndex = cartItems.findIndex(
        (item) => item.product.id === productId
      );
      if (itemIndex === -1) return;

      const item = cartItems[itemIndex];

      // Release old reservation
      if (item.reservationId) {
        await stockManager.releaseReservation(item.reservationId);
      }

      // Create new reservation
      const result = await stockManager.reserveStock(
        productId,
        newQuantity,
        userId,
        'cart',
        30
      );

      const updatedItems = [...cartItems];
      updatedItems[itemIndex] = {
        ...item,
        quantity: newQuantity,
        reservationId: result.reservationId,
        reservationStatus: result.success ? 'reserved' : 'failed',
      };
      setCartItems(updatedItems);

      if (!result.success) {
        setError(result.error || 'Failed to update reservation');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update quantity'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    setIsLoading(true);

    try {
      const itemIndex = cartItems.findIndex(
        (item) => item.product.id === productId
      );
      if (itemIndex === -1) return;

      const item = cartItems[itemIndex];

      if (item.reservationId) {
        await stockManager.releaseReservation(item.reservationId);
      }

      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);

    try {
      await Promise.all(
        cartItems
          .filter((item) => item.reservationId)
          .map((item) => stockManager.releaseReservation(item.reservationId!))
      );

      setCartItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      setError('Please provide customer information');
      return;
    }

    setIsLoading(true);

    try {
      const orderId = `ORDER-${Date.now()}`;

      for (const item of cartItems) {
        if (item.reservationStatus === 'reserved') {
          await stockManager.processSale({
            productId: item.product.id,
            quantity: item.quantity,
            orderId,
            timestamp: new Date(),
            customerId: customerInfo.email,
            unitPrice: item.product.price || 0,
            totalAmount: (item.product.price || 0) * item.quantity,
          });
        }
      }

      setCartItems([]);
      setCheckoutDialogOpen(false);
      setCustomerInfo({ name: '', email: '' });

      if (onCheckout) {
        onCheckout(cartItems);
      }

      alert(`Order ${orderId} processed successfully!`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process checkout'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleReservationExpired = (data: EventData) => {
      if (
        'reservationId' in data &&
        'productId' in data &&
        'quantity' in data
      ) {
        const eventData = data as ReservationExpiredEventData;
        setCartItems((prev) =>
          prev.map((item) =>
            item.reservationId === eventData.reservationId
              ? { ...item, reservationStatus: 'expired' as const }
              : item
          )
        );
      }
    };

    stockManager.on('reservationExpired', handleReservationExpired);

    return () => {
      stockManager.off('reservationExpired', handleReservationExpired);
    };
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );
  const validItems = cartItems.filter(
    (item) => item.reservationStatus === 'reserved'
  );

  const getStatusIcon = (status: CartItem['reservationStatus']) => {
    switch (status) {
      case 'reserved':
        return <CheckCircle color="success" fontSize="small" />;
      case 'failed':
        return <Warning color="error" fontSize="small" />;
      case 'expired':
        return <Warning color="warning" fontSize="small" />;
      default:
        return <Lock color="action" fontSize="small" />;
    }
  };

  const getStatusColor = (
    status: CartItem['reservationStatus']
  ):
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning' => {
    switch (status) {
      case 'reserved':
        return 'success';
      case 'failed':
        return 'error';
      case 'expired':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <CartIcon />
          <Typography variant="h6">
            Shopping Cart ({totalItems} items)
          </Typography>
          {cartItems.length > 0 && (
            <Button
              size="small"
              color="error"
              onClick={clearCart}
              disabled={isLoading}
            >
              Clear Cart
            </Button>
          )}
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.product.id} divider>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1">
                          {item.product.productName}
                        </Typography>
                        {getStatusIcon(item.reservationStatus)}
                        <Chip
                          label={item.reservationStatus}
                          size="small"
                          color={getStatusColor(item.reservationStatus)}
                        />
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">
                          R{(item.product.price || 0).toFixed(2)} each
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          Total: R
                          {((item.product.price || 0) * item.quantity).toFixed(
                            2
                          )}
                        </Typography>
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        disabled={isLoading}
                      >
                        <Remove />
                      </IconButton>
                      <Typography
                        variant="body1"
                        sx={{ minWidth: 30, textAlign: 'center' }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={isLoading}
                      >
                        <Add />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(item.product.id)}
                        disabled={isLoading}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                Total: R{totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setCheckoutDialogOpen(true)}
                disabled={isLoading || validItems.length === 0}
              >
                Checkout ({validItems.length} items)
              </Button>
            </Stack>
          </>
        )}
      </CardContent>

      {}
      <Dialog
        open={checkoutDialogOpen}
        onClose={() => setCheckoutDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Customer Name"
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Customer Email"
              type="email"
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              fullWidth
              required
            />
            <Box>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              {validItems.map((item) => (
                <Stack
                  key={item.product.id}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>
                    {item.product.productName} x {item.quantity}
                  </Typography>
                  <Typography>
                    R{((item.product.price || 0) * item.quantity).toFixed(2)}
                  </Typography>
                </Stack>
              ))}
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">R{totalPrice.toFixed(2)}</Typography>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCheckout}
            variant="contained"
            disabled={isLoading || !customerInfo.name || !customerInfo.email}
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ShoppingCart;
