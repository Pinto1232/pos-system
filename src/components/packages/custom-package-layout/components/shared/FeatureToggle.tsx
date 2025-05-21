'use client';

import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { FaCheck } from 'react-icons/fa';
import styles from '../../CustomPackageLayout.module.css';
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
      className={`${styles.featureItem} ${isSelected ? styles.selectedFeature : ''}`}
      onClick={handleToggle}
      onKeyDown={(e) => handleKeyboardAction(e, handleToggle)}
      tabIndex={0}
      {...ariaProps}
    >
      <Box>
        <Typography className={styles.featureName}>{feature.name}</Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={isSelected}
                onChange={handleToggle}
                inputProps={{ 'aria-label': `Select ${feature.name}` }}
              />
            }
            label={
              <Box display="flex" alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <span>{feature.name}</span>
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
                    {formatPrice(currency, featurePrice)}
                  </Typography>
                </Box>
                {isSelected && (
                  <Typography
                    variant="body2"
                    className={styles.featureDescription}
                    sx={{
                      marginLeft: 1,
                    }}
                  >
                    <FaCheck aria-hidden="true" />
                  </Typography>
                )}
              </Box>
            }
          />
          {isSelected && showDescription && (
            <Box className={styles.featureDescriptionContainer}>
              <InfoIcon className={styles.infoIcon} aria-hidden="true" />
              <Typography variant="body2" className={styles.featureDescription}>
                {feature.description}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(FeatureToggle);
