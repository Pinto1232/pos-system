'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface ValueCardProps {
  value: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ value }) => {
  return (
    <Card
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(139, 92, 246, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography
            variant="overline"
            sx={{
              color: '#8b5cf6',
              letterSpacing: '1.5px',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            Value
          </Typography>
          <Tooltip title="Total deal value">
            <InfoIcon
              sx={{
                fontSize: '1.1rem',
                color: '#8b5cf6',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
            />
          </Tooltip>
        </Stack>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mt: 1,
            mb: 2,
            fontSize: {
              xs: '2rem',
              sm: '2.25rem',
              md: '2.5rem',
            },
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </Typography>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            backgroundColor: 'rgba(139, 92, 246, 0.08)',
            borderRadius: '12px',
            padding: '10px 16px',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(139, 92, 246, 0.12)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUpIcon
              sx={{
                color: '#8b5cf6',
                fontSize: '1.25rem',
              }}
            />
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: '#4c1d95',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Monthly trend is positive
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ValueCard;
