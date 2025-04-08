'use client';

import React, { memo } from 'react';
import {
  TextField,
  TextFieldProps,
} from '@mui/material';

interface InputProps {
  label: string;
  name: string;
  textFieldProps?: TextFieldProps;
  type?: string;
}
const Input: React.FC<InputProps> = memo(
  ({ label, name, textFieldProps, ...props }) => {
    return (
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        name={name}
        {...textFieldProps}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
