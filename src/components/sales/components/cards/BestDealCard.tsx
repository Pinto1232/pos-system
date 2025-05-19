'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BestDeal } from '../../types';

interface BestDealCardProps {
  bestDeal: BestDeal;
  formatCurrency: (amount: number, currencyCode?: string) => string;
}

const BestDealCard: React.FC<BestDealCardProps> = ({
  bestDeal,
  formatCurrency,
}) => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        color: 'white',
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
              <Typography
                variant="overline"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '1.5px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Best Deal
              </Typography>
              <Tooltip title="Highest value deal">
                <InfoIcon
                  sx={{
                    fontSize: '1.1rem',
                    color: 'rgba(255,255,255,0.9)',
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
                color: 'white',
                mb: 2,
                fontSize: {
                  xs: '2rem',
                  sm: '2.25rem',
                  md: '2.5rem',
                },
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                letterSpacing: '-0.02em',
              }}
            >
              {formatCurrency(bestDeal.value, 'ZAR')}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255,255,255,0.15)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'white',
                  fontWeight: 500,
                }}
              >
                {bestDeal.company}
              </Typography>
              <ChevronRightIcon
                sx={{
                  fontSize: '1.1rem',
                  color: 'white',
                }}
              />
            </Stack>
          </Box>
          <IconButton
            size="small"
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              width: 40,
              height: 40,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'scale(1.15) rotate(10deg)',
                color: '#ffd700',
                backgroundColor: 'rgba(255,255,255,0.2)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              },
            }}
          >
            <StarIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BestDealCard;
