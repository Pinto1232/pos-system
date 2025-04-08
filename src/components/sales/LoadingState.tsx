import React from 'react';
import {
  Box,
  CircularProgress,
} from '@mui/material';

interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingState: React.FC<
  LoadingStateProps
> = ({ loading, children }) => {
  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          mt: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return <>{children}</>;
};

export default LoadingState;
