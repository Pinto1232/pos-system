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
import DoneIcon from '@mui/icons-material/Done';
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

            {/* The container with the animation */}
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
              variant="h5"
              className={styles.successTitle}
            >
              Success
            </Typography>
            <Typography
              className={styles.successText}
            >
              {message ||
                'Your action was successful. Please login now'}
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
              >
                Return
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: '#1e3a8a',
                }}
                onClick={() => onConfirm(true)}
                startIcon={<DoneIcon />}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      );
    }
  );

SuccessMessage.displayName = 'SuccessMessage';

export default SuccessMessage;
