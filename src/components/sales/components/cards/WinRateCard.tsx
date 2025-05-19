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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface WinRateCardProps {
  winRate: number;
  winRateGrowth: number;
  formatPercentage: (value: number) => string;
  selectedMetric: string | null;
  handleMetricClick: (metric: string) => void;
  getMetricDetails: (
    metric: string
  ) => { title: string; content: string } | null;
}

const WinRateCard: React.FC<WinRateCardProps> = ({
  winRate,
  winRateGrowth,
  formatPercentage,
  selectedMetric,
  handleMetricClick,
  getMetricDetails,
}) => {
  return (
    <Card
      onClick={() => handleMetricClick('winRate')}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 10px 30px rgba(245, 158, 11, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(245, 158, 11, 0.2)',
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
          background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)',
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
              color: '#f59e0b',
              letterSpacing: '1.5px',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            Win Rate
          </Typography>
          <Tooltip title="Click for win rate analysis">
            <InfoIcon
              sx={{
                fontSize: '1.1rem',
                color: '#f59e0b',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
            />
          </Tooltip>
        </Stack>
        <Box sx={{ position: 'relative' }}>
          <Stack direction="row" spacing={1.5} alignItems="baseline">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
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
              {formatPercentage(winRate)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor:
                  winRateGrowth > 0
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(244, 63, 94, 0.1)',
                borderRadius: '8px',
                padding: '4px 10px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor:
                    winRateGrowth > 0
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(244, 63, 94, 0.15)',
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: winRateGrowth > 0 ? '#10b981' : '#f43f5e',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {winRateGrowth > 0 ? (
                  <ArrowUpwardIcon
                    sx={{
                      fontSize: '1rem',
                      mr: 0.5,
                    }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    sx={{
                      fontSize: '1rem',
                      mr: 0.5,
                    }}
                  />
                )}
                {formatPercentage(Math.abs(winRateGrowth))}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {}
        <Box
          sx={{
            position: 'relative',
            mt: 3,
            mb: 1,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={Math.min(winRate, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#f59e0b',
                borderRadius: 4,
                backgroundImage: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
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
            Target: 75%
          </Typography>
        </Box>

        {selectedMetric === 'winRate' && (
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              bgcolor: 'rgba(245, 158, 11, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.1)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(245, 158, 11, 0.08)',
                bgcolor: 'rgba(245, 158, 11, 0.07)',
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-line',
                color: '#334155',
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              {getMetricDetails('winRate')?.content}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WinRateCard;
