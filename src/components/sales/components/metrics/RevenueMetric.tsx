'use client';

import React from 'react';
import { Stack, Typography, Chip, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface RevenueMetricProps {
  totalRevenue: number;
  previousRevenue: number;
  growthPercentage: number;
  growthValue: number;
  timeframe: string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatPercentage: (value: number) => string;
}

const RevenueMetric: React.FC<RevenueMetricProps> = ({
  totalRevenue,
  previousRevenue,
  growthPercentage,
  growthValue,
  timeframe,
  formatCurrency,
  formatPercentage,
}) => {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Typography
          variant="h6"
          sx={{
            color: '#64748b',
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
            },
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-4px',
              left: '0',
              width: '30%',
              height: '2px',
              background: 'linear-gradient(90deg, #4338ca, transparent)',
              borderRadius: '2px',
            },
          }}
        >
          Revenue
        </Typography>
        <Tooltip title="Click for detailed revenue information">
          <InfoIcon
            sx={{
              fontSize: '1rem',
              color: '#64748b',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#4f46e5',
                transform: 'scale(1.1)',
              },
            }}
          />
        </Tooltip>
      </Stack>
      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#1a1a1a',
            fontSize: {
              xs: '1.5rem',
              sm: '2rem',
              md: '2.5rem',
            },
            background: 'linear-gradient(135deg, #4338ca, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {formatCurrency(totalRevenue, 'ZAR')}
        </Typography>
        <Typography variant="h5" sx={{ color: '#666666' }}>
          .{((totalRevenue % 1) * 100).toFixed(0)}
        </Typography>
        <Chip
          label={`${growthPercentage > 0 ? '+' : ''}${formatPercentage(growthPercentage)}`}
          icon={
            growthPercentage > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
          }
          color={growthPercentage > 0 ? 'success' : 'error'}
          size="small"
          sx={{
            height: 30,
            borderRadius: '10px',
            fontWeight: 600,
            '& .MuiChip-label': {
              px: 1.5,
              fontSize: '0.85rem',
            },
            '& .MuiChip-icon': {
              fontSize: '1rem',
            },
            boxShadow:
              growthPercentage > 0
                ? '0 4px 12px rgba(76, 175, 80, 0.2)'
                : '0 4px 12px rgba(244, 67, 54, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            '&:hover': {
              transform: 'translateY(-3px) scale(1.05)',
              boxShadow:
                growthPercentage > 0
                  ? '0 6px 16px rgba(76, 175, 80, 0.25)'
                  : '0 6px 16px rgba(244, 67, 54, 0.25)',
            },
          }}
        />
        <Typography variant="body2" sx={{ color: '#666666' }}>
          {formatCurrency(growthValue, 'ZAR')}
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        sx={{
          color: '#666666',
          mt: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <span>vs prev.</span>
        <span style={{ fontWeight: 600 }}>
          {formatCurrency(previousRevenue, 'ZAR')}
        </span>
        <span>{timeframe}</span>
      </Typography>
    </>
  );
};

export default RevenueMetric;
