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
} from "@mui/material";
import { motion } from "framer-motion";
import InfoIcon from "@mui/icons-material/Info";
import styles from "./CustomPackageLayout.module.css";
import { Feature, AddOn, UsagePricing } from "./types";

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
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  onFeatureToggle: (features: Feature[]) => void;
  onAddOnToggle: (addOns: AddOn[]) => void;
  onUsageChange: (quantities: Record<number, number>) => void;
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
  onNext,
  onBack,
  onSave,
  onFeatureToggle,
  onAddOnToggle,
  onUsageChange,
}) => {
  const [loading, setLoading] = useState(false);

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
        return (
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <Typography variant="h4">{packageDetails.title}</Typography>
            </div>
            <div className={styles.detailItem}>
              <Typography variant="body1">{packageDetails.description}</Typography>
            </div>
            <div className={styles.detailItem}>
              <Typography variant="h6">
                {isCustomizable
                  ? `Base Price: $${basePrice}/mo`
                  : `Price: $${calculatedPrice}/mo`}
              </Typography>
            </div>
            <div className={styles.detailItem}>
              <Typography variant="body2">
                Test Period: {packageDetails.testPeriod} days
              </Typography>
            </div>
          </div>
        );

      case "Select Core Features":
        return (
          <div className={styles.featuresContainer}>
            {features.length > 0 ? (
              features.map(feature => {
                const isSelected = selectedFeatures.some(f => f.id === feature.id);
                return (
                  <div key={feature.id} className={`${styles.featureItem} ${isSelected ? styles.selectedFeature : ""}`}>
                    <Button
                      fullWidth
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => handleFeatureToggle(feature)}
                    >
                      {feature.name.replace(/[^a-zA-Z0-9 ]/g, "")} (${feature.basePrice})
                    </Button>
                    {isSelected && (
                      <div className={styles.featureDescriptionContainer}>
                        <InfoIcon className={styles.infoIcon} />
                        <Typography
                          variant="body2"
                          className={styles.featureDescription}
                        >
                          {feature.description}
                        </Typography>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <Typography variant="h6">No features available</Typography>
                <Button variant="outlined" onClick={onNext}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        );

      case "Choose Add-Ons":
        return (
          <div className={styles.featuresContainer}>
            <div className={styles.sectionHeader}>
              <Typography variant="h5">Choose Add-Ons</Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Select additional features to enhance your package. Each add-on comes with its own pricing.
              </Typography>
            </div>
            {addOns.length > 0 ? (
              addOns.map(addOn => {
                const isSelected = selectedAddOns.some(a => a.id === addOn.id);
                return (
                  <div key={addOn.id} className={`${styles.featureItem} ${isSelected ? styles.selectedFeature : ""}`}>
                    <Button
                      fullWidth
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => handleAddOnToggle(addOn)}
                    >
                      {addOn.name.replace(/[^a-zA-Z0-9 ]/g, "")} (${addOn.price})
                    </Button>
                    {isSelected && (
                      <div className={styles.featureDescriptionContainer}>
                        <InfoIcon className={styles.infoIcon} />
                        <Typography
                          variant="body2"
                          className={styles.featureDescription}
                        >
                          {addOn.description}
                        </Typography>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <Typography variant="h6">No add-ons available</Typography>
                <Button variant="outlined" onClick={onNext}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        );

      case "Configure Usage":
        return (
          <div className={styles.featuresContainer}>
            <div className={styles.sectionHeader}>
              <Typography variant="h5">Configure Usage</Typography>
              <Typography variant="body2" className={styles.sectionDescription}>
                Adjust the usage metrics to fit your business needs. Ensure the values are within the allowed range.
              </Typography>
            </div>
            {usagePricing.length > 0 ? (
              usagePricing.map(usage => {
                const currentValue = usageQuantities[usage.id] ?? usage.defaultValue;
                const usageError =
                  currentValue < usage.minValue || currentValue > usage.maxValue
                    ? `Value must be between ${usage.minValue} and ${usage.maxValue}`
                    : "";
                return (
                  <div key={usage.id} className={styles.usageItem}>
                    <Typography variant="subtitle1" gutterBottom>
                      {usage.name} (${usage.pricePerUnit}/{usage.unit})
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
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <Typography variant="h6">No usage metrics to configure</Typography>
                <Button variant="outlined" onClick={onNext}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        );

      case "Review & Confirm":
        return (
          <div className={styles.review}>
            <Typography variant="h5">Final Review</Typography>
            <div className={styles.priceSummary}>
              <Typography variant="h6">
                Total Price: ${calculatedPrice}/mo
              </Typography>
              {isCustomizable && (
                <Typography variant="body2">
                  (Base: ${basePrice} + Customizations: ${calculatedPrice - basePrice})
                </Typography>
              )}
            </div>
            {isCustomizable && (
              <>
                {selectedFeatures.length > 0 && (
                  <div className={styles.section}>
                    <Typography variant="subtitle1">Selected Features:</Typography>
                    {selectedFeatures.map(f => (
                      <Typography key={f.id}>
                        {f.name} (+${f.basePrice})
                      </Typography>
                    ))}
                  </div>
                )}
                {selectedAddOns.length > 0 && (
                  <div className={styles.section}>
                    <Typography variant="subtitle1">Selected Add-Ons:</Typography>
                    {selectedAddOns.map(a => (
                      <Typography key={a.id}>
                        {a.name} (+${a.price})
                      </Typography>
                    ))}
                  </div>
                )}
                {usagePricing.length > 0 && (
                  <div className={styles.section}>
                    <Typography variant="subtitle1">Usage Limits:</Typography>
                    {usagePricing.map(u => (
                      <Typography key={u.id}>
                        {u.name}: {usageQuantities[u.id]} {u.unit}
                      </Typography>
                    ))}
                  </div>
                )}
              </>
            )}
            <div className={styles.buttonContainer}>
              <Button variant="outlined" onClick={onBack}>
                Back
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Confirm & Save
              </Button>
            </div>
          </div>
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
