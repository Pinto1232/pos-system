'use client';

import React, {
  useState,
  createContext,
  useContext,
} from 'react';

import {
  Dialog,
  DialogContent,
} from '@mui/material';
import LoginForm from './LoginForm';

interface LoginFormContextProps {
  toggleLoginForm: () => void;
}

const LoginFormContext = createContext<
  LoginFormContextProps | undefined
>(undefined);

export const useLoginForm = () => {
  const context = useContext(LoginFormContext);
  if (!context) {
    throw new Error(
      'useLoginForm must be used within a LoginFormProvider'
    );
  }
  return context;
};

export const LoginFormProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleLoginForm = () => {
    setOpen((prev) => !prev);
  };

  return (
    <LoginFormContext.Provider
      value={{ toggleLoginForm }}
    >
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
            '@media (max-width: 480px)': {
              margin: '16px',
              maxWidth: 'calc(100% - 32px)',
            },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <LoginForm onClose={toggleLoginForm} />
        </DialogContent>
      </Dialog>
    </LoginFormContext.Provider>
  );
};
