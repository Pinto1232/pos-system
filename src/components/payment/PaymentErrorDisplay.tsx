'use client';

import React from 'react';
import { Box, Button, Alert, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface PaymentErrorAction {
  label: string;
  onClick: () => void;
  primary: boolean;
}

type ActionItem = PaymentErrorAction | null;

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
  const getUserFriendlyError = (
    message: string,
    type: string
  ): {
    title: string;
    description: string;
    actions: PaymentErrorAction[];
  } => {
    const createActionArray = (items: ActionItem[]): PaymentErrorAction[] => {
      return items.filter((item): item is PaymentErrorAction => item !== null);
    };
    switch (type) {
      case 'card_error':
        return {
          title: 'Card Payment Failed',
          description:
            message ||
            'Your card was declined. Please check your card details or try another payment method.',
          actions: createActionArray([
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
          ]),
        };

      case 'validation_error':
        return {
          title: 'Invalid Information',
          description:
            message || 'Please check your payment information and try again.',
          actions: createActionArray([
            onRetry
              ? {
                  label: 'Try Again',
                  onClick: onRetry,
                  primary: true,
                }
              : null,
          ]),
        };

      case 'server_error':
        return {
          title: 'Payment System Error',
          description:
            message ||
            'Our payment system is experiencing issues. Please try again later or contact support.',
          actions: createActionArray([
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
          ]),
        };

      case 'timeout':
        return {
          title: 'Payment Timeout',
          description:
            message ||
            'Your payment is taking longer than expected. Please check your bank app or account to see if the payment went through before trying again.',
          actions: createActionArray([
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
          ]),
        };

      default:
        return {
          title: 'Payment Error',
          description:
            message ||
            'An unexpected error occurred. Please try again or contact support.',
          actions: createActionArray([
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
          ]),
        };
    }
  };

  const { title, description, actions } = getUserFriendlyError(
    errorMessage,
    errorType
  );

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
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          {actions.map((action: PaymentErrorAction, index: number) => (
            <Button
              key={index}
              variant={action.primary ? 'contained' : 'outlined'}
              onClick={action.onClick}
              sx={{ minWidth: 120 }}
            >
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
