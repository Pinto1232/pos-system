'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { motion } from 'framer-motion';
import InfoIcon from '@mui/icons-material/Info';
import styles from './CustomPackageLayout.module.css';
import { Feature, AddOn, CustomPackageLayoutProps } from './types';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import { FaCheck } from 'react-icons/fa';
import Link from 'next/link';

const countries = ['USA', 'Canada', 'UK', 'Australia'];
const states = ['California', 'Texas', 'New York', 'Florida'];

const CustomPackageLayout: React.FC<CustomPackageLayoutProps> = ({
  isCustomizable,
  currentStep,
  steps = [],
  features = [],
  addOns = [],
  usagePricing = [],
  selectedFeatures,
  selectedAddOns,
  usageQuantities,
  basePrice,
  calculatedPrice,
  packageDetails,
  selectedPackage,
  onNext,
  onBack,
  onSave,
  onFeatureToggle,
  onAddOnToggle,
  onUsageChange,
  enterpriseFeatures,
  onEnterpriseFeatureToggle,
}) => {
  const [loading, setLoading] = useState(false);
  const [backLoading, setBackLoading] = useState(false);
  const [selectedCurrency] = useState<string>('USD');
  const { setTestPeriod } = useTestPeriod();
  const [totalFeaturePrice, setTotalFeaturePrice] = useState<number>(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
  });

  useEffect(() => {
    const total = selectedFeatures.reduce((sum, feature) => {
      const featurePrice = feature.multiCurrencyPrices
        ? feature.multiCurrencyPrices[selectedCurrency]
        : feature.basePrice;
      return sum + featurePrice;
    }, 0);
    setTotalFeaturePrice(total);
  }, [selectedFeatures, selectedCurrency]);

  const handleNext = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      onNext();
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    setBackLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      onBack();
    } finally {
      setBackLoading(false);
    }
  };

  const handleFeatureToggle = (feature: Feature) => {
    const newFeatures = selectedFeatures.some((f) => f.id === feature.id)
      ? selectedFeatures.filter((f) => f.id !== feature.id)
      : [...selectedFeatures, feature];
    onFeatureToggle(newFeatures);
  };

  const handleAddOnToggle = (addOn: AddOn) => {
    const newAddOns = selectedAddOns.some((a) => a.id === addOn.id)
      ? selectedAddOns.filter((a) => a.id !== addOn.id)
      : [...selectedAddOns, addOn];
    onAddOnToggle(newAddOns);
  };

  const handleUsageUpdate = (id: number, value: string) => {
    onUsageChange({
      ...usageQuantities,
      [id]: Math.max(0, parseInt(value) || 0),
    });
  };

  const handleTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`TextField change: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    console.log(`Select change: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const fullData = {
      selectedFeatures,
      selectedAddOns,
      usageQuantities,
      calculatedPrice,
      selectedCurrency,
      formData,
    };
    console.log('Package data saved:', fullData);
    setTestPeriod(selectedPackage.testPeriodDays);
    onSave(fullData);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'Kz':
        return 'Kz';
      default:
        return currency;
    }
  };

  const formatPrice = (currency: string, price: number) => {
    const roundedPrice = Math.round(price);
    return currency === 'Kz'
      ? `${roundedPrice}${currency}`
      : `${getCurrencySymbol(currency)} ${roundedPrice}`;
  };

  const getStepContent = () => {
    const currentLabel = steps[currentStep]?.trim() || '';

    if (!currentLabel) {
      return (
        <Typography variant="body1">Loading step configuration...</Typography>
      );
    }

    switch (currentLabel) {
      case 'Package Details':
        let multiCurrencyPrices: Record<string, number> = {};
        try {
          if (selectedPackage?.multiCurrencyPrices) {
            multiCurrencyPrices = JSON.parse(
              selectedPackage.multiCurrencyPrices
            );
          } else {
            multiCurrencyPrices = { [selectedCurrency]: basePrice };
          }
        } catch (error) {
          console.error('Error parsing multiCurrencyPrices:', error);
          multiCurrencyPrices = { [selectedCurrency]: basePrice };
        }

        const displayPrice = multiCurrencyPrices[selectedCurrency] || basePrice;
        const formattedDescription = packageDetails.description
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/business needs/g, 'business needs.');
        return (
          <Box className={styles.packageDetails}>
            <Box className={styles.detailItem}>
              <Typography variant="h5">Package Title</Typography>
              <Typography variant="body2">{packageDetails.title}</Typography>
            </Box>
            <Box className={styles.detailItem}>
              <Typography variant="h5">Description</Typography>
              <Typography variant="body2">{formattedDescription}</Typography>
            </Box>
            <Box className={styles.detailItem}>
              <Typography variant="h5">Base Price</Typography>
              <Typography variant="body2">
                {isCustomizable ? (
                  <>
                    Base Price:{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {formatPrice(selectedCurrency, displayPrice)}
                    </span>
                    /pm
                  </>
                ) : (
                  <>
                    Price:{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {formatPrice(selectedCurrency, displayPrice)}
                    </span>
                    /pm
                  </>
                )}
              </Typography>
            </Box>
            <Box className={styles.detailItem}>
              <Typography variant="h5">Test Period</Typography>
              <Typography variant="body2">
                {packageDetails.testPeriod} days
              </Typography>
            </Box>
            {renderPackageDetailsButtons()}
          </Box>
        );
      case 'Select Core Features':
        return (
          <Box
            className={styles.container}
            sx={{
              maxHeight: '600px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <Box>
              <Typography variant="h6" className={styles.sectionHeader}>
                Select Core Features
              </Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Select the modules and features that best meet your needs.
              </Typography>
              <Box className={styles.featuresContainer}>
                {features.length > 0 ? (
                  features.map((feature) => {
                    const isSelected = selectedFeatures.some(
                      (f) => f.id === feature.id
                    );
                    const featurePrice = feature.multiCurrencyPrices
                      ? feature.multiCurrencyPrices[selectedCurrency]
                      : feature.basePrice;
                    return (
                      <Box
                        key={feature.id}
                        className={`${styles.featureItem} ${
                          isSelected ? styles.selectedFeature : ''
                        }`}
                      >
                        <Box>
                          <Typography className={styles.featureName}>
                            Create Custom Plan
                          </Typography>
                          <Typography
                            variant="body2"
                            className={styles.featureDescription}
                          >
                            Select the modules and features.
                          </Typography>
                          <Box>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => handleFeatureToggle(feature)}
                                />
                              }
                              label={
                                <Box display="flex" alignItems="center">
                                  {`${feature.name} (${formatPrice(
                                    selectedCurrency,
                                    featurePrice
                                  )})`}
                                  {isSelected && (
                                    <Typography
                                      variant="body2"
                                      className={styles.featureDescription}
                                      sx={{ marginLeft: 1 }}
                                    >
                                      <FaCheck />
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                            {isSelected && (
                              <Box
                                className={styles.featureDescriptionContainer}
                              >
                                <InfoIcon className={styles.infoIcon} />
                                <Typography
                                  variant="body2"
                                  className={styles.featureDescription}
                                >
                                  {feature.description}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ width: '379px', mt: 1 }}>
                            <Divider />
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Box className={styles.emptyState}>
                    <Typography variant="h5">No features available</Typography>
                    <Button variant="outlined">Continue</Button>
                  </Box>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="h6" className={styles.title}>
                Purchase Summary
              </Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Brief summary of your purchase.
              </Typography>
              <Box className={styles.purchaseSummaryContainer}>
                {selectedFeatures.length > 0 ? (
                  selectedFeatures.map((feature, index) => {
                    const featurePrice = feature.multiCurrencyPrices
                      ? feature.multiCurrencyPrices[selectedCurrency]
                      : feature.basePrice;
                    return (
                      <Box
                        key={feature.id}
                        className={styles.billingItem}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? '#3b82f65e' : '#ffffff',
                        }}
                      >
                        <Typography className={styles.itemLabel}>
                          {feature.name}
                        </Typography>
                        <Typography className={styles.itemPrice}>
                          {formatPrice(selectedCurrency, featurePrice)}
                        </Typography>
                      </Box>
                    );
                  })
                ) : (
                  <Box
                    className={styles.billingItem}
                    sx={{ backgroundColor: '#3b82f65e' }}
                  >
                    <Typography className={styles.itemLabel}>
                      Billing Module
                    </Typography>
                    <Typography className={styles.itemPrice}>$0.00</Typography>
                  </Box>
                )}
                <Box className={styles.userAgreement}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="User Agreement"
                  />
                  <Typography
                    variant="body2"
                    className={styles.userAgreementText}
                  >
                    Before proceeding to payment, please read and sign, agreeing
                    to the{' '}
                    <Link
                      href="/path/to/user-agreement"
                      className={styles.userAgreementLink}
                    >
                      User agreement
                    </Link>
                  </Typography>
                </Box>
                <Box className={styles.totalContainer}>
                  <Typography variant="subtitle1" className={styles.totalLabel}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" className={styles.totalPrice}>
                    {formatPrice(selectedCurrency, totalFeaturePrice)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      case 'Choose Add-Ons':
        return (
          <Box className={styles.featuresContainer}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Choose Add-Ons</Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Select additional features to enhance your package. Each add-on
                comes with its own pricing.
              </Typography>
            </Box>
            {addOns.length > 0 ? (
              addOns.map((addOn) => {
                const isSelected = selectedAddOns.some(
                  (a) => a.id === addOn.id
                );
                const addOnPrice = addOn.multiCurrencyPrices
                  ? addOn.multiCurrencyPrices[selectedCurrency]
                  : addOn.price;
                return (
                  <Box
                    key={addOn.id}
                    className={`${styles.featureItem} ${isSelected ? styles.selectedFeature : ''}`}
                  >
                    <Button
                      className={styles.addOnsfeatureButton}
                      variant={isSelected ? 'contained' : 'outlined'}
                      onClick={() => handleAddOnToggle(addOn)}
                    >
                      {addOn.name.replace(/[^a-zA-Z0-9 ]/g, '')} (
                      {formatPrice(selectedCurrency, addOnPrice)})
                    </Button>
                    {isSelected && (
                      <Box className={styles.featureDescriptionContainer}>
                        <InfoIcon className={styles.infoIcon} />
                        <Typography
                          variant="body2"
                          className={styles.featureDescription}
                        >
                          {addOn.description}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })
            ) : (
              <Box className={styles.emptyState}>
                <Typography variant="h6">No add-ons available</Typography>
                <Button variant="outlined" onClick={onNext}>
                  Continue
                </Button>
              </Box>
            )}
          </Box>
        );
      case 'Configure Usage':
        return (
          <Box className={styles.featuresContainer}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Configure Usage</Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Adjust the usage metrics to fit your business needs. Ensure the
                values are within the allowed range.
              </Typography>
            </Box>
            {usagePricing.length > 0 ? (
              usagePricing.map((usage) => {
                const currentValue =
                  usageQuantities[usage.id] ?? usage.defaultValue;
                const usagePrice = usage.multiCurrencyPrices
                  ? usage.multiCurrencyPrices[selectedCurrency]
                  : usage.pricePerUnit;
                const usageError =
                  currentValue < usage.minValue || currentValue > usage.maxValue
                    ? `Value must be between ${usage.minValue} and ${usage.maxValue}`
                    : '';
                return (
                  <Box key={usage.id} className={styles.usageItem}>
                    <Typography variant="subtitle1" gutterBottom>
                      {usage.name} ({formatPrice(selectedCurrency, usagePrice)}/
                      {usage.unit})
                    </Typography>
                    <TextField
                      type="number"
                      value={currentValue}
                      onChange={(e) =>
                        handleUsageUpdate(usage.id, e.target.value)
                      }
                      error={!!usageError}
                      helperText={usageError}
                      InputProps={{
                        inputProps: {
                          min: usage.minValue,
                          max: usage.maxValue,
                        },
                      }}
                      fullWidth
                      className={styles.textField}
                    />
                  </Box>
                );
              })
            ) : (
              <Box className={styles.emptyState}>
                <Typography variant="h6">
                  No usage metrics to configure
                </Typography>
                <Button variant="outlined" onClick={onNext}>
                  Continue
                </Button>
              </Box>
            )}
          </Box>
        );
      case 'Select Payment Plan':
        return (
          <Box sx={{ width: '100%', p: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#173a79',
                  mb: 1,
                }}
              >
                Select Payment Plan
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: '0.875rem', color: '#64748b' }}
              >
                Choose your preferred payment plan
              </Typography>
            </Box>
            <Box
              className={styles.paymentPlansContainer}
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}
            >
              {[
                {
                  title: 'Monthly Plan',
                  description: 'Pay monthly for maximum flexibility',
                  price:
                    formatPrice(selectedCurrency, calculatedPrice) + '/month',
                  features: [
                    'Monthly Billing',
                    'No Commitment',
                    'Easy Upgrade',
                  ],
                  buttonText: 'Select Monthly Plan',
                },
                {
                  title: 'Biannual Plan',
                  description: 'Save 15% with biannual billing',
                  price:
                    formatPrice(selectedCurrency, calculatedPrice * 6 * 0.85) +
                    '/6 months',
                  features: [
                    '15% Discount',
                    'Flexible Billing',
                    'Mid-term Adjustments',
                  ],
                  buttonText: 'Select Biannual Plan',
                },
                {
                  title: 'Annual Plan',
                  description: 'Save 20% with annual billing',
                  price:
                    formatPrice(selectedCurrency, calculatedPrice * 12 * 0.8) +
                    '/year',
                  features: ['20% Discount', 'Priority Support', 'Free Setup'],
                  buttonText: 'Select Annual Plan',
                },
                {
                  title: 'Enterprise Plan',
                  description: 'Custom solutions for large businesses',
                  price: 'Custom Pricing',
                  features: [
                    'Dedicated Support',
                    'Custom Features',
                    'SLA Guarantee',
                  ],
                  buttonText: 'Contact Sales',
                },
              ].map((plan, index) => (
                <Box key={index} className={styles.paymentPlanItem}>
                  <Typography variant="h6">{plan.title}</Typography>
                  <Typography className={styles.paymentDescription}>
                    {plan.description}
                  </Typography>
                  <Typography className={styles.paymentPrice}>
                    {plan.price}
                  </Typography>
                  <Box className={styles.paymentFeatures}>
                    {plan.features.map((feature, idx) => (
                      <Typography key={idx}>✓ {feature}</Typography>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    className={styles.selectPlanButton}
                    onClick={() => {
                      handleNext();
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </Box>
              ))}
            </Box>
            <Box className={styles.packageDetailsControls}>
              <Button
                className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonBack}`}
                variant="outlined"
                onClick={handleBack}
                disabled={currentStep === 0 || backLoading}
              >
                {backLoading ? <CircularProgress size={20} /> : 'Back'}
              </Button>
              <Button
                className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonContinue}`}
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Continue'}
              </Button>
            </Box>
          </Box>
        );
      case 'Choose Support Level':
        return (
          <Box className={styles.featuresContainer}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Choose Support Level</Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Select the support package that matches your business needs.
              </Typography>
            </Box>
            <Box className={styles.supportPlansContainer}>
              <Box className={styles.supportPlanItem}>
                <Typography variant="h6">Standard Support</Typography>
                <Typography
                  variant="body2"
                  className={styles.supportDescription}
                >
                  Email support with 24-hour response time
                </Typography>
                <Box className={styles.supportFeatures}>
                  <Typography variant="body2">✓ Email Support</Typography>
                  <Typography variant="body2">
                    ✓ Knowledge Base Access
                  </Typography>
                  <Typography variant="body2">✓ Community Forum</Typography>
                </Box>
                <Typography variant="h5" className={styles.supportPrice}>
                  Included
                </Typography>
                <Button
                  variant="contained"
                  className={styles.selectPlanButton}
                  onClick={onNext}
                >
                  Select Standard Support
                </Button>
              </Box>
              <Box className={`${styles.supportPlanItem} ${styles.premium}`}>
                <Typography variant="h6">Premium Support</Typography>
                <Typography
                  variant="body2"
                  className={styles.supportDescription}
                >
                  Priority support with 4-hour response time
                </Typography>
                <Box className={styles.supportFeatures}>
                  <Typography variant="body2">
                    ✓ 24/7 Priority Support
                  </Typography>
                  <Typography variant="body2">
                    ✓ Dedicated Account Manager
                  </Typography>
                  <Typography variant="body2">✓ Phone Support</Typography>
                  <Typography variant="body2">
                    ✓ Custom Training Sessions
                  </Typography>
                </Box>
                <Typography variant="h5" className={styles.supportPrice}>
                  +{formatPrice(selectedCurrency, calculatedPrice * 0.2)}/month
                </Typography>
                <Button
                  variant="contained"
                  className={styles.selectPlanButton}
                  onClick={onNext}
                >
                  Select Premium Support
                </Button>
              </Box>
              <Box className={`${styles.supportPlanItem} ${styles.advanced}`}>
                <Typography variant="h6">Advanced Support</Typography>
                <Typography
                  variant="body2"
                  className={styles.supportDescription}
                >
                  Enterprise-grade support with dedicated team
                </Typography>
                <Box className={styles.supportFeatures}>
                  <Typography variant="body2">
                    ✓ 24/7 Dedicated Support Team
                  </Typography>
                  <Typography variant="body2">✓ SLA Guarantee</Typography>
                  <Typography variant="body2">✓ On-site Support</Typography>
                  <Typography variant="body2">✓ Custom Development</Typography>
                  <Typography variant="body2">
                    ✓ Priority Feature Requests
                  </Typography>
                </Box>
                <Typography variant="h5" className={styles.supportPrice}>
                  +{formatPrice(selectedCurrency, calculatedPrice * 0.4)}/month
                </Typography>
                <Button
                  variant="contained"
                  className={styles.selectPlanButton}
                  onClick={onNext}
                >
                  Select Advanced Support
                </Button>
              </Box>
            </Box>
            {renderPackageDetailsButtons()}
          </Box>
        );
      case 'Configure Enterprise Features':
        return (
          <Box className={styles.featuresContainer}>
            <Box className={styles.sectionHeader}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: '#173a79' }}
              >
                Configure Enterprise Features
              </Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Customize your enterprise package with advanced features
                tailored for large businesses.
              </Typography>
            </Box>
            <Box className={styles.enterpriseFeaturesContainer}>
              <Box className={styles.enterpriseFeatureItem}>
                <Box className={styles.featureHeader}>
                  <Typography variant="h6">Advanced Analytics</Typography>
                  <Typography
                    variant="body2"
                    className={styles.featureDescription}
                  >
                    Comprehensive reporting and analytics tools
                  </Typography>
                </Box>
                <Box className={styles.featureOptions}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.realTimeAnalytics || false}
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('realTimeAnalytics')
                        }
                      />
                    }
                    label="Real-time Analytics"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.customReports || false}
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('customReports')
                        }
                      />
                    }
                    label="Custom Reports"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.dataExport || false}
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('dataExport')
                        }
                      />
                    }
                    label="Data Export"
                  />
                </Box>
              </Box>

              <Box className={styles.enterpriseFeatureItem}>
                <Box className={styles.featureHeader}>
                  <Typography variant="h6">Multi-Location</Typography>
                  <Typography
                    variant="body2"
                    className={styles.featureDescription}
                  >
                    Manage multiple business locations efficiently
                  </Typography>
                </Box>
                <Box className={styles.featureOptions}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={
                          enterpriseFeatures?.centralizedManagement || false
                        }
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('centralizedManagement')
                        }
                      />
                    }
                    label="Centralized Management"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.locationSettings || false}
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('locationSettings')
                        }
                      />
                    }
                    label="Location Settings"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={
                          enterpriseFeatures?.crossLocationInventory || false
                        }
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('crossLocationInventory')
                        }
                      />
                    }
                    label="Cross-location Inventory"
                  />
                </Box>
              </Box>

              <Box className={styles.enterpriseFeatureItem}>
                <Box className={styles.featureHeader}>
                  <Typography variant="h6">Security Suite</Typography>
                  <Typography
                    variant="body2"
                    className={styles.featureDescription}
                  >
                    Advanced security features for enterprise protection
                  </Typography>
                </Box>
                <Box className={styles.featureOptions}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.roleBasedAccess || false}
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('roleBasedAccess')
                        }
                      />
                    }
                    label="Role-based Access"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={
                          enterpriseFeatures?.advancedEncryption || false
                        }
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('advancedEncryption')
                        }
                      />
                    }
                    label="Advanced Encryption"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.auditLogging || false}
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('auditLogging')
                        }
                      />
                    }
                    label="Audit Logging"
                  />
                </Box>
              </Box>

              <Box className={styles.enterpriseFeatureItem}>
                <Box className={styles.featureHeader}>
                  <Typography variant="h6">API & Integration</Typography>
                  <Typography
                    variant="body2"
                    className={styles.featureDescription}
                  >
                    Connect with other business applications
                  </Typography>
                </Box>
                <Box className={styles.featureOptions}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.restfulApi || false}
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('restfulApi')
                        }
                      />
                    }
                    label="RESTful API"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={
                          enterpriseFeatures?.webhookNotifications || false
                        }
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('webhookNotifications')
                        }
                      />
                    }
                    label="Webhook Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.customIntegration || false}
                        onChange={() =>
                          onEnterpriseFeatureToggle?.('customIntegration')
                        }
                      />
                    }
                    label="Custom Integration"
                  />
                </Box>
              </Box>
            </Box>
            {renderPackageDetailsButtons()}
          </Box>
        );
      case 'Review & Confirm':
        return (
          <Box className={styles.reviewContainer}>
            <Box className={styles.reviewColumn}>
              <Box className={styles.reviewSection}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Enter Your Detail
                </Typography>
                <Box className={styles.reviewForm}>
                  <Box className={styles.formRow}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      fullWidth
                      required
                      value={formData.firstName}
                      onChange={handleTextFieldChange}
                    />
                    <TextField
                      label="Last Name"
                      name="lastName"
                      fullWidth
                      required
                      value={formData.lastName}
                      onChange={handleTextFieldChange}
                    />
                  </Box>
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    label="Phone Number"
                    name="phone"
                    fullWidth
                    required
                    value={formData.phone}
                    onChange={handleTextFieldChange}
                  />
                  <TextField
                    label="Address"
                    name="address"
                    fullWidth
                    required
                    value={formData.address}
                    onChange={handleTextFieldChange}
                  />
                  <Box className={styles.formRow}>
                    <FormControl fullWidth required>
                      <InputLabel>Country</InputLabel>
                      <Select
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleSelectChange}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country} value={country}>
                            {country}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>State / Province / Region</InputLabel>
                      <Select
                        label="State / Province / Region"
                        name="state"
                        value={formData.state}
                        onChange={handleSelectChange}
                      >
                        {states.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box className={styles.formRow}>
                    <TextField
                      label="City"
                      name="city"
                      fullWidth
                      required
                      value={formData.city}
                      onChange={handleTextFieldChange}
                    />
                    <TextField
                      label="Postal / Zip Code"
                      name="zipCode"
                      fullWidth
                      value={formData.zipCode}
                      onChange={handleTextFieldChange}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className={styles.reviewColumn}>
              <Box className={styles.orderSummary}>
                <Box className={styles.orderSummaryHeader}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Order Summary
                  </Typography>
                </Box>

                <Box className={styles.orderSummaryContent}>
                  {/* Package Details */}
                  <Box className={styles.section}>
                    <Typography className={styles.sectionTitle}>
                      Selected Package
                    </Typography>
                    <Box className={styles.sectionContent}>
                      <Box className={styles.itemRow}>
                        <Typography className={styles.itemLabel}>
                          Enterprise Package
                          <span className={styles.discountTag}>
                            Most Popular
                          </span>
                        </Typography>
                        <Typography className={styles.itemValue}>
                          {formatPrice(selectedCurrency, basePrice)}/mo
                        </Typography>
                      </Box>
                      <Typography className={styles.itemDescription}>
                        Basic features and standard support included
                      </Typography>
                    </Box>
                  </Box>

                  {/* Payment Plan */}
                  <Box className={styles.section}>
                    <Typography className={styles.sectionTitle}>
                      Payment Plan
                    </Typography>
                    <Box className={styles.sectionContent}>
                      <Box className={styles.itemRow}>
                        <Typography className={styles.itemLabel}>
                          Annual Plan
                          <span className={styles.discountTag}>20% Off</span>
                        </Typography>
                        <Typography
                          className={styles.itemValue}
                          sx={{ color: '#059669' }}
                        >
                          -{formatPrice(selectedCurrency, basePrice * 0.2)}/mo
                        </Typography>
                      </Box>
                      <Typography className={styles.itemDescription}>
                        Billed annually at{' '}
                        {formatPrice(selectedCurrency, basePrice * 12 * 0.8)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Support Level */}
                  <Box className={styles.section}>
                    <Typography className={styles.sectionTitle}>
                      Support Level
                    </Typography>
                    <Box className={styles.sectionContent}>
                      <Box className={styles.itemRow}>
                        <Typography className={styles.itemLabel}>
                          Premium Support
                          <span className={styles.discountTag}>24/7</span>
                        </Typography>
                        <Typography className={styles.itemValue}>
                          +{formatPrice(selectedCurrency, basePrice * 0.2)}/mo
                        </Typography>
                      </Box>
                      <Typography className={styles.itemDescription}>
                        Priority support with 4-hour response time
                      </Typography>
                    </Box>
                  </Box>

                  {/* Enterprise Features */}
                  <Box className={styles.section}>
                    <Typography className={styles.sectionTitle}>
                      Enterprise Features
                    </Typography>
                    <Box className={styles.sectionContent}>
                      <Box className={styles.itemRow}>
                        <Typography className={styles.itemLabel}>
                          Advanced Analytics
                        </Typography>
                        <Typography className={styles.itemValue}>
                          +{formatPrice(selectedCurrency, 199)}/mo
                        </Typography>
                      </Box>
                      <Box className={styles.itemRow}>
                        <Typography className={styles.itemLabel}>
                          Multi-Location
                        </Typography>
                        <Typography className={styles.itemValue}>
                          +{formatPrice(selectedCurrency, 299)}/mo
                        </Typography>
                      </Box>
                      <Box className={styles.itemRow}>
                        <Typography className={styles.itemLabel}>
                          Security Suite
                        </Typography>
                        <Typography className={styles.itemValue}>
                          +{formatPrice(selectedCurrency, 249)}/mo
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Price Breakdown */}
                  <Box className={styles.section}>
                    <Typography className={styles.sectionTitle}>
                      Price Breakdown
                    </Typography>
                    <Box className={styles.sectionContent}>
                      <Box className={styles.itemRow}>
                        <Typography className={styles.itemLabel}>
                          Subtotal
                        </Typography>
                        <Typography className={styles.itemValue}>
                          {formatPrice(selectedCurrency, basePrice + 747)}/mo
                        </Typography>
                      </Box>
                      <Box className={styles.divider} />
                      <Box className={styles.itemRow}>
                        <Typography className={styles.itemLabel}>
                          Annual Discount
                          <span className={styles.discountTag}>20%</span>
                        </Typography>
                        <Typography
                          className={styles.itemValue}
                          sx={{ color: '#059669' }}
                        >
                          -
                          {formatPrice(
                            selectedCurrency,
                            (basePrice + 747) * 0.2
                          )}
                          /mo
                        </Typography>
                      </Box>
                      <Box className={styles.itemRow}>
                        <Typography className={styles.itemLabel}>
                          Enterprise Discount
                          <span className={styles.discountTag}>10%</span>
                        </Typography>
                        <Typography
                          className={styles.itemValue}
                          sx={{ color: '#059669' }}
                        >
                          -
                          {formatPrice(
                            selectedCurrency,
                            (basePrice + 747) * 0.1
                          )}
                          /mo
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Footer with Total and Buttons */}
                <Box className={styles.orderSummaryFooter}>
                  <Box className={styles.totalContainer}>
                    <Box className={styles.totalLabel}>
                      <Typography className={styles.totalAmount}>
                        {formatPrice(selectedCurrency, (basePrice + 747) * 0.7)}
                        /mo
                      </Typography>
                      <Typography className={styles.billingNote}>
                        Billed annually • Includes all discounts
                      </Typography>
                    </Box>
                  </Box>

                  <Box className={styles.packageDetailsControls}>
                    <Button
                      className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonBack}`}
                      variant="outlined"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonContinue}`}
                      variant="contained"
                      onClick={handleSave}
                    >
                      Confirm
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      default:
        return (
          <Typography variant="body1">
            Unknown step configuration. Please contact support.
          </Typography>
        );
    }
  };

  const renderPackageDetailsButtons = () => (
    <Box className={styles.packageDetailsControls}>
      <Button
        className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonBack}`}
        variant="outlined"
        onClick={handleBack}
        disabled={currentStep === 0 || backLoading}
      >
        {backLoading ? <CircularProgress size={20} /> : 'Back'}
      </Button>
      <Button
        className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonContinue}`}
        variant="contained"
        onClick={handleNext}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} /> : 'Continue'}
      </Button>
    </Box>
  );

  const renderNavigationButtons = () => (
    <Box className={styles.controls}>
      {currentStep > 0 &&
        steps[currentStep] !== 'Choose Support Level' &&
        steps[currentStep] !== 'Select Payment Plan' && (
          <Button
            className={styles.btnControlsBack}
            variant="outlined"
            onClick={handleBack}
            disabled={currentStep === 0 || backLoading}
          >
            {backLoading ? <CircularProgress size={20} /> : 'Back'}
          </Button>
        )}
      {currentStep < steps.length - 1 &&
        steps[currentStep] !== 'Choose Support Level' &&
        steps[currentStep] !== 'Select Payment Plan' && (
          <Button
            className={styles.btnControlsNext}
            variant="contained"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Next'}
          </Button>
        )}
    </Box>
  );

  return (
    <Card className={styles.container}>
      <CardContent>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label || `Step ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.stepContent}
        >
          {getStepContent()}
        </motion.div>
        {currentStep !== steps.length - 1 &&
          currentStep !== 0 &&
          renderNavigationButtons()}
      </CardContent>
    </Card>
  );
};

export default React.memo(CustomPackageLayout);
