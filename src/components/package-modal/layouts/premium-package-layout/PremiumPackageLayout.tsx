"use client";

import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import iconMap from "../../../../utils/icons";
import SuccessMessage from "../../../ui/success-message/SuccessMessage";
import styles from "./PremiumPackageLayout.module.css";
import LazyLoginForm from "@/components/login-form/LoginForm";

interface PremiumPackageLayoutProps {
  selectedPackage: {
    id: number;
    title: string;
    description: string;
    icon: string;
    extraDescription: string;
    price: number;
    testPeriodDays: number;
    type: "starter" | "growth" | "enterprise" | "custom" | "premium";
    currency?: string;
    multiCurrencyPrices?: string;
  };
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  Kz: "Kz",
  // Add more as needed
};

const PremiumPackageLayout: React.FC<PremiumPackageLayoutProps> = ({
  selectedPackage,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<string>(
    selectedPackage.currency || "USD"
  );

  const IconComponent =
    iconMap[selectedPackage.icon] || iconMap["MUI:DefaultIcon"];

  const handleSelectedPremiumPackage = async () => {
    setLoading(true);
    console.log("Selected package", { ...selectedPackage, currency: currentCurrency });
    // Simulate backend call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
  };

  const handleCloseSuccessMessage = () => {
    setSuccess(false);
  };

  const handleConfirmSuccessMessage = (isSignup: boolean) => {
    console.log("Confirmed", isSignup);
    setSuccess(false);
    setShowLoginForm(true)
  };

  const handleReturnSuccessMessage = () => {
    console.log("Return");
    setSuccess(false);
  };

  const handleCurrencyChange = (currency: string) => {
    setCurrentCurrency(currency);
  };

  // Parse the multiCurrencyPrices JSON and cast to a known type
  const multiCurrency: Record<string, number> | null = selectedPackage.multiCurrencyPrices
    ? (JSON.parse(selectedPackage.multiCurrencyPrices) as Record<string, number>)
    : null;

  // Determine the display price based on the selected currency (if available)
  const displayPrice =
    currentCurrency && multiCurrency && multiCurrency[currentCurrency] !== undefined
      ? multiCurrency[currentCurrency]
      : selectedPackage.price;
  const currencySymbol =
    currentCurrency === "Kz" ? "Kz" : (currencySymbols[currentCurrency] || "$");

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
      {showLoginForm && <LazyLoginForm />}
       {!loading && !success && !showLoginForm &&  (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box className={styles.leftColumn}>
              {selectedPackage.icon && (
                <IconComponent className={styles.packageIcon} />
              )}
              <Typography variant="h6" className={styles.heading}>
                {selectedPackage.title}
              </Typography>
              <Typography variant="body1" className={styles.description}>
                {selectedPackage.description.replace(/[^\w\s.,!?]/g, "")}
              </Typography>
              <Typography variant="body2" className={styles.description}>
                {selectedPackage.extraDescription}
              </Typography>
              <Box className={styles.premiumBox}>
                <Typography variant="subtitle2" className={styles.premiumBoxLabel}>
                  YOUR TOTAL IN ( {currentCurrency})
                </Typography>
                <Typography variant="h4" className={styles.premiumBoxAmount}>
                  <b>{currencySymbol}{displayPrice}</b>/mo
                </Typography>
              </Box>

              {/* Multi-Currency Selection */}
              {multiCurrency && (
                <Box className={styles.multiCurrencyBox}>
                  <Typography variant="subtitle2" className={styles.multiCurrencyLabel}>
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
                            {currency}: {currency === "Kz" ? "" : (currencySymbols[currency] || "$")}{price}
                          </b>
                        }
                        className={styles.multiCurrencyItem}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}

              <Typography variant="subtitle2" className={styles.testPeriod}>
                Test Period: {selectedPackage.testPeriodDays} days
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className={styles.rightColumn}>
              <Typography variant="h6" className={styles.heading}>
                Package summary
              </Typography>
              <Typography variant="body2" className={styles.summaryItem}>
                Package Type: {selectedPackage.type}
              </Typography>
              <Typography variant="body2" className={styles.summaryItem}>
                Package ID: {selectedPackage.id}
              </Typography>
              <Typography variant="body2" className={styles.summaryItem}>
                Monthly Price: {currencySymbol}{displayPrice}
              </Typography>
              <Typography variant="body2" className={styles.summaryItem}>
                Test Period: {selectedPackage.testPeriodDays} days
              </Typography>
              <Button
                variant="contained"
                className={styles.continueButton}
                fullWidth
                onClick={handleSelectedPremiumPackage}
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

export default PremiumPackageLayout;
