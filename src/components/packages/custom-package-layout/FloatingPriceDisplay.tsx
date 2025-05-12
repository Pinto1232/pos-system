'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Collapse,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './FloatingPriceDisplay.module.css';

interface FloatingPriceDisplayProps {
  basePrice: number;
  calculatedPrice: number;
  currency: string;
  selectedFeatures: Array<{
    id: number;
    name: string;
    basePrice: number;
  }>;
  selectedAddOns: Array<{
    id: number;
    name: string;
    price: number;
  }>;
  usageQuantities: Record<number, number>;
  usagePricing: Array<{
    id: number;
    name: string;
    pricePerUnit: number;
    unit: string;
  }>;
  currentStep: number;
  steps: string[];
}

const FloatingPriceDisplay: React.FC<
  FloatingPriceDisplayProps
> = ({
  basePrice,
  calculatedPrice,
  currency,
  selectedFeatures,
  selectedAddOns,
  usageQuantities,
  usagePricing,
  currentStep,
  steps,
}) => {
  const [expanded, setExpanded] = useState(true);
  const displayCurrency =
    currency === 'ZAR' ? 'R' : currency;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Calculate feature prices
  const featurePrice = selectedFeatures.reduce(
    (sum, feature) => sum + feature.basePrice,
    0
  );

  // Calculate add-on prices
  const addOnPrice = selectedAddOns.reduce(
    (sum, addOn) => sum + addOn.price,
    0
  );

  // Calculate usage prices
  const usagePrice = usagePricing.reduce(
    (sum, usage) => {
      const quantity =
        usageQuantities[usage.id] || 0;
      return sum + quantity * usage.pricePerUnit;
    },
    0
  );

  // Get current step name
  const currentStepName =
    steps[currentStep] || '';

  return (
    <Paper
      elevation={3}
      className={styles.floatingPrice}
    >
      <Box className={styles.priceHeader}>
        <Typography
          variant="h6"
          className={styles.priceTitle}
        >
          {currentStepName} - Package Price
        </Typography>
        <Box display="flex" alignItems="center">
          <Tooltip title="This is the current price based on your selections. It will update as you customize your package.">
            <InfoIcon
              fontSize="small"
              className={styles.infoIcon}
            />
          </Tooltip>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            className={styles.expandButton}
          >
            {expanded ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box className={styles.priceContent}>
          <Typography
            variant="h4"
            className={styles.totalPrice}
          >
            {displayCurrency}
            {formatPrice(calculatedPrice)}
            <span className={styles.perMonth}>
              /month
            </span>
          </Typography>

          <Box className={styles.priceBreakdown}>
            <Box className={styles.breakdownItem}>
              <Typography variant="body2">
                Base Price:
              </Typography>
              <Typography variant="body2">
                {displayCurrency}
                {formatPrice(basePrice)}
              </Typography>
            </Box>

            {featurePrice > 0 && (
              <Box
                className={styles.breakdownItem}
              >
                <Typography variant="body2">
                  Features (
                  {selectedFeatures.length}):
                </Typography>
                <Typography variant="body2">
                  +{displayCurrency}
                  {formatPrice(featurePrice)}
                </Typography>
              </Box>
            )}

            {addOnPrice > 0 && (
              <Box
                className={styles.breakdownItem}
              >
                <Typography variant="body2">
                  Add-ons ({selectedAddOns.length}
                  ):
                </Typography>
                <Typography variant="body2">
                  +{displayCurrency}
                  {formatPrice(addOnPrice)}
                </Typography>
              </Box>
            )}

            {usagePrice > 0 && (
              <Box
                className={styles.breakdownItem}
              >
                <Typography variant="body2">
                  Usage-based:
                </Typography>
                <Typography variant="body2">
                  +{displayCurrency}
                  {formatPrice(usagePrice)}
                </Typography>
              </Box>
            )}

            <Box
              className={styles.breakdownTotal}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
              >
                Total:
              </Typography>
              <Typography
                variant="body1"
                fontWeight="bold"
              >
                {displayCurrency}
                {formatPrice(calculatedPrice)}
              </Typography>
            </Box>
          </Box>

          {selectedFeatures.length > 0 && (
            <Box
              className={
                styles.selectedItemsSection
              }
            >
              <Typography
                variant="subtitle2"
                className={styles.sectionTitle}
              >
                Selected Features:
              </Typography>
              <Box
                className={
                  styles.selectedItemsList
                }
              >
                {selectedFeatures.map(
                  (feature) => (
                    <Box
                      key={feature.id}
                      className={
                        styles.selectedItem
                      }
                    >
                      <Typography
                        variant="caption"
                        noWrap
                      >
                        {feature.name}
                      </Typography>
                      <Typography variant="caption">
                        +{displayCurrency}
                        {formatPrice(
                          feature.basePrice
                        )}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </Box>
          )}

          {selectedAddOns.length > 0 && (
            <Box
              className={
                styles.selectedItemsSection
              }
            >
              <Typography
                variant="subtitle2"
                className={styles.sectionTitle}
              >
                Selected Add-ons:
              </Typography>
              <Box
                className={
                  styles.selectedItemsList
                }
              >
                {selectedAddOns.map((addon) => (
                  <Box
                    key={addon.id}
                    className={
                      styles.selectedItem
                    }
                  >
                    <Typography
                      variant="caption"
                      noWrap
                    >
                      {addon.name}
                    </Typography>
                    <Typography variant="caption">
                      +{displayCurrency}
                      {formatPrice(addon.price)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FloatingPriceDisplay;
