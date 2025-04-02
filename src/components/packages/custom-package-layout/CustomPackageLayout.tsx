"use client";

import React, { useState, useEffect } from "react";
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
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { motion } from "framer-motion";
import InfoIcon from "@mui/icons-material/Info";
import styles from "./CustomPackageLayout.module.css";
import { Feature, AddOn, CustomPackageLayoutProps } from "./types";
import { useTestPeriod } from "@/contexts/TestPeriodContext";
import { FaCheck } from "react-icons/fa";
import Link from "next/link";

const countries = ["USA", "Canada", "UK", "Australia"];
const states = ["California", "Texas", "New York", "Florida"];

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
  setSelectedCurrency,
  enterpriseFeatures,
  onEnterpriseFeatureToggle,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>("USD");
  const { setTestPeriod } = useTestPeriod();
  const [totalFeaturePrice, setTotalFeaturePrice] = useState<number>(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
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

  const handleNext = () => {
    setLoading(true);
    onNext();
    setLoading(false);
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
    console.log("Package data saved:", fullData);
    setTestPeriod(selectedPackage.testPeriodDays);
    onSave(fullData);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "Kz":
        return "Kz";
      default:
        return currency;
    }
  };

  const formatPrice = (currency: string, price: number) => {
    const roundedPrice = Math.round(price);
    return currency === "Kz"
      ? `${roundedPrice}${currency}`
      : `${getCurrencySymbol(currency)} ${roundedPrice}`;
  };

  const getStepContent = () => {
    const currentLabel = steps[currentStep]?.trim() || "";

    if (!currentLabel) {
      return (
        <Typography variant="body1">
          Loading step configuration...
        </Typography>
      );
    }

    switch (currentLabel) {
      case "Package Details":
        let multiCurrencyPrices: Record<string, number> = {};
        try {
          if (selectedPackage?.multiCurrencyPrices) {
            multiCurrencyPrices = JSON.parse(selectedPackage.multiCurrencyPrices);
          } else {
            multiCurrencyPrices = { [selectedCurrency]: basePrice };
          }
        } catch (error) {
          console.error("Error parsing multiCurrencyPrices:", error);
          multiCurrencyPrices = { [selectedCurrency]: basePrice };
        }

        const displayPrice = multiCurrencyPrices[selectedCurrency] || basePrice;
        const formattedDescription = packageDetails.description
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/business needs/g, "business needs.");
        return (
          <Box
            className={styles.packageDetails}
            sx={{
              maxHeight: "600px",
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .${styles.packageDetails}::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <Box className={styles.detailItem}>
              <Typography variant="h5">{packageDetails.title}</Typography>
            </Box>
            <Box className={styles.detailItem}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {formattedDescription}
              </Typography>
            </Box>
            <Box className={styles.detailItem}>
              <Typography variant="h6">
                {isCustomizable ? (
                  <>
                    Base Price:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {formatPrice(selectedCurrency, displayPrice)}
                    </span>
                    /pm
                  </>
                ) : (
                  <>
                    Price:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {formatPrice(selectedCurrency, displayPrice)}
                    </span>
                    /pm
                  </>
                )}
              </Typography>
            </Box>
            <Box className={styles.currencyContainer}>
              <Typography variant="body2" className={styles.currencyLabel}>
                <b>Prices in other currencies:</b>
              </Typography>
              <Box className={styles.currencyOptions}>
                {Object.entries(multiCurrencyPrices).map(([currency, price]) => (
                  <Box key={currency} className={styles.currencyItem}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedCurrency === currency}
                          onChange={() => {
                            setSelectedCurrency(currency);
                            setSelectedCurrencyState(currency);
                          }}
                        />
                      }
                      label={
                        currency === "Kz"
                          ? `${price}${currency}`
                          : `${getCurrencySymbol(currency)} ${price}`
                      }
                      className={styles.currencyItemPrice}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            <Box className={styles.testPeriodItem}>
              <Typography variant="body2">
                Test Period: {packageDetails.testPeriod} days
              </Typography>
            </Box>
            {/* Unique Next/Back controls for "Package Details" */}
            <Box className={styles.controls}>
              <Button
                className={styles.btnControlsBack}
                variant="outlined"
                onClick={onBack}
                disabled
              >
                Back
              </Button>
              <Button
                className={styles.btnControlsNext}
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Next"}
              </Button>
            </Box>
          </Box>
        );
      case "Select Core Features":
        return (
          <Box
            className={styles.container}
            sx={{
              maxHeight: "600px",
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
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
                        className={`${styles.featureItem} ${isSelected ? styles.selectedFeature : ""
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
                              <Box className={styles.featureDescriptionContainer}>
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
                          <Box sx={{ width: "379px", mt: 1 }}>
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
                            index % 2 === 0 ? "#3b82f65e" : "#ffffff",
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
                    sx={{ backgroundColor: "#3b82f65e" }}
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
                    Before proceeding to payment, please read and sign, agreeing to the{" "}
                    <Link
                      href="/path/to/user-agreement"
                      className={styles.userAgreementLink}
                    >
                      User agreement
                    </Link>
                  </Typography>
                </Box>
                <Box className={styles.totalContainer}>
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
                    {formatPrice(selectedCurrency, totalFeaturePrice)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      case "Choose Add-Ons":
        return (
          <Box className={styles.featuresContainer}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Choose Add-Ons</Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Select additional features to enhance your package. Each add-on comes
                with its own pricing.
              </Typography>
            </Box>
            {addOns.length > 0 ? (
              addOns.map((addOn) => {
                const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
                const addOnPrice = addOn.multiCurrencyPrices
                  ? addOn.multiCurrencyPrices[selectedCurrency]
                  : addOn.price;
                return (
                  <Box
                    key={addOn.id}
                    className={`${styles.featureItem} ${isSelected ? styles.selectedFeature : ""
                      }`}
                  >
                    <Button
                      className={styles.addOnsfeatureButton}
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => handleAddOnToggle(addOn)}
                    >
                      {addOn.name.replace(/[^a-zA-Z0-9 ]/g, "")} (
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
      case "Configure Usage":
        return (
          <Box className={styles.featuresContainer}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Configure Usage</Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Adjust the usage metrics to fit your business needs. Ensure the values
                are within the allowed range.
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
                    : "";
                return (
                  <Box key={usage.id} className={styles.usageItem}>
                    <Typography variant="subtitle1" gutterBottom>
                      {usage.name} ({formatPrice(selectedCurrency, usagePrice)}/
                      {usage.unit})
                    </Typography>
                    <TextField
                      type="number"
                      value={currentValue}
                      onChange={(e) => handleUsageUpdate(usage.id, e.target.value)}
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
                <Typography variant="h6">No usage metrics to configure</Typography>
                <Button variant="outlined" onClick={onNext}>
                  Continue
                </Button>
              </Box>
            )}
          </Box>
        );
      case "Select Payment Plan":
        return (
          <Box className={styles.featuresContainer}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Select Payment Plan</Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Choose your preferred payment plan. Select the option that best suits your needs.
              </Typography>
            </Box>
            <Box className={styles.paymentPlansContainer}>
              <Box className={styles.paymentPlanItem}>
                <Typography variant="h6">Monthly Plan</Typography>
                <Typography variant="body2" className={styles.paymentDescription}>
                  Pay monthly for maximum flexibility
                </Typography>
                <Typography variant="h5" className={styles.paymentPrice}>
                  {formatPrice(selectedCurrency, calculatedPrice)}/month
                </Typography>
                <Button
                  variant="contained"
                  className={styles.selectPlanButton}
                  onClick={onNext}
                >
                  Select Monthly Plan
                </Button>
              </Box>
              <Box className={styles.paymentPlanItem}>
                <Typography variant="h6">Annual Plan</Typography>
                <Typography variant="body2" className={styles.paymentDescription}>
                  Save 20% with annual billing
                </Typography>
                <Typography variant="h5" className={styles.paymentPrice}>
                  {formatPrice(selectedCurrency, calculatedPrice * 12 * 0.8)}/year
                </Typography>
                <Button
                  variant="contained"
                  className={styles.selectPlanButton}
                  onClick={onNext}
                >
                  Select Annual Plan
                </Button>
              </Box>
            </Box>
          </Box>
        );
      case "Choose Support Level":
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
                <Typography variant="body2" className={styles.supportDescription}>
                  Email support with 24-hour response time
                </Typography>
                <Box className={styles.supportFeatures}>
                  <Typography variant="body2">✓ Email Support</Typography>
                  <Typography variant="body2">✓ Knowledge Base Access</Typography>
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
              <Box className={styles.supportPlanItem}>
                <Typography variant="h6">Premium Support</Typography>
                <Typography variant="body2" className={styles.supportDescription}>
                  Priority support with 4-hour response time
                </Typography>
                <Box className={styles.supportFeatures}>
                  <Typography variant="body2">✓ 24/7 Priority Support</Typography>
                  <Typography variant="body2">✓ Dedicated Account Manager</Typography>
                  <Typography variant="body2">✓ Phone Support</Typography>
                  <Typography variant="body2">✓ Custom Training Sessions</Typography>
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
            </Box>
          </Box>
        );
      case "Configure Enterprise Features":
        return (
          <Box className={styles.featuresContainer}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#173a79" }}>
                Configure Enterprise Features
              </Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Customize your enterprise package with advanced features tailored for large businesses.
              </Typography>
            </Box>
            <Box className={styles.enterpriseFeaturesContainer}>
              <Box className={styles.enterpriseFeatureItem}>
                <Box className={styles.featureHeader}>
                  <Typography variant="h6">Advanced Analytics</Typography>
                  <Typography variant="body2" className={styles.featureDescription}>
                    Comprehensive reporting and analytics tools to gain deeper insights into your business operations
                  </Typography>
                </Box>
                <Box className={styles.featureOptions}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.realTimeAnalytics || false}
                        onChange={() => onEnterpriseFeatureToggle?.('realTimeAnalytics')}
                      />
                    }
                    label="Real-time Analytics Dashboard"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.customReports || false}
                        onChange={() => onEnterpriseFeatureToggle?.('customReports')}
                      />
                    }
                    label="Custom Reports Builder"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.dataExport || false}
                        onChange={() => onEnterpriseFeatureToggle?.('dataExport')}
                      />
                    }
                    label="Data Export & Integration"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.predictiveAnalytics || false}
                        onChange={() => onEnterpriseFeatureToggle?.('predictiveAnalytics')}
                      />
                    }
                    label="Predictive Analytics"
                  />
                </Box>
              </Box>
              <Box className={styles.enterpriseFeatureItem}>
                <Box className={styles.featureHeader}>
                  <Typography variant="h6">Multi-Location Management</Typography>
                  <Typography variant="body2" className={styles.featureDescription}>
                    Manage multiple business locations from a single dashboard with centralized control
                  </Typography>
                </Box>
                <Box className={styles.featureOptions}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.centralizedManagement || false}
                        onChange={() => onEnterpriseFeatureToggle?.('centralizedManagement')}
                      />
                    }
                    label="Centralized Management Console"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.locationSettings || false}
                        onChange={() => onEnterpriseFeatureToggle?.('locationSettings')}
                      />
                    }
                    label="Location-specific Settings"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.crossLocationInventory || false}
                        onChange={() => onEnterpriseFeatureToggle?.('crossLocationInventory')}
                      />
                    }
                    label="Cross-location Inventory Management"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.interLocationTransfers || false}
                        onChange={() => onEnterpriseFeatureToggle?.('interLocationTransfers')}
                      />
                    }
                    label="Inter-location Transfers"
                  />
                </Box>
              </Box>
              <Box className={styles.enterpriseFeatureItem}>
                <Box className={styles.featureHeader}>
                  <Typography variant="h6">Advanced Security</Typography>
                  <Typography variant="body2" className={styles.featureDescription}>
                    Enterprise-grade security features to protect your business data and operations
                  </Typography>
                </Box>
                <Box className={styles.featureOptions}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.roleBasedAccess || false}
                        onChange={() => onEnterpriseFeatureToggle?.('roleBasedAccess')}
                      />
                    }
                    label="Role-based Access Control"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.advancedEncryption || false}
                        onChange={() => onEnterpriseFeatureToggle?.('advancedEncryption')}
                      />
                    }
                    label="Advanced Encryption"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.auditLogging || false}
                        onChange={() => onEnterpriseFeatureToggle?.('auditLogging')}
                      />
                    }
                    label="Comprehensive Audit Logging"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.twoFactorAuth || false}
                        onChange={() => onEnterpriseFeatureToggle?.('twoFactorAuth')}
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                </Box>
              </Box>
              <Box className={styles.enterpriseFeatureItem}>
                <Box className={styles.featureHeader}>
                  <Typography variant="h6">API & Integration</Typography>
                  <Typography variant="body2" className={styles.featureDescription}>
                    Connect your POS system with other business applications and services
                  </Typography>
                </Box>
                <Box className={styles.featureOptions}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.restfulApi || false}
                        onChange={() => onEnterpriseFeatureToggle?.('restfulApi')}
                      />
                    }
                    label="RESTful API Access"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.webhookNotifications || false}
                        onChange={() => onEnterpriseFeatureToggle?.('webhookNotifications')}
                      />
                    }
                    label="Webhook Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.customIntegration || false}
                        onChange={() => onEnterpriseFeatureToggle?.('customIntegration')}
                      />
                    }
                    label="Custom Integration Support"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={enterpriseFeatures?.bulkDataImport || false}
                        onChange={() => onEnterpriseFeatureToggle?.('bulkDataImport')}
                      />
                    }
                    label="Bulk Data Import/Export"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        );
      case "Review & Confirm":
        return (
          <>
            <Grid container spacing={5}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
                  Enter Your Detail
                </Typography>
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 3.5,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
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
                  <Box sx={{ display: "flex", gap: 2 }}>
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
                  <Box sx={{ display: "flex", gap: 2 }}>
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
              </Grid>
              <Grid item xs={12} md={5}>
                <>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                    Order Summary
                  </Typography>
                  <Box className={styles.review}>
                    <Box className={styles.priceSummary}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Total Price: {formatPrice(selectedCurrency, calculatedPrice)}/mo
                      </Typography>
                      {isCustomizable && (
                        <Typography variant="body2">
                          (Base: {formatPrice(selectedCurrency, basePrice)} + Customizations:{" "}
                          {formatPrice(selectedCurrency, calculatedPrice - basePrice)})
                        </Typography>
                      )}
                    </Box>
                    {isCustomizable && (
                      <>
                        {selectedFeatures.length > 0 && (
                          <Box className={styles.section}>
                            <Typography variant="subtitle1">
                              Selected Features:
                            </Typography>
                            {selectedFeatures.map((f) => (
                              <Typography key={f.id}>
                                {f.name} ({formatPrice(selectedCurrency, f.basePrice)})
                              </Typography>
                            ))}
                          </Box>
                        )}
                        {selectedAddOns.length > 0 && (
                          <Box className={styles.section}>
                            <Typography variant="subtitle1">
                              Selected Add-Ons:
                            </Typography>
                            {selectedAddOns.map((a) => (
                              <Typography key={a.id}>
                                {a.name} ({formatPrice(selectedCurrency, a.price)})
                              </Typography>
                            ))}
                          </Box>
                        )}
                        {usagePricing.length > 0 && (
                          <Box className={styles.section}>
                            <Typography variant="subtitle1">
                              Usage Limits:
                            </Typography>
                            {usagePricing.map((u) => (
                              <Typography key={u.id}>
                                {u.name}: {usageQuantities[u.id]} {u.unit}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                  <Box className={styles.buttonContainer}>
                    <Button
                      variant="outlined"
                      className={styles.btnControlsBack}
                      onClick={onBack}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      className={styles.btnControlsNext}
                      onClick={handleSave}
                    >
                      Confirm
                    </Button>
                  </Box>
                </>
              </Grid>
            </Grid>
          </>
        );
      default:
        return (
          <Typography variant="body1">
            Unknown step configuration. Please contact support.
          </Typography>
        );
    }
  };

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
        {currentStep !== steps.length - 1 && currentStep !== 0 && (
          <Box className={styles.controls}>
            {currentStep > 0 && (
              <Button
                className={styles.btnControlsBack}
                variant="outlined"
                onClick={onBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button
                className={styles.btnControlsNext}
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Next"}
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(CustomPackageLayout);
