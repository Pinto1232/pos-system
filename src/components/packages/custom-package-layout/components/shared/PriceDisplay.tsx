'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';

interface PriceDisplayProps {
  basePrice: number;
  totalPrice: number;
  totalFeaturePrice?: number;
  supportPrice?: number;
  planDiscount?: number;
  currency: string;
  formatPrice: (currency: string, price: number) => string;
  isCustomizable?: boolean;
  label?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  basePrice,
  totalPrice,
  totalFeaturePrice = 0,
  supportPrice = 0,
  planDiscount = 0,
  currency,
  formatPrice,
  isCustomizable = false,
  label = 'Base Price',
}) => {
  return (
    <Box className={styles.priceDisplay}>
      <Typography variant="h5">
        {label}: {formatPrice(currency, basePrice)}
      </Typography>

      {isCustomizable && (
        <Box className={styles.currentPriceContainer}>
          <Typography variant="h5" className={styles.currentPrice}>
            Current Total: {formatPrice(currency, totalPrice)}
          </Typography>
          <Typography variant="body2" className={styles.priceNote}>
            *Price updates as you select or deselect features
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#2563eb',
              mt: 1,
            }}
          >
            Base: {formatPrice(currency, basePrice)} + Features:{' '}
            {formatPrice(currency, totalFeaturePrice)}
            {supportPrice > 0 &&
              ` + Support: ${formatPrice(currency, supportPrice)}`}
            {planDiscount > 0 &&
              ` - Discount: ${formatPrice(
                currency,
                (basePrice + totalFeaturePrice + supportPrice) * planDiscount
              )}`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(PriceDisplay);
