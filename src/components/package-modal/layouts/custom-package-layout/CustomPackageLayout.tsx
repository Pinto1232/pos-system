"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import InfoIcon from "@mui/icons-material/Info";
import styles from "./CustomPackageLayout.module.css";
import { Feature, AddOn, UsagePricing, Package } from "./types";
import { FaCheck } from "react-icons/fa";

interface CustomPackageLayoutProps {
  isCustomizable: boolean;
  currentStep: number;
  steps: string[];
  features: Feature[];
  addOns: AddOn[];
  usagePricing: UsagePricing[];
  selectedFeatures: Feature[];
  selectedAddOns: AddOn[];
  usageQuantities: Record<number, number>;
  basePrice: number;
  calculatedPrice: number;
  packageDetails: {
    title: string;
    description: string;
    testPeriod: number;
  };
  selectedPackage: Package;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  onFeatureToggle: (features: Feature[]) => void;
  onAddOnToggle: (addOns: AddOn[]) => void;
  onUsageChange: (quantities: Record<number, number>) => void;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
}

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
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>("USD");

  const handleNext = () => {
    setLoading(true);
    onNext();
    setLoading(false);
  };

  const handleFeatureToggle = (feature: Feature) => {
    const newFeatures = selectedFeatures.some(f => f.id === feature.id)
      ? selectedFeatures.filter(f => f.id !== feature.id)
      : [...selectedFeatures, feature];
    onFeatureToggle(newFeatures);
  };

  const handleAddOnToggle = (addOn: AddOn) => {
    const newAddOns = selectedAddOns.some(a => a.id === addOn.id)
      ? selectedAddOns.filter(a => a.id !== addOn.id)
      : [...selectedAddOns, addOn];
    onAddOnToggle(newAddOns);
  };

  const handleUsageUpdate = (id: number, value: string) => {
    onUsageChange({
      ...usageQuantities,
      [id]: Math.max(0, parseInt(value) || 0),
    });
  };

  const handleSave = () => {
    console.log("Package data saved:", {
      selectedFeatures,
      selectedAddOns,
      usageQuantities,
      calculatedPrice,
    });
    onSave();
  };

  const getStepContent = () => {
    const currentLabel = steps[currentStep]?.trim() || "";

    if (!currentLabel)
      return (
        <Typography variant="body1">
          Loading step configuration...
        </Typography>
      );

    switch (currentLabel) {
      case "Package Details":
        const multiCurrencyPrices = JSON.parse(selectedPackage.multiCurrencyPrices);
        const displayPrice = multiCurrencyPrices[selectedCurrency] || basePrice;
        const formattedDescription = packageDetails.description
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/business needs/g, 'business needs.');
        return (
          <Box className={styles.packageDetails} sx={{ maxHeight: '600px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
              <Typography variant="body1">{formattedDescription}</Typography>
            </Box>
            <Box className={styles.detailItem}>
              <Typography variant="h6">
                {isCustomizable
                  ? `Base Price: ${selectedCurrency} ${displayPrice}/mo`
                  : `Price: ${selectedCurrency} ${displayPrice}/mo`}
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
                      label={`${currency}: ${price}`}
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

          </Box>
        );

      case "Select Core Features":
        return (
          <Box className={styles.container}>
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
                    const isSelected = selectedFeatures.some((f) => f.id === feature.id);
                    const featurePrice = feature.multiCurrencyPrices
                      ? feature.multiCurrencyPrices[selectedCurrency]
                      : feature.basePrice;
                    return (
                      <Box
                        key={feature.id}
                        className={`${styles.featureItem} ${isSelected ? styles.selectedFeature : ""}`}
                      >
                        <Box>
                          <Typography className={styles.featureName}>Create Custom Plan</Typography>
                          <Typography variant="body2" className={styles.featureDescription}>Select the modules and features.</Typography>
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
                                  {`${feature.name} (${selectedCurrency} ${featurePrice})`}
                                  {isSelected && (
                                    <Typography variant="body2" className={styles.featureDescription} sx={{ marginLeft: 1 }}>
                                      Module Selected <FaCheck />
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


            <Box>  <Typography variant="h6" className={styles.title}>
              Purchase Summary
            </Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Brief summary of your purchase.
              </Typography>
              <Box className={styles.purchaseSummaryContainer}>
                {/* Repeated billing items */}
                <Box className={styles.billingItem}>
                  <Typography className={styles.itemLabel}>Billing Module</Typography>
                  <Typography className={styles.itemPrice}>$2,000.00</Typography>
                </Box>
                <Box className={styles.billingItem}>
                  <Typography className={styles.itemLabel}>Billing Module</Typography>
                  <Typography className={styles.itemPrice}>$2,000.00</Typography>
                </Box>

                <Divider className={styles.divider} />

                {/* User Agreement section */}
                <Box className={styles.userAgreement}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="User Agreement"
                  />
                  <Typography variant="body2" className={styles.userAgreementText}>
                    Before proceeding to payment, please read and sign, agreeing to the User Agreement
                  </Typography>
                </Box>

                {/* Total */}
                <Box className={styles.totalContainer}>
                  <Typography variant="subtitle1" className={styles.totalLabel}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" className={styles.totalPrice}>
                    R2.000,00
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
                Select additional features to enhance your package. Each add-on comes with its own pricing.
              </Typography>
            </Box>
            {addOns.length > 0 ? (
              addOns.map(addOn => {
                const isSelected = selectedAddOns.some(a => a.id === addOn.id);
                const addOnPrice = addOn.multiCurrencyPrices ? addOn.multiCurrencyPrices[selectedCurrency] : addOn.price;
                return (
                  <Box key={addOn.id} className={`${styles.featureItem} ${isSelected ? styles.selectedFeature : ""}`}>
                    <Button
                      fullWidth
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => handleAddOnToggle(addOn)}
                    >
                      {addOn.name.replace(/[^a-zA-Z0-9 ]/g, "")} ({selectedCurrency} {addOnPrice})
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
                Adjust the usage metrics to fit your business needs. Ensure the values are within the allowed range.
              </Typography>
            </Box>
            {usagePricing.length > 0 ? (
              usagePricing.map(usage => {
                const currentValue = usageQuantities[usage.id] ?? usage.defaultValue;
                const usagePrice = usage.multiCurrencyPrices ? usage.multiCurrencyPrices[selectedCurrency] : usage.pricePerUnit;
                const usageError =
                  currentValue < usage.minValue || currentValue > usage.maxValue
                    ? `Value must be between ${usage.minValue} and ${usage.maxValue}`
                    : "";
                return (
                  <Box key={usage.id} className={styles.usageItem}>
                    <Typography variant="subtitle1" gutterBottom>
                      {usage.name} ({selectedCurrency} {usagePrice}/{usage.unit})
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

      case "Review & Confirm":
        return (
          <Box className={styles.review} >
            <Typography variant="h5">Your Order Summary</Typography>
            <Box className={styles.priceSummary}>
              <Typography variant="h6">
                Total Price: {selectedCurrency} {calculatedPrice}/mo
              </Typography>
              {isCustomizable && (
                <Typography variant="body2">
                  (Base: {selectedCurrency} {basePrice.toFixed(2)} + Customizations: {selectedCurrency} {(calculatedPrice - basePrice).toFixed(2)})
                </Typography>
              )}
            </Box>
            {isCustomizable && (
              <>
                {selectedFeatures.length > 0 && (
                  <Box className={styles.section}>
                    <Typography variant="subtitle1">Selected Features:</Typography>
                    {selectedFeatures.map(f => (
                      <Typography key={f.id}>
                        {f.name} ({selectedCurrency} {f.basePrice})
                      </Typography>
                    ))}
                  </Box>
                )}
                {selectedAddOns.length > 0 && (
                  <Box className={styles.section}>
                    <Typography variant="subtitle1">Selected Add-Ons:</Typography>
                    {selectedAddOns.map(a => (
                      <Typography key={a.id}>
                        {a.name} ({selectedCurrency} {a.price})
                      </Typography>
                    ))}
                  </Box>
                )}
                {usagePricing.length > 0 && (
                  <Box className={styles.section}>
                    <Typography variant="subtitle1">Usage Limits:</Typography>
                    {usagePricing.map(u => (
                      <Typography key={u.id}>
                        {u.name}: {usageQuantities[u.id]} {u.unit}
                      </Typography>
                    ))}
                  </Box>
                )}
              </>
            )}
            <Box className={styles.buttonContainer}>
              <Button variant="outlined" onClick={onBack}>
                Back
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Confirm & Save
              </Button>
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

        {currentStep !== steps.length - 1 && (
          <Box className={styles.controls}>
            {currentStep > 0 && (
              <Button variant="outlined" onClick={onBack}>
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button variant="contained" onClick={handleNext} disabled={loading}>
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
