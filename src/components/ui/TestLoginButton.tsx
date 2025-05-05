'use client';

import React from 'react';
import { Button } from '@mui/material';
import { useLoginForm } from '@/contexts/LoginFormContext';

const TestLoginButton = () => {
  const { toggleLoginForm } = useLoginForm();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        console.log('Test button clicked');
        toggleLoginForm();
      }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
      }}
    >
      Test Login Form
    </Button>
  );
};

export default TestLoginButton;
