'use client';

import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import LoadingDots from '@/components/LoadingDots';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({
  children,
}: AuthWrapperProps) => {
  const { error, isInitialized } =
    useContext(AuthContext);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6" color="error">
          Authentication Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          Initializing authentication
          <LoadingDots />
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
