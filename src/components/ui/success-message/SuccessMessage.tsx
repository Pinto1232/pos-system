'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Button,
  IconButton,
  Snackbar,
  Alert,
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
  formData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    [key: string]: any;
  };
  selectedFeatures?: Array<any>;
  selectedAddOns?: Array<any>;
  usageQuantities?: Record<number, number>;
  calculatedPrice?: number;
  onAddToCart?: (message: string) => void;
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
      formData,
      selectedFeatures,
      selectedAddOns,
      usageQuantities,
      calculatedPrice,
      onAddToCart,
    }) => {
      const { addToCart } = useCart();

      useEffect(() => {
        if (open && formData) {
          console.log('===== ORDER SUMMARY DATA =====');
          console.log('Customer Information:', formData);
          console.log('Selected Package:', selectedPackage);
          console.log('Selected Features:', selectedFeatures);
          console.log('Selected Add-ons:', selectedAddOns);
          console.log('Usage Quantities:', usageQuantities);
          console.log('Total Price:', calculatedPrice, currentCurrency);
          console.log('=============================');
        }
      }, [open, formData, selectedPackage, selectedFeatures, selectedAddOns, usageQuantities, calculatedPrice, currentCurrency]);

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
          price: calculatedPrice || selectedPackage.price || 29.99,
          quantity: 1,
          packageType,
          stripePriceId,
          currency:
            currentCurrency ||
            selectedPackage.currency ||
            'USD',
          formData,
          selectedFeatures,
          selectedAddOns,
          usageQuantities,
        };
        console.log('Adding to cart:', cartItem);

        addToCart?.(cartItem);

        const notificationMessage = `${selectedPackage.title} package added to cart!`;

        if (onAddToCart) {
          onAddToCart(notificationMessage);
        }

        onConfirm(false);
      }, [
        addToCart,
        selectedPackage,
        currentCurrency,
        onConfirm,
        formData,
        selectedFeatures,
        selectedAddOns,
        usageQuantities,
        calculatedPrice,
        onAddToCart,
      ]);

      if (!open) return null;

      return (
        <div className={styles.successMessageOverlay}>
          <div className={styles.successMessageContainer}>
            <IconButton
              className={styles.closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>

            <div className={styles.successIconContainer}>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  repeat: 0,
                }}
              >
                <CheckCircleIcon className={styles.successIcon} />
              </motion.div>
            </div>

            <Typography variant="h6" className={styles.successTitle}>
              Success
            </Typography>
            <Typography className={styles.successText}>
              {message || 'Please proceed with payment'}
            </Typography>

            <div className={styles.successMessageActions}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#1e3a8a' }}
                onClick={onReturn}
                startIcon={<ArrowBackIcon />}
                sx={{ width: '150px', whiteSpace: 'nowrap' }}
              >
                Return
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#1e3a8a' }}
                onClick={handleAddToCart}
                startIcon={<HiShoppingCart />}
                sx={{ width: '150px', whiteSpace: 'nowrap' }}
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
