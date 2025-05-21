'use client';

import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import styles from '../../CustomPackageLayout.module.css';
import { UsagePricing } from '../../types';
import { getFormFieldAriaProps } from '../../utils/accessibilityUtils';

interface UsageInputProps {
  usage: UsagePricing;
  currentValue: number;
  onUpdate: (id: number, value: string) => void;
  currency: string;
  formatPrice: (currency: string, price: number) => string;
}

const UsageInput: React.FC<UsageInputProps> = ({
  usage,
  currentValue,
  onUpdate,
  currency,
  formatPrice,
}) => {
  const usagePrice = usage.multiCurrencyPrices
    ? usage.multiCurrencyPrices[currency]
    : usage.pricePerUnit;

  const usageError =
    currentValue < usage.minValue || currentValue > usage.maxValue
      ? `Value must be between ${usage.minValue} and ${usage.maxValue}`
      : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(usage.id, e.target.value);
  };

  const fieldId = `usage-input-${usage.id}`;
  const errorId = `usage-input-error-${usage.id}`;

  const ariaProps = getFormFieldAriaProps(
    fieldId,
    `${usage.name} quantity`,
    true,
    !!usageError,
    usageError
  );

  return (
    <Box className={styles.usageItem}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="subtitle1">{usage.name}</Typography>
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
          {formatPrice(currency, usagePrice)}/{usage.unit}
        </Typography>
      </Box>
      <TextField
        id={fieldId}
        type="number"
        value={currentValue}
        onChange={handleChange}
        error={!!usageError}
        helperText={usageError}
        aria-invalid={!!usageError}
        aria-describedby={usageError ? errorId : undefined}
        inputProps={{
          min: usage.minValue,
          max: usage.maxValue,
          ...ariaProps,
        }}
        sx={{
          '& input': {
            textAlign: 'center',
            '&::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          },
        }}
        fullWidth
        className={styles.textField}
      />
      {usageError && (
        <div id={errorId} className="sr-only">
          {usageError}
        </div>
      )}
    </Box>
  );
};

export default React.memo(UsageInput);
