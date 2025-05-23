'use client';

import React from 'react';
import { Box, Typography, Checkbox } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { FaCheck } from 'react-icons/fa';
import { Feature } from '../../types';
import {
  handleKeyboardAction,
  getSelectableItemProps,
} from '../../utils/accessibilityUtils';

interface FeatureToggleProps {
  feature: Feature;
  isSelected: boolean;
  onToggle: (feature: Feature) => void;
  currency: string;
  formatPrice: (currency: string, price: number) => string;
  showDescription?: boolean;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({
  feature,
  isSelected,
  onToggle,
  currency,
  formatPrice,
  showDescription = true,
}) => {
  const featurePrice = feature.multiCurrencyPrices
    ? feature.multiCurrencyPrices[currency]
    : feature.basePrice;

  const handleToggle = () => {
    onToggle(feature);
  };

  const ariaProps = getSelectableItemProps(
    isSelected,
    `Feature: ${feature.name}, Price: ${formatPrice(currency, featurePrice)}`
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        width: '100%',
        cursor: 'pointer',
      }}
      onClick={handleToggle}
      onKeyDown={(e) => handleKeyboardAction(e, handleToggle)}
      tabIndex={0}
      {...ariaProps}
    >
      <Checkbox
        checked={isSelected}
        onChange={handleToggle}
        inputProps={{ 'aria-label': `Select ${feature.name}` }}
        sx={{
          color: '#cbd5e1',
          '&.Mui-checked': {
            color: '#2563eb',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.4rem',
          },
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: '1.1rem',
              lineHeight: 1.3,
            }}
          >
            {feature.name}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
              }}
            >
              {formatPrice(currency, featurePrice)}
            </Typography>

            {isSelected && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  color: 'white',
                }}
              >
                <FaCheck size={12} aria-hidden="true" />
              </Box>
            )}
          </Box>
        </Box>

        {isSelected && showDescription && feature.description && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              mt: 2,
              p: 2,
              backgroundColor: 'rgba(37, 99, 235, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(37, 99, 235, 0.1)',
            }}
          >
            <InfoIcon
              sx={{
                color: '#2563eb',
                fontSize: '1.1rem',
                mt: 0.1,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <Typography
              variant="body2"
              sx={{
                color: '#475569',
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              {feature.description}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(FeatureToggle);
