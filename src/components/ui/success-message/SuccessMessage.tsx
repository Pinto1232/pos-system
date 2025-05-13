'use client';

import React, {
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import { useSpinner } from '@/contexts/SpinnerContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { useSuccessModal } from '@/contexts/SuccessModalContext';

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
      const { addToCart, cartItems } = useCart();
      const { loading } = useSpinner();
      const { closeModal } =
        usePackageSelection();
      const { hideSuccessModal } =
        useSuccessModal();
      const [snackbarOpen, setSnackbarOpen] =
        useState(false);
      const [
        snackbarMessage,
        setSnackbarMessage,
      ] = useState('');
      const [
        snackbarSeverity,
        setSnackbarSeverity,
      ] = useState<
        'success' | 'warning' | 'error'
      >('success');

      useEffect(() => {
        if (open && formData) {
          console.log(
            '===== ORDER SUMMARY DATA ====='
          );
          console.log(
            'Customer Information:',
            formData
          );
          console.log(
            'Selected Package:',
            selectedPackage
          );
          console.log(
            'Selected Features:',
            selectedFeatures
          );
          console.log(
            'Selected Add-ons:',
            selectedAddOns
          );
          console.log(
            'Usage Quantities:',
            usageQuantities
          );
          console.log(
            'Total Price:',
            calculatedPrice,
            currentCurrency
          );
          console.log(
            '============================='
          );
        }
      }, [
        open,
        formData,
        selectedPackage,
        selectedFeatures,
        selectedAddOns,
        usageQuantities,
        calculatedPrice,
        currentCurrency,
      ]);

      const handleAddToCart = useCallback(() => {
        if (!selectedPackage) return;

        const packageType = selectedPackage.type;
        const stripePriceId =
          STRIPE_PRICE_IDS?.[packageType] ||
          'default_price_id';

        const packageId =
          selectedPackage.id || Date.now();

        console.log(
          'Checking if package exists in cart:',
          packageId
        );
        console.log(
          'Current cart items:',
          cartItems
        );

        const isPackageInCart = cartItems.some(
          (item) => {
            console.log(
              'Comparing item.id:',
              item.id,
              'with packageId:',
              packageId
            );
            return item.id === packageId;
          }
        );

        if (isPackageInCart) {
          console.log(
            'Package already in cart, showing warning'
          );
          setSnackbarMessage(
            `${selectedPackage.title} package is already in your cart!`
          );
          setSnackbarSeverity('warning');
          setSnackbarOpen(true);
          return;
        }

        const cartItem = {
          id: packageId,
          name:
            selectedPackage.title ||
            packageType.charAt(0).toUpperCase() +
              packageType.slice(1),
          price:
            calculatedPrice ||
            selectedPackage.price ||
            29.99,
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
        setSnackbarMessage(notificationMessage);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        if (onAddToCart) {
          onAddToCart(notificationMessage);
        }

        // Close both the success modal and the package selection modal
        onConfirm(false);
        hideSuccessModal(); // Close the success modal
        closeModal(); // Close the package selection modal
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
        cartItems,
        closeModal,
        hideSuccessModal,
      ]);

      const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };

      if (!open) return null;

      // Don't show the modal at all when spinner is loading (for any package type)
      if (loading) return null;

      return (
        <>
          <div
            className={
              styles.successMessageOverlay
            }
          >
            <div
              className={
                styles.successMessageContainer
              }
            >
              <IconButton
                className={styles.closeButton}
                onClick={() => {
                  hideSuccessModal();
                  onReturn();
                }}
              >
                <CloseIcon />
              </IconButton>

              <div
                className={
                  styles.successIconContainer
                }
              >
                <motion.div
                  initial={{
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="checkmark-animation"
                >
                  <CheckCircleIcon
                    className={styles.successIcon}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.3,
                }}
              >
                <Typography
                  variant="h6"
                  className={styles.successTitle}
                >
                  Success
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.7,
                  duration: 0.3,
                }}
              >
                <Typography
                  className={styles.successText}
                >
                  {message ||
                    'Please proceed with payment'}
                </Typography>
              </motion.div>

              <motion.div
                className={
                  styles.successMessageActions
                }
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.9,
                  duration: 0.3,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    // Just close the success modal, but keep the package selection modal open
                    hideSuccessModal();
                    onReturn();
                  }}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    width: '150px',
                    whiteSpace: 'nowrap',
                    borderRadius: 0,
                    borderColor: '#2563eb',
                    color: '#2563eb',
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '8px 16px',
                    '&:hover': {
                      borderColor: '#1e40af',
                      backgroundColor:
                        'rgba(37, 99, 235, 0.04)',
                    },
                  }}
                >
                  Return
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  startIcon={<HiShoppingCart />}
                  sx={{
                    width: '150px',
                    whiteSpace: 'nowrap',
                    borderRadius: 0,
                    backgroundColor: '#2563eb',
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '8px 16px',
                    '&:hover': {
                      backgroundColor: '#1e40af',
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </motion.div>
            </div>
          </div>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            sx={{
              zIndex: 9999,
              '& .MuiAlert-root': {
                width: '100%',
                minWidth: '300px',
              },
            }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      );
    }
  );

SuccessMessage.displayName = 'SuccessMessage';

export default SuccessMessage;
