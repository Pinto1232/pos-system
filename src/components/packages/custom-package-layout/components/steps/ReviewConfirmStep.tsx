'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Divider, Chip, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { FaCheck, FaBox, FaCog, FaPlus, FaHeadset, FaBuilding, FaCalendarAlt, FaShoppingCart } from 'react-icons/fa';
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
    handleSave,
    handleBack,
    loading,
    backLoading,
  } = usePackageContext();

  // Payment plan names
  const paymentPlans = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];
  const supportLevels = ['Basic Support', 'Priority Support', 'Premium Support'];

  // Get selected enterprise features
  const getSelectedEnterpriseFeatures = () => {
    if (!enterpriseFeatures) return [];
    return Object.entries(enterpriseFeatures)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => {
        // Convert camelCase to readable format
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
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

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
        {/* Configuration Summary */}
        <Box>
          {/* Package Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaBox style={{ marginRight: 12, color: '#2563eb', fontSize: '1.25rem' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Package Details
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#173a79', mb: 1 }}>
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

          {/* Selected Features */}
          {selectedFeatures.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaCog style={{ marginRight: 12, color: '#10b981', fontSize: '1.25rem' }} />
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
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#173a79' }}>
                        {formatPrice(selectedCurrency, feature.basePrice)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Selected Add-ons */}
          {selectedAddOns.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaPlus style={{ marginRight: 12, color: '#f59e0b', fontSize: '1.25rem' }} />
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
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#173a79' }}>
                        {formatPrice(selectedCurrency, addOn.price)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Usage Configuration */}
          {Object.keys(usageQuantities).length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaCog style={{ marginRight: 12, color: '#8b5cf6', fontSize: '1.25rem' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Usage Configuration
                  </Typography>
                </Box>
                <List dense>
                  {Object.entries(usageQuantities).map(([idStr, quantity]) => {
                    const id = parseInt(idStr);
                    const usageItem = usagePricing.find(item => item.id === id);
                    if (!usageItem) return null;

                    return (
                      <ListItem key={id} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FaCheck size={12} style={{ color: '#8b5cf6' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${usageItem.name}: ${quantity} ${usageItem.unit}`}
                          secondary={usageItem.description}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#173a79' }}>
                          {formatPrice(selectedCurrency, usageItem.pricePerUnit * quantity)}
                        </Typography>
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Enterprise Features */}
          {selectedEnterpriseFeatures.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FaBuilding style={{ marginRight: 12, color: '#dc2626', fontSize: '1.25rem' }} />
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

        {/* Pricing Summary */}
        <Box>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Summary
              </Typography>

              {/* Payment Plan */}
              {selectedPlanIndex !== null && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FaCalendarAlt style={{ marginRight: 8, color: '#2563eb', fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Billing Plan
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {paymentPlans[selectedPlanIndex]}
                    {selectedPlanIndex > 0 && (
                      <Chip
                        label={`${Math.round([0, 0.1, 0.15, 0.2][selectedPlanIndex] * 100)}% OFF`}
                        size="small"
                        sx={{ ml: 1, backgroundColor: '#dcfce7', color: '#166534' }}
                      />
                    )}
                  </Typography>
                </Box>
              )}

              {/* Support Level */}
              {selectedSupportIndex !== null && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FaHeadset style={{ marginRight: 8, color: '#10b981', fontSize: '1rem' }} />
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

              {/* Price Breakdown */}
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Base Package:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatPrice(selectedCurrency, basePrice)}
                  </Typography>
                </Box>

                {pricingState.totalFeaturePrice > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Features & Add-ons:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatPrice(selectedCurrency, pricingState.totalFeaturePrice)}
                    </Typography>
                  </Box>
                )}

                {pricingState.supportPrice > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Support:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatPrice(selectedCurrency, pricingState.supportPrice)}
                    </Typography>
                  </Box>
                )}

                {pricingState.planDiscount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: '#10b981' }}>
                    <Typography variant="body2">Plan Discount:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      -{formatPrice(selectedCurrency, (basePrice + pricingState.totalFeaturePrice + pricingState.supportPrice) * pricingState.planDiscount)}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#173a79' }}>
                  {formatPrice(selectedCurrency, pricingState.totalPrice)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<FaShoppingCart />}
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
                {loading ? 'Processing...' : 'Add to Cart'}
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
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
