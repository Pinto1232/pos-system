'use client';

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Badge,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FaTrash } from 'react-icons/fa';
import { HiShoppingCart } from 'react-icons/hi';
import { styled } from '@mui/material/styles';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: { xs: '100%', sm: 550 },
    boxSizing: 'border-box',
    background: '#FFFFFF',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.08)',
  },
}));

const CartHeader = styled(Box)(() => ({
  padding: '24px 32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#FAFBFC',
}));

const CartItem = styled(Paper)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: '20px 24px',
  margin: '0 16px',
  marginTop: '16px',
  borderRadius: '8px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.04)',
    borderColor: '#1976d2',
  },
}));

const ProductImage = styled(Box)(() => ({
  width: 80,
  height: 80,
  background: '#f5f5f5',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '24px',
  fontSize: '1.75rem',
  color: '#e0e0e0',
  border: '1px solid #f0f0f0',
  flexShrink: 0,
}));

const DeleteButton = styled(IconButton)(() => ({
  color: '#bdbdbd',
  padding: '8px',
  position: 'absolute',
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  '&:hover': {
    backgroundColor: '#ffebee',
    color: '#f44336',
  },
}));

const PriceText = styled(Typography)(() => ({
  color: '#1976d2',
  fontWeight: 600,
  fontSize: '1rem',
  marginLeft: '16px',
  flexShrink: 0,
}));

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const CartSidebar: React.FC<CartSidebarProps> = ({
  open,
  onClose,
}) => {
  const cartItems = [
    {
      id: 1,
      name: 'Product 1',
      price: 1499.99,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Product 2',
      price: 2499.99,
      quantity: 2,
    },
    {
      id: 3,
      name: 'Product 3',
      price: 3499.99,
      quantity: 1,
    },
  ];

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );
  const taxAmount = totalPrice * 0.15; // 15% VAT for South Africa
  const finalTotal = totalPrice + taxAmount;

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <CartHeader>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <HiShoppingCart
            size={20}
            color="#2196F3"
            style={{ marginRight: '12px' }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mr: 2,
            }}
          >
            Shopping Cart
          </Typography>
          <Badge
            badgeContent={cartItems.length}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                height: '20px',
                minWidth: '20px',
                fontWeight: 600,
              },
            }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor:
                'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </CartHeader>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#FAFBFC',
          py: 1,
          height: '100%',
        }}
      >
        {cartItems.map((item) => (
          <CartItem key={item.id} elevation={0}>
            <ProductImage>P</ProductImage>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '1rem',
                  }}
                >
                  {item.name}
                </Typography>
                <PriceText>
                  {formatPrice(
                    item.price * item.quantity
                  )}
                </PriceText>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mt: 1,
                }}
              >
                Quantity: {item.quantity}
              </Typography>
            </Box>
            <DeleteButton
              edge="end"
              aria-label="delete"
            >
              <FaTrash size={14} />
            </DeleteButton>
          </CartItem>
        ))}
      </Box>

      <Box
        sx={{
          p: 4,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
            >
              Subtotal
            </Typography>
            <Typography
              variant="body1"
              fontWeight={500}
            >
              {formatPrice(totalPrice)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
            >
              VAT (15%)
            </Typography>
            <Typography
              variant="body1"
              fontWeight={500}
            >
              {formatPrice(taxAmount)}
            </Typography>
          </Box>
          <Divider sx={{ my: 2.5 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600 }}
            >
              Total
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: (theme) =>
                  theme.palette.primary.main,
                fontWeight: 600,
              }}
            >
              {formatPrice(finalTotal)}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            py: 0.5,
            backgroundColor: (theme) =>
              theme.palette.primary.main,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            boxShadow:
              '0 4px 12px rgba(33, 150, 243, 0.2)',
            '&:hover': {
              backgroundColor: (theme) =>
                theme.palette.primary.dark,
              boxShadow:
                '0 6px 16px rgba(33, 150, 243, 0.25)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Checkout Now
        </Button>
      </Box>
    </StyledDrawer>
  );
};

export default CartSidebar;
