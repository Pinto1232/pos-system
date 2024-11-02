import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface StyledButtonProps extends ButtonProps {
  label: string;
  icon?: React.ReactNode; 
}

const StyledButton: React.FC<StyledButtonProps> = ({ label, icon, ...props }) => {
  return (
    <Button {...props} startIcon={icon}>
      {label}
    </Button>
  );
};

export default StyledButton;