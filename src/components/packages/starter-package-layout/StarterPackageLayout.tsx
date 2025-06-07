'use client';
import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Snackbar,
  Alert,
} from '@mui/material';
import iconMap from '../../../utils/icons';
import LazyLoginForm from '../../login-form/LoginForm';
import styles from './StarterPackageLayout.module.css';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSpinner } from '@/contexts/SpinnerContext';
import { useSuccessModal } from '@/contexts/SuccessModalContext';
import { TranslatedText } from '@/i18n';

interface StarterPackageLayoutProps {
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


const mapPackageType = (
  type: string
):
  | 'starter-plus'
  | 'growth-pro'
  | 'enterprise-elite'
  | 'custom-pro'
  | 'premium-plus' => {
  switch (type) {
    case 'starter':
      return 'starter-plus';
    case 'growth':
      return 'growth-pro';
    case 'enterprise':
      return 'enterprise-elite';
    case 'custom':
      return 'custom-pro';
    case 'premium':
      return 'premium-plus';
    default:
      return 'starter-plus';
  }
};

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  Kz: 'Kz',
};

const StarterPackageLayout: React.FC<StarterPackageLayoutProps> = ({
  selectedPackage,
}) => {
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const {
    currency: currentCurrency,
    setCurrency: setCurrentCurrency,
    currencySymbol,
    formatPrice,
    rate,
  } = useCurrency();
  const { setTestPeriod } = useTestPeriod();
  const { setLoading: setSpinnerLoading } = useSpinner();
  const { showSuccessModal } = useSuccessModal();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const IconComponent =
    iconMap[selectedPackage.icon] || iconMap['MUI:DefaultIcon'];

  const handleSelectedStarterPackage = async () => {
    setSpinnerLoading(true);
    setLoading(true);
    console.log('Selected package', {
      ...selectedPackage,
      currency: currentCurrency,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSpinnerLoading(false);
    setLoading(false);

    showSuccessModal({
      message: 'Package selected successfully!',
      onConfirm: handleConfirmSuccessMessage,
      onReturn: handleReturnSuccessMessage,
      selectedPackage: {
        id: selectedPackage.id,
        title: selectedPackage.title,
        type: mapPackageType(selectedPackage.type),
        price: selectedPackage.price,
        currency: selectedPackage.currency,
      },
      currentCurrency: currentCurrency,
      formData: formData,
      calculatedPrice: displayPrice,
      onAddToCart: handleAddToCart,
    });
  };

  const handleConfirmSuccessMessage = (isSignup: boolean) => {
    console.log('Confirmed', JSON.stringify(isSignup, null, 2));

    if (isSignup) {
      setShowLoginForm(true);
    }

    setTestPeriod(selectedPackage.testPeriodDays);
  };

  const handleReturnSuccessMessage = () => {
    console.log('Return');
  };

  const handleCurrencyChange = (currency: string) => {
    setCurrentCurrency(currency);
  };

  const handleAddToCart = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const multiCurrency: Record<string, number> | null =
    selectedPackage.multiCurrencyPrices
      ? JSON.parse(selectedPackage.multiCurrencyPrices)
      : null;
  let displayPrice = selectedPackage.price;

  if (currentCurrency && multiCurrency && multiCurrency[currentCurrency]) {
    displayPrice = multiCurrency[currentCurrency];
  } else {
    displayPrice = selectedPackage.price * rate;
  }

  console.log(
    `StarterPackage modal price: ${displayPrice} ${currentCurrency}, rate: ${rate}`
  );

  const [formData] = useState<Record<string, string>>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St',
    country: 'USA',
    state: 'California',
    city: 'San Francisco',
    postal: '94105',
  });

  if (showLoginForm) {
    return <LazyLoginForm />;
  }

  return (
    <Box className={styles.container}>
      {!loading && (
        <Grid container spacing={2} className={styles.gridContainer}>
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
              <Box className={styles.premiumBox}>
                <Typography
                  variant="subtitle2"
                  className={styles.premiumBoxLabel}
                >
                  YOUR TOTAL In ({currentCurrency})
                </Typography>
                <Typography variant="h4" className={styles.premiumBoxAmount}>
                  <b>
                    {currentCurrency === 'Kz'
                      ? `${displayPrice}Kz`
                      : `${currencySymbol}${formatPrice(displayPrice)}`}
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
                          />
                        }
                        label={
                          <b className={styles.multiCurrencyPrice}>
                            {currency === 'Kz'
                              ? `${price}Kz`
                              : `${currencySymbols[currency] || '$'}${formatPrice(price)}`}
                          </b>
                        }
                        className={styles.multiCurrencyItem}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}
              <Typography variant="subtitle2" className={styles.testPeriod}>
                <TranslatedText
                  i18nKey="packages.testPeriod"
                  defaultValue="Test Period:"
                />{' '}
                <b>{selectedPackage.testPeriodDays} days</b>
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
                    : `${currencySymbol}${formatPrice(displayPrice)}`}
                </b>
              </Typography>

              <Typography variant="body2" className={styles.summaryItem}>
                <TranslatedText
                  i18nKey="packages.testPeriod"
                  defaultValue="Test Period:"
                />{' '}
                <b>{selectedPackage.testPeriodDays} days</b>
              </Typography>

              <Button
                variant="contained"
                className={styles.continueButton}
                fullWidth
                onClick={handleSelectedStarterPackage}
              >
                Continue
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StarterPackageLayout;
