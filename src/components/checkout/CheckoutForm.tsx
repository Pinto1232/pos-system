import React from 'react';
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
  Paper,
} from '@mui/material';
import { FaPaypal, FaCreditCard, FaStripe } from 'react-icons/fa';
import styles from './CheckoutForm.module.css';
import { CheckoutFormProps } from './CheckoutFormInterfaces';
import Image from 'next/image';

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
    <Paper elevation={0} className={styles.checkoutContainer}>
      <Box className={styles.checkoutLeft}>
        <Typography variant="h5" className={styles.title}>
          {title}
        </Typography>

        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            {checkoutFields.map(field => {
              const gridSize = field.name.toLowerCase() === 'address' ? 12 : 6;
              return (
                <Grid item xs={12} sm={gridSize} key={field.name}>
                  {field.type === 'select' || field.name === 'country' || field.name === 'state' ? (
                    <TextField
                      select
                      name={field.name}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={handleSelectChange}
                      label={field.label}
                      fullWidth
                      variant="outlined"
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
                      type={field.type ?? 'text'}
                      name={field.name}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={onChange}
                      label={field.label}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
        </form>
      </Box>

      <Box className={styles.checkoutRight}>
        <Typography variant="h5" className={styles.title}>
          {orderSummaryTitle}
        </Typography>

        <Box className={styles.orderSummary}>
          {orderSummaryItems.map(item => (
            <Typography key={item.label} className={styles.summaryItem}>
              <span>{item.label}</span>
              <span>{item.value}</span>
            </Typography>
          ))}
        </Box>

        <Divider className={styles.divider} />

        <Box className={styles.checkoutContent}>
          <Typography variant="h6" className={styles.total}>
            Choose Your Payment Method
          </Typography>

          <Box className={styles.paymentDetails}>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                aria-label="payment-method"
                name="paymentMethod"
                value={formData.paymentMethod || ''}
                onChange={handleSelectChange}
              >
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label={
                    <Box className={styles.paymentMethodLabel}>
                      <Box className={styles.paymentMethodIcon}>
                        <FaPaypal style={{ fontSize: '1.5rem', color: '#0070ba' }} />
                        <Typography>PayPal</Typography>
                      </Box>
                      <Box className={styles.paymentMethodCards}>
                        <Image
                          src="/visa.jpg"
                          alt="Visa"
                          width={60}
                          height={25}
                          className={styles.paymentMethodImage}
                        />
                        <Image
                          src="/card.jpg"
                          alt="Card"
                          width={60}
                          height={25}
                          className={styles.paymentMethodImage}
                        />
                      </Box>
                    </Box>
                  }
                />

                <FormControlLabel
                  value="stripe"
                  control={<Radio />}
                  label={
                    <Box className={styles.paymentMethodLabel}>
                      <Box className={styles.paymentMethodIcon}>
                        <FaStripe
                          style={{
                            fontSize: '2rem',
                            color: '#6772E5',
                          }}
                        />
                      </Box>
                    </Box>
                  }
                />

                <FormControlLabel
                  value="payfast"
                  control={<Radio />}
                  label={
                    <Box className={styles.paymentMethodLabel}>
                      <Box className={styles.paymentMethodIcon}>
                        <Typography>PayFast</Typography>
                      </Box>
                    </Box>
                  }
                />

                <FormControlLabel
                  value="creditCard"
                  control={<Radio />}
                  label={
                    <Box className={styles.paymentMethodLabel}>
                      <Box className={styles.paymentMethodIcon}>
                        <FaCreditCard style={{ fontSize: '1.5rem' }} />
                        <Typography>Credit Card</Typography>
                      </Box>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {formData.paymentMethod === 'creditCard' && (
              <Box sx={{ marginTop: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name on the card"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={onChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      name="cardNumber"
                      type="text"
                      value={formData.cardNumber}
                      onChange={onChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      fullWidth
                      label="Month"
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={onChange}
                      variant="outlined"
                    >
                      {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(
                        month => (
                          <MenuItem key={month} value={month}>
                            {month}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      fullWidth
                      label="Year"
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={onChange}
                      variant="outlined"
                    >
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(
                        year => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="CCV"
                      name="ccv"
                      type="password"
                      value={formData.ccv}
                      onChange={onChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              className={styles.checkoutButton}
              onClick={e => {
                e.preventDefault();
                onSubmit(e);
              }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CheckoutForm;
