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
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Dialog,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { motion } from 'framer-motion';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorageIcon from '@mui/icons-material/Storage';
import styles from './CustomPackageLayout.module.css';

import {
  Feature,
  AddOn,
  CustomPackageLayoutProps,
} from './types';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import { useCurrency } from '@/contexts/CurrencyContext';
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
  onShowSuccessMessage,
  currentCurrency: propsCurrency,
}) => {
  const [loading, setLoading] = useState(false);
  const [backLoading, setBackLoading] =
    useState(false);
  const { setTestPeriod } = useTestPeriod();
  const {
    currency: contextCurrency,
    formatPrice: formatCurrencyPrice,
    rate,
    currencySymbol,
  } = useCurrency();

  const selectedCurrency =
    propsCurrency || contextCurrency;
  const [
    totalFeaturePrice,
    setTotalFeaturePrice,
  ] = useState<number>(0);
  const [featurePrices, setFeaturePrices] = useState<Record<number, number>>({});

  // New state variables for dynamic price calculation
  const [planDiscount, setPlanDiscount] = useState<number>(0); // Percentage discount (0-1)
  const [supportPrice, setSupportPrice] = useState<number>(0); // Additional price for support
  const [totalPrice, setTotalPrice] = useState<number>(basePrice); // Total calculated price

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

  const [dialogOpen, setDialogOpen] =
    useState<boolean>(false);

  const [
    activeEnterpriseCategory,
    setActiveEnterpriseCategory,
  ] = useState<string | null>(null);

  // Initialize feature prices when features are loaded
  useEffect(() => {
    if (features.length > 0) {
      const priceMap: Record<number, number> = {};
      features.forEach(feature => {
        const featurePrice = feature.multiCurrencyPrices && feature.multiCurrencyPrices[selectedCurrency]
          ? feature.multiCurrencyPrices[selectedCurrency]
          : feature.basePrice;
        priceMap[feature.id] = featurePrice;
      });
      setFeaturePrices(priceMap);

      // Also initialize add-on prices
      if (addOns.length > 0) {
        console.log('===== PROCESSING ADD-ONS IN CUSTOM PACKAGE LAYOUT =====');
        console.log('Total AddOns received:', addOns.length);

        addOns.forEach((addOn, index) => {
          console.log(`Processing AddOn #${index + 1} (ID: ${addOn.id}):`);
          console.log('  Name:', addOn.name);
          console.log('  Description:', addOn.description);
          console.log('  Price:', addOn.price);
          console.log('  Currency:', addOn.currency);
          console.log('  MultiCurrencyPrices:', addOn.multiCurrencyPrices);
          console.log('  Category:', addOn.category);
          console.log('  IsActive:', addOn.isActive);

          const addOnPrice = addOn.multiCurrencyPrices && addOn.multiCurrencyPrices[selectedCurrency]
            ? addOn.multiCurrencyPrices[selectedCurrency]
            : addOn.price;
          priceMap[addOn.id] = addOnPrice;
          console.log(`  Calculated price for currency ${selectedCurrency}:`, addOnPrice);
        });
        console.log('===================================================');
      }

      // Initialize usage-based pricing
      if (usagePricing.length > 0) {
        usagePricing.forEach(item => {
          const usagePrice = item.multiCurrencyPrices && item.multiCurrencyPrices[selectedCurrency]
            ? item.multiCurrencyPrices[selectedCurrency]
            : item.pricePerUnit;
          priceMap[item.id] = usagePrice;
        });
      }

      setFeaturePrices(priceMap);
      console.log('Feature prices initialized:', priceMap);
    }
  }, [features, addOns, usagePricing, selectedCurrency]);

  // Calculate total price when selected features, add-ons, usage quantities, or currency changes
  useEffect(() => {
    console.log('DEBUG - Price calculation triggered');
    console.log(`DEBUG - Current currency: ${selectedCurrency}, Rate: ${rate}`);
    console.log(`DEBUG - Base price (raw): ${basePrice}`);
    console.log(`DEBUG - Selected package:`, selectedPackage);

    // Calculate feature prices
    const featureTotal = selectedFeatures.reduce(
      (sum, feature) => {
        const featurePrice = featurePrices[feature.id] ||
          (feature.multiCurrencyPrices && feature.multiCurrencyPrices[selectedCurrency]
            ? feature.multiCurrencyPrices[selectedCurrency]
            : feature.basePrice);

        console.log(`Feature: ${feature.name}, ID: ${feature.id}, Price: ${featurePrice}`);
        return sum + featurePrice;
      },
      0
    );

    // Calculate add-on prices
    const addOnTotal = selectedAddOns.reduce(
      (sum, addOn) => {
        const addOnPrice = featurePrices[addOn.id] ||
          (addOn.multiCurrencyPrices && addOn.multiCurrencyPrices[selectedCurrency]
            ? addOn.multiCurrencyPrices[selectedCurrency]
            : addOn.price);

        console.log(`Add-on: ${addOn.name}, ID: ${addOn.id}, Price: ${addOnPrice}`);
        return sum + addOnPrice;
      },
      0
    );

    // Calculate usage-based prices
    const usageTotal = Object.entries(usageQuantities).reduce(
      (sum, [idStr, quantity]) => {
        const id = parseInt(idStr);
        const usageItem = usagePricing.find(item => item.id === id);
        if (!usageItem) return sum;

        const usagePrice = featurePrices[id] ||
          (usageItem.multiCurrencyPrices && usageItem.multiCurrencyPrices[selectedCurrency]
            ? usageItem.multiCurrencyPrices[selectedCurrency]
            : usageItem.pricePerUnit);

        const itemTotal = usagePrice * quantity;
        console.log(`Usage: ${usageItem.name}, ID: ${id}, Quantity: ${quantity}, Price per unit: ${usagePrice}, Total: ${itemTotal}`);
        return sum + itemTotal;
      },
      0
    );

    // Set the feature price total
    const featuresSum = featureTotal + addOnTotal + usageTotal;
    console.log(`Calculated features price: ${featuresSum} (Features: ${featureTotal}, Add-ons: ${addOnTotal}, Usage: ${usageTotal})`);
    setTotalFeaturePrice(featuresSum);

    // Calculate the final total price including base price, features, support, and discount
    const subtotal = basePrice + featuresSum + supportPrice;
    const discount = subtotal * planDiscount;
    const finalTotal = subtotal - discount;

    console.log(`Price calculation breakdown:
    - Base price: ${basePrice}
    - Features total: ${featuresSum}
    - Support price: ${supportPrice}
    - Subtotal: ${subtotal}
    - Discount (${planDiscount * 100}%): -${discount}
    - Final total: ${finalTotal}
    - Currency: ${selectedCurrency}`);

    setTotalPrice(finalTotal);

  }, [selectedFeatures, selectedAddOns, usageQuantities, featurePrices, selectedCurrency, usagePricing, basePrice, planDiscount, supportPrice]);

  const handleInfoClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (!enterpriseFeatures) return;

    const categories = {
      analytics: [
        'realTimeAnalytics',
        'customReports',
        'dataExport',
      ],
      multiLocation: [
        'centralizedManagement',
        'locationSettings',
        'crossLocationInventory',
      ],
      security: [
        'roleBasedAccess',
        'advancedEncryption',
        'auditLogging',
      ],
      api: [
        'restfulApi',
        'webhookNotifications',
        'customIntegration',
      ],
    };

    let activeCategory: string | null = null;

    for (const [
      category,
      features,
    ] of Object.entries(categories)) {
      if (
        features.some(
          (feature) => enterpriseFeatures[feature]
        )
      ) {
        activeCategory = category;
        break;
      }
    }

    setActiveEnterpriseCategory(activeCategory);
  }, [enterpriseFeatures]);

  const handleNext = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
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
      );
      setSelectedPlanIndex(null);
      onBack();
    } finally {
      setBackLoading(false);
    }
  };

  const handleFeatureToggle = (
    feature: Feature
  ) => {
    const isSelected = selectedFeatures.some(
      (f) => f.id === feature.id
    );

    // Get the feature price from the featurePrices map or calculate it
    let featurePrice = featurePrices[feature.id];

    // If the price is not in the map, calculate it and update the map
    if (featurePrice === undefined) {
      featurePrice = feature.multiCurrencyPrices && feature.multiCurrencyPrices[selectedCurrency]
        ? feature.multiCurrencyPrices[selectedCurrency]
        : feature.basePrice;

      // Update the featurePrices map
      setFeaturePrices(prev => ({
        ...prev,
        [feature.id]: featurePrice
      }));
    }

    // Update the total price immediately for a responsive UI
    if (isSelected) {
      // If feature is already selected, we're removing it, so subtract its price
      setTotalFeaturePrice(prevTotal => prevTotal - featurePrice);
      console.log(`Removed feature ${feature.name} (ID: ${feature.id}), price: ${featurePrice}, new total: ${totalFeaturePrice - featurePrice}`);
    } else {
      // If feature is not selected, we're adding it, so add its price
      setTotalFeaturePrice(prevTotal => prevTotal + featurePrice);
      console.log(`Added feature ${feature.name} (ID: ${feature.id}), price: ${featurePrice}, new total: ${totalFeaturePrice + featurePrice}`);
    }

    // Update the selected features list
    const newFeatures = isSelected
      ? selectedFeatures.filter((f) => f.id !== feature.id)
      : [...selectedFeatures, feature];

    onFeatureToggle(newFeatures);
  };

  const handleAddOnToggle = (addOn: AddOn) => {
    console.log('===== TOGGLING ADD-ON =====');
    console.log('AddOn being toggled:', addOn);
    console.log('  ID:', addOn.id);
    console.log('  Name:', addOn.name);
    console.log('  Description:', addOn.description);
    console.log('  Price:', addOn.price);
    console.log('  Currency:', addOn.currency);
    console.log('  MultiCurrencyPrices:', addOn.multiCurrencyPrices);
    console.log('  Category:', addOn.category);
    console.log('  IsActive:', addOn.isActive);

    const isSelected = selectedAddOns.some(
      (a) => a.id === addOn.id
    );
    console.log('  Currently selected:', isSelected);

    // Get the add-on price from the featurePrices map or calculate it
    let addOnPrice = featurePrices[addOn.id];
    console.log('  Price from featurePrices map:', addOnPrice);

    // If the price is not in the map, calculate it and update the map
    if (addOnPrice === undefined) {
      addOnPrice = addOn.multiCurrencyPrices && addOn.multiCurrencyPrices[selectedCurrency]
        ? addOn.multiCurrencyPrices[selectedCurrency]
        : addOn.price;
      console.log(`  Calculated price for currency ${selectedCurrency}:`, addOnPrice);

      // Update the featurePrices map
      setFeaturePrices(prev => ({
        ...prev,
        [addOn.id]: addOnPrice
      }));
    }

    // Update the total price immediately for a responsive UI
    if (isSelected) {
      // If add-on is already selected, we're removing it, so subtract its price
      setTotalFeaturePrice(prevTotal => prevTotal - addOnPrice);
      console.log(`Removed add-on ${addOn.name} (ID: ${addOn.id}), price: ${addOnPrice}, new total: ${totalFeaturePrice - addOnPrice}`);
    } else {
      // If add-on is not selected, we're adding it, so add its price
      setTotalFeaturePrice(prevTotal => prevTotal + addOnPrice);
      console.log(`Added add-on ${addOn.name} (ID: ${addOn.id}), price: ${addOnPrice}, new total: ${totalFeaturePrice + addOnPrice}`);
    }
    console.log('===========================');

    // Update the selected add-ons list
    const newAddOns = isSelected
      ? selectedAddOns.filter((a) => a.id !== addOn.id)
      : [...selectedAddOns, addOn];

    onAddOnToggle(newAddOns);
  };

  const handleUsageUpdate = (
    id: number,
    value: string
  ) => {
    const newValue = Math.max(0, parseInt(value) || 0);
    const oldValue = usageQuantities[id] || 0;

    // Find the usage pricing item
    const usageItem = usagePricing.find(item => item.id === id);

    if (usageItem) {
      // Get the usage price from the featurePrices map or calculate it
      let usagePrice = featurePrices[id];

      // If the price is not in the map, calculate it and update the map
      if (usagePrice === undefined) {
        usagePrice = usageItem.multiCurrencyPrices && usageItem.multiCurrencyPrices[selectedCurrency]
          ? usageItem.multiCurrencyPrices[selectedCurrency]
          : usageItem.pricePerUnit;

        // Update the featurePrices map
        setFeaturePrices(prev => ({
          ...prev,
          [id]: usagePrice
        }));
      }

      const priceDifference = (newValue - oldValue) * usagePrice;

      // Update the total price
      setTotalFeaturePrice(prevTotal => prevTotal + priceDifference);
      console.log(`Updated usage ${usageItem.name} (ID: ${id}) from ${oldValue} to ${newValue}, price difference: ${priceDifference}, new total: ${totalFeaturePrice + priceDifference}`);
    }

    // Update the usage quantities
    onUsageChange({
      ...usageQuantities,
      [id]: newValue,
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
    // Use our dynamically calculated price that includes base price, features, support, and discounts
    const fullData = {
      selectedFeatures,
      selectedAddOns,
      usageQuantities,
      calculatedPrice: totalPrice, // Use our dynamically calculated price
      selectedCurrency,
      formData,
      planDiscount,
      supportLevel: selectedSupportIndex,
      supportPrice,
    };

    // Log detailed price breakdown
    console.log('Package data saved:', fullData);
    console.log(`Final price calculation breakdown:
    - Base price: ${basePrice}
    - Features total: ${totalFeaturePrice}
    - Support price: ${supportPrice}
    - Subtotal: ${basePrice + totalFeaturePrice + supportPrice}
    - Discount (${planDiscount * 100}%): -${(basePrice + totalFeaturePrice + supportPrice) * planDiscount}
    - Final total: ${totalPrice}
    - Currency: ${selectedCurrency}`);

    setTestPeriod(selectedPackage.testPeriodDays);
    onSave(fullData);
    onNext();
  };

  const getCurrencySymbol = (
    currency: string
  ) => {
    if (currency === 'ZAR') {
      return 'R';
    } else if (currency === 'Kz') {
      return 'Kz';
    } else {
      const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        ZAR: 'R',
        Kz: 'Kz',
      };
      return symbols[currency] || currency;
    }
  };

  const getCurrentCurrencySymbol = () => {
    return currencySymbol;
  };

  const convertPrice = (
    price: number
  ): number => {
    if (selectedCurrency !== 'USD') {
      return price * rate;
    }
    return price;
  };

  const formatPrice = (
    currency: string,
    price: number
  ) => {
    let displayPrice = price;
    console.log(`DEBUG - formatPrice called with currency: ${currency}, price: ${price}`);

    if (
      currency !== 'USD' &&
      selectedPackage.currency === 'USD'
    ) {
      let multiCurrency: Record<
        string,
        number
      > | null = null;
      if (selectedPackage.multiCurrencyPrices) {
        try {
          multiCurrency = JSON.parse(
            selectedPackage.multiCurrencyPrices
          );
          console.log(`DEBUG - multiCurrencyPrices parsed:`, multiCurrency);

          if (
            multiCurrency &&
            multiCurrency[currency]
          ) {
            displayPrice =
              multiCurrency[currency];
            console.log(`DEBUG - Using multiCurrency price: ${displayPrice}`);
          } else {
            displayPrice = price * rate;
            console.log(`DEBUG - Using rate conversion: ${price} * ${rate} = ${displayPrice}`);
          }
        } catch (e) {
          console.error(
            'Error parsing multiCurrencyPrices:',
            e
          );

          displayPrice = price * rate;
          console.log(`DEBUG - Error in parsing, using rate conversion: ${price} * ${rate} = ${displayPrice}`);
        }
      } else {
        displayPrice = price * rate;
        console.log(`DEBUG - No multiCurrencyPrices, using rate conversion: ${price} * ${rate} = ${displayPrice}`);
      }
    } else {
      console.log(`DEBUG - No conversion needed, using original price: ${displayPrice}`);
    }

    let result;
    if (currency === 'Kz') {
      result = `${Math.round(displayPrice)}${currency}`;
    } else {
      result = `${getCurrencySymbol(currency)} ${formatCurrencyPrice(displayPrice)}`;
    }

    console.log(`DEBUG - Final formatted price: ${result}`);
    return result;
  };

  const handleCheckboxChange = (id: string) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePlanSelect = (index: number) => {
    // Define discount percentages for each plan
    const planDiscounts = [
      0,      // Monthly Plan - no discount
      0.10,   // Quarterly Plan - 10% discount
      0.15,   // Biannual Plan - 15% discount
      0.20,   // Annual Plan - 20% discount
      0       // Enterprise Plan - custom pricing, no standard discount
    ];

    if (selectedPlanIndex === index) {
      // If deselecting the current plan, reset to no discount
      setSelectedPlanIndex(null);
      setPlanDiscount(0);
      console.log(`Payment plan deselected. Discount reset to 0%`);
    } else {
      // If selecting a new plan, apply the corresponding discount
      setSelectedPlanIndex(index);
      const newDiscount = index < planDiscounts.length ? planDiscounts[index] : 0;
      setPlanDiscount(newDiscount);

      // Calculate and log the price impact
      const subtotal = basePrice + totalFeaturePrice + supportPrice;
      const discountAmount = subtotal * newDiscount;
      const newTotal = subtotal - discountAmount;

      console.log(`Payment plan selected: ${index} (${['Monthly', 'Quarterly', 'Biannual', 'Annual', 'Enterprise'][index]})`);
      console.log(`Discount applied: ${newDiscount * 100}%`);
      console.log(`Price impact: -${discountAmount} (${subtotal} → ${newTotal})`);
    }
  };

  const handleSupportSelect = (index: number) => {
    // Define support price multipliers for each support level
    // Standard support (index 0) is included, Premium (index 1) is +20%, Advanced (index 2) is +40%
    const supportMultipliers = [0, 0.2, 0.4];

    if (selectedSupportIndex === index) {
      // If deselecting the current support level, reset to no additional cost
      setSelectedSupportIndex(null);
      setSupportPrice(0);
      console.log(`Support level deselected. Additional support cost reset to 0`);
    } else {
      // If selecting a new support level, apply the corresponding price
      setSelectedSupportIndex(index);

      // Calculate the base price for support based on the package and features
      const baseForSupport = basePrice + totalFeaturePrice;
      const multiplier = index < supportMultipliers.length ? supportMultipliers[index] : 0;
      const newSupportPrice = baseForSupport * multiplier;

      setSupportPrice(newSupportPrice);

      // Calculate and log the price impact
      console.log(`Support level selected: ${index} (${['Standard', 'Premium', 'Advanced'][index]})`);
      console.log(`Support price multiplier: ${multiplier * 100}% of base package`);
      console.log(`Support price calculation: ${baseForSupport} × ${multiplier} = ${newSupportPrice}`);
      console.log(`New total with support: ${basePrice + totalFeaturePrice + newSupportPrice}`);
    }
  };

  const handleEnterpriseFeatureToggle = (
    featureName: string,
    category: string
  ) => {
    if (!onEnterpriseFeatureToggle) return;
    if (
      enterpriseFeatures &&
      enterpriseFeatures[featureName]
    ) {
      onEnterpriseFeatureToggle(featureName);
      return;
    }
    if (
      activeEnterpriseCategory !== null &&
      activeEnterpriseCategory !== category
    ) {
      return;
    }
    onEnterpriseFeatureToggle(featureName);
  };
  const isEnterpriseFeatureDisabled = (
    category: string
  ) => {
    return (
      activeEnterpriseCategory !== null &&
      activeEnterpriseCategory !== category
    );
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
              sx={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#173a79',
              }}
            >
              {isCustomizable
                ? 'Customize Your Package'
                : 'Package Details'}
            </Typography>
            <Typography
              variant="body1"
              className={
                styles.packageDescription
              }
            >
              {formattedDescription}
            </Typography>

            <Box className={styles.priceDisplay}>
              <Typography variant="h5">
                Base Price:{' '}
                {formatPrice(
                  selectedCurrency,
                  displayPrice
                )}
              </Typography>

              {isCustomizable && (
                <Box className={styles.currentPriceContainer}>
                  <Typography variant="h5" className={styles.currentPrice}>
                    Current Total: {formatPrice(selectedCurrency, totalPrice)}
                  </Typography>
                  <Typography variant="body2" className={styles.priceNote}>
                    *Price updates as you select or deselect features
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2563eb', mt: 1 }}>
                    Base: {formatPrice(selectedCurrency, displayPrice)} +
                    Features: {formatPrice(selectedCurrency, totalFeaturePrice)}
                    {supportPrice > 0 && ` + Support: ${formatPrice(selectedCurrency, supportPrice)}`}
                    {planDiscount > 0 && ` - Discount: ${formatPrice(selectedCurrency, (basePrice + totalFeaturePrice + supportPrice) * planDiscount)}`}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                overflowY: 'auto',
                maxHeight: '400px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <Box
                className={styles.featuresTable}
              >
                <Box
                  className={styles.tableHeader}
                >
                  <Box
                    className={
                      styles.featureColumn
                    }
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
                    className={
                      styles.featureColumn
                    }
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
                        backgroundColor:
                          '#2563eb',
                        '&:hover': {
                          backgroundColor:
                            '#1d4ed8',
                        },
                      }}
                      startIcon={
                        <FaCalendarAlt />
                      }
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
                        minWidth: '60px',
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
                      yrs
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
                        minWidth: '60px',
                        borderColor: '#e2e8f0',
                        flexWrap: 'nowrap',
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
                      2yrs
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

                {/* Dynamic Add-on Features Table */}
                {addOns.map((addOn) => {
                  // Generate unique IDs for each checkbox based on add-on ID and plan type
                  const businessKey = `business-${addOn.id}`;
                  const startupKey = `startup-${addOn.id}`;
                  const personalKey = `personal-${addOn.id}`;

                  // Get the add-on price from the featurePrices map or calculate it
                  const addOnPrice = featurePrices[addOn.id] ||
                    (addOn.multiCurrencyPrices && addOn.multiCurrencyPrices[selectedCurrency]
                      ? addOn.multiCurrencyPrices[selectedCurrency]
                      : addOn.price);

                  return (
                    <Box className={styles.tableRow} key={addOn.id}>
                      <Box className={styles.featureColumn}>
                        {addOn.name}
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.7rem' }}>
                          {formatPrice(selectedCurrency, addOnPrice)}
                        </Typography>
                      </Box>
                      <Box
                        className={styles.planColumn}
                        data-label="Business"
                        sx={{
                          backgroundColor: checkboxStates[businessKey]
                            ? 'rgba(76, 175, 80, 0.1)'
                            : 'transparent',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        <Checkbox
                          checked={checkboxStates[businessKey] || false}
                          onChange={() => handleCheckboxChange(businessKey)}
                        />
                      </Box>
                      <Box
                        className={styles.planColumn}
                        data-label="Startup"
                        sx={{
                          backgroundColor: checkboxStates[startupKey]
                            ? 'rgba(76, 175, 80, 0.1)'
                            : 'transparent',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        <Checkbox
                          checked={checkboxStates[startupKey] || false}
                          onChange={() => handleCheckboxChange(startupKey)}
                        />
                      </Box>
                      <Box
                        className={styles.planColumn}
                        data-label="Personal"
                        sx={{
                          backgroundColor: checkboxStates[personalKey]
                            ? 'rgba(76, 175, 80, 0.1)'
                            : 'transparent',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        <Checkbox
                          checked={checkboxStates[personalKey] || false}
                          onChange={() => handleCheckboxChange(personalKey)}
                        />
                      </Box>
                    </Box>
                  );
                })}
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
                onClick={handleSave}
                disabled={
                  loading ||
                  (isCustomizable && selectedFeatures.length === 0)
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
                        className={`${styles.featureItem} ${
                          isSelected
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
                                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                    <span>{feature.name}</span>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        color: '#2563eb',
                                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        marginLeft: '8px'
                                      }}
                                    >
                                      {formatPrice(
                                        selectedCurrency,
                                        featurePrice
                                      )}
                                    </Typography>
                                  </Box>
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

              {/* Continue button with current price */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 3,
                  pt: 2,
                  borderTop: '1px solid #e2e8f0'
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onNext}
                  disabled={selectedFeatures.length === 0}
                  sx={{
                    minWidth: '200px',
                    backgroundColor: '#2563eb',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Continue
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginLeft: '8px'
                    }}
                  >
                    {formatPrice(selectedCurrency, totalPrice)}
                  </Typography>
                </Button>
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
                {/* Base price row */}
                <Box
                  className={styles.billingItem}
                  sx={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '12px 16px',
                  }}
                >
                  <Typography
                    className={styles.itemLabel}
                    sx={{ fontWeight: 600 }}
                  >
                    Base Package
                  </Typography>
                  <Typography
                    className={styles.itemPrice}
                    sx={{ fontWeight: 600 }}
                  >
                    {formatPrice(
                      selectedCurrency,
                      basePrice
                    )}
                  </Typography>
                </Box>

                {/* Selected features */}
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
                      backgroundColor: '#ffffff',
                      padding: '12px 16px',
                      fontStyle: 'italic',
                      color: '#64748b',
                    }}
                  >
                    <Typography
                      className={styles.itemLabel}
                    >
                      No features selected
                    </Typography>
                    <Typography
                      className={styles.itemPrice}
                    >
                      {formatPrice(selectedCurrency, 0)}
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

                {/* Total price row */}
                <Box
                  className={styles.totalContainer}
                  sx={{
                    backgroundColor: '#f1f5f9',
                    padding: '16px',
                    borderRadius: '0 0 8px 8px',
                    marginTop: '16px',
                    borderTop: '2px solid #e2e8f0',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    className={styles.totalLabel}
                    sx={{ fontWeight: 600, fontSize: '1.1rem' }}
                  >
                    Total
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className={styles.totalPrice}
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      color: '#2563eb'
                    }}
                  >
                    {formatPrice(
                      selectedCurrency,
                      totalPrice
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      case 'Choose Add-Ons':
        console.log('===== RENDERING ADD-ONS SECTION =====');
        console.log('Total AddOns available:', addOns.length);
        console.log('Currently selected AddOns:', selectedAddOns);
        console.log('Selected currency:', selectedCurrency);

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
                console.log(`Rendering AddOn ID ${addOn.id}:`, addOn);
                console.log('  Currency:', addOn.currency);
                console.log('  MultiCurrencyPrices:', addOn.multiCurrencyPrices);
                console.log('  Category:', addOn.category);
                console.log('  IsActive:', addOn.isActive);

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
                console.log(`  Calculated price for currency ${selectedCurrency}:`, addOnPrice);
                return (
                  <Box
                    key={addOn.id}
                    className={`${styles.featureItem} ${
                      isSelected
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
                      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                        <Box display="flex" alignItems="center">
                          {addOn.icon && (
                            <Box
                              component="span"
                              sx={{
                                mr: 1,
                                display: 'flex',
                                alignItems: 'center',
                                color: isSelected ? 'white' : '#2563eb'
                              }}
                            >
                              {/* Display icon if it's a known icon name */}
                              {addOn.icon === 'analytics_icon' && <BarChartIcon fontSize="small" />}
                              {addOn.icon === 'api_icon' && <CodeIcon fontSize="small" />}
                              {addOn.icon === 'branding_icon' && <BrushIcon fontSize="small" />}
                              {addOn.icon === 'support_icon' && <SupportAgentIcon fontSize="small" />}
                              {addOn.icon === 'migration_icon' && <StorageIcon fontSize="small" />}
                              {/* If it's not a known icon, don't display anything */}
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
                            marginLeft: '8px'
                          }}
                        >
                          {formatPrice(selectedCurrency, addOnPrice)}
                        </Typography>
                      </Box>
                    </Button>
                    {isSelected && (
                      <Box
                        className={
                          styles.featureDescriptionContainer
                        }
                        sx={{ flexDirection: 'column', gap: '12px' }}
                      >
                        <Box display="flex" alignItems="flex-start">
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

                        {/* Display features if available */}
                        {addOn.features && addOn.features.length > 0 && (
                          <Box sx={{ ml: 4, mt: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Features:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                              {Array.isArray(addOn.features) ?
                                addOn.features.map((feature, idx) => (
                                  <Typography key={idx} component="li" variant="body2" sx={{ mb: 0.5 }}>
                                    {feature}
                                  </Typography>
                                )) :
                                JSON.parse(addOn.features as string).map((feature: string, idx: number) => (
                                  <Typography key={idx} component="li" variant="body2" sx={{ mb: 0.5 }}>
                                    {feature}
                                  </Typography>
                                ))
                              }
                            </Box>
                          </Box>
                        )}

                        {/* Display dependencies if available */}
                        {addOn.dependencies && addOn.dependencies.length > 0 && (
                          <Box sx={{ ml: 4, mt: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Requirements:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                              {Array.isArray(addOn.dependencies) ?
                                addOn.dependencies.map((dep, idx) => (
                                  <Typography key={idx} component="li" variant="body2" sx={{ mb: 0.5 }}>
                                    {dep}
                                  </Typography>
                                )) :
                                JSON.parse(addOn.dependencies as string).map((dep: string, idx: number) => (
                                  <Typography key={idx} component="li" variant="body2" sx={{ mb: 0.5 }}>
                                    {dep}
                                  </Typography>
                                ))
                              }
                            </Box>
                          </Box>
                        )}
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

            {/* Continue button with current price */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3,
                pt: 2,
                borderTop: '1px solid #e2e8f0'
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={onNext}
                sx={{
                  minWidth: '200px',
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Continue
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginLeft: '8px'
                  }}
                >
                  {formatPrice(selectedCurrency, totalPrice)}
                </Typography>
              </Button>
            </Box>
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
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography
                        variant="subtitle1"
                      >
                        {usage.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#2563eb',
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          marginLeft: '8px'
                        }}
                      >
                        {formatPrice(selectedCurrency, usagePrice)}/{usage.unit}
                      </Typography>
                    </Box>
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
                      // Use inputProps directly instead of InputProps
                      inputProps={{
                        min: usage.minValue,
                        max: usage.maxValue,
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

            {/* Continue button with current price */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3,
                pt: 2,
                borderTop: '1px solid #e2e8f0'
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={onNext}
                sx={{
                  minWidth: '200px',
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Continue
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginLeft: '8px'
                  }}
                >
                  {formatPrice(selectedCurrency, totalPrice)}
                </Typography>
              </Button>
            </Box>
          </Box>
        );
      case 'Select Payment Plan':
        return (
          <Box
            sx={{
              width: '100%',
              p: { xs: 1, sm: 2 },
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  mb: 1,
                  borderBottom:
                    '1px solid #f1f5f9',
                  paddingBottom: '0.5rem',
                }}
              >
                Select Payment Plan
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  mb: 1,
                }}
              >
                Choose your preferred payment plan
              </Typography>
            </Box>
            <Box
              className={
                styles.paymentPlansContainer
              }
            >
              {[
                {
                  title: 'Monthly Plan',
                  description:
                    'Pay monthly for maximum flexibility',
                  price:
                    getCurrentCurrencySymbol() +
                    formatCurrencyPrice(
                      convertPrice(
                        basePrice + totalFeaturePrice + supportPrice
                      )
                    ) +
                    '/month',
                  features: [
                    'Monthly Billing',
                    'No Commitment',
                    'Easy Upgrade',
                  ],
                  buttonText: 'SELECT PLAN',
                  discount: 0,
                  period: 1,
                },
                {
                  title: 'Quarterly Plan',
                  description:
                    'Save 10% with quarterly billing',
                  price:
                    getCurrentCurrencySymbol() +
                    formatCurrencyPrice(
                      convertPrice(
                        (basePrice + totalFeaturePrice + supportPrice) * 0.9
                      )
                    ) +
                    '/month',
                  totalPrice:
                    getCurrentCurrencySymbol() +
                    formatCurrencyPrice(
                      convertPrice(
                        (basePrice + totalFeaturePrice + supportPrice) * 3 * 0.9
                      )
                    ) +
                    ' total',
                  features: [
                    '10% Discount',
                    'Quarterly Reviews',
                    'Email Support',
                  ],
                  buttonText: 'SELECT PLAN',
                  discount: 0.1,
                  period: 3,
                },
                {
                  title: 'Biannual Plan',
                  description:
                    'Save 15% with biannual billing',
                  price:
                    getCurrentCurrencySymbol() +
                    formatCurrencyPrice(
                      convertPrice(
                        (basePrice + totalFeaturePrice + supportPrice) * 0.85
                      )
                    ) +
                    '/month',
                  totalPrice:
                    getCurrentCurrencySymbol() +
                    formatCurrencyPrice(
                      convertPrice(
                        (basePrice + totalFeaturePrice + supportPrice) * 6 * 0.85
                      )
                    ) +
                    ' total',
                  features: [
                    '15% Discount',
                    'Flexible Billing',
                    'Mid-term Adjustments',
                  ],
                  buttonText: 'SELECT PLAN',
                  discount: 0.15,
                  period: 6,
                },
                {
                  title: 'Annual Plan',
                  description:
                    'Save 20% with annual billing',
                  price:
                    getCurrentCurrencySymbol() +
                    formatCurrencyPrice(
                      convertPrice(
                        (basePrice + totalFeaturePrice + supportPrice) * 0.8
                      )
                    ) +
                    '/month',
                  totalPrice:
                    getCurrentCurrencySymbol() +
                    formatCurrencyPrice(
                      convertPrice(
                        (basePrice + totalFeaturePrice + supportPrice) * 12 * 0.8
                      )
                    ) +
                    ' total',
                  features: [
                    '20% Discount',
                    'Priority Support',
                    'Free Setup',
                  ],
                  buttonText: 'SELECT PLAN',
                  discount: 0.2,
                  period: 12,
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
                  buttonText: 'SELECT PLAN',
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
                        ? 0.7
                        : 1,
                    pointerEvents:
                      selectedPlanIndex !==
                        null &&
                      selectedPlanIndex !== index
                        ? 'none'
                        : 'auto',
                  }}
                >
                  <Typography
                    className={
                      styles.paymentTitle
                    }
                  >
                    {plan.title}
                  </Typography>
                  <Typography
                    className={
                      styles.paymentDescription
                    }
                  >
                    {plan.description}
                  </Typography>
                  <Box className={styles.paymentPriceContainer}>
                    <Typography
                      className={
                        styles.paymentPrice
                      }
                    >
                      {plan.price}
                    </Typography>
                    {plan.totalPrice && (
                      <Typography
                        className={styles.paymentTotalPrice}
                        sx={{
                          fontSize: '0.85rem',
                          color: '#6B7280',
                          mt: 0.5
                        }}
                      >
                        {plan.totalPrice}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    className={
                      styles.paymentFeatures
                    }
                  >
                    {plan.features.map(
                      (feature, idx) => (
                        <Typography
                          key={idx}
                          component="li"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '&::before': {
                              content: '"✓"',
                              color: '#2563eb',
                              marginRight:
                                '0.5rem',
                              fontWeight: 'bold',
                            },
                          }}
                        >
                          {feature}
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
                    sx={{
                      backgroundColor:
                        selectedPlanIndex ===
                        index
                          ? '#15803d'
                          : '#2563eb',
                      '&:hover': {
                        backgroundColor:
                          selectedPlanIndex ===
                          index
                            ? '#166534'
                            : '#1d4ed8',
                      },
                    }}
                  >
                    {selectedPlanIndex === index
                      ? 'SELECTED'
                      : plan.buttonText}
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
              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#173a79',
                  mb: 1,
                  mt: 2,
                }}
              >
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
                  sx={
                    selectedSupportIndex === 0
                      ? {
                          backgroundColor:
                            'green',
                        }
                      : {}
                  }
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
                    (basePrice + totalFeaturePrice) * 0.2
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
                  sx={
                    selectedSupportIndex === 1
                      ? {
                          backgroundColor:
                            'green',
                        }
                      : {}
                  }
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
                    (basePrice + totalFeaturePrice) * 0.4
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
                  sx={
                    selectedSupportIndex === 2
                      ? {
                          backgroundColor:
                            'green',
                        }
                      : {}
                  }
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
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#173a79',
                  mb: 1,
                  mt: 2,
                }}
              >
                Configure Enterprise Features
              </Typography>
              Customize your enterprise package
              with advanced features tailored for
              large businesses.
              {activeEnterpriseCategory && (
                <>
                  <Typography
                    variant="body2"
                    className={
                      styles.sectionDescription
                    }
                    sx={{ mb: 2 }}
                  >
                    Customize your enterprise
                    package with advanced features
                    tailored for large businesses.
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: '#059669',
                        fontWeight: 500,
                        mr: 1,
                        fontSize: '0.875rem',
                      }}
                    >
                      Category selected:{' '}
                      <strong>
                        {activeEnterpriseCategory}
                      </strong>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleInfoClick}
                      sx={{ color: '#059669' }}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    aria-labelledby="enterprise-category-dialog-title"
                    maxWidth="xs"
                    fullWidth
                  >
                    <DialogTitle
                      id="enterprise-category-dialog-title"
                      sx={{
                        backgroundColor:
                          '#F9FAFB',
                        borderBottom:
                          '1px solid #E5E7EB',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#173a79',
                      }}
                    >
                      Enterprise Feature Selection
                    </DialogTitle>
                    <DialogContent
                      sx={{ pt: 2, mt: 1 }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ mb: 2 }}
                      >
                        You&apos;ve selected
                        features from the{' '}
                        <strong>
                          {
                            activeEnterpriseCategory
                          }
                        </strong>{' '}
                        category.
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#4B5563',
                          mb: 2,
                        }}
                      >
                        Our enterprise packages
                        allow one category
                        selection at a time to
                        ensure optimal system
                        performance and
                        compatibility.
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#4B5563' }}
                      >
                        To explore other
                        categories, please
                        deselect your current
                        selections first.
                      </Typography>
                    </DialogContent>
                    <DialogActions
                      sx={{
                        borderTop:
                          '1px solid #E5E7EB',
                        p: 2,
                      }}
                    >
                      <Button
                        onClick={
                          handleDialogClose
                        }
                        variant="contained"
                        sx={{
                          backgroundColor:
                            '#173a79',
                          '&:hover': {
                            backgroundColor:
                              '#0F2A5C',
                          },
                        }}
                      >
                        Got it
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
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
                sx={{
                  opacity:
                    isEnterpriseFeatureDisabled(
                      'analytics'
                    )
                      ? 0.5
                      : 1,
                }}
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
                          handleEnterpriseFeatureToggle(
                            'realTimeAnalytics',
                            'analytics'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'analytics'
                        )}
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
                          handleEnterpriseFeatureToggle(
                            'customReports',
                            'analytics'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'analytics'
                        )}
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
                          handleEnterpriseFeatureToggle(
                            'dataExport',
                            'analytics'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'analytics'
                        )}
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
                sx={{
                  opacity:
                    isEnterpriseFeatureDisabled(
                      'multiLocation'
                    )
                      ? 0.5
                      : 1,
                }}
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
                          handleEnterpriseFeatureToggle(
                            'centralizedManagement',
                            'multiLocation'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'multiLocation'
                        )}
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
                          handleEnterpriseFeatureToggle(
                            'locationSettings',
                            'multiLocation'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'multiLocation'
                        )}
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
                          handleEnterpriseFeatureToggle(
                            'crossLocationInventory',
                            'multiLocation'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'multiLocation'
                        )}
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
                sx={{
                  opacity:
                    isEnterpriseFeatureDisabled(
                      'security'
                    )
                      ? 0.5
                      : 1,
                }}
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
                          handleEnterpriseFeatureToggle(
                            'roleBasedAccess',
                            'security'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'security'
                        )}
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
                          handleEnterpriseFeatureToggle(
                            'advancedEncryption',
                            'security'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'security'
                        )}
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
                          handleEnterpriseFeatureToggle(
                            'auditLogging',
                            'security'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'security'
                        )}
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
                sx={{
                  opacity:
                    isEnterpriseFeatureDisabled(
                      'api'
                    )
                      ? 0.5
                      : 1,
                }}
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
                          handleEnterpriseFeatureToggle(
                            'restfulApi',
                            'api'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'api'
                        )}
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
                          handleEnterpriseFeatureToggle(
                            'webhookNotifications',
                            'api'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'api'
                        )}
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
                          handleEnterpriseFeatureToggle(
                            'customIntegration',
                            'api'
                          )
                        }
                        disabled={isEnterpriseFeatureDisabled(
                          'api'
                        )}
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
                  variant="h5"
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#173a79',
                    mb: 1,
                    mt: 2,
                  }}
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
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#173a79',
                      mb: 1,
                      mt: 2,
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
                      Price Breakdown
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
                      {/* Base Price */}
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
                          }}
                        >
                          Base Price
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
                          {`${getCurrencySymbol(selectedCurrency)} ${formatCurrencyPrice(basePrice)}`}
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

                      {/* Features Total */}
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
                          }}
                        >
                          Features Total
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
                          {`${getCurrencySymbol(selectedCurrency)} ${formatCurrencyPrice(totalFeaturePrice)}`}
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

                      {/* Support Price */}
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
                          }}
                        >
                          Support Price
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
                          {`${getCurrencySymbol(selectedCurrency)} ${formatCurrencyPrice(supportPrice)}`}
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

                      {/* Subtotal */}
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
                            fontWeight: 600,
                          }}
                        >
                          Subtotal (Before Discount)
                        </Typography>
                        <Typography
                          className={
                            styles.itemValue
                          }
                          sx={{
                            fontSize: '0.95rem',
                            fontWeight: 600,
                          }}
                        >
                          {`${getCurrencySymbol(selectedCurrency)} ${formatCurrencyPrice(basePrice + totalFeaturePrice + supportPrice)}`}
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
                      Discount & Final Price
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {planDiscount > 0 ? 'Plan Discount' : 'No Discount Applied'}
                          {planDiscount > 0 && (
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
                              {planDiscount * 100}% Off
                            </span>
                          )}
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
                          {`${getCurrencySymbol(selectedCurrency)} ${formatCurrencyPrice((basePrice + totalFeaturePrice + supportPrice) * planDiscount)}`}
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

                      <Box
                        className={styles.divider}
                        sx={{
                          height: '1px',
                          backgroundColor:
                            '#E5E7EB',
                          my: 2,
                        }}
                      />

                      {/* Final Total Price */}
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
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#1a1a1a',
                          }}
                        >
                          Final Total
                        </Typography>
                        <Typography
                          className={
                            styles.itemValue
                          }
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#2563eb',
                          }}
                        >
                          {`${getCurrencySymbol(selectedCurrency)} ${formatCurrencyPrice(totalPrice)}`}
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
                    sx={{ mb: 3 }}
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
                        {`${getCurrencySymbol(selectedCurrency)} ${formatCurrencyPrice(totalPrice)}`}
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
                        {`${getCurrencySymbol(selectedCurrency)} ${formatCurrencyPrice((basePrice + totalFeaturePrice + supportPrice) * planDiscount * 12)}`}
                        /year
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        width: '100%',
                        mt: 4,
                      }}
                    >
                      <Button
                        className={
                          styles.btnControlsBack
                        }
                        variant="outlined"
                        onClick={handleBack}
                        disabled={
                          currentStep === 0 ||
                          backLoading
                        }
                      >
                        {backLoading ? (
                          <CircularProgress
                            size={20}
                          />
                        ) : (
                          'Back'
                        )}
                      </Button>
                      <Button
                        className={
                          styles.btnControlsNext
                        }
                        variant="contained"
                        onClick={() => {
                          handleNext();
                          if (
                            onShowSuccessMessage
                          ) {
                            const packageData = {
                              formData,
                              selectedFeatures,
                              selectedAddOns,
                              usageQuantities,
                              calculatedPrice: totalPrice, // Use our dynamically calculated price
                              selectedCurrency,
                              planDiscount,
                              supportLevel: selectedSupportIndex,
                              supportPrice,
                            };

                            onShowSuccessMessage(
                              'Package successfully configured! Proceed with payment.',
                              packageData
                            );
                          }
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress
                            size={20}
                          />
                        ) : (
                          'Confirm'
                        )}
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



  const isAnyEnterpriseFeatureSelected = () => {
    if (!enterpriseFeatures) return false;
    return Object.values(enterpriseFeatures).some(
      (value) => value === true
    );
  };

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
    <Card
      className={styles.container}
      elevation={0}
      sx={{ borderRadius: 0 }}
    >
      <CardContent
        sx={{
          padding: { xs: '1rem', sm: '1.5rem' },
          '&:last-child': {
            paddingBottom: {
              xs: '1rem',
              sm: '1.5rem',
            },
          },
        }}
      >
        <div className={styles.stepperWrapper}>
          <Stepper
            activeStep={currentStep}
            alternativeLabel
            className={styles.stepperContainer}
            sx={{
              borderBottom: 'none',
              '& .MuiStepConnector-line': {
                borderColor: '#e2e8f0',
                borderTopWidth: '1px',
              },
            }}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>
                {label || `Step ${index + 1}`}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        </div>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
