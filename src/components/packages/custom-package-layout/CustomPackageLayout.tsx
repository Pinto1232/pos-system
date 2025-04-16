'use client';

import React, {
  useState,
  useEffect,
} from 'react';
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
import {
  Feature,
  AddOn,
  CustomPackageLayoutProps,
} from './types';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import {
  FaCheck,
  FaCalendarAlt,
  FaCalendarCheck,
} from 'react-icons/fa';
import Link from 'next/link';

const countries = [
  'USA',
  'Canada',
  'UK',
  'Australia',
];
const states = [
  'California',
  'Texas',
  'New York',
  'Florida',
];

const CustomPackageLayout: React.FC<
  CustomPackageLayoutProps
> = ({
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
    const [backLoading, setBackLoading] =
      useState(false);
    const [selectedCurrency] =
      useState<string>('USD');
    const { setTestPeriod } = useTestPeriod();
    const [
      totalFeaturePrice,
      setTotalFeaturePrice,
    ] = useState<number>(0);
    const [checkboxStates, setCheckboxStates] =
      useState<Record<string, boolean>>({
        'business-regular-updates': false,
        'startup-regular-updates': false,
        'personal-regular-updates': false,
        'business-cloud-storage': false,
        'startup-cloud-storage': false,
        'personal-cloud-storage': false,
        'business-market-analysis': false,
        'startup-market-analysis': false,
        'personal-market-analysis': false,
        'business-team-management': false,
        'startup-team-management': false,
        'personal-team-management': false,
        'business-support': false,
        'startup-support': false,
        'personal-support': false,
      });
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
    const [
      selectedPlanIndex,
      setSelectedPlanIndex,
    ] = useState<number | null>(null);
    const [
      selectedSupportIndex,
      setSelectedSupportIndex,
    ] = useState<number | null>(null);

    useEffect(() => {
      const total = selectedFeatures.reduce(
        (sum, feature) => {
          const featurePrice =
            feature.multiCurrencyPrices
              ? feature.multiCurrencyPrices[
              selectedCurrency
              ]
              : feature.basePrice;
          return sum + featurePrice;
        },
        0
      );
      setTotalFeaturePrice(total);
    }, [selectedFeatures, selectedCurrency]);

    const handleNext = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        ); // Simulate loading
        onNext();
      } finally {
        setLoading(false);
      }
    };

    const handleBack = async () => {
      setBackLoading(true);
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        ); // Simulate loading
        setSelectedPlanIndex(null);
        onBack();
      } finally {
        setBackLoading(false);
      }
    };

    const handleFeatureToggle = (
      feature: Feature
    ) => {
      const newFeatures = selectedFeatures.some(
        (f) => f.id === feature.id
      )
        ? selectedFeatures.filter(
          (f) => f.id !== feature.id
        )
        : [...selectedFeatures, feature];
      onFeatureToggle(newFeatures);
    };

    const handleAddOnToggle = (addOn: AddOn) => {
      const newAddOns = selectedAddOns.some(
        (a) => a.id === addOn.id
      )
        ? selectedAddOns.filter(
          (a) => a.id !== addOn.id
        )
        : [...selectedAddOns, addOn];
      onAddOnToggle(newAddOns);
    };

    const handleUsageUpdate = (
      id: number,
      value: string
    ) => {
      onUsageChange({
        ...usageQuantities,
        [id]: Math.max(0, parseInt(value) || 0),
      });
    };

    const handleTextFieldChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      console.log(
        `TextField change: ${name} = ${value}`
      );
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSelectChange = (
      e: SelectChangeEvent<string>
    ) => {
      const { name, value } = e.target;
      console.log(
        `Select change: ${name} = ${value}`
      );
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
      onNext()
    };

    const getCurrencySymbol = (
      currency: string
    ) => {
      switch (currency) {
        case 'USD':
          return 'R';
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

    const formatPrice = (
      currency: string,
      price: number
    ) => {
      const roundedPrice = Math.round(price);
      return currency === 'Kz'
        ? `${roundedPrice}${currency}`
        : `${getCurrencySymbol(currency)} ${roundedPrice}`;
    };

    const handleCheckboxChange = (id: string) => {
      setCheckboxStates((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    const handlePlanSelect = (index: number) => {
      if (selectedPlanIndex === index) {
        setSelectedPlanIndex(null);
      } else {
        setSelectedPlanIndex(index);
      }
    };

    const handleSupportSelect = (index: number) => {
      if (selectedSupportIndex === index) {
        setSelectedSupportIndex(null);
      } else {
        setSelectedSupportIndex(index);
      }
    };

    const getStepContent = () => {
      const currentLabel =
        steps[currentStep]?.trim() || '';

      if (!currentLabel) {
        return (
          <Typography variant="body1">
            Loading step configuration...
          </Typography>
        );
      }

      switch (currentLabel) {
        case 'Package Details':
          let multiCurrencyPrices: Record<
            string,
            number
          > = {};
          try {
            if (
              selectedPackage?.multiCurrencyPrices
            ) {
              multiCurrencyPrices = JSON.parse(
                selectedPackage.multiCurrencyPrices
              );
            } else {
              multiCurrencyPrices = {
                [selectedCurrency]: basePrice,
              };
            }
          } catch (error) {
            console.error(
              'Error parsing multiCurrencyPrices:',
              error
            );
            multiCurrencyPrices = {
              [selectedCurrency]: basePrice,
            };
          }

          const displayPrice =
            multiCurrencyPrices[selectedCurrency] ||
            basePrice;
          const formattedDescription =
            packageDetails.description
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(
                /business needs/g,
                'business needs.'
              );
          return (
            <Box className={styles.packageDetails}>
              <Typography
                variant="h4"
                className={styles.packageTitle}
              >
                {isCustomizable ? 'Customize Your Package' : 'Package Details'}
              </Typography>
              <Typography
                variant="body1"
                className={styles.packageDescription}
              >
                {formattedDescription}
              </Typography>

              <Box className={styles.priceDisplay}>
                <Typography variant="h5">
                  Base Price: R{displayPrice}
                </Typography>
              </Box>

              <Box className={styles.featuresTable}>
                <Box className={styles.tableHeader}>
                  <Box
                    className={styles.featureColumn}
                  ></Box>
                  <Box
                    className={styles.planColumn}
                  >
                    Business
                  </Box>
                  <Box
                    className={styles.planColumn}
                  >
                    Startup
                  </Box>
                  <Box
                    className={styles.planColumn}
                  >
                    Personal
                  </Box>
                </Box>

                <Box
                  className={styles.tableRow}
                  sx={{
                    borderBottom:
                      '2px solid #e0e0e0',
                  }}
                >
                  <Box
                    className={styles.featureColumn}
                  >
                    Billing Period
                  </Box>
                  <Box
                    className={styles.planColumn}
                  >
                    <Button
                      variant="contained"
                      className={
                        styles.priceTabActive
                      }
                      sx={{
                        minWidth: '100px',
                        backgroundColor: '#2563eb',
                        '&:hover': {
                          backgroundColor:
                            '#1d4ed8',
                        },
                      }}
                      startIcon={<FaCalendarAlt />}
                    >
                      Monthly
                    </Button>
                  </Box>
                  <Box
                    className={styles.planColumn}
                  >
                    <Button
                      variant="outlined"
                      className={styles.priceTab}
                      sx={{
                        minWidth: '100px',
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        '&:hover': {
                          borderColor: '#cbd5e1',
                          backgroundColor:
                            '#f8fafc',
                        },
                      }}
                      startIcon={
                        <FaCalendarCheck />
                      }
                    >
                      Yearly
                      <span
                        style={{
                          backgroundColor:
                            '#dcfce7',
                          color: '#166534',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          marginLeft: '8px',
                        }}
                      >
                        -20%
                      </span>
                    </Button>
                  </Box>
                  <Box
                    className={styles.planColumn}
                  >
                    <Button
                      variant="outlined"
                      className={styles.priceTab}
                      sx={{
                        minWidth: '100px',
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        '&:hover': {
                          borderColor: '#cbd5e1',
                          backgroundColor:
                            '#f8fafc',
                        },
                      }}
                      startIcon={
                        <FaCalendarCheck />
                      }
                    >
                      2 Years
                      <span
                        style={{
                          backgroundColor:
                            '#dcfce7',
                          color: '#166534',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          marginLeft: '8px',
                        }}
                      >
                        -30%
                      </span>
                    </Button>
                  </Box>
                </Box>

                <Box className={styles.tableRow}>
                  <Box
                    className={styles.featureColumn}
                  >
                    Regular Update & Reports
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'business-regular-updates'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'business-regular-updates'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'business-regular-updates'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'startup-regular-updates'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'startup-regular-updates'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'startup-regular-updates'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'personal-regular-updates'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'personal-regular-updates'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'personal-regular-updates'
                        )
                      }
                    />
                  </Box>
                </Box>

                <Box className={styles.tableRow}>
                  <Box
                    className={styles.featureColumn}
                  >
                    Cloud Storage & Sharing
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'business-cloud-storage'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'business-cloud-storage'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'business-cloud-storage'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'startup-cloud-storage'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'startup-cloud-storage'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'startup-cloud-storage'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'personal-cloud-storage'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'personal-cloud-storage'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'personal-cloud-storage'
                        )
                      }
                    />
                  </Box>
                </Box>

                <Box className={styles.tableRow}>
                  <Box
                    className={styles.featureColumn}
                  >
                    Market Analysis Tools
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'business-market-analysis'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'business-market-analysis'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'business-market-analysis'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'startup-market-analysis'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'startup-market-analysis'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'startup-market-analysis'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'personal-market-analysis'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'personal-market-analysis'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'personal-market-analysis'
                        )
                      }
                    />
                  </Box>
                </Box>

                <Box className={styles.tableRow}>
                  <Box
                    className={styles.featureColumn}
                  >
                    Team Management
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'business-team-management'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'business-team-management'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'business-team-management'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'startup-team-management'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'startup-team-management'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'startup-team-management'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'personal-team-management'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'personal-team-management'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'personal-team-management'
                        )
                      }
                    />
                  </Box>
                </Box>

                <Box className={styles.tableRow}>
                  <Box
                    className={styles.featureColumn}
                  >
                    24/7 Business Support
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'business-support'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'business-support'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'business-support'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'startup-support'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'startup-support'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'startup-support'
                        )
                      }
                    />
                  </Box>
                  <Box
                    className={styles.planColumn}
                    sx={{
                      backgroundColor:
                        checkboxStates[
                          'personal-support'
                        ]
                          ? 'rgba(76, 175, 80, 0.1)'
                          : 'transparent',
                      transition:
                        'background-color 0.3s ease',
                    }}
                  >
                    <Checkbox
                      checked={
                        checkboxStates[
                        'personal-support'
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          'personal-support'
                        )
                      }
                    />
                  </Box>
                </Box>
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
                  onClick={handleSave}
                  disabled={loading || !isAnyCheckboxSelected()}
                >
                  {loading ? <CircularProgress size={20} /> : 'Continue'}
                </Button>
              </Box>
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
                <Typography
                  variant="h6"
                  className={styles.sectionHeader}
                >
                  Select Core Features
                </Typography>
                <Typography
                  variant="body2"
                  className={
                    styles.sectionDescription
                  }
                >
                  Select the modules and features
                  that best meet your needs.
                </Typography>
                <Box
                  className={
                    styles.featuresContainer
                  }
                >
                  {features.length > 0 ? (
                    features.map((feature) => {
                      const isSelected =
                        selectedFeatures.some(
                          (f) => f.id === feature.id
                        );
                      const featurePrice =
                        feature.multiCurrencyPrices
                          ? feature
                            .multiCurrencyPrices[
                          selectedCurrency
                          ]
                          : feature.basePrice;
                      return (
                        <Box
                          key={feature.id}
                          className={`${styles.featureItem} ${isSelected
                            ? styles.selectedFeature
                            : ''
                            }`}
                        >
                          <Box>
                            <Typography
                              className={
                                styles.featureName
                              }
                            >
                              Create Custom Plan
                            </Typography>
                            <Typography
                              variant="body2"
                              className={
                                styles.featureDescription
                              }
                            >
                              Select the modules and
                              features.
                            </Typography>
                            <Box>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      isSelected
                                    }
                                    onChange={() =>
                                      handleFeatureToggle(
                                        feature
                                      )
                                    }
                                  />
                                }
                                label={
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                  >
                                    {`${feature.name} (${formatPrice(
                                      selectedCurrency,
                                      featurePrice
                                    )})`}
                                    {isSelected && (
                                      <Typography
                                        variant="body2"
                                        className={
                                          styles.featureDescription
                                        }
                                        sx={{
                                          marginLeft: 1,
                                        }}
                                      >
                                        <FaCheck />
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                              {isSelected && (
                                <Box
                                  className={
                                    styles.featureDescriptionContainer
                                  }
                                >
                                  <InfoIcon
                                    className={
                                      styles.infoIcon
                                    }
                                  />
                                  <Typography
                                    variant="body2"
                                    className={
                                      styles.featureDescription
                                    }
                                  >
                                    {
                                      feature.description
                                    }
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <Box
                              sx={{
                                width: '379px',
                                mt: 1,
                              }}
                            >
                              <Divider />
                            </Box>
                          </Box>
                        </Box>
                      );
                    })
                  ) : (
                    <Box
                      className={styles.emptyState}
                    >
                      <Typography variant="h5">
                        No features available
                      </Typography>
                      <Button variant="outlined">
                        Continue
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  className={styles.title}
                >
                  Purchase Summary
                </Typography>
                <Typography
                  variant="body2"
                  className={
                    styles.sectionDescription
                  }
                >
                  Brief summary of your purchase.
                </Typography>
                <Box
                  className={
                    styles.purchaseSummaryContainer
                  }
                >
                  {selectedFeatures.length > 0 ? (
                    selectedFeatures.map(
                      (feature, index) => {
                        const featurePrice =
                          feature.multiCurrencyPrices
                            ? feature
                              .multiCurrencyPrices[
                            selectedCurrency
                            ]
                            : feature.basePrice;
                        return (
                          <Box
                            key={feature.id}
                            className={
                              styles.billingItem
                            }
                            sx={{
                              backgroundColor:
                                index % 2 === 0
                                  ? '#3b82f65e'
                                  : '#ffffff',
                            }}
                          >
                            <Typography
                              className={
                                styles.itemLabel
                              }
                            >
                              {feature.name}
                            </Typography>
                            <Typography
                              className={
                                styles.itemPrice
                              }
                            >
                              {formatPrice(
                                selectedCurrency,
                                featurePrice
                              )}
                            </Typography>
                          </Box>
                        );
                      }
                    )
                  ) : (
                    <Box
                      className={styles.billingItem}
                      sx={{
                        backgroundColor:
                          '#3b82f65e',
                      }}
                    >
                      <Typography
                        className={styles.itemLabel}
                      >
                        Billing Module
                      </Typography>
                      <Typography
                        className={styles.itemPrice}
                      >
                        $0.00
                      </Typography>
                    </Box>
                  )}
                  <Box
                    className={styles.userAgreement}
                  >
                    <FormControlLabel
                      control={<Checkbox />}
                      label="User Agreement"
                    />
                    <Typography
                      variant="body2"
                      className={
                        styles.userAgreementText
                      }
                    >
                      Before proceeding to payment,
                      please read and sign, agreeing
                      to the{' '}
                      <Link
                        href="/path/to/user-agreement"
                        className={
                          styles.userAgreementLink
                        }
                      >
                        User agreement
                      </Link>
                    </Typography>
                  </Box>
                  <Box
                    className={
                      styles.totalContainer
                    }
                  >
                    <Typography
                      variant="subtitle1"
                      className={styles.totalLabel}
                    >
                      Total
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      className={styles.totalPrice}
                    >
                      {formatPrice(
                        selectedCurrency,
                        totalFeaturePrice
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        case 'Choose Add-Ons':
          return (
            <Box
              className={styles.featuresContainer}
            >
              <Box className={styles.sectionHeader}>
                <Typography variant="h5">
                  Choose Add-Ons
                </Typography>
                <Typography
                  variant="body2"
                  className={
                    styles.sectionDescription
                  }
                >
                  Select additional features to
                  enhance your package. Each add-on
                  comes with its own pricing.
                </Typography>
              </Box>
              {addOns.length > 0 ? (
                addOns.map((addOn) => {
                  const isSelected =
                    selectedAddOns.some(
                      (a) => a.id === addOn.id
                    );
                  const addOnPrice =
                    addOn.multiCurrencyPrices
                      ? addOn.multiCurrencyPrices[
                      selectedCurrency
                      ]
                      : addOn.price;
                  return (
                    <Box
                      key={addOn.id}
                      className={`${styles.featureItem} ${isSelected
                        ? styles.selectedFeature
                        : ''
                        }`}
                    >
                      <Button
                        className={
                          styles.addOnsfeatureButton
                        }
                        variant={
                          isSelected
                            ? 'contained'
                            : 'outlined'
                        }
                        onClick={() =>
                          handleAddOnToggle(addOn)
                        }
                      >
                        {addOn.name.replace(
                          /[^a-zA-Z0-9 ]/g,
                          ''
                        )}{' '}
                        (
                        {formatPrice(
                          selectedCurrency,
                          addOnPrice
                        )}
                        )
                      </Button>
                      {isSelected && (
                        <Box
                          className={
                            styles.featureDescriptionContainer
                          }
                        >
                          <InfoIcon
                            className={
                              styles.infoIcon
                            }
                          />
                          <Typography
                            variant="body2"
                            className={
                              styles.featureDescription
                            }
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
                  <Typography variant="h6">
                    No add-ons available
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={onNext}
                  >
                    Continue
                  </Button>
                </Box>
              )}
            </Box>
          );
        case 'Configure Usage':
          return (
            <Box
              className={styles.featuresContainer}
            >
              <Box className={styles.sectionHeader}>
                <Typography variant="h5">
                  Configure Usage
                </Typography>
                <Typography
                  variant="body2"
                  className={
                    styles.sectionDescription
                  }
                >
                  Adjust the usage metrics to fit
                  your business needs. Ensure the
                  values are within the allowed
                  range.
                </Typography>
              </Box>
              {usagePricing.length > 0 ? (
                usagePricing.map((usage) => {
                  const currentValue =
                    usageQuantities[usage.id] ??
                    usage.defaultValue;
                  const usagePrice =
                    usage.multiCurrencyPrices
                      ? usage.multiCurrencyPrices[
                      selectedCurrency
                      ]
                      : usage.pricePerUnit;
                  const usageError =
                    currentValue < usage.minValue ||
                      currentValue > usage.maxValue
                      ? `Value must be between ${usage.minValue} and ${usage.maxValue}`
                      : '';
                  return (
                    <Box
                      key={usage.id}
                      className={styles.usageItem}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                      >
                        {usage.name} (
                        {formatPrice(
                          selectedCurrency,
                          usagePrice
                        )}
                        /{usage.unit})
                      </Typography>
                      <TextField
                        type="number"
                        value={currentValue}
                        onChange={(e) =>
                          handleUsageUpdate(
                            usage.id,
                            e.target.value
                          )
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
                  <Button
                    variant="outlined"
                    onClick={onNext}
                  >
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
                  sx={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                  }}
                >
                  Choose your preferred payment plan
                </Typography>
              </Box>
              <Box
                className={
                  styles.paymentPlansContainer
                }
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                {[
                  {
                    title: 'Monthly Plan',
                    description:
                      'Pay monthly for maximum flexibility',
                    price:
                      formatPrice(
                        selectedCurrency,
                        calculatedPrice
                      ) + '/month',
                    features: [
                      'Monthly Billing',
                      'No Commitment',
                      'Easy Upgrade',
                    ],
                    buttonText: 'Select Plan',
                  },
                  {
                    title: 'Biannual Plan',
                    description:
                      'Save 15% with biannual billing',
                    price:
                      formatPrice(
                        selectedCurrency,
                        calculatedPrice * 6 * 0.85
                      ) + '/6 months',
                    features: [
                      '15% Discount',
                      'Flexible Billing',
                      'Mid-term Adjustments',
                    ],
                    buttonText: 'Select Plan',
                  },
                  {
                    title: 'Annual Plan',
                    description:
                      'Save 20% with annual billing',
                    price:
                      formatPrice(
                        selectedCurrency,
                        calculatedPrice * 12 * 0.8
                      ) + '/year',
                    features: [
                      '20% Discount',
                      'Priority Support',
                      'Free Setup',
                    ],
                    buttonText: 'Select Plan',
                  },
                  {
                    title: 'Enterprise Plan',
                    description:
                      'Custom solutions for large businesses',
                    price: 'Custom Pricing',
                    features: [
                      'Dedicated Support',
                      'Custom Features',
                      'SLA Guarantee',
                    ],
                    buttonText: 'Select Plan',
                  },
                ].map((plan, index) => (
                  <Box
                    key={index}
                    className={
                      styles.paymentPlanItem
                    }
                    data-selected={
                      selectedPlanIndex === index
                    }
                    sx={{
                      opacity:
                        selectedPlanIndex !==
                          null &&
                          selectedPlanIndex !== index
                          ? 0.5
                          : 1,
                      pointerEvents:
                        selectedPlanIndex !==
                          null &&
                          selectedPlanIndex !== index
                          ? 'none'
                          : 'auto',
                    }}
                  >
                    <Typography variant="h6">
                      {plan.title}
                    </Typography>
                    <Typography
                      className={
                        styles.paymentDescription
                      }
                    >
                      {plan.description}
                    </Typography>
                    <Typography
                      className={
                        styles.paymentPrice
                      }
                    >
                      {plan.price}
                    </Typography>
                    <Box
                      className={
                        styles.paymentFeatures
                      }
                    >
                      {plan.features.map(
                        (feature, idx) => (
                          <Typography key={idx}>
                            ✓ {feature}
                          </Typography>
                        )
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      className={
                        styles.selectPlanButton
                      }
                      onClick={() =>
                        handlePlanSelect(index)
                      }
                      disabled={
                        selectedPlanIndex !==
                        null &&
                        selectedPlanIndex !== index
                      }
                    >
                      {selectedPlanIndex === index
                        ? 'Selected'
                        : 'Select Plan'}
                    </Button>
                  </Box>
                ))}
              </Box>
              <Box
                className={
                  styles.packageDetailsControls
                }
              >
                <Button
                  className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonBack}`}
                  variant="outlined"
                  onClick={handleBack}
                  disabled={
                    currentStep === 0 || backLoading
                  }
                >
                  {backLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Back'
                  )}
                </Button>
                <Button
                  className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonContinue}`}
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    loading ||
                    selectedPlanIndex === null
                  }
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Continue'
                  )}
                </Button>
              </Box>
            </Box>
          );
        case 'Choose Support Level':
          return (
            <Box
              className={styles.featuresContainer}
            >
              <Box className={styles.sectionHeader}>
                <Typography variant="h5">
                  Choose Support Level
                </Typography>
                <Typography
                  variant="body2"
                  className={
                    styles.sectionDescription
                  }
                >
                  Select the support package that
                  matches your business needs.
                </Typography>
              </Box>
              <Box
                className={
                  styles.supportPlansContainer
                }
              >
                <Box
                  className={`${styles.supportPlanItem} ${selectedSupportIndex === 0 ? styles.selected : ''}`}
                  sx={{
                    opacity:
                      selectedSupportIndex !==
                        null &&
                        selectedSupportIndex !== 0
                        ? 0.5
                        : 1,
                    pointerEvents:
                      selectedSupportIndex !==
                        null &&
                        selectedSupportIndex !== 0
                        ? 'none'
                        : 'auto',
                  }}
                >
                  <Typography variant="h6">
                    Standard Support
                  </Typography>
                  <Typography
                    variant="body2"
                    className={
                      styles.supportDescription
                    }
                  >
                    Email support with 24-hour
                    response time
                  </Typography>
                  <Box
                    className={
                      styles.supportFeatures
                    }
                  >
                    <Typography variant="body2">
                      ✓ Email Support
                    </Typography>
                    <Typography variant="body2">
                      ✓ Knowledge Base Access
                    </Typography>
                    <Typography variant="body2">
                      ✓ Community Forum
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    className={styles.supportPrice}
                  >
                    Included
                  </Typography>
                  <Button
                    variant="contained"
                    className={
                      styles.selectPlanButton
                    }
                    onClick={() =>
                      handleSupportSelect(0)
                    }
                    sx={selectedSupportIndex === 0 ? { backgroundColor: 'green' } : {}}
                  >
                    {selectedSupportIndex === 0
                      ? 'Selected'
                      : 'Select Plan'}
                  </Button>
                </Box>
                <Box
                  className={`${styles.supportPlanItem} ${styles.premium} ${selectedSupportIndex === 1 ? styles.selected : ''}`}
                  sx={{
                    opacity:
                      selectedSupportIndex !==
                        null &&
                        selectedSupportIndex !== 1
                        ? 0.5
                        : 1,
                    pointerEvents:
                      selectedSupportIndex !==
                        null &&
                        selectedSupportIndex !== 1
                        ? 'none'
                        : 'auto',
                  }}
                >
                  <Typography variant="h6">
                    Premium Support
                  </Typography>
                  <Typography
                    variant="body2"
                    className={
                      styles.supportDescription
                    }
                  >
                    Priority support with 4-hour
                    response time
                  </Typography>
                  <Box
                    className={
                      styles.supportFeatures
                    }
                  >
                    <Typography variant="body2">
                      ✓ 24/7 Priority Support
                    </Typography>
                    <Typography variant="body2">
                      ✓ Dedicated Account Manager
                    </Typography>
                    <Typography variant="body2">
                      ✓ Phone Support
                    </Typography>
                    <Typography variant="body2">
                      ✓ Custom Training Sessions
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    className={styles.supportPrice}
                  >
                    +
                    {formatPrice(
                      selectedCurrency,
                      calculatedPrice * 0.2
                    )}
                    /month
                  </Typography>
                  <Button
                    variant="contained"
                    className={
                      styles.selectPlanButton
                    }
                    onClick={() =>
                      handleSupportSelect(1)
                    }
                    sx={selectedSupportIndex === 1 ? { backgroundColor: 'green' } : {}}
                  >
                    {selectedSupportIndex === 1
                      ? 'Selected'
                      : 'Select Plan'}
                  </Button>
                </Box>
                <Box
                  className={`${styles.supportPlanItem} ${styles.advanced} ${selectedSupportIndex === 2 ? styles.selected : ''}`}
                  sx={{
                    opacity:
                      selectedSupportIndex !==
                        null &&
                        selectedSupportIndex !== 2
                        ? 0.5
                        : 1,
                    pointerEvents:
                      selectedSupportIndex !==
                        null &&
                        selectedSupportIndex !== 2
                        ? 'none'
                        : 'auto',
                  }}
                >
                  <Typography variant="h6">
                    Advanced Support
                  </Typography>
                  <Typography
                    variant="body2"
                    className={
                      styles.supportDescription
                    }
                  >
                    Enterprise-grade support with
                    dedicated team
                  </Typography>
                  <Box
                    className={
                      styles.supportFeatures
                    }
                  >
                    <Typography variant="body2">
                      ✓ 24/7 Dedicated Support Team
                    </Typography>
                    <Typography variant="body2">
                      ✓ SLA Guarantee
                    </Typography>
                    <Typography variant="body2">
                      ✓ On-site Support
                    </Typography>
                    <Typography variant="body2">
                      ✓ Custom Development
                    </Typography>
                    <Typography variant="body2">
                      ✓ Priority Feature Requests
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    className={styles.supportPrice}
                  >
                    +
                    {formatPrice(
                      selectedCurrency,
                      calculatedPrice * 0.4
                    )}
                    /month
                  </Typography>
                  <Button
                    variant="contained"
                    className={
                      styles.selectPlanButton
                    }
                    onClick={() =>
                      handleSupportSelect(2)
                    }
                    sx={selectedSupportIndex === 2 ? { backgroundColor: 'green' } : {}}
                  >
                    {selectedSupportIndex === 2
                      ? 'Selected'
                      : 'Select Plan'}
                  </Button>
                </Box>
              </Box>
              <Box
                className={
                  styles.packageDetailsControls
                }
              >
                <Button
                  className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonBack}`}
                  variant="outlined"
                  onClick={handleBack}
                  disabled={
                    currentStep === 0 || backLoading
                  }
                >
                  {backLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Back'
                  )}
                </Button>
                <Button
                  className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonContinue}`}
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    loading ||
                    selectedSupportIndex === null
                  }
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Continue'
                  )}
                </Button>
              </Box>
            </Box>
          );
        case 'Configure Enterprise Features':
          return (
            <Box
              className={styles.featuresContainer}
            >
              <Box className={styles.sectionHeader}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#173a79',
                  }}
                >
                  Configure Enterprise Features
                </Typography>
                <Typography
                  variant="body2"
                  className={
                    styles.sectionDescription
                  }
                >
                  Customize your enterprise package
                  with advanced features tailored
                  for large businesses.
                </Typography>
              </Box>
              <Box
                className={
                  styles.enterpriseFeaturesContainer
                }
              >
                <Box
                  className={
                    styles.enterpriseFeatureItem
                  }
                >
                  <Box
                    className={styles.featureHeader}
                  >
                    <Typography variant="h6">
                      Advanced Analytics
                    </Typography>
                    <Typography
                      variant="body2"
                      className={
                        styles.featureDescription
                      }
                    >
                      Comprehensive reporting and
                      analytics tools
                    </Typography>
                  </Box>
                  <Box
                    className={
                      styles.featureOptions
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            enterpriseFeatures?.realTimeAnalytics ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'realTimeAnalytics'
                            )
                          }
                        />
                      }
                      label="Real-time Analytics"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            enterpriseFeatures?.customReports ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'customReports'
                            )
                          }
                        />
                      }
                      label="Custom Reports"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            enterpriseFeatures?.dataExport ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'dataExport'
                            )
                          }
                        />
                      }
                      label="Data Export"
                    />
                  </Box>
                </Box>

                <Box
                  className={
                    styles.enterpriseFeatureItem
                  }
                >
                  <Box
                    className={styles.featureHeader}
                  >
                    <Typography variant="h6">
                      Multi-Location
                    </Typography>
                    <Typography
                      variant="body2"
                      className={
                        styles.featureDescription
                      }
                    >
                      Manage multiple business
                      locations efficiently
                    </Typography>
                  </Box>
                  <Box
                    className={
                      styles.featureOptions
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            enterpriseFeatures?.centralizedManagement ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'centralizedManagement'
                            )
                          }
                        />
                      }
                      label="Centralized Management"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            enterpriseFeatures?.locationSettings ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'locationSettings'
                            )
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
                            enterpriseFeatures?.crossLocationInventory ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'crossLocationInventory'
                            )
                          }
                        />
                      }
                      label="Cross-location Inventory"
                    />
                  </Box>
                </Box>

                <Box
                  className={
                    styles.enterpriseFeatureItem
                  }
                >
                  <Box
                    className={styles.featureHeader}
                  >
                    <Typography variant="h6">
                      Security Suite
                    </Typography>
                    <Typography
                      variant="body2"
                      className={
                        styles.featureDescription
                      }
                    >
                      Advanced security features for
                      enterprise protection
                    </Typography>
                  </Box>
                  <Box
                    className={
                      styles.featureOptions
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            enterpriseFeatures?.roleBasedAccess ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'roleBasedAccess'
                            )
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
                            enterpriseFeatures?.advancedEncryption ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'advancedEncryption'
                            )
                          }
                        />
                      }
                      label="Advanced Encryption"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            enterpriseFeatures?.auditLogging ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'auditLogging'
                            )
                          }
                        />
                      }
                      label="Audit Logging"
                    />
                  </Box>
                </Box>

                <Box
                  className={
                    styles.enterpriseFeatureItem
                  }
                >
                  <Box
                    className={styles.featureHeader}
                  >
                    <Typography variant="h6">
                      API & Integration
                    </Typography>
                    <Typography
                      variant="body2"
                      className={
                        styles.featureDescription
                      }
                    >
                      Connect with other business
                      applications
                    </Typography>
                  </Box>
                  <Box
                    className={
                      styles.featureOptions
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            enterpriseFeatures?.restfulApi ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'restfulApi'
                            )
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
                            enterpriseFeatures?.webhookNotifications ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'webhookNotifications'
                            )
                          }
                        />
                      }
                      label="Webhook Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            enterpriseFeatures?.customIntegration ||
                            false
                          }
                          onChange={() =>
                            onEnterpriseFeatureToggle?.(
                              'customIntegration'
                            )
                          }
                        />
                      }
                      label="Custom Integration"
                    />
                  </Box>
                </Box>
              </Box>
              <Box
                className={
                  styles.packageDetailsControls
                }
              >
                <Button
                  className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonBack}`}
                  variant="outlined"
                  onClick={handleBack}
                  disabled={
                    currentStep === 0 || backLoading
                  }
                >
                  {backLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Back'
                  )}
                </Button>
                <Button
                  className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonContinue}`}
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    loading ||
                    !isAnyEnterpriseFeatureSelected()
                  }
                >
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Continue'
                  )}
                </Button>
              </Box>
            </Box>
          );

        case 'Review & Confirm':
          return (
            <Box className={styles.reviewContainer}>
              <Box className={styles.reviewColumn}>
                <Box
                  className={styles.reviewSection}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold' }}
                  >
                    Enter Your Details
                  </Typography>
                  <Box
                    className={styles.reviewForm}
                  >
                    <Box className={styles.formRow}>
                      <TextField
                        label="First Name"
                        name="firstName"
                        fullWidth
                        required
                        value={formData.firstName}
                        onChange={
                          handleTextFieldChange
                        }
                      />
                      <TextField
                        label="Last Name"
                        name="lastName"
                        fullWidth
                        required
                        value={formData.lastName}
                        onChange={
                          handleTextFieldChange
                        }
                      />
                    </Box>
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      required
                      value={formData.email}
                      onChange={
                        handleTextFieldChange
                      }
                    />
                    <TextField
                      label="Phone Number"
                      name="phone"
                      fullWidth
                      required
                      value={formData.phone}
                      onChange={
                        handleTextFieldChange
                      }
                    />
                    <TextField
                      label="Address"
                      name="address"
                      fullWidth
                      required
                      value={formData.address}
                      onChange={
                        handleTextFieldChange
                      }
                    />
                    <Box className={styles.formRow}>
                      <FormControl
                        fullWidth
                        required
                      >
                        <InputLabel>
                          Country
                        </InputLabel>
                        <Select
                          label="Country"
                          name="country"
                          value={formData.country}
                          onChange={
                            handleSelectChange
                          }
                        >
                          {countries.map(
                            (country) => (
                              <MenuItem
                                key={country}
                                value={country}
                              >
                                {country}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>
                          State / Province / Region
                        </InputLabel>
                        <Select
                          label="State / Province / Region"
                          name="state"
                          value={formData.state}
                          onChange={
                            handleSelectChange
                          }
                        >
                          {states.map((state) => (
                            <MenuItem
                              key={state}
                              value={state}
                            >
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
                        onChange={
                          handleTextFieldChange
                        }
                      />
                      <TextField
                        label="Postal / Zip Code"
                        name="zipCode"
                        fullWidth
                        value={formData.zipCode}
                        onChange={
                          handleTextFieldChange
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box className={styles.reviewColumn}>
                <Box
                  className={styles.orderSummary}
                >
                  <Box
                    className={
                      styles.orderSummaryHeader
                    }
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 2,
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                      }}
                    >
                      Order Summary
                    </Typography>
                  </Box>
                  <Box
                    className={
                      styles.orderSummaryContent
                    }
                    sx={{
                      '& .MuiTypography-root': {
                        color: '#1a1a1a',
                      },
                    }}
                  >
                    <Box
                      className={styles.section}
                      sx={{ mb: 3 }}
                    >
                      <Typography
                        className={
                          styles.sectionTitle
                        }
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          mb: 2,
                          color: '#4B5563',
                        }}
                      >
                        Selected Package
                      </Typography>
                      <Box
                        className={
                          styles.sectionContent
                        }
                        sx={{
                          backgroundColor:
                            '#F9FAFB',
                          borderRadius: '8px',
                          p: 2,
                        }}
                      >
                        <Box
                          className={styles.itemRow}
                          sx={{
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography
                            className={
                              styles.itemLabel
                            }
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            Enterprise Package
                            <span
                              className={
                                styles.discountTag
                              }
                              style={{
                                backgroundColor:
                                  '#EEF2FF',
                                color: '#4F46E5',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.69rem',
                                fontWeight: 600,
                                flexWrap: 'nowrap',
                              }}
                            >
                              Most Popular
                            </span>
                          </Typography>
                          <Typography
                            className={
                              styles.itemValue
                            }
                            sx={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              flexWrap: 'nowrap',
                            }}
                          >
                            {formatPrice(
                              selectedCurrency,
                              basePrice
                            )}
                            <span
                              style={{
                                fontSize: '0.85rem',
                                color: '#6B7280',
                                marginLeft: '2px',
                              }}
                            >
                              /mo
                            </span>
                          </Typography>
                        </Box>
                        <Typography
                          className={
                            styles.itemDescription
                          }
                          sx={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                          }}
                        >
                          Complete enterprise
                          solution with advanced
                          features and priority
                          support
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className={styles.section}
                      sx={{ mb: 3 }}
                    >
                      <Typography
                        className={
                          styles.sectionTitle
                        }
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          mb: 2,
                          color: '#4B5563',
                        }}
                      >
                        Payment Plan
                      </Typography>
                      <Box
                        className={
                          styles.sectionContent
                        }
                        sx={{
                          backgroundColor:
                            '#F9FAFB',
                          borderRadius: '8px',
                          p: 2,
                        }}
                      >
                        <Box
                          className={styles.itemRow}
                          sx={{
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography
                            className={
                              styles.itemLabel
                            }
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            Annual Plan
                            <span
                              className={
                                styles.discountTag
                              }
                              style={{
                                backgroundColor:
                                  '#ECFDF5',
                                color: '#059669',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              Save 20%
                            </span>
                          </Typography>
                          <Typography
                            className={
                              styles.priceReduction
                            }
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              color: '#059669',
                            }}
                          >
                            -
                            {formatPrice(
                              selectedCurrency,
                              basePrice * 0.2
                            )}
                            <span
                              style={{
                                fontSize: '0.85rem',
                                marginLeft: '2px',
                              }}
                            >
                              /mo
                            </span>
                          </Typography>
                        </Box>
                        <Typography
                          className={
                            styles.itemDescription
                          }
                          sx={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                          }}
                        >
                          Billed annually •{' '}
                          {formatPrice(
                            selectedCurrency,
                            basePrice * 12 * 0.8
                          )}{' '}
                          total
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className={styles.section}
                      sx={{ mb: 3 }}
                    >
                      <Typography
                        className={
                          styles.sectionTitle
                        }
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          mb: 2,
                          color: '#4B5563',
                        }}
                      >
                        Support Level
                      </Typography>
                      <Box
                        className={
                          styles.sectionContent
                        }
                        sx={{
                          backgroundColor:
                            '#F9FAFB',
                          borderRadius: '8px',
                          p: 2,
                        }}
                      >
                        <Box
                          className={styles.itemRow}
                          sx={{
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography
                            className={
                              styles.itemLabel
                            }
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            Premium Support
                            <span
                              className={
                                styles.discountTag
                              }
                              style={{
                                backgroundColor:
                                  '#FEF3C7',
                                color: '#D97706',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              24/7
                            </span>
                          </Typography>
                          <Typography
                            className={
                              styles.itemValue
                            }
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                            }}
                          >
                            +
                            {formatPrice(
                              selectedCurrency,
                              basePrice * 0.2
                            )}
                            <span
                              style={{
                                fontSize: '0.85rem',
                                color: '#6B7280',
                                marginLeft: '2px',
                              }}
                            >
                              /mo
                            </span>
                          </Typography>
                        </Box>
                        <Typography
                          className={
                            styles.itemDescription
                          }
                          sx={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                          }}
                        >
                          Dedicated support team •
                          4-hour response time •
                          Priority handling
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className={styles.section}
                      sx={{ mb: 4 }}
                    >
                      <Typography
                        className={
                          styles.sectionTitle
                        }
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          mb: 2,
                          color: '#4B5563',
                        }}
                      >
                        Savings Overview
                      </Typography>
                      <Box
                        className={
                          styles.sectionContent
                        }
                        sx={{
                          backgroundColor:
                            '#F9FAFB',
                          borderRadius: '8px',
                          p: 2,
                        }}
                      >
                        <Box
                          className={styles.itemRow}
                          sx={{
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography
                            className={
                              styles.itemLabel
                            }
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                            }}
                          >
                            Subtotal
                          </Typography>
                          <Typography
                            className={
                              styles.itemValue
                            }
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                            }}
                          >
                            {formatPrice(
                              selectedCurrency,
                              basePrice + 747
                            )}
                            <span
                              style={{
                                fontSize: '0.85rem',
                                color: '#6B7280',
                                marginLeft: '2px',
                              }}
                            >
                              /mo
                            </span>
                          </Typography>
                        </Box>
                        <Box
                          className={styles.divider}
                          sx={{
                            height: '1px',
                            backgroundColor:
                              '#E5E7EB',
                            my: 2,
                          }}
                        />
                        <Box
                          className={styles.itemRow}
                          sx={{
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography
                            className={
                              styles.itemLabel
                            }
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            Annual Discount
                            <span
                              className={
                                styles.discountTag
                              }
                              style={{
                                backgroundColor:
                                  '#ECFDF5',
                                color: '#059669',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              20% Off
                            </span>
                          </Typography>
                          <Typography
                            className={
                              styles.priceReduction
                            }
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              color: '#059669',
                            }}
                          >
                            -
                            {formatPrice(
                              selectedCurrency,
                              (basePrice + 747) *
                              0.2
                            )}
                            <span
                              style={{
                                fontSize: '0.85rem',
                                marginLeft: '2px',
                              }}
                            >
                              /mo
                            </span>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    className={
                      styles.orderSummaryFooter
                    }
                    sx={{
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      pt: 3,
                    }}
                  >
                    <Box
                      className={
                        styles.totalContainer
                      }
                      sx={{
                        mb: 3,
                      }}
                    >
                      <Box
                        className={
                          styles.totalLabel
                        }
                      >
                        <Typography
                          className={
                            styles.totalAmount
                          }
                          sx={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#1a1a1a',
                            mb: 1,
                          }}
                        >
                          {formatPrice(
                            selectedCurrency,
                            (basePrice + 747) * 0.7
                          )}
                          <span
                            style={{
                              fontSize: '1rem',
                              color: '#6B7280',
                              marginLeft: '4px',
                            }}
                          >
                            /mo
                          </span>
                        </Typography>
                        <Typography
                          className={
                            styles.billingNote
                          }
                          sx={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                          }}
                        >
                          Billed annually • Total
                          savings of{' '}
                          {formatPrice(
                            selectedCurrency,
                            (basePrice + 747) *
                            0.3 *
                            12
                          )}
                          /year
                        </Typography>
                      </Box>
                      <Box className={styles.controls} sx={{ '& > *': { mr: 10, mt: 4 } }}>
                        <Button
                          className={styles.btnControlsBack}
                          variant="outlined"
                          onClick={handleBack}
                          disabled={currentStep === 0 || backLoading}
                        >
                          {backLoading ? <CircularProgress size={20} /> : 'Back'}
                        </Button>
                        <Button
                          className={styles.btnControlsNext}
                          variant="contained"
                          onClick={handleNext}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={20} /> : 'Confirm'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          );

        default:
          return (
            <Typography variant="body1">
              Unknown step configuration. Please
              contact support.
            </Typography>
          );
      }
    };

    const isAnyCheckboxSelected = () => {
      return Object.values(checkboxStates).some(
        (value) => value === true
      );
    };

    const isAnyEnterpriseFeatureSelected = () => {
      if (!enterpriseFeatures) return false;
      return Object.values(enterpriseFeatures).some(
        (value) => value === true
      );
    };

    const renderPackageDetailsButtons = () => (
      <Box
        className={styles.packageDetailsControls}
      >
        <Button
          className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonBack}`}
          variant="outlined"
          onClick={handleBack}
          disabled={
            currentStep === 0 || backLoading
          }
        >
          {backLoading ? (
            <CircularProgress size={20} />
          ) : (
            'Back'
          )}
        </Button>
        <Button
          className={`${styles.packageDetailsButton} ${styles.packageDetailsButtonContinue}`}
          variant="contained"
          onClick={handleSave}
          disabled={loading || !isAnyCheckboxSelected()}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            'Continue'
          )}
        </Button>
      </Box>
    );

    const renderNavigationButtons = () => (
      <Box className={styles.controls}>
        {currentStep > 0 &&
          steps[currentStep] !==
          'Choose Support Level' &&
          steps[currentStep] !==
          'Select Payment Plan' &&
          steps[currentStep] !==
          'Configure Enterprise Features' && (
            <Button
              className={styles.btnControlsBack}
              variant="outlined"
              onClick={handleBack}
              disabled={
                currentStep === 0 || backLoading
              }
            >
              {backLoading ? (
                <CircularProgress size={20} />
              ) : (
                'Back'
              )}
            </Button>
          )}
        {currentStep < steps.length - 1 &&
          steps[currentStep] !==
          'Choose Support Level' &&
          steps[currentStep] !==
          'Select Payment Plan' &&
          steps[currentStep] !==
          'Configure Enterprise Features' && (
            <Button
              className={styles.btnControlsNext}
              variant="contained"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                'Next'
              )}
            </Button>
          )}
      </Box>
    );

    return (
      <Card className={styles.container}>
        <CardContent>
          <Stepper
            activeStep={currentStep}
            alternativeLabel
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>
                  {label || `Step ${index + 1}`}
                </StepLabel>
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
