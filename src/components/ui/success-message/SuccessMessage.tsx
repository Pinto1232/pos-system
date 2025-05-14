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

// Define more specific types for features and add-ons
interface Feature {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  isRequired: boolean;
  multiCurrencyPrices?: Record<string, number>;
}

interface AddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  multiCurrencyPrices?: Record<string, number>;
}

// Define form data type
interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  [key: string]:
    | string
    | number
    | boolean
    | undefined;
}

interface SuccessMessageProps {
  open: boolean;
  // onClose is kept for backward compatibility but not used
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
  formData?: FormData;
  selectedFeatures?: Feature[];
  selectedAddOns?: AddOn[];
  usageQuantities?: Record<number, number>;
  calculatedPrice?: number;
  onAddToCart?: (message: string) => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> =
  memo(
    ({
      open,
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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
      const [
        packageAddedSnackbarOpen,
        setPackageAddedSnackbarOpen,
      ] = useState(false);

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

        try {
          // Add to cart
          addToCart?.(cartItem);

          // Set the package-added snackbar message and show it
          const notificationMessage = `${selectedPackage.title} package added to cart!`;
          setSnackbarMessage(notificationMessage);
          setSnackbarSeverity('success');

          // Use a small delay to avoid focus trap conflicts
          setTimeout(() => {
            setPackageAddedSnackbarOpen(true);
          }, 0);

          if (onAddToCart) {
            onAddToCart(notificationMessage);
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          setSnackbarMessage('Error adding package to cart. Please try again.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }, [
        addToCart,
        selectedPackage,
        currentCurrency,
        formData,
        selectedFeatures,
        selectedAddOns,
        usageQuantities,
        calculatedPrice,
        onAddToCart,
        cartItems,
      ]);

      const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };

      const handlePackageAddedSnackbarClose =
        () => {
          setPackageAddedSnackbarOpen(false);

          // First close the success modal, then the package selection modal
          // This prevents focus trap conflicts by ensuring proper cleanup order
          setTimeout(() => {
            hideSuccessModal(); // Close the success modal first
            setTimeout(() => {
              closeModal(); // Close the package selection modal after a small delay
              onConfirm(false); // Call onConfirm after both modals are closed
            }, 50);
          }, 50);
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
                onClick={(e) => {
                  // Prevent event bubbling that might cause focus issues
                  e.stopPropagation();
                  // Use setTimeout to avoid focus trap conflicts
                  setTimeout(() => {
                    hideSuccessModal();
                    onReturn();
                  }, 0);
                }}
              >
                <CloseIcon />
              </IconButton>

              <div
                className={
                  styles.successIconContainer
                }
              >
                <div className={styles.checkmarkWrapper}>
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
                  onClick={(e) => {
                    // Prevent event bubbling that might cause focus issues
                    e.stopPropagation();
                    // Use setTimeout to avoid focus trap conflicts
                    setTimeout(() => {
                      // Just close the success modal, but keep the package selection modal open
                      hideSuccessModal();
                      onReturn();
                    }, 0);
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
                  onClick={(e) => {
                    // Prevent event bubbling that might cause focus issues
                    e.stopPropagation();
                    // Use setTimeout to avoid focus trap conflicts
                    setTimeout(() => {
                      handleAddToCart();
                    }, 0);
                  }}
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

          {/* Package Added Snackbar */}
          <Snackbar
            open={packageAddedSnackbarOpen}
            autoHideDuration={3000}
            onClose={
              handlePackageAddedSnackbarClose
            }
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            sx={{
              zIndex: 10000, // Higher than the success modal
              '& .MuiAlert-root': {
                width: '100%',
                minWidth: '350px',
              },
            }}
          >
            <Alert
              onClose={
                handlePackageAddedSnackbarClose
              }
              severity="success"
              variant="filled"
              sx={{
                width: '100%',
                backgroundColor: '#2563eb',
              }}
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
