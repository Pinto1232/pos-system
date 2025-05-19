'use client';

import React from 'react';
import { Stack, Box, Typography, Avatar } from '@mui/material';

const SalesHeader: React.FC = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      mb={3}
      sx={{
        borderBottom: '1px solid rgba(230, 235, 245, 0.6)',
        pb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#6366f1',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.1rem',
          }}
        >
          E
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: '1.25rem',
              sm: '1.5rem',
              md: '1.6rem',
            },
            color: '#6366f1',
            letterSpacing: '-0.01em',
          }}
        >
          New Sales Report
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#6366f1',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          A
        </Avatar>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#6366f1',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          M
        </Avatar>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#6366f1',
            color: 'white',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          E
        </Avatar>
      </Box>
    </Stack>
  );
};

export default SalesHeader;
