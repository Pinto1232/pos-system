'use client';

import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import LoginForm from '@/components/login-form/LoginForm';
import { Dialog, DialogContent } from '@mui/material';
import { SpinnerProvider } from '@/contexts/SpinnerContext';

interface LoginFormContextProps {
  toggleLoginForm: () => void;
}

const LoginFormContext = createContext<LoginFormContextProps | undefined>(
  undefined
);

export const useLoginForm = () => {
  const context = useContext(LoginFormContext);
  if (!context) {
    throw new Error('useLoginForm must be used within a LoginFormProvider');
  }
  return context;
};

export const LoginFormProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleLoginForm = useCallback(() => {
    console.log(
      'toggleLoginForm called, current state:',
      JSON.stringify(open, null, 2)
    );
    setOpen((prev) => !prev);
    console.log('toggleLoginForm new state:', JSON.stringify(!open, null, 2));
  }, [open]);

  const contextValue = useMemo(
    () => ({
      toggleLoginForm,
    }),
    [toggleLoginForm]
  );

  return (
    <LoginFormContext.Provider value={contextValue}>
      {children}
      <Dialog
        open={open}
        onClose={toggleLoginForm}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            maxWidth: '480px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#ffffff',
            '@media (max-width: 480px)': {
              margin: '16px',
              maxWidth: 'calc(100% - 32px)',
            },
          },
        }}
        sx={{
          zIndex: 9999,
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            backgroundColor: '#ffffff',
          }}
        >
          <SpinnerProvider>
            <LoginForm onClose={toggleLoginForm} />
          </SpinnerProvider>
        </DialogContent>
      </Dialog>
    </LoginFormContext.Provider>
  );
};
