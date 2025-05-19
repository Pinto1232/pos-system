'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface TopSalesCardProps {
  topSales: number;
}

const TopSalesCard: React.FC<TopSalesCardProps> = ({ topSales }) => {
  return (
    <Card
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
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
          background: 'linear-gradient(90deg, #3b82f6, #93c5fd)',
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
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
              color: '#3b82f6',
              letterSpacing: '1.5px',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            Top Sales
          </Typography>
          <Tooltip title="Number of top-performing sales">
            <InfoIcon
              sx={{
                fontSize: '1.1rem',
                color: '#3b82f6',
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
            background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
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
          {topSales}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            mt: 3,
            mb: 1,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={Math.min((topSales / 100) * 100, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#3b82f6',
                borderRadius: 4,
                backgroundImage: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              right: 0,
              top: -20,
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            {Math.min((topSales / 100) * 100, 100)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopSalesCard;
