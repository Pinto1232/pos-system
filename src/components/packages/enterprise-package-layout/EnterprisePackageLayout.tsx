'use client';

import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import iconMap from '../../../utils/icons';
import SuccessMessage from '../../ui/success-message/SuccessMessage';
import styles from './EnterprisePackageLayout.module.css';
import LazyLoginForm from '@/components/login-form/LoginForm';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import { useSpinner } from '@/contexts/SpinnerContext';

interface EnterprisePackageLayoutProps {
  selectedPackage: {
    id: number;
    title: string;
    description: string;
    icon: string;
    extraDescription: string;
    price: number;
    testPeriodDays: number;
    type: 'starter' | 'growth' | 'enterprise' | 'custom' | 'premium';
    currency?: string;
    multiCurrencyPrices?: string;
  };
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  Kz: 'Kz',
};

const EnterprisePackageLayout: React.FC<EnterprisePackageLayoutProps> = ({
  selectedPackage,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { setTestPeriod } = useTestPeriod();
  const { setLoading: setSpinnerLoading } = useSpinner();
  const [currentCurrency, setCurrentCurrency] = useState<string>(
    selectedPackage.currency || 'USD'
  );

  const IconComponent =
    iconMap[selectedPackage.icon] || iconMap['MUI:DefaultIcon'];

  const handleSelectedEnterprisePackage = async () => {
    setSpinnerLoading(true);
    setLoading(true);
    console.log('Selected package', {
      ...selectedPackage,
      currency: currentCurrency,
    });
    // Simulate backend call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setSpinnerLoading(false);
    setSuccess(true);
  };

  const handleCloseSuccessMessage = () => {
    setSuccess(false);
  };

  const handleConfirmSuccessMessage = (isSignup: boolean) => {
    console.log('Confirmed', isSignup);
    setSuccess(false);
    setShowLoginForm(true);
    setTestPeriod(selectedPackage.testPeriodDays);
  };

  const handleReturnSuccessMessage = () => {
    console.log('Return');
    setSuccess(false);
  };

  const handleCurrencyChange = (currency: string) => {
    setCurrentCurrency(currency);
  };

  // Parse multiCurrencyPrices if provided
  const multiCurrency: Record<string, number> | null =
    selectedPackage.multiCurrencyPrices
      ? JSON.parse(selectedPackage.multiCurrencyPrices)
      : null;

  const displayPrice =
    currentCurrency && multiCurrency
      ? multiCurrency[currentCurrency]
      : selectedPackage.price;
  const currencySymbol =
    currentCurrency === 'Kz' ? 'Kz' : currencySymbols[currentCurrency] || '$';

  if (showLoginForm) {
    return <LazyLoginForm />;
  }

  return (
    <Box className={styles.container}>
      {success && (
        <SuccessMessage
          open={success}
          onClose={handleCloseSuccessMessage}
          onConfirm={handleConfirmSuccessMessage}
          onReturn={handleReturnSuccessMessage}
        />
      )}
      {!loading && !success && (
        <Grid container spacing={3} className={styles.gridContainer}>
          <Grid item xs={12} md={8}>
            <Box className={styles.leftColumn}>
              {selectedPackage.icon && (
                <IconComponent className={styles.packageIcon} />
              )}
              <Typography variant="h6" className={styles.heading}>
                {selectedPackage.title}
              </Typography>

              <Typography variant="body1" className={styles.description}>
                {selectedPackage.description.replace(/[^\w\s.,!?]/g, '')}
              </Typography>

              <Typography variant="body2" className={styles.description}>
                {selectedPackage.extraDescription}
              </Typography>

              <Box className={styles.enterpriseBox}>
                <Typography
                  variant="subtitle2"
                  className={styles.enterpriseBoxLabel}
                >
                  YOUR TOTAL IN ({currentCurrency})
                </Typography>
                <Typography variant="h4" className={styles.enterpriseBoxAmount}>
                  <b>
                    {currentCurrency === 'Kz'
                      ? `${displayPrice}Kz`
                      : `${currencySymbol}${displayPrice}`}
                  </b>
                  /mo
                </Typography>
              </Box>

              {multiCurrency && (
                <Box className={styles.multiCurrencyBox}>
                  <Typography
                    variant="subtitle2"
                    className={styles.multiCurrencyLabel}
                  >
                    Prices in other currencies:
                  </Typography>
                  <FormGroup row>
                    {Object.entries(multiCurrency).map(([currency, price]) => (
                      <FormControlLabel
                        key={currency}
                        control={
                          <Checkbox
                            checked={currentCurrency === currency}
                            onChange={() => handleCurrencyChange(currency)}
                            sx={{
                              color: '#805ad5',
                              '&.Mui-checked': {
                                color: '#805ad5',
                              },
                            }}
                          />
                        }
                        label={
                          <b className={styles.multiCurrencyPrice}>
                            {currency === 'Kz'
                              ? `${price}Kz`
                              : `${currencySymbols[currency] || '$'}${price}`}
                          </b>
                        }
                        className={styles.multiCurrencyItem}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}

              <Typography variant="subtitle2" className={styles.testPeriod}>
                Test Period: <b>{selectedPackage.testPeriodDays} days</b>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box className={styles.rightColumn}>
              <Typography variant="h6" className={styles.heading}>
                Package summary
              </Typography>

              <Typography variant="body2" className={styles.summaryItem}>
                Package Type <b>{selectedPackage.type}</b>
              </Typography>

              <Typography variant="body2" className={styles.summaryItem}>
                Package ID <b>{selectedPackage.id}</b>
              </Typography>

              <Typography variant="body2" className={styles.summaryItem}>
                Monthly Price{' '}
                <b>
                  {currentCurrency === 'Kz'
                    ? `${displayPrice}Kz`
                    : `${currencySymbol}${displayPrice}`}
                </b>
              </Typography>

              <Typography variant="body2" className={styles.summaryItem}>
                Test Period <b>{selectedPackage.testPeriodDays} days</b>
              </Typography>

              <Button
                variant="contained"
                className={styles.continueButton}
                fullWidth
                onClick={handleSelectedEnterprisePackage}
              >
                Continue
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default EnterprisePackageLayout;
