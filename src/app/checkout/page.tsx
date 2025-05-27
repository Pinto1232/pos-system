'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Paper,
  Grid,
  Divider,
  Breadcrumbs,
} from '@mui/material';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import StripePaymentForm from '@/components/payment/StripePaymentForm';
import OrderSummary from '@/components/payment/OrderSummary';
import PaymentErrorDisplay from '@/components/payment/PaymentErrorDisplay';
import styles from './checkout.module.css';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  stripePriceId: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems: contextCartItems, clearCart } = useCart();
  const [effectiveCartItems, setEffectiveCartItems] = useState<CartItem[]>([]);

  const [paymentState, setPaymentState] = useState({
    clientSecret: null as string | null,
    isLoading: true,
    error: null as string | null,
    errorType: 'unknown_error',
    isTimeout: false,
    paymentStep: 'initializing',
    stripeFormMounted: false,
  });

  const getEffectiveCartItems = useCallback(() => {
    if (contextCartItems && contextCartItems.length > 0) {
      return contextCartItems;
    }

    const storedValidatedCart = localStorage.getItem('validatedCartItems');
    if (storedValidatedCart) {
      try {
        const parsedCart = JSON.parse(storedValidatedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          return parsedCart;
        }
      } catch (error) {
        console.error(
          'Failed to parse validated cart items from localStorage:',
          JSON.stringify(error, null, 2)
        );
      }
    }

    return [];
  }, [contextCartItems]);

  const updatePaymentState = useCallback(
    (newState: Partial<typeof paymentState>) => {
      setPaymentState((prev) => ({
        ...prev,
        ...newState,
      }));
    },
    []
  );

  const handleFormMounted = useCallback(() => {
    updatePaymentState({
      stripeFormMounted: true,
    });
  }, [updatePaymentState]);

  useEffect(() => {
    const items = getEffectiveCartItems();
    setEffectiveCartItems(items);

    if (!items || items.length === 0) {
      updatePaymentState({
        isLoading: false,
        errorType: 'validation_error',
        error:
          'Your cart is empty. Please add items to your cart before checkout.',
      });
      return;
    }

    const createPaymentIntent = async (itemsToUse: CartItem[]) => {
      updatePaymentState({
        isLoading: true,
        error: null,
      });

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartItems: itemsToUse,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create payment intent');
        }

        const responseData = await response.json();
        const { clientSecret } = responseData;

        updatePaymentState({
          clientSecret,
          isLoading: false,
          paymentStep: 'payment_form',
        });
      } catch (error) {
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

    const timeoutId = setTimeout(() => {
      createPaymentIntent(items);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [getEffectiveCartItems, updatePaymentState]);

  const handlePaymentSuccess = useCallback(() => {
    clearCart();

    router.push('/checkout/success');
  }, [clearCart, router]);

  useEffect(() => {
    const handlePaymentSuccessEvent = () => {
      handlePaymentSuccess();
    };

    window.addEventListener('paymentSuccess', handlePaymentSuccessEvent);

    return () => {
      window.removeEventListener('paymentSuccess', handlePaymentSuccessEvent);
    };
  }, [handlePaymentSuccess]);

  return (
    <Container maxWidth="lg" className={styles.checkoutContainer}>
      <Box sx={{ my: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link href="/" passHref>
            <Typography color="inherit" sx={{ cursor: 'pointer' }}>
              Home
            </Typography>
          </Link>
          <Link href="/cart" passHref>
            <Typography color="inherit" sx={{ cursor: 'pointer' }}>
              Cart
            </Typography>
          </Link>
          <Typography color="text.primary">Checkout</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>

        {effectiveCartItems.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" paragraph>
              Please add items to your cart before proceeding to checkout.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/"
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
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
                      onRetry={useCallback(() => {
                        const currentItems = getEffectiveCartItems();
                        if (!currentItems || currentItems.length === 0) {
                          updatePaymentState({
                            isLoading: false,
                            errorType: 'validation_error',
                            error:
                              'Your cart is empty. Please add items to your cart before checkout.',
                          });
                          return;
                        }

                        updatePaymentState({
                          isLoading: true,
                          error: null,
                        });

                        const retryPaymentIntent = async () => {
                          try {
                            const response = await fetch(
                              '/api/create-payment-intent',
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  cartItems: currentItems,
                                }),
                              }
                            );

                            if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(
                                errorData.error ||
                                  'Failed to create payment intent'
                              );
                            }

                            const { clientSecret } = await response.json();

                            updatePaymentState({
                              clientSecret,
                              isLoading: false,
                              paymentStep: 'payment_form',
                            });
                          } catch (error) {
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
                        retryPaymentIntent();
                      }, [getEffectiveCartItems, updatePaymentState])}
                      onDismiss={() => router.push('/cart')}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Payment Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    {paymentState.clientSecret ? (
                      <StripePaymentForm
                        clientSecret={paymentState.clientSecret}
                        onMounted={handleFormMounted}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '300px',
                        }}
                      >
                        <Typography>
                          Failed to initialize payment form. Please try again.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  position: 'sticky',
                  top: '20px',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <OrderSummary cartItems={effectiveCartItems} />
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    component={Link}
                    href="/cart"
                    sx={{ mb: 2 }}
                  >
                    Return to Cart
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}
