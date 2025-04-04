import React from 'react';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { MenuToggleButtonProps } from './types';

const MenuToggleButton: React.FC<MenuToggleButtonProps> = ({ onClick, isOpen }) => (
  <IconButton
    color="inherit"
    aria-label="toggle drawer"
    onClick={onClick}
    sx={{
      position: 'fixed',
      top: 10,
      left: isOpen ? 'auto' : 10,
      zIndex: 1200,
      bgcolor: '#173a79',
      color: '#fff',
      '&:hover': {
        bgcolor: '#2a4d8a',
      },
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    }}
  >
    {isOpen ? <CloseIcon /> : <MenuIcon />}
  </IconButton>
);

export default MenuToggleButton;
