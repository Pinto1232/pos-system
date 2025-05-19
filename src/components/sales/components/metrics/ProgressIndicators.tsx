'use client';

import React from 'react';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';

interface ProgressIndicatorsProps {
  inStoreProgress: number;
  onlineProgress: number;
  mobileProgress: number;
  desktopProgress: number;
  getProgressStyles: (type: string) => {
    color: string;
    background: string;
  };
}

const ProgressIndicators: React.FC<ProgressIndicatorsProps> = ({
  inStoreProgress,
  onlineProgress,
  mobileProgress,
  desktopProgress,
  getProgressStyles,
}) => {
  return (
    <Stack
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      spacing={3}
      justifyContent="space-between"
      sx={{ mt: { xs: 2, sm: 0 } }}
    >
      {}
      <CircularProgressWithLabel
        value={inStoreProgress}
        label="In Store"
        count={1020}
        type="inStore"
        getProgressStyles={getProgressStyles}
        size={90}
        thickness={4}
      />

      {}
      <CircularProgressWithLabel
        value={onlineProgress}
        label="Online"
        count={869}
        type="online"
        getProgressStyles={getProgressStyles}
        size={80}
        thickness={3}
      />

      {}
      <CircularProgressWithLabel
        value={mobileProgress}
        label="Mobile"
        count={1458}
        type="mobile"
        getProgressStyles={getProgressStyles}
        size={80}
        thickness={3}
      />

      {}
      <CircularProgressWithLabel
        value={desktopProgress}
        label="Desktop"
        count={952}
        type="desktop"
        getProgressStyles={getProgressStyles}
        size={80}
        thickness={3}
      />
    </Stack>
  );
};

interface CircularProgressWithLabelProps {
  value: number;
  label: string;
  count: number;
  type: string;
  getProgressStyles: (type: string) => {
    color: string;
    background: string;
  };
  size: number;
  thickness: number;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
  label,
  count,
  type,
  getProgressStyles,
  size,
  thickness,
}) => {
  const isLarge = size === 90;

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '100%', sm: size },
        height: { xs: isLarge ? 70 : 60, sm: size },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: { xs: 2, sm: 0 },
        transition: isLarge
          ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'none',
        '&:hover': {
          transform: isLarge ? 'scale(1.05)' : 'none',
        },
      }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{
          position: 'absolute',
          color: getProgressStyles(type).background,
          opacity: 0.7,
        }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        sx={{
          position: 'absolute',
          color: getProgressStyles(type).color,
          transform: 'rotate(-90deg)',
          boxShadow: isLarge
            ? `0 0 10px ${getProgressStyles(type).color}40`
            : 'none',
          borderRadius: '50%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: isLarge ? '1.5rem' : '1.25rem',
            fontWeight: isLarge ? 800 : 700,
            color: getProgressStyles(type).color,
            mb: 0.5,
            letterSpacing: isLarge ? '-0.02em' : 'normal',
          }}
        >
          {value}%
        </Typography>
        <Typography
          sx={{
            fontSize: isLarge ? '0.75rem' : '0.7rem',
            color: '#1e293b',
            textTransform: 'uppercase',
            fontWeight: isLarge ? 700 : 600,
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: isLarge ? '0.75rem' : '0.7rem',
            color: '#64748b',
            mt: 0.25,
            fontWeight: isLarge ? 500 : 'normal',
          }}
        >
          {count}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressIndicators;
