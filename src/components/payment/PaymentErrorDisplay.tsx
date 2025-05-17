'use client';

import React from 'react';
import { Box, Typography, Button, Alert, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface PaymentErrorDisplayProps {
  errorMessage: string;
  errorType?: string;
  onRetry?: () => void;
  onUseAnotherCard?: () => void;
  onContactSupport?: () => void;
  onDismiss?: () => void;
}

const PaymentErrorDisplay: React.FC<PaymentErrorDisplayProps> = ({
  errorMessage,
  errorType = 'unknown_error',
  onRetry,
  onUseAnotherCard,
  onContactSupport,
  onDismiss,
}) => {
  const getUserFriendlyError = (message: string, type: string) => {
    switch (type) {
      case 'card_error':
        return {
          title: 'Card Payment Failed',
          description: message || 'Your card was declined. Please check your card details or try another payment method.',
          actions: [
            onUseAnotherCard
              ? {
                  label: 'Try Another Card',
                  onClick: onUseAnotherCard,
                  primary: true,
                }
              : null,
            onRetry
              ? {
                  label: 'Try Again',
                  onClick: onRetry,
                  primary: false,
                }
              : null,
          ].filter(Boolean),
        };

      case 'validation_error':
        return {
          title: 'Invalid Information',
          description: message || 'Please check your payment information and try again.',
          actions: [
            onRetry
              ? {
                  label: 'Try Again',
                  onClick: onRetry,
                  primary: true,
                }
              : null,
          ].filter(Boolean),
        };

      case 'server_error':
        return {
          title: 'Payment System Error',
          description: message || 'Our payment system is experiencing issues. Please try again later or contact support.',
          actions: [
            onRetry
              ? {
                  label: 'Try Again',
                  onClick: onRetry,
                  primary: true,
                }
              : null,
            onContactSupport
              ? {
                  label: 'Contact Support',
                  onClick: onContactSupport,
                  primary: false,
                }
              : null,
          ].filter(Boolean),
        };

      case 'timeout':
        return {
          title: 'Payment Timeout',
          description:
            message ||
            'Your payment is taking longer than expected. Please check your bank app or account to see if the payment went through before trying again.',
          actions: [
            onRetry
              ? {
                  label: 'Try Again',
                  onClick: onRetry,
                  primary: true,
                }
              : null,
            onContactSupport
              ? {
                  label: 'Contact Support',
                  onClick: onContactSupport,
                  primary: false,
                }
              : null,
          ].filter(Boolean),
        };

      default:
        return {
          title: 'Payment Error',
          description: message || 'An unexpected error occurred. Please try again or contact support.',
          actions: [
            onRetry
              ? {
                  label: 'Try Again',
                  onClick: onRetry,
                  primary: true,
                }
              : null,
            onContactSupport
              ? {
                  label: 'Contact Support',
                  onClick: onContactSupport,
                  primary: false,
                }
              : null,
          ].filter(Boolean),
        };
    }
  };

  const { title, description, actions } = getUserFriendlyError(errorMessage, errorType);

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />

      <Box
        component="div"
        sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          mb: 1,
        }}
      >
        {title}
      </Box>

      <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
        {description}
      </Alert>

      {actions && actions.length > 0 && (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          {actions.map((action, index) => (
            <Button key={index} variant={action.primary ? 'contained' : 'outlined'} onClick={action.onClick} sx={{ minWidth: 120 }}>
              {action.label}
            </Button>
          ))}

          {onDismiss && (
            <Button variant="text" onClick={onDismiss} sx={{ ml: 1 }}>
              Dismiss
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default PaymentErrorDisplay;
