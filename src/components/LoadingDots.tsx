import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

const dotAnimation = keyframes`
  0%, 20% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-4px);
  }
  80%, 100% {
    opacity: 0;
    transform: translateY(0);
  }
`;

const LoadingDots = () => {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        gap: 0.5,
        ml: 0.5,
        '& > span': {
          display: 'inline-block',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          animation: `${dotAnimation} 1.4s infinite ease-in-out`,
        },
        '& > span:nth-of-type(1)': {
          animationDelay: '0s',
        },
        '& > span:nth-of-type(2)': {
          animationDelay: '0.2s',
        },
        '& > span:nth-of-type(3)': {
          animationDelay: '0.4s',
        },
      }}
    >
      <span />
      <span />
      <span />
    </Box>
  );
};

export default LoadingDots;
