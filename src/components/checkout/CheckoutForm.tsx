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
import { FaCreditCard, FaRegCreditCard, FaCalendarAlt } from 'react-icons/fa';
import styles from "./CheckoutForm.module.css";
import { CheckoutFormProps } from "./CheckoutFormInterfaces";

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
            {/* LEFT SIDE: FORM */}
            <Box >
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

            {/* RIGHT SIDE: ORDER SUMMARY */}
            <Box >
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
                                <FormControlLabel
                                    value="creditCard"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <FaCreditCard style={{ marginRight: '8px' }} />
                                            Credit Card
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="cardNumber"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <FaRegCreditCard style={{ marginRight: '8px' }} />
                                            Card Number: **** **** **** 1234
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="expiryDate"
                                    control={<Radio />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <FaCalendarAlt style={{ marginRight: '8px' }} />
                                            Expiry Date: 12/2024
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            className={styles.checkoutButton}
                            onClick={onSubmit}
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
