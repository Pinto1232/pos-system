'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Button, Paper } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';

export default function TestCSPPage() {
  const [stripeStatus, setStripeStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [keycloakStatus, setKeycloakStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [currencyStatus, setCurrencyStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [cspErrors, setCspErrors] = useState<string[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any>(null);

  useEffect(() => {
    const testStripe = async () => {
      try {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
          throw new Error('Stripe publishable key not found');
        }

        const stripe = await loadStripe(publishableKey);
        if (stripe) {
          setStripeStatus('success');
          console.log('✅ Stripe loaded successfully');
        } else {
          throw new Error('Stripe failed to load');
        }
      } catch (error) {
        setStripeStatus('error');
        console.error('❌ Stripe loading failed:', error);
        setCspErrors((prev) => [...prev, `Stripe: ${error}`]);
      }
    };

    const testKeycloak = async () => {
      try {
        const keycloakUrl =
          process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8282';
        const response = await fetch(
          `${keycloakUrl}/realms/pisval-pos-realm/.well-known/openid-configuration`
        );
        if (response.ok) {
          setKeycloakStatus('success');
          console.log('✅ Keycloak connection successful');
          const config = await response.json();
          console.log('Keycloak config:', config);
        } else {
          throw new Error(`Keycloak responded with status: ${response.status}`);
        }
      } catch (error) {
        setKeycloakStatus('error');
        console.error('❌ Keycloak connection failed:', error);
        setCspErrors((prev) => [...prev, `Keycloak: ${error}`]);
      }
    };

    const testCurrencyAPI = async () => {
      try {
        const apiUrl =
          'https://openexchangerates.org/api/latest.json?app_id=c88ce4a807aa43c3b578f19b66eef7be';
        console.log('Testing currency API:', apiUrl);

        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setCurrencyStatus('success');
          setExchangeRates(data);
          console.log('✅ Currency API connection successful');
          console.log(
            `Retrieved ${Object.keys(data.rates).length} exchange rates`
          );
        } else {
          throw new Error(
            `Currency API responded with status: ${response.status}`
          );
        }
      } catch (error) {
        setCurrencyStatus('error');
        console.error('❌ Currency API connection failed:', error);
        setCspErrors((prev) => [...prev, `Currency API: ${error}`]);
      }
    };

    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      const violation = `CSP Violation: ${event.violatedDirective} - ${event.blockedURI}`;
      console.error('🚫 CSP Violation:', violation);
      setCspErrors((prev) => [...prev, violation]);
    };

    document.addEventListener('securitypolicyviolation', handleCSPViolation);

    testStripe();
    testKeycloak();
    testCurrencyAPI();

    return () => {
      document.removeEventListener(
        'securitypolicyviolation',
        handleCSPViolation
      );
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '✅ Working';
      case 'error':
        return '❌ Failed';
      default:
        return '⏳ Testing...';
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        CSP Configuration Test
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        This page tests whether the Content Security Policy allows Keycloak
        authentication, Stripe payment processing, and external currency API
        calls to work properly.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Stripe.js Loading Test
          </Typography>
          <Alert severity={getStatusColor(stripeStatus)}>
            {getStatusText(stripeStatus)}
            {stripeStatus === 'success' &&
              ' - Stripe.js loaded without CSP violations'}
            {stripeStatus === 'error' && ' - Check console for details'}
          </Alert>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Keycloak Connection Test
          </Typography>
          <Alert severity={getStatusColor(keycloakStatus)}>
            {getStatusText(keycloakStatus)}
            {keycloakStatus === 'success' && ' - Keycloak server accessible'}
            {keycloakStatus === 'error' &&
              ' - Check if Keycloak is running on port 8282'}
          </Alert>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Currency API Test (OpenExchangeRates)
          </Typography>
          <Alert severity={getStatusColor(currencyStatus)}>
            {getStatusText(currencyStatus)}
            {currencyStatus === 'success' &&
              ` - Retrieved ${exchangeRates ? Object.keys(exchangeRates.rates).length : 0} exchange rates`}
            {currencyStatus === 'error' &&
              ' - CSP may be blocking openexchangerates.org'}
          </Alert>
          {exchangeRates && currencyStatus === 'success' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Sample rates (Base: {exchangeRates.base}):
              </Typography>
              <Typography variant="body2">
                EUR: {exchangeRates.rates.EUR?.toFixed(4)} | GBP:{' '}
                {exchangeRates.rates.GBP?.toFixed(4)} | ZAR:{' '}
                {exchangeRates.rates.ZAR?.toFixed(4)} | JPY:{' '}
                {exchangeRates.rates.JPY?.toFixed(2)}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {cspErrors.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="error">
            CSP Violations Detected
          </Typography>
          {cspErrors.map((error, index) => (
            <Alert key={index} severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          ))}
        </Paper>
      )}

      {stripeStatus === 'success' &&
        keycloakStatus === 'success' &&
        currencyStatus === 'success' &&
        cspErrors.length === 0 && (
          <Alert severity="success" sx={{ mb: 3 }}>
            🎉 All tests passed! Stripe, Keycloak, and Currency API are all
            working without CSP violations.
          </Alert>
        )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Rerun Tests
        </Button>
        <Button variant="outlined" onClick={() => (window.location.href = '/')}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}
