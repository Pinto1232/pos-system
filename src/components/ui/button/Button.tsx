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
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  onClick,
  startIcon,
  type = 'button',
  variant = 'contained',
  fullWidth = false,
}) => {
  return (
    <button
      className={`${styles.button} ${className} ${styles[variant]} ${
        fullWidth ? styles.fullWidth : ''
      }`}
      onClick={onClick}
      type={type}
    >
      {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
      {children}
    </button>
  );
};
