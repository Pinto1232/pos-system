'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import PaymentErrorDisplay from './PaymentErrorDisplay';
import styles from './StripePaymentForm.module.css';

const getPublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
};

const publishableKey = getPublishableKey();

// Verify the publishable key format
const isValidPublishableKey =
  publishableKey &&
  (publishableKey.startsWith('pk_test_') ||
    publishableKey.startsWith('pk_live_'));

const getStripePromise = () => {
  if (!isValidPublishableKey) {
    console.error('Invalid Stripe publishable key format');
    return null;
  }

  try {
    return loadStripe(publishableKey);
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return null;
  }
};

const stripePromise = getStripePromise();

const ensureStripeLoaded = async () => {
  if (!stripePromise) {
    return null;
  }

  try {
    const stripe = await stripePromise;
    return stripe;
  } catch (error) {
    console.error('Error loading Stripe:', error);
    return null;
  }
};

interface StripePaymentFormWrapperProps {
  clientSecret: string;
  onMounted: () => void;
}

const StripePaymentFormWrapper: React.FC<StripePaymentFormWrapperProps> =
  React.memo(({ clientSecret, onMounted }) => {
    const [stripeLoaded, setStripeLoaded] = useState<boolean | null>(null);

    console.log(
      '[DEBUG] StripePaymentFormWrapper rendering with clientSecret:',
      JSON.stringify(clientSecret ? 'present' : 'missing', null, 2)
    );

    useEffect(() => {
      console.log(
        '[DEBUG] StripePaymentFormWrapper useEffect - clientSecret:',
        JSON.stringify(clientSecret ? 'present' : 'missing', null, 2)
      );

      if (stripePromise) {
        ensureStripeLoaded()
          .then((stripe) => {
            setStripeLoaded(!!stripe);
            console.log(
              '[DEBUG] Stripe loaded:',
              JSON.stringify(!!stripe, null, 2)
            );
          })
          .catch((error) => {
            console.error(
              '[DEBUG] Error loading Stripe:',
              JSON.stringify(error, null, 2)
            );
            setStripeLoaded(false);
          });
      }
    }, [clientSecret]);

    if (stripeLoaded === false) {
      return (
        <Box className={styles.paymentFormContainer}>
          <Alert severity="error">
            Failed to load payment system. Please refresh the page and try
            again.
          </Alert>
        </Box>
      );
    }

    if (!clientSecret) {
      console.error('[DEBUG] Cannot render Elements without a client secret');
      return (
        <Box
          className={styles.paymentFormContainer}
          sx={{
            backgroundColor: '#ffffff',
            color: '#333333',
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            Payment system configuration error. Please try again later.
          </Alert>
          <Typography sx={{ mb: 2 }}>
            Unable to initialize the payment form. Please refresh the page and
            try again.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    if (!stripePromise) {
      console.error('[DEBUG] Stripe promise is not available');
      return (
        <Box
          className={styles.paymentFormContainer}
          sx={{
            backgroundColor: '#ffffff',
            color: '#333333',
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            Payment system initialization error.
          </Alert>
          <Typography sx={{ mb: 2 }}>
            The payment system could not be initialized. Please check your
            internet connection and try again.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      );
    }

    console.log(
      '[DEBUG] Rendering Elements with client secret:',
      clientSecret.substring(0, 10) + '...'
    );

    const appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#1976d2',
        colorBackground: '#ffffff',
        colorText: '#333333',
        colorDanger: '#ff4444',
        fontFamily: 'Arial, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      rules: {
        '.Input': {
          backgroundColor: '#ffffff',
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
        },
        '.Tab': {
          backgroundColor: '#ffffff',
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
        },
        '.Label': {
          color: '#333333',
        },
      },
    } as const;

    return (
      <div
        style={{
          position: 'relative',
          zIndex: 1050,
        }}
      >
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance,
            loader: 'auto',
          }}
        >
          <StripePaymentForm onMounted={onMounted} />
        </Elements>
      </div>
    );
  });

StripePaymentFormWrapper.displayName = 'StripePaymentFormWrapper';

interface StripePaymentFormProps {
  onMounted: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = React.memo(
  ({ onMounted }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<string>('unknown_error');
    const [isLoading, setIsLoading] = useState(false);
    const [stripeInitialized, setStripeInitialized] = useState(false);

    const mountedRef = useRef(false);

    useEffect(() => {
      if (stripe && elements && !mountedRef.current) {
        setStripeInitialized(true);
        onMounted();
        mountedRef.current = true;
      }
    }, [stripe, elements, onMounted]);

    useEffect(() => {
      if (!stripe) {
        console.log('[DEBUG] Stripe not available in useEffect');
        return;
      }

      console.log('[DEBUG] Stripe is available, ready for payment processing');
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log('[DEBUG] Payment form submit handler called');

      if (!stripeInitialized) {
        console.error('[DEBUG] Submit attempted but Stripe not initialized');
        setErrorType('stripe_error');
        setMessage(
          'Payment system is still initializing. Please wait a moment and try again.'
        );
        return;
      }

      if (!stripe || !elements) {
        console.error(
          '[DEBUG] Submit attempted but Stripe or Elements not loaded',
          {
            stripeLoaded: !!stripe,
            elementsLoaded: !!elements,
          }
        );
        setErrorType('stripe_error');
        setMessage(
          'Payment system not fully loaded. Please refresh the page and try again.'
        );
        return;
      }

      setIsLoading(true);
      console.log('[DEBUG] Confirming payment with Stripe');

      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('Payment processing timeout')),
            30000
          );
        });

        const confirmationPromise = stripe.confirmPayment({
          elements,
          confirmParams: {
            receipt_email: email,
            payment_method_data: {
              billing_details: {
                phone: '', // Provide an empty string for phone since we set it to 'never' in the PaymentElement
                address: {
                  line2: '', // Provide an empty string for address.line2 since we set it to 'never' in the PaymentElement
                },
              },
            },
          },
          redirect: 'if_required',
        });

        const { error, paymentIntent } = await Promise.race([
          confirmationPromise,
          timeoutPromise.then(() => {
            throw new Error('Payment processing timeout');
          }),
        ]);

        if (error) {
          console.error(
            '[DEBUG] Payment confirmation error:',
            JSON.stringify(error, null, 2)
          );
          setErrorType(error.type || 'unknown_error');
          setMessage(error.message || 'An unexpected error occurred.');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          console.log('[DEBUG] Payment succeeded, navigating to success page');

          window.dispatchEvent(new CustomEvent('paymentSuccess'));
        }
      } catch (error) {
        console.error(
          '[DEBUG] Exception during payment confirmation:',
          JSON.stringify(error, null, 2)
        );
        if (
          error instanceof Error &&
          error.message === 'Payment processing timeout'
        ) {
          setErrorType('timeout');
          setMessage(
            'Payment is taking longer than expected. Please check your bank app or account to see if the payment went through before trying again.'
          );
        } else {
          setErrorType('unknown_error');
          setMessage('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    console.log('[DEBUG] Rendering StripePaymentForm component');

    return (
      <Box
        className={styles.paymentFormContainer}
        sx={{
          backgroundColor: '#ffffff !important',
          color: '#333333 !important',
          borderRadius: '6px',
          p: 2,
          minHeight: '320px',
          position: 'relative',
          display: 'block !important',
          visibility: 'visible !important',
          opacity: 1,
        }}
      >
        <Box
          component="div"
          className={styles.formTitle}
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 2,
            textAlign: 'center',
          }}
        >
          Payment Details
        </Box>

        {}
        <Box
          sx={{
            fontSize: '10px',
            color: '#999',
            mb: 2,
          }}
        >
          Stripe loaded: {stripe ? 'yes' : 'no'}, Elements loaded:{' '}
          {elements ? 'yes' : 'no'}, Initialized:{' '}
          {stripeInitialized ? 'yes' : 'no'}
        </Box>

        <form
          id="payment-form"
          onSubmit={handleSubmit}
          className={styles.paymentForm}
          style={{
            backgroundColor: '#ffffff',
            minHeight: '240px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            position: 'relative',
            zIndex: 1040,
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1030,
            }}
          >
            <LinkAuthenticationElement
              id="link-authentication-element"
              onChange={(e) => setEmail(e.value.email)}
              options={{
                defaultValues: {
                  email: email || '',
                },
              }}
            />
          </div>

          <Box
            sx={{
              backgroundColor: '#ffffff',
              p: 1.5,
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              mb: 1.5,
              position: 'relative',
              zIndex: 1020,
              minHeight: '150px',
            }}
          >
            <PaymentElement
              id="payment-element"
              options={{
                layout: {
                  type: 'tabs',
                  defaultCollapsed: false,
                  spacedAccordionItems: false,
                },
                fields: {
                  billingDetails: {
                    name: 'auto',
                    email: 'auto',
                    phone: 'never',
                    address: {
                      country: 'auto',
                      line1: 'auto',
                      line2: 'never',
                      city: 'auto',
                      state: 'auto',
                      postalCode: 'auto',
                    },
                  },
                },
                paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
              }}
            />
          </Box>

          <Button
            disabled={isLoading || !stripe || !elements}
            type="submit"
            variant="contained"
            fullWidth
            className={styles.payButton}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Pay Now'
            )}
          </Button>

          {message && errorType !== 'unknown_error' ? (
            <PaymentErrorDisplay
              errorMessage={message}
              errorType={errorType}
              onRetry={() => {
                setMessage(null);
                setErrorType('unknown_error');
              }}
            />
          ) : (
            message && (
              <Box className={styles.paymentMessage}>
                <Typography variant="body2" color="textPrimary">
                  {message}
                </Typography>
              </Box>
            )
          )}
        </form>
      </Box>
    );
  }
);

StripePaymentForm.displayName = 'StripePaymentForm';

export default StripePaymentFormWrapper;
