'use client';

import React, { useEffect, useState } from 'react';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSearchParams } from 'next/navigation';

const ErrorAlert: React.FC = () => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      const error = searchParams.get('error');
      if (error) {
        setErrorMessage(decodeURIComponent(error));
        setOpen(true);

        if (window.history && window.history.replaceState) {
          const url = new URL(window.location.href);
          url.searchParams.delete('error');
          window.history.replaceState({}, document.title, url.toString());
        }
      }
    }
  }, [searchParams]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Alert
        severity="error"
        variant="filled"
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          '& .MuiAlert-message': {
            fontSize: '0.95rem',
          },
        }}
      >
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};

export default ErrorAlert;
