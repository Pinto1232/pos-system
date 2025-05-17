'use client';

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'contained' | 'outlined' | 'text';
  fullWidth?: boolean;
  disabled?: boolean;
  sx?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  onClick,
  startIcon,
  type = 'button',
  variant = 'contained',
  fullWidth = false,
  disabled = false,
  sx,
}) => {
  return (
    <button
      className={`${styles.button} ${className} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={sx}
    >
      {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
      {children}
    </button>
  );
};
