import React from "react";
import {
    TextField,
    MenuItem,
    Box,
    Grid,
    Typography,
    Button,
    Divider,
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
                        Transactions: $100.00
                    </Typography>
                    <Typography variant="body2" className={styles.total}>
                        Discount  points: $100.00
                    </Typography>
                    <Typography variant="body2" className={styles.total}>
                        Gift card and coupon: $100.00
                    </Typography>
                    <Typography variant="h5" className={styles.total}>
                        Grand Total: $100.00
                    </Typography>
                    <Divider className={styles.divider} />
                    <Box className={styles.paymentDetails}>
                        <Typography variant="body2" className={styles.total}>
                            <FaCreditCard style={{ marginRight: '8px' }} />
                            <strong>Payment Method:</strong> Credit Card
                        </Typography>
                        <Typography variant="body2" className={styles.total}>
                            <FaRegCreditCard style={{ marginRight: '8px' }} />
                            <strong>Card Number:</strong> **** **** **** 1234
                        </Typography>
                        <Typography variant="body2" className={styles.total}>
                            <FaCalendarAlt style={{ marginRight: '8px' }} />
                            <strong>Expiry Date:</strong> 12/2024
                        </Typography>
                    </Box>
                </Box>
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
    );
};

export default CheckoutForm;
