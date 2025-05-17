'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '@/contexts/CartContext';
import styles from './CheckoutModal.module.css';
import StripePaymentForm from './StripePaymentForm';
import OrderSummary from './OrderSummary';
import PaymentErrorDisplay from './PaymentErrorDisplay';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  stripePriceId?: string;
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  customStyles?: {
    width?: string | number;
    height?: string | number;
    backgroundColor?: string;
    blurEffect?: boolean;
  };
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  cartItems: propCartItems,
  customStyles = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const cartContext = useCart();
  const cartItems = useMemo(
    () => propCartItems || cartContext.cartItems,
    [propCartItems, cartContext.cartItems]
  );

  const [paymentState, setPaymentState] = useState({
    clientSecret: null as string | null,
    isLoading: true,
    error: null as string | null,
    errorType: 'unknown_error',
    isTimeout: false,
    paymentStep: 'initializing',
    stripeFormMounted: false,
  });

  const updatePaymentState = useCallback(
    (newState: Partial<typeof paymentState>) => {
      setPaymentState((prev) => ({
        ...prev,
        ...newState,
      }));
    },
    []
  );

  useEffect(() => {
    if (!open) {
      updatePaymentState({
        stripeFormMounted: false,
        isTimeout: false,
      });
      return;
    }

    console.log(
      'CheckoutModal useEffect - open:',
      open,
      'cartItems:',
      JSON.stringify(cartItems, null, 2)
    );

    if (!cartItems || cartItems.length === 0) {
      console.error('Cart is empty in CheckoutModal');
      updatePaymentState({
        isLoading: false,
        errorType: 'validation_error',
        error:
          'Your cart is empty. Please add items to your cart before checkout.',
      });
      return;
    }

    console.log('Cart has items, proceeding with payment intent creation');

    const createPaymentIntent = async () => {
      updatePaymentState({
        isLoading: true,
        error: null,
      });

      try {
        console.log(
          'Sending request to create payment intent with cart items:',
          JSON.stringify(cartItems, null, 2)
        );

        const requestBody = JSON.stringify({
          cartItems,
        });
        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });

        console.log(
          'Response status:',
          JSON.stringify(response.status, null, 2)
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            'Error response from API:',
            JSON.stringify(errorData, null, 2)
          );
          throw new Error(errorData.error || 'Failed to create payment intent');
        }

        const responseData = await response.json();
        console.log(
          'Success response from API:',
          JSON.stringify(responseData, null, 2)
        );
        const { clientSecret } = responseData;

        updatePaymentState({
          clientSecret,
          isLoading: false,
          paymentStep: 'payment_form',
        });
      } catch (error) {
        console.error(
          'Error creating payment intent:',
          JSON.stringify(
            error instanceof Error ? error.message : error,
            null,
            2
          )
        );
        updatePaymentState({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to initialize payment',
          errorType: 'server_error',
          paymentStep: 'error',
        });
      }
    };

    createPaymentIntent();
  }, [open, cartItems, updatePaymentState]);

  const modalWidth = useMemo(() => {
    if (customStyles.width) return customStyles.width;
    if (isMobile) return '95%';
    if (isTablet) return '80%';
    return '1000px';
  }, [customStyles.width, isMobile, isTablet]);

  const modalHeight = useMemo(() => {
    if (customStyles.height) return customStyles.height;
    return 'auto';
  }, [customStyles.height]);

  const handleFormMounted = useCallback(() => {
    updatePaymentState({
      stripeFormMounted: true,
    });
  }, [updatePaymentState]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      className={`${styles.dialog} ${customStyles.blurEffect ? styles.blurBackdrop : ''}`}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#ffffff !important',
          color: '#333333 !important',
          width: modalWidth,
          maxHeight: modalHeight !== 'auto' ? modalHeight : undefined,
          margin: '16px',
          borderRadius: '16px',
          overflow: 'visible',
          transition: 'all 0.3s ease-in-out',
          maxWidth: '1200px !important',
          zIndex: 1100,
        },
        '& .MuiDialogContent-root': {
          backgroundColor: '#ffffff !important',
          color: '#333333 !important',
          padding: '24px !important',
          overflow: 'visible',
          position: 'relative',
          zIndex: 1100,
        },
      }}
    >
      <DialogTitle className={styles.dialogTitle} sx={{ p: 0 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Box component="span" className={styles.title}>
            Checkout
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            className={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        {}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 1,
            fontSize: '10px',
            color: '#999',
            zIndex: 1000,
          }}
        >
          Loading: {paymentState.isLoading ? 'true' : 'false'}, Error:{' '}
          {paymentState.error ? 'true' : 'false'}, ClientSecret:{' '}
          {paymentState.clientSecret ? 'present' : 'missing'}
        </Box>

        {paymentState.isLoading ? (
          <Box className={styles.loadingContainer}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Preparing your checkout...
            </Typography>
          </Box>
        ) : paymentState.error ? (
          <Box className={styles.errorContainer}>
            <PaymentErrorDisplay
              errorMessage={paymentState.error}
              errorType={paymentState.errorType}
              onRetry={() => {
                updatePaymentState({
                  isLoading: true,
                  error: null,
                });
                const createPaymentIntent = async () => {
                  try {
                    const response = await fetch('/api/create-payment-intent', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        cartItems,
                      }),
                    });

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(
                        errorData.error || 'Failed to create payment intent'
                      );
                    }

                    const { clientSecret } = await response.json();

                    updatePaymentState({
                      clientSecret,
                      isLoading: false,
                      paymentStep: 'payment_form',
                    });
                  } catch (error) {
                    console.error(
                      'Error creating payment intent:',
                      JSON.stringify(error, null, 2)
                    );
                    updatePaymentState({
                      isLoading: false,
                      error:
                        error instanceof Error
                          ? error.message
                          : 'Failed to initialize payment',
                      errorType: 'server_error',
                      paymentStep: 'error',
                    });
                  }
                };
                createPaymentIntent();
              }}
              onDismiss={onClose}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              gap: 3,
              width: '100%',
              minHeight: '400px',
              position: 'relative',
              zIndex: 1000,
            }}
          >
            <Box
              sx={{
                flex: { xs: '1', md: '7' },
                width: '100%',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                p: 2,
                backgroundColor: '#ffffff',
                position: 'relative',
                zIndex: 1000,
                overflow: 'visible',
              }}
            >
              {paymentState.clientSecret ? (
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1000,
                    overflow: 'visible',
                  }}
                >
                  <StripePaymentForm
                    clientSecret={paymentState.clientSecret}
                    onMounted={handleFormMounted}
                  />
                </div>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    minHeight: '300px',
                  }}
                >
                  <Typography>
                    Failed to initialize payment form. Please try again.
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                flex: { xs: '1', md: '5' },
                width: '100%',
              }}
            >
              <OrderSummary cartItems={cartItems} />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
