'use client';

import React from 'react';
import { Box, Typography, Checkbox, Chip } from '@mui/material';
import { FaCheck, FaPlus, FaInfoCircle } from 'react-icons/fa';
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
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={handleToggle}
      onKeyDown={(e) => handleKeyboardAction(e, handleToggle)}
      tabIndex={0}
      {...ariaProps}
    >
      {}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 2,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Checkbox
            checked={isSelected}
            onChange={handleToggle}
            inputProps={{ 'aria-label': `Select ${feature.name}` }}
            sx={{
              color: '#cbd5e1',
              padding: '4px',
              marginLeft: '-4px',
              '&.Mui-checked': {
                color: '#2563eb',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.3rem',
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: '1rem',
              lineHeight: 1.3,
              transition: 'color 0.2s ease',
              ...(isSelected && {
                color: '#2563eb',
              }),
            }}
          >
            {feature.name}
          </Typography>
        </Box>

        {}
        <Chip
          label={formatPrice(currency, featurePrice)}
          size="small"
          sx={{
            fontWeight: 700,
            color: isSelected ? 'white' : '#2563eb',
            backgroundColor: isSelected ? '#2563eb' : 'rgba(37, 99, 235, 0.08)',
            padding: '0 8px',
            height: '28px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease',
            border: isSelected ? 'none' : '1px solid rgba(37, 99, 235, 0.15)',
            boxShadow: isSelected ? '0 2px 5px rgba(37, 99, 235, 0.2)' : 'none',
            '&:hover': {
              backgroundColor: isSelected
                ? '#1d4ed8'
                : 'rgba(37, 99, 235, 0.12)',
            },
          }}
        />
      </Box>

      {}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {feature.description}
        </Typography>

        {}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 'auto',
            pt: 1.5,
            borderTop: '1px dashed rgba(203, 213, 225, 0.5)',
          }}
        >
          {isSelected ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: '#10b981',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              <FaCheck size={14} />
              <span>Selected</span>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              <FaPlus size={14} />
              <span>Add to package</span>
            </Box>
          )}

          {feature.isRequired && (
            <Chip
              label="Required"
              size="small"
              sx={{
                height: '22px',
                fontSize: '0.7rem',
                backgroundColor: 'rgba(234, 88, 12, 0.08)',
                color: '#ea580c',
                fontWeight: 600,
                borderRadius: '4px',
              }}
            />
          )}
        </Box>
      </Box>

      {}
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
            animation: 'fadeIn 0.3s ease-in',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(5px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <FaInfoCircle
            style={{
              color: '#2563eb',
              fontSize: '1rem',
              marginTop: '3px',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <Typography
            variant="body2"
            sx={{
              color: '#475569',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}
          >
            {feature.description}
          </Typography>
        </Box>
      )}

      {}
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 2px 5px rgba(16, 185, 129, 0.3)',
            border: '2px solid white',
            zIndex: 2,
          }}
        >
          <FaCheck size={10} aria-hidden="true" />
        </Box>
      )}
    </Box>
  );
};

export default React.memo(FeatureToggle);
