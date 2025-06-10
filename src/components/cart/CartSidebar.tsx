'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Badge,
  Paper,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { HiShoppingCart } from 'react-icons/hi';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useCartUI } from '@/contexts/CartUIContext';
import CheckoutModal from '@/components/payment/CheckoutModal';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: {
      xs: '100%',
      sm: '320px',
      md: '350px',
    },
    boxSizing: 'border-box',
    background: '#FFFFFF',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.08)',
  },
}));

const CartHeader = styled(Box)(() => ({
  padding: '18px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#F8F9FA',
  marginBottom: '4px',
}));

const CartItemContainer = styled(Paper)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: '14px 16px',
  margin: '0 12px',
  marginTop: '12px',
  borderRadius: '8px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  transition: 'all 0.2s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.04)',
    borderColor: '#1976d2',
  },
}));

const ProductImage = styled(Box)(() => ({
  width: 45,
  height: 45,
  background: '#f8f9fa',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '14px',
  fontSize: '1.25rem',
  color: '#bdbdbd',
  border: '1px solid #f0f0f0',
  flexShrink: 0,
  overflow: 'hidden',
}));

const DeleteButton = styled(IconButton)(() => ({
  color: '#bdbdbd',
  padding: '4px',
  marginLeft: '8px',
  height: '28px',
  width: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: '#ffebee',
    color: '#f44336',
  },
}));

const PriceText = styled(Typography)(() => ({
  color: '#1976d2',
  fontWeight: 600,
  fontSize: '0.85rem',
  marginLeft: '10px',
  flexShrink: 0,
  padding: '2px 0',
  letterSpacing: '0.01em',
}));

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const CartSidebar: React.FC<CartSidebarProps> = ({ open, onClose }) => {
  const router = useRouter();
  const { cartItems, removeFromCart } = useCart();
  const { setCartOpen } = useCartUI();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  
  useEffect(() => {
    setCartOpen(open);
  }, [open, setCartOpen]);

  const modalCustomStyles = {
    width: '1000px',
    height: 'auto',
    backgroundColor: '#ffffff',
    blurEffect: true,
  };

  interface ValidatedCartItem {
    id: string;
    stripePriceId?: string;
    quantity: number;
    name: string;
    price: number;
  }

  const [validatedCartItems, setValidatedCartItems] = useState<
    ValidatedCartItem[]
  >([]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxAmount = totalPrice * 0.15;
  const finalTotal = totalPrice + taxAmount;

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      console.log(
        'Proceeding to checkout page with cart items:',
        JSON.stringify(cartItems, null, 2)
      );

      const validated = cartItems.map((item) => ({
        ...item,
        id: item.id.toString(),
        stripePriceId: item.stripePriceId || undefined,
        quantity: item.quantity || 1,
        name: item.name || 'Product',
        price: item.price || 0,
      }));

      console.log('Validated cart items:', JSON.stringify(validated, null, 2));

      setValidatedCartItems(validated);

      if (validated.length === 0) {
        throw new Error(
          'Your cart is empty. Please add items to your cart before checkout.'
        );
      }

      localStorage.setItem('validatedCartItems', JSON.stringify(validated));

      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        await router.push('/checkout');

        onClose();
      } catch (navigationError) {
        console.error('Navigation Error:', navigationError);
        throw new Error(
          'Failed to navigate to checkout page. Please try again.'
        );
      }
    } catch (error) {
      console.error('Checkout Error:', JSON.stringify(error, null, 2));

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : 'Checkout failed. Please try again or contact support.';

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  return (
    <>
      {}
      <CheckoutModal
        open={isCheckoutModalOpen}
        onClose={handleCloseCheckoutModal}
        cartItems={
          validatedCartItems.length > 0 ? validatedCartItems : cartItems
        }
        customStyles={modalCustomStyles}
      />
      <StyledDrawer anchor="right" open={open} onClose={onClose}>
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
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItemContainer key={item.id} elevation={0}>
                <ProductImage>
                  {}
                  <span style={{ fontSize: '1rem' }}>
                    {item.name ? item.name.charAt(0).toUpperCase() : 'P'}
                  </span>
                </ProductImage>
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2,
                        flex: '1 1 auto',
                        maxWidth: 'calc(100% - 36px)',
                        pr: 1,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <DeleteButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeFromCart(item.id)}
                      size="small"
                    >
                      <FaTrash size={14} />
                    </DeleteButton>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        letterSpacing: '0.01em',
                      }}
                    >
                      Quantity: {item.quantity}
                    </Typography>
                    <PriceText>
                      {formatPrice(item.price * item.quantity)}
                    </PriceText>
                  </Box>
                </Box>
              </CartItemContainer>
            ))
          ) : (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                my: 3,
              }}
            >
              <Box
                sx={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <FaShoppingCart size={20} color="#bdbdbd" />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.01em',
                }}
              >
                Your cart is empty
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            p: '16px 20px',
            borderTop: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            backgroundColor: '#FFFFFF',
            mt: 1,
          }}
        >
          <Box sx={{ mb: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1.5,
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.01em',
                }}
              >
                Subtotal
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.01em',
                }}
              >
                {formatPrice(totalPrice)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1.5,
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.01em',
                }}
              >
                VAT (15%)
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.01em',
                }}
              >
                {formatPrice(taxAmount)}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1.5,
                alignItems: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  letterSpacing: '0.01em',
                }}
              >
                Total
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  letterSpacing: '0.01em',
                }}
              >
                {formatPrice(finalTotal)}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              mt: 1,
            }}
          >
            <Button
              variant="contained"
              fullWidth
              size="medium"
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isLoading}
              sx={{
                py: 0.75,
                backgroundColor: (theme) => theme.palette.primary.main,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.01em',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                  boxShadow: '0 6px 16px rgba(33, 150, 243, 0.25)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
                minHeight: '42px',
              }}
            >
              {isLoading ? (
                <CircularProgress
                  size={24}
                  sx={{ color: 'white' }}
                  thickness={4}
                />
              ) : (
                'Checkout Now'
              )}
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{
                mt: 0.5,
                fontSize: '0.75rem',
                opacity: 0.8,
                letterSpacing: '0.01em',
              }}
            >
              You&apos;ll be redirected to our checkout page.
            </Typography>
          </Box>
        </Box>
      </StyledDrawer>
    </>
  );
};

export default CartSidebar;
