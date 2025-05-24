'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import styles from './CheckoutModal.module.css';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  stripePriceId?: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = React.memo(({ cartItems }) => {
  const formatPrice = useMemo(() => (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const tax = useMemo(() => subtotal * 0.15, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <Paper
      elevation={0}
      className={styles.orderSummary}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        p: 3,
        backgroundColor: '#ffffff',
        color: '#333333',
        minHeight: '400px',
      }}
    >
      <Box
        component="div"
        sx={{
          fontSize: '1.25rem',
          fontWeight: 600,
          mb: 2,
        }}
      >
        Order Summary
      </Box>

      <List disablePadding>
        {cartItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ py: 1 }}>
            <ListItemText
              primary={item.name}
              secondary={`Quantity: ${item.quantity}`}
              primaryTypographyProps={{
                fontWeight: 500,
                variant: 'body1',
              }}
              secondaryTypographyProps={{
                variant: 'body2',
              }}
            />
            <Typography variant="body1" fontWeight={500}>
              {formatPrice(item.price * item.quantity)}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {formatPrice(subtotal)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            VAT (15%)
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {formatPrice(tax)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component="div"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 600,
          }}
        >
          Total
        </Box>
        <Box
          component="div"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'primary.main',
          }}
        >
          {formatPrice(total)}
        </Box>
      </Box>
    </Paper>
  );
});

OrderSummary.displayName = 'OrderSummary';

export default OrderSummary;
