"use client";
import React, { useState } from "react";
import { Grid, Box, Typography, Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import iconMap from "../../../utils/icons";
import SuccessMessage from "../../ui/success-message/SuccessMessage";
import LazyLoginForm from "../../login-form/LoginForm";
import CheckoutForm from "../../checkout/CheckoutForm"; // Import CheckoutForm
import styles from "./StarterPackageLayout.module.css";
import { useTestPeriod } from "@/contexts/TestPeriodContext";
import { CheckoutField, OrderSummaryItem } from "../../checkout/CheckoutFormInterfaces"; // Import interfaces
import { useSpinner } from "@/contexts/SpinnerContext"; // Import useSpinner

interface StarterPackageLayoutProps {
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
};

const StarterPackageLayout: React.FC<StarterPackageLayoutProps> = ({ selectedPackage }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [currentCurrency, setCurrentCurrency] = useState<string>(selectedPackage.currency || "USD");
  const { setTestPeriod } = useTestPeriod();
  const { setLoading: setSpinnerLoading } = useSpinner(); 

  const IconComponent = iconMap[selectedPackage.icon] || iconMap["MUI:DefaultIcon"];

  const handleSelectedStarterPackage = async () => {
    setSpinnerLoading(true); // Show spinner
    setLoading(true);
    console.log("Selected package", {
      ...selectedPackage,
      currency: currentCurrency,
    });

    // Simulate backend call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSpinnerLoading(false); // Hide spinner
    setLoading(false);
    setSuccess(true);
  };

  const handleCloseSuccessMessage = () => {
    setSuccess(false);
  };

  const handleConfirmSuccessMessage = (isSignup: boolean) => {
    console.log("Confirmed", isSignup);
    setSuccess(false);
    setShowCheckoutForm(true); 
    setShowLoginForm(false);
    setTestPeriod(selectedPackage.testPeriodDays);
  };

  const handleReturnSuccessMessage = () => {
    console.log("Return");
    setSuccess(false);
  };

  const handleCurrencyChange = (currency: string) => {
    setCurrentCurrency(currency);
  };

  const multiCurrency: Record<string, number> | null = selectedPackage.multiCurrencyPrices
    ? JSON.parse(selectedPackage.multiCurrencyPrices)
    : null;

  const displayPrice =
    currentCurrency && multiCurrency ? multiCurrency[currentCurrency] : selectedPackage.price;
  const currencySymbol = currencySymbols[currentCurrency] || "$";

  const checkoutFields: CheckoutField[] = [
    { label: "First Name", name: "firstName", type: "text", required: true },
    { label: "Last Name", name: "lastName", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Phone Number", name: "phone", type: "text", required: true },
    { label: "Address", name: "address", type: "text", required: true },
    { label: "Country", name: "country", type: "select", required: true, options: ["USA", "Canada", "UK"] },
    { label: "State / Province / Region", name: "state", type: "select", required: true, options: ["California", "Texas", "New York"] },
    { label: "City", name: "city", type: "text", required: true },
    { label: "Postal / Zip Code", name: "postal", type: "text", required: true },
  ];

  const orderSummaryItems: OrderSummaryItem[] = [
    { label: "Package", value: selectedPackage.title },
    { label: "Price", value: `${currencySymbol}${displayPrice}` },
    { label: "Test Period", value: `${selectedPackage.testPeriodDays} days` },
  ];

  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  if (showLoginForm) {
    return <LazyLoginForm />;
  }

  if (showCheckoutForm) {
    return (
      <CheckoutForm
        title="Enter Your Details"
        checkoutFields={checkoutFields}
        orderSummaryTitle="Order Summary"
        orderSummaryItems={orderSummaryItems}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );
  }

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
      {!loading && !success && (
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
                {selectedPackage.description.replace(/[^\w\s.,!?]/g, "")}
              </Typography>
              <Typography variant="body2" className={styles.description}>
                {selectedPackage.extraDescription}
              </Typography>
              <Box className={styles.premiumBox}>
                <Typography variant="subtitle2" className={styles.premiumBoxLabel}>
                  YOUR TOTAL In ({currentCurrency})
                </Typography>
                <Typography variant="h4" className={styles.premiumBoxAmount}>
                  <b>{currentCurrency === "Kz" ? `${displayPrice}Kz` : `${currencySymbol}${displayPrice}`}</b>/mo
                </Typography>
              </Box>
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
                            {currency === "Kz" ? `${price}Kz` : `${currencySymbols[currency] || "$"}${price}`}
                          </b>
                        }
                        className={styles.multiCurrencyItem}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}
              <Typography variant="subtitle2" className={styles.testPeriod}>
                Test Period: <b>{selectedPackage.testPeriodDays} days</b>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box className={styles.rightColumn}>
              <Typography variant="h6" className={styles.heading}>
                Package summary
              </Typography>
              <Typography variant="body2" className={styles.summaryItem}>
                Package Type: <b>{selectedPackage.type}</b>
              </Typography>
              <Typography variant="body2" className={styles.summaryItem}>
                Package ID: <b>{selectedPackage.id}</b>
              </Typography>
              <Typography variant="body2" className={styles.summaryItem}>
                Monthly Price: <b>{currentCurrency === "Kz" ? `${displayPrice}Kz` : `${currencySymbol}${displayPrice}`}</b>
              </Typography>
              <Typography variant="body2" className={styles.summaryItem}>
                Test Period: <b>{selectedPackage.testPeriodDays} days</b>
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
    </Box>
  );
};

export default StarterPackageLayout;
