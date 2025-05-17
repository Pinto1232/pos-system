'use client';

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import ErrorModal from '@/components/ui/errorModal/ErrorModal';
import { usePathname } from 'next/navigation';

export interface SpinnerContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: (options?: { timeout?: number }) => void;
  stopLoading: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const SpinnerContext = createContext<SpinnerContextProps | undefined>(
  undefined
);

const DEFAULT_TIMEOUT = 10000;

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startLoading = React.useCallback(
    (options?: { timeout?: number }) => {
      clearTimeouts();
      setLoading(true);
      const timeoutDuration = options?.timeout || DEFAULT_TIMEOUT;

      timeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, timeoutDuration);
    },
    [clearTimeouts]
  );

  const stopLoading = React.useCallback(() => {
    clearTimeouts();
    setLoading(false);
  }, [clearTimeouts]);

  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  useEffect(() => {
    if (isDashboard && loading) {
      const dashboardTimeout = setTimeout(() => {
        setLoading(false);
      }, 5000);

      return () => clearTimeout(dashboardTimeout);
    }
  }, [isDashboard, loading]);

  const contextValue = React.useMemo(
    () => ({
      loading,
      setLoading,
      startLoading,
      stopLoading,
      error,
      setError,
    }),
    [loading, setLoading, startLoading, stopLoading, error, setError]
  );

  return (
    <SpinnerContext.Provider value={contextValue}>
      <Fade in={loading && !isDashboard} timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: loading && !isDashboard ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#ffffff',
            }}
          />
          <Typography variant="h6" sx={{ mt: 2, color: '#ffffff' }}>
            Loading...
          </Typography>
        </Box>
      </Fade>

      <Fade in={loading && isDashboard} timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: loading && isDashboard ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#ffffff',
            }}
          />
          <Typography variant="h6" sx={{ mt: 2, color: '#ffffff' }}>
            Loading...
          </Typography>
        </Box>
      </Fade>

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
