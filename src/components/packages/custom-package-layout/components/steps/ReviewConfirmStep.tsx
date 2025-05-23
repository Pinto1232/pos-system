'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  FaCheck,
  FaBox,
  FaCog,
  FaPlus,
  FaHeadset,
  FaBuilding,
  FaCalendarAlt,
} from 'react-icons/fa';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import NavigationButtons from '../shared/NavigationButtons';

const ReviewConfirmStep: React.FC = () => {
  const {
    packageDetails,
    selectedFeatures,
    selectedAddOns,
    usageQuantities,
    usagePricing,
    basePrice,
    pricingState,
    selectedCurrency,
    formatPrice,
    selectedPlanIndex,
    selectedSupportIndex,
    enterpriseFeatures,
    paymentPlans,
    paymentPlansLoading,
    handleSave,
    handleBack,
    loading,
    backLoading,
  } = usePackageContext();

  const supportLevels = [
    'Basic Support',
    'Priority Support',
    'Premium Support',
  ];

  const getSelectedEnterpriseFeatures = () => {
    if (!enterpriseFeatures) return [];
    return Object.entries(enterpriseFeatures)
      .filter(([, selected]) => selected)
      .map(([key]) => {
        return key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());
      });
  };

  const selectedEnterpriseFeatures = getSelectedEnterpriseFeatures();

  return (
    <Box className={styles.featuresContainer}>
      <Box className={styles.sectionHeader}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#173a79' }}>
          Review & Confirm
        </Typography>
        <Typography variant="body2" className={styles.sectionDescription}>
          Review your package configuration and confirm your selection
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        }}
      >
        {}
        <Box>
          {}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaBox
                  style={{
                    marginRight: 12,
                    color: '#2563eb',
                    fontSize: '1.25rem',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Package Details
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: '#173a79', mb: 1 }}
              >
                {packageDetails.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {packageDetails.description}
              </Typography>
              <Chip
                label={`${packageDetails.testPeriod} days free trial`}
                color="primary"
                size="small"
              />
            </CardContent>
          </Card>

          {}
          {selectedFeatures.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaCog
                    style={{
                      marginRight: 12,
                      color: '#10b981',
                      fontSize: '1.25rem',
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Core Features ({selectedFeatures.length})
                  </Typography>
                </Box>
                <List dense>
                  {selectedFeatures.map((feature) => (
                    <ListItem key={feature.id} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <FaCheck size={12} style={{ color: '#10b981' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.name}
                        secondary={feature.description}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#173a79' }}
                      >
                        {formatPrice(selectedCurrency, feature.basePrice)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {}
          {selectedAddOns.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaPlus
                    style={{
                      marginRight: 12,
                      color: '#f59e0b',
                      fontSize: '1.25rem',
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Add-ons ({selectedAddOns.length})
                  </Typography>
                </Box>
                <List dense>
                  {selectedAddOns.map((addOn) => (
                    <ListItem key={addOn.id} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <FaCheck size={12} style={{ color: '#f59e0b' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={addOn.name}
                        secondary={addOn.description}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: '#173a79' }}
                      >
                        {formatPrice(selectedCurrency, addOn.price)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {}
          {Object.keys(usageQuantities).length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaCog
                    style={{
                      marginRight: 12,
                      color: '#8b5cf6',
                      fontSize: '1.25rem',
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Usage Configuration
                  </Typography>
                </Box>
                <List dense>
                  {Object.entries(usageQuantities).map(([idStr, quantity]) => {
                    const id = parseInt(idStr);
                    const usageItem = usagePricing.find(
                      (item) => item.id === id
                    );
                    if (!usageItem) return null;

                    return (
                      <ListItem key={id} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FaCheck size={12} style={{ color: '#8b5cf6' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${usageItem.name}: ${quantity} ${usageItem.unit}`}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: '#173a79' }}
                        >
                          {formatPrice(
                            selectedCurrency,
                            usageItem.pricePerUnit * quantity
                          )}
                        </Typography>
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          )}

          {}
          {selectedEnterpriseFeatures.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaBuilding
                    style={{
                      marginRight: 12,
                      color: '#dc2626',
                      fontSize: '1.25rem',
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Enterprise Features ({selectedEnterpriseFeatures.length})
                  </Typography>
                </Box>
                <List dense>
                  {selectedEnterpriseFeatures.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <FaCheck size={12} style={{ color: '#dc2626' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>

        {}
        <Box>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Summary
              </Typography>

              {}
              {selectedPlanIndex !== null && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FaCalendarAlt
                      style={{
                        marginRight: 8,
                        color: '#2563eb',
                        fontSize: '1rem',
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Billing Plan
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {paymentPlansLoading ? (
                      <Typography variant="body2" color="text.secondary">
                        Loading...
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {paymentPlans.find(
                            (plan) => plan.id === selectedPlanIndex
                          )?.name || 'Unknown Plan'}
                        </Typography>
                        {paymentPlans.find(
                          (plan) => plan.id === selectedPlanIndex
                        )?.discountLabel && (
                          <Chip
                            label={
                              paymentPlans.find(
                                (plan) => plan.id === selectedPlanIndex
                              )?.discountLabel
                            }
                            size="small"
                            sx={{
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                            }}
                          />
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              )}

              {}
              {selectedSupportIndex !== null && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FaHeadset
                      style={{
                        marginRight: 8,
                        color: '#10b981',
                        fontSize: '1rem',
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Support Level
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {supportLevels[selectedSupportIndex]}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {}
              <Box sx={{ mb: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Base Package:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatPrice(selectedCurrency, basePrice)}
                  </Typography>
                </Box>

                {}
                {selectedAddOns.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Selected Add-ons:
                    </Typography>
                    {selectedAddOns.map((addOn) => {
                      const addOnPrice =
                        addOn.multiCurrencyPrices &&
                        addOn.multiCurrencyPrices[selectedCurrency]
                          ? addOn.multiCurrencyPrices[selectedCurrency]
                          : addOn.price;

                      return (
                        <Box
                          key={addOn.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 0.5,
                            pl: 2,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            • {addOn.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatPrice(selectedCurrency, addOnPrice)}
                          </Typography>
                        </Box>
                      );
                    })}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                        borderTop: '1px solid #e0e0e0',
                        pt: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Add-ons Subtotal:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatPrice(
                          selectedCurrency,
                          selectedAddOns.reduce((sum, addOn) => {
                            const price =
                              addOn.multiCurrencyPrices &&
                              addOn.multiCurrencyPrices[selectedCurrency]
                                ? addOn.multiCurrencyPrices[selectedCurrency]
                                : addOn.price;
                            return sum + price;
                          }, 0)
                        )}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {}
                {selectedFeatures.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Core Features:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatPrice(
                        selectedCurrency,
                        selectedFeatures.reduce((sum, feature) => {
                          const featurePrice =
                            pricingState.featurePrices[feature.id] || 0;
                          return sum + featurePrice;
                        }, 0)
                      )}
                    </Typography>
                  </Box>
                )}

                {pricingState.supportPrice > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Support:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatPrice(selectedCurrency, pricingState.supportPrice)}
                    </Typography>
                  </Box>
                )}

                {pricingState.planDiscount > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                      color: '#10b981',
                    }}
                  >
                    <Typography variant="body2">Plan Discount:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      -
                      {formatPrice(
                        selectedCurrency,
                        (basePrice +
                          pricingState.totalFeaturePrice +
                          pricingState.supportPrice) *
                          pricingState.planDiscount
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: '#173a79' }}
                >
                  {formatPrice(selectedCurrency, pricingState.totalPrice)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSave}
                disabled={loading}
                sx={{
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {loading ? 'Processing...' : 'Confirm'}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center', mt: 2 }}
              >
                You can modify your selection before checkout
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <NavigationButtons
        onNext={() => {}}
        onBack={handleBack}
        isNextDisabled={true}
        isNextLoading={loading}
        isBackLoading={backLoading}
        nextLabel=""
        backLabel="Back"
        showNextButton={false}
      />
    </Box>
  );
};

export default ReviewConfirmStep;
