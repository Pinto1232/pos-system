"use client";

import React from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
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

  const getStepContent = () => {
    const currentLabel = steps[currentStep]?.trim() || "";

    if (!currentLabel) return (
      <Typography variant="body1">
        Loading step configuration...
      </Typography>
    );

    switch (currentLabel) {
      case "Package Details":
        return (
          <div className={styles.details}>
            <Typography variant="h4">{packageDetails.title}</Typography>
            <Typography variant="body1">{packageDetails.description}</Typography>
            <Typography variant="h6">
              {isCustomizable
                ? `Base Price: $${basePrice}/mo`
                : `Price: $${calculatedPrice}/mo`}
            </Typography>
            <Typography variant="body2">
              Test Period: {packageDetails.testPeriod} days
            </Typography>
          </div>
        );

      case "Select Core Features":
        return (
          <Grid container spacing={2}>
            {features.length > 0 ? (
              features.map(feature => {
                const isSelected = selectedFeatures.some(f => f.id === feature.id);
                return (
                  <Grid item xs={12} sm={6} key={feature.id}>
                    <div className={styles.featureItem}>
                      <Button
                        fullWidth
                        variant={isSelected ? "contained" : "outlined"}
                        onClick={() => handleFeatureToggle(feature)}
                      >
                        {feature.name} (+${feature.basePrice})
                      </Button>
                      {isSelected && (
                        <Typography
                          variant="body2"
                          className={styles.featureDescription}
                        >
                          {feature.description}
                        </Typography>
                      )}
                    </div>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <div className={styles.emptyState}>
                  <Typography variant="h6">No features available</Typography>
                  <Button variant="outlined" onClick={onNext}>
                    Continue
                  </Button>
                </div>
              </Grid>
            )}
          </Grid>
        );

        case "Choose Add-Ons":
          return (
            <Grid container spacing={2}>
              {addOns.length > 0 ? (
                addOns.map(addOn => {
                  const isSelected = selectedAddOns.some(a => a.id === addOn.id);
                  return (
                    <Grid item xs={12} sm={6} key={addOn.id}>
                      <div className={styles.addOnItem}>
                        <Button
                          fullWidth
                          variant={isSelected ? "contained" : "outlined"}
                          onClick={() => handleAddOnToggle(addOn)}
                        >
                          {addOn.name} (+${addOn.price})
                        </Button>
                        {isSelected && (
                          <Typography
                            variant="body2"
                            className={styles.addOnDescription}
                          >
                            {addOn.description}
                          </Typography>
                        )}
                      </div>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <div className={styles.emptyState}>
                    <Typography variant="h6">No add-ons available</Typography>
                    <Button variant="outlined" onClick={onNext}>
                      Continue
                    </Button>
                  </div>
                </Grid>
              )}
            </Grid>
          );
        
      case "Configure Usage":
        return (
          <Grid container spacing={2}>
            {usagePricing.length > 0 ? (
              usagePricing.map(usage => (
                <Grid item xs={12} sm={6} key={usage.id}>
                  <div className={styles.usageItem}>
                    <Typography variant="subtitle1" gutterBottom>
                      {usage.name} (${usage.pricePerUnit}/{usage.unit})
                    </Typography>
                    <TextField
                      type="number"
                      value={usageQuantities[usage.id] || usage.defaultValue}
                      onChange={(e) => handleUsageUpdate(usage.id, e.target.value)}
                      InputProps={{
                        inputProps: {
                          min: usage.minValue,
                          max: usage.maxValue
                        }
                      }}
                      fullWidth
                    />
                  </div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <div className={styles.emptyState}>
                  <Typography variant="h6">No usage metrics to configure</Typography>
                  <Button variant="outlined" onClick={onNext}>
                    Continue
                  </Button>
                </div>
              </Grid>
            )}
          </Grid>
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

        <Box className={styles.controls}>
          {currentStep > 0 && (
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button variant="contained" onClick={onNext}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={onSave}>
              Confirm & Save
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default React.memo(CustomPackageLayout);