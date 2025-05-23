'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorageIcon from '@mui/icons-material/Storage';
import styles from '../../CustomPackageLayout.module.css';
import { AddOn } from '../../types';
import {
  handleKeyboardAction,
  getSelectableItemProps,
} from '../../utils/accessibilityUtils';

interface AddOnToggleProps {
  addOn: AddOn;
  isSelected: boolean;
  onToggle: (addOn: AddOn) => void;
  currency: string;
  formatPrice: (currency: string, price: number) => string;
}

const AddOnToggle: React.FC<AddOnToggleProps> = ({
  addOn,
  isSelected,
  onToggle,
  currency,
  formatPrice,
}) => {
  const addOnPrice = React.useMemo(() => {
    return addOn.multiCurrencyPrices
      ? addOn.multiCurrencyPrices[currency]
      : addOn.price;
  }, [addOn.multiCurrencyPrices, addOn.price, currency]);

  const handleToggle = React.useCallback(() => {
    onToggle(addOn);
  }, [onToggle, addOn]);

  const renderIcon = React.useCallback(() => {
    if (!addOn.icon) return null;

    switch (addOn.icon) {
      case 'analytics_icon':
        return <BarChartIcon fontSize="small" />;
      case 'api_icon':
        return <CodeIcon fontSize="small" />;
      case 'branding_icon':
        return <BrushIcon fontSize="small" />;
      case 'support_icon':
        return <SupportAgentIcon fontSize="small" />;
      case 'migration_icon':
        return <StorageIcon fontSize="small" />;
      default:
        return null;
    }
  }, [addOn.icon]);

  const features = React.useMemo(() => {
    if (!addOn.features) return [];
    if (Array.isArray(addOn.features)) {
      return addOn.features;
    }

    try {
      return JSON.parse(addOn.features as string);
    } catch {
      return [];
    }
  }, [addOn.features]);

  const dependencies = React.useMemo(() => {
    if (!addOn.dependencies) return [];
    if (Array.isArray(addOn.dependencies)) {
      return addOn.dependencies;
    }

    try {
      return JSON.parse(addOn.dependencies as string);
    } catch {
      return [];
    }
  }, [addOn.dependencies]);

  const ariaProps = React.useMemo(() => {
    return getSelectableItemProps(
      isSelected,
      `Add-on: ${addOn.name}, Price: ${formatPrice(currency, addOnPrice)}`
    );
  }, [isSelected, addOn.name, formatPrice, currency, addOnPrice]);

  return (
    <Box
      className={`${styles.featureItem} ${isSelected ? styles.selectedFeature : ''}`}
      {...ariaProps}
    >
      <Button
        className={styles.addOnsfeatureButton}
        variant={isSelected ? 'contained' : 'outlined'}
        onClick={handleToggle}
        onKeyDown={(e) => handleKeyboardAction(e, handleToggle)}
        aria-pressed={isSelected}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box display="flex" alignItems="center">
            {addOn.icon && (
              <Box
                component="span"
                sx={{
                  mr: 1,
                  display: 'flex',
                  alignItems: 'center',
                  color: isSelected ? 'white' : '#2563eb',
                }}
                aria-hidden="true"
              >
                {renderIcon()}
              </Box>
            )}
            <span>{addOn.name.replace(/[^a-zA-Z0-9 ]/g, '')}</span>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              padding: '4px 8px',
              borderRadius: '4px',
              marginLeft: '8px',
            }}
          >
            {formatPrice(currency, addOnPrice)}
          </Typography>
        </Box>
      </Button>

      {isSelected && (
        <Box
          className={styles.featureDescriptionContainer}
          sx={{
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Box display="flex" alignItems="flex-start">
            <InfoIcon className={styles.infoIcon} aria-hidden="true" />
            <Typography variant="body2" className={styles.featureDescription}>
              {addOn.description}
            </Typography>
          </Box>

          {features.length > 0 && (
            <Box
              sx={{
                ml: 4,
                mt: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Features:
              </Typography>
              <Box
                component="ul"
                sx={{
                  pl: 2,
                  m: 0,
                }}
                role="list"
                aria-label={`Features of ${addOn.name}`}
              >
                {features.map((feature: string, idx: number) => (
                  <Typography
                    key={idx}
                    component="li"
                    variant="body2"
                    sx={{
                      mb: 0.5,
                    }}
                  >
                    {feature}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {dependencies.length > 0 && (
            <Box
              sx={{
                ml: 4,
                mt: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Requirements:
              </Typography>
              <Box
                component="ul"
                sx={{
                  pl: 2,
                  m: 0,
                }}
                role="list"
                aria-label={`Requirements for ${addOn.name}`}
              >
                {dependencies.map((dep: string, idx: number) => (
                  <Typography
                    key={idx}
                    component="li"
                    variant="body2"
                    sx={{
                      mb: 0.5,
                    }}
                  >
                    {dep}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(AddOnToggle);
