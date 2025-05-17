import React from 'react';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { MenuToggleButtonProps } from './types';

const MenuToggleButton: React.FC<MenuToggleButtonProps> = ({
  onClick,
  isOpen,
}) => (
  <IconButton
    color="inherit"
    aria-label="toggle drawer"
    onClick={onClick}
    sx={{
      position: 'fixed',
      top: 10,
      left: isOpen ? 'auto' : 10,
      zIndex: 1200,
      bgcolor: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      width: 40,
      height: 40,
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&:hover': {
        bgcolor: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateX(2px)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
    }}
  >
    {isOpen ? (
      <CloseIcon sx={{ fontSize: '1.5rem' }} />
    ) : (
      <MenuIcon sx={{ fontSize: '1.5rem' }} />
    )}
  </IconButton>
);

export default MenuToggleButton;
