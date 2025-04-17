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
import {
  FaPaypal,
  FaCreditCard,
  FaStripe,
} from 'react-icons/fa';
import styles from './CheckoutForm.module.css';
import { CheckoutFormProps } from './CheckoutFormInterfaces';
import Image from 'next/image';

const CheckoutForm: React.FC<
  CheckoutFormProps
> = ({
  title,
  checkoutFields,
  orderSummaryTitle,
  orderSummaryItems,
  formData,
  onChange,
  onSubmit,
}) => {
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(e);
  };

  return (
    <Paper
      elevation={0}
      className={styles.checkoutContainer}
    >
      <Box className={styles.checkoutLeft}>
        <Typography
          variant="h5"
          className={styles.title}
          sx={{ padding: '1rem' }}
        >
          {title}
        </Typography>

        <form onSubmit={onSubmit}>
          <Grid
            container
            spacing={3}
            sx={{ padding: '0 1rem' }}
          >
            {checkoutFields.map((field) => {
              const gridSize =
                field.name.toLowerCase() ===
                'address'
                  ? 12
                  : 6;
              return (
                <Grid
                  item
                  xs={12}
                  sm={gridSize}
                  key={field.name}
                >
                  {field.type === 'select' ||
                  field.name === 'country' ||
                  field.name === 'state' ? (
                    <TextField
                      select
                      name={field.name}
                      required={field.required}
                      value={
                        formData[field.name] || ''
                      }
                      onChange={
                        handleSelectChange
                      }
                      label={field.label}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root':
                          {
                            backgroundColor:
                              '#f8fafc',
                            borderRadius: '0px',
                            '& fieldset': {
                              borderColor:
                                'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor:
                                '#1976d2',
                            },
                            '&.Mui-focused fieldset':
                              {
                                borderColor:
                                  '#1976d2',
                              },
                          },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          '&.Mui-focused': {
                            color: '#1976d2',
                          },
                        },
                        '& .MuiSelect-select': {
                          padding: '12px 14px',
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>
                          Select {field.label}
                        </em>
                      </MenuItem>
                      {field.options?.map(
                        (option: string) => (
                          <MenuItem
                            key={option}
                            value={option}
                          >
                            {option}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  ) : (
                    <TextField
                      type={field.type ?? 'text'}
                      name={field.name}
                      required={field.required}
                      value={
                        formData[field.name] || ''
                      }
                      onChange={onChange}
                      label={field.label}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root':
                          {
                            backgroundColor:
                              '#f8fafc',
                            borderRadius: '0px',
                            '& fieldset': {
                              borderColor:
                                'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor:
                                '#1976d2',
                            },
                            '&.Mui-focused fieldset':
                              {
                                borderColor:
                                  '#1976d2',
                              },
                          },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          '&.Mui-focused': {
                            color: '#1976d2',
                          },
                        },
                        '& .MuiOutlinedInput-input':
                          {
                            padding: '12px 14px',
                          },
                      }}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
        </form>
      </Box>

      <Box className={styles.checkoutRight}>
        <Box
          className={styles.checkoutRightWrapper}
        >
          <Typography
            variant="h5"
            className={styles.title}
            sx={{ padding: '1rem' }}
          >
            {orderSummaryTitle}
          </Typography>

          <Box className={styles.orderSummary}>
            <Box
              className={
                styles.orderSummaryContent
              }
            >
              {orderSummaryItems.map((item) => (
                <Box
                  key={item.label}
                  className={styles.section}
                >
                  <Box className={styles.itemRow}>
                    <Typography
                      className={styles.itemLabel}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      className={styles.itemValue}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                  {item.description && (
                    <Typography
                      className={
                        styles.itemDescription
                      }
                    >
                      {item.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          <Divider className={styles.divider} />

          <Box className={styles.total}>
            <Typography>Total</Typography>
            <Typography>
              {orderSummaryItems
                .reduce((acc, item) => {
                  if (
                    typeof item.value === 'number'
                  ) {
                    return acc + item.value;
                  }
                  const numericValue = parseFloat(
                    item.value.replace(
                      /[^0-9.-]/g,
                      ''
                    )
                  );
                  return (
                    acc +
                    (isNaN(numericValue)
                      ? 0
                      : numericValue)
                  );
                }, 0)
                .toLocaleString('en-ZA', {
                  style: 'currency',
                  currency: 'ZAR',
                })}
            </Typography>
          </Box>

          <Box className={styles.paymentDetails}>
            <Typography
              variant="h6"
              className={styles.sectionTitle}
            >
              Payment Method
            </Typography>

            <FormControl
              component="fieldset"
              fullWidth
            >
              <RadioGroup
                aria-label="payment-method"
                name="paymentMethod"
                value={
                  formData.paymentMethod || ''
                }
                onChange={handleSelectChange}
              >
                <FormControlLabel
                  value="paypal"
                  control={
                    <Radio
                      sx={{
                        color: '#0070ba',
                        '&.Mui-checked': {
                          color: '#0070ba',
                        },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Box
                        className={
                          styles.paymentMethodIcon
                        }
                      >
                        <FaPaypal
                          style={{
                            fontSize: '2rem',
                            color: '#0070ba',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#1a1a1a',
                          }}
                        >
                          PayPal
                        </Typography>
                      </Box>
                      <Box
                        className={
                          styles.paymentMethodCards
                        }
                      >
                        <Image
                          src="/visa.jpg"
                          alt="Visa"
                          width={40}
                          height={25}
                          style={{
                            objectFit: 'contain',
                          }}
                        />
                        <Image
                          src="/card.jpg"
                          alt="Card"
                          width={40}
                          height={25}
                          style={{
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    </Box>
                  }
                  sx={{
                    margin: 0,
                    width: '100%',
                    '.MuiFormControlLabel-label':
                      {
                        width: '100%',
                      },
                  }}
                />

                <FormControlLabel
                  value="stripe"
                  control={
                    <Radio
                      sx={{
                        color: '#6772E5',
                        '&.Mui-checked': {
                          color: '#6772E5',
                        },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Box
                        className={
                          styles.paymentMethodIcon
                        }
                      >
                        <FaStripe
                          style={{
                            fontSize: '2.5rem',
                            color: '#6772E5',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#1a1a1a',
                          }}
                        >
                          Stripe
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{
                    margin: 0,
                    width: '100%',
                    '.MuiFormControlLabel-label':
                      {
                        width: '100%',
                      },
                  }}
                />

                <FormControlLabel
                  value="creditCard"
                  control={
                    <Radio
                      sx={{
                        color: '#1a1a1a',
                        '&.Mui-checked': {
                          color: '#1a1a1a',
                        },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Box
                        className={
                          styles.paymentMethodIcon
                        }
                      >
                        <FaCreditCard
                          style={{
                            fontSize: '1.5rem',
                            color: '#1a1a1a',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#1a1a1a',
                          }}
                        >
                          Credit Card
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{
                    margin: 0,
                    width: '100%',
                    '.MuiFormControlLabel-label':
                      {
                        width: '100%',
                      },
                  }}
                />
              </RadioGroup>
            </FormControl>

            {formData.paymentMethod ===
              'creditCard' && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name on the card"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={onChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root':
                          {
                            '&:hover fieldset': {
                              borderColor:
                                '#1a1a1a',
                            },
                          },
                      }}
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
                      {[
                        '01',
                        '02',
                        '03',
                        '04',
                        '05',
                        '06',
                        '07',
                        '08',
                        '09',
                        '10',
                        '11',
                        '12',
                      ].map((month) => (
                        <MenuItem
                          key={month}
                          value={month}
                        >
                          {month}
                        </MenuItem>
                      ))}
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
                      {Array.from(
                        { length: 10 },
                        (_, i) =>
                          new Date().getFullYear() +
                          i
                      ).map((year) => (
                        <MenuItem
                          key={year}
                          value={year}
                        >
                          {year}
                        </MenuItem>
                      ))}
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
              onClick={(e) => {
                e.preventDefault();
                onSubmit(e);
              }}
              sx={{
                mt: 2,
                py: 1,
                px: 1,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                backgroundColor: '#1976d2',
                width: '80%',
                display: 'block',
                margin: '16px auto',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
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
