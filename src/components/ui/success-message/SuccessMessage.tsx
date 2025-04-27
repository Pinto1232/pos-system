'use client';

import React, { memo } from 'react';
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

interface SuccessMessageProps {
  open: boolean;
  onClose: () => void;
  message?: string;
  onConfirm: (isSignup: boolean) => void;
  onReturn: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> =
  memo(
    ({
      open,
      onClose,
      message,
      onConfirm,
      onReturn,
    }) => {
      if (!open) return null;

      const handleAddToCart = () => {
        onConfirm(true);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      };

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
              <CheckCircleIcon
                className={styles.successIcon}
              />
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
