'use client';

import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import LoadingDots from '@/components/LoadingDots';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { error, isInitialized } = useContext(AuthContext);

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
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 3,
            borderRadius: '15px',
            padding: '20px 30px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              color: '#000',
              letterSpacing: '0.5px',
            }}
          >
            Initializing authentication
            <LoadingDots />
          </Typography>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
