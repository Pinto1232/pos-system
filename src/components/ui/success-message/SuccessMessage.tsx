'use client';

import React, { memo, useCallback } from 'react';
import {
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { HiShoppingCart } from 'react-icons/hi';
import styles from './SuccessMessage.module.css';
import { STRIPE_PRICE_IDS } from '@/constants/stripeProducts';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

interface SuccessMessageProps {
  open: boolean;
  onClose: () => void;
  message?: string;
  onConfirm: (isSignup: boolean) => void;
  onReturn: () => void;
  selectedPackage?: {
    id: number;
    title: string;
    type:
    | 'starter'
    | 'growth'
    | 'enterprise'
    | 'custom'
    | 'premium';
    price: number;
    currency?: string;
  };
  currentCurrency?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> =
  memo(
    ({
      open,
      onClose,
      message,
      onReturn,
      onConfirm,
      selectedPackage,
      currentCurrency = 'USD',
    }) => {
      const { addToCart } = useCart();

      const handleAddToCart = useCallback(() => {
        if (!selectedPackage) return;

        const packageType = selectedPackage.type;
        const stripePriceId =
          STRIPE_PRICE_IDS?.[packageType] ||
          'default_price_id';

        const cartItem = {
          id: selectedPackage.id || Date.now(),
          name:
            selectedPackage.title ||
            packageType.charAt(0).toUpperCase() +
            packageType.slice(1),
          price: selectedPackage.price || 29.99,
          quantity: 1,
          packageType,
          stripePriceId,
          currency:
            currentCurrency ||
            selectedPackage.currency ||
            'USD',
        };

        addToCart?.(cartItem);
        onConfirm(false); // Close the success message after adding to cart
      }, [
        addToCart,
        selectedPackage,
        currentCurrency,
        onConfirm,
      ]);

      if (!open) return null;

      return (
        <div
          className={styles.successMessageOverlay}
        >
          <div
            className={
              styles.successMessageContainer
            }
          >
            <IconButton
              className={styles.closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>

            <div
              className={
                styles.successIconContainer
              }
            >
              <motion.div
                animate={{
                  rotate: [
                    0, 10, -10, 10, -10, 0,
                  ],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  repeat: 0,
                }}
              >
                <CheckCircleIcon
                  className={styles.successIcon}
                />
              </motion.div>
            </div>

            <Typography
              variant="h6"
              className={styles.successTitle}
            >
              Success
            </Typography>
            <Typography
              className={styles.successText}
            >
              {message ||
                'Please proceed with payment'}
            </Typography>

            <div
              className={
                styles.successMessageActions
              }
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: '#1e3a8a',
                }}
                onClick={onReturn}
                startIcon={<ArrowBackIcon />}
                sx={{
                  width: '150px',
                  whiteSpace: 'nowrap',
                }}
              >
                Return
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: '#1e3a8a',
                }}
                onClick={handleAddToCart}
                startIcon={<HiShoppingCart />}
                sx={{
                  width: '150px',
                  whiteSpace: 'nowrap',
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      );
    }
  );

SuccessMessage.displayName = 'SuccessMessage';

export default SuccessMessage;
