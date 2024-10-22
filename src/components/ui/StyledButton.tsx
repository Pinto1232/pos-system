import React from 'react';
import { Button, ButtonProps } from '@mui/material';


interface StyledButtonProps extends ButtonProps {
  label: string; 
}

const StyledButton: React.FC<StyledButtonProps> = ({ label, ...props }) => {
  return (
    <Button {...props}>
      {label}
    </Button>
  );
};

export default StyledButton;