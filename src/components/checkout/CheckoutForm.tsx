import React from "react";
import {
    TextField,
    MenuItem,
    Box,
    Grid,
    Typography,
    Button,
    Divider,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
} from "@mui/material";
import { FaPaypal, FaCreditCard, FaStripe } from "react-icons/fa";
import styles from "./CheckoutForm.module.css";
import { CheckoutFormProps } from "./CheckoutFormInterfaces";
import Image from "next/image";

const CheckoutForm: React.FC<CheckoutFormProps> = ({
    title,
    checkoutFields,
    orderSummaryTitle,
    orderSummaryItems,
    formData,
    onChange,
    onSubmit,
}) => {
    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
    };

    return (
        <Box className={styles.checkoutContainer}>
            <Box>
                <Typography variant="h5" className={styles.title}>
                    {title}
                </Typography>

                <form onSubmit={onSubmit} className={styles.checkoutLeft}>
                    <Grid container spacing={2}>
                        {checkoutFields.map((field) => {
                            const gridSize = field.name.toLowerCase() === "address" ? 12 : 6;
                            return (
                                <Grid item xs={12} sm={gridSize} key={field.name}>
                                    {field.type === "select" ||
                                        field.name === "country" ||
                                        field.name === "state" ? (
                                        <TextField
                                            select
                                            name={field.name}
                                            required={field.required}
                                            value={formData[field.name] || ""}
                                            onChange={handleSelectChange}
                                            label={field.label}
                                            fullWidth
                                        >
                                            <MenuItem value="">
                                                <em>Select {field.label}</em>
                                            </MenuItem>
                                            {field.options?.map((option: string) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    ) : (
                                        <TextField
                                            type={field.type ?? "text"}
                                            name={field.name}
                                            required={field.required}
                                            value={formData[field.name] || ""}
                                            onChange={onChange}
                                            label={field.label}
                                            fullWidth
                                            className={field.name.toLowerCase() === "address" ? styles.addressTextfield : ""}
                                        />
                                    )}
                                </Grid>
                            );
                        })}
                    </Grid>
                </form>
            </Box>

            <Box>
                <Typography variant="h5" className={styles.title}>
                    {orderSummaryTitle}
                </Typography>

                <Box className={styles.checkoutRight}>
                    {orderSummaryItems.map((item) => (
                        <Typography key={item.label} className={styles.summaryItem}>
                            <strong>{item.label}:</strong> {item.value}
                        </Typography>
                    ))}
                </Box>
                <Divider className={styles.divider} />
                <Box className={styles.checkoutContent}>
                    <Typography variant="h6" className={styles.total}>
                        Choose Your Payment Method
                    </Typography>
                    <Divider className={styles.divider} />
                    <Box className={styles.paymentDetails}>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="payment-method"
                                name="paymentMethod"
                                value={formData.paymentMethod || ""}
                                onChange={handleSelectChange}
                            >
                                {/* PayPal */}
                                <FormControlLabel
                                    value="paypal"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <FaPaypal style={{ marginRight: 8}} />
                                            PayPal
                                            <Box component="span" sx={{ marginLeft: 30 }}>
                                                <Image
                                                    src="/visa.jpg"
                                                    alt="Visa & Mastercard"
                                                    width={85}
                                                    height={35}
                                                />
                                            </Box>
                                        </Box>
                                    }
                                />

                                {/* Stripe */}
                                <FormControlLabel
                                    value="stripe"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <FaStripe style={{
                                                marginRight: 8,
                                                color: "#6772E5",
                                                fontSize: "3.1rem",
                                            }}
                                            />                                    
                                        </Box>
                                    }
                                />

                                {/* PayFast */}
                                <FormControlLabel
                                    value="payfast"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            PayFast
                                        </Box>
                                    }
                                />

                                {/* Credit Card */}
                                <FormControlLabel
                                    value="creditCard"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <FaCreditCard style={{ marginRight: 8 }} />
                                            Credit Card
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                        </FormControl>

                        {formData.paymentMethod === "creditCard" && (
                            <Box sx={{ marginTop: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Name on the card"
                                    name="nameOnCard"
                                    value={formData.nameOnCard}
                                    onChange={onChange}
                                    margin="normal"
                                    sx={{ backgroundColor: "#ffffff" }}
                                />
                                <TextField
                                    fullWidth
                                    label="Card Number"
                                    name="cardNumber"
                                    type="text"
                                    value={formData.cardNumber}
                                    onChange={onChange}
                                    margin="normal"
                                    sx={{ backgroundColor: "#ffffff" }}
                                />

                                {/* Expiration Date & CCV */}
                                <Box display="flex" gap={2}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Month"
                                        name="expiryMonth"
                                        value={formData.expiryMonth}
                                        onChange={onChange}
                                        margin="normal"
                                        sx={{ backgroundColor: "#ffffff" }}
                                    >
                                        {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((month) => (
                                            <MenuItem key={month} value={month}>
                                                {month}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        select
                                        fullWidth
                                        label="Year"
                                        name="expiryYear"
                                        value={formData.expiryYear}
                                        onChange={onChange}
                                        margin="normal"
                                        sx={{ backgroundColor: "#ffffff" }}
                                    >
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="CCV"
                                        name="ccv"
                                        type="password"
                                        value={formData.ccv}
                                        onChange={onChange}
                                        margin="normal"
                                        sx={{ backgroundColor: "#ffffff" }}
                                    />
                                </Box>
                            </Box>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            className={styles.checkoutButton}
                            onClick={(e) => {
                                e.preventDefault();
                                console.log("Checkout button clicked. Form data:", formData); 
                                onSubmit(e);
                            }}
                        >
                            Checkout
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CheckoutForm;
