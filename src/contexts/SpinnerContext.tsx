'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ErrorModal from '@/components/ui/errorModal/ErrorModal';
import { usePathname } from 'next/navigation';

export interface SpinnerContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const SpinnerContext = createContext<SpinnerContextProps | undefined>(undefined);

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <SpinnerContext.Provider value={{ loading, setLoading, error, setError }}>
      {loading && !isDashboard && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.primary' }}>
            Loading...
          </Typography>
        </Box>
      )}
      {loading && isDashboard && (
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        />
      )}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = () => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error('useSpinner must be used within a SpinnerProvider');
  }
  return context;
};

export { SpinnerContext };
