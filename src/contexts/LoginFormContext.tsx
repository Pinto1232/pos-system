'use client';

import React, {
  useState,
  createContext,
  useContext,
} from 'react';
import LoginForm from '@/components/login-form/LoginForm';
import {
  Dialog,
  DialogContent,
} from '@mui/material';
import { SpinnerProvider } from '@/contexts/SpinnerContext';

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
      >
        <DialogContent>
          <SpinnerProvider>
            <LoginForm />
          </SpinnerProvider>
        </DialogContent>
      </Dialog>
    </LoginFormContext.Provider>
  );
};
