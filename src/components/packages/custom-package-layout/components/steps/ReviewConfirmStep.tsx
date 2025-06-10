'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import Stack from '@mui/material/Stack';
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
      <Box className={styles.sectionHeader} sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#1e293b',
            mb: 1.5,
            background: 'linear-gradient(90deg, #1e293b, #334155)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.5rem',
          }}
        >
          Review & Confirm
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#64748b', 
            maxWidth: '700px', 
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: '1.05rem'
          }}
        >
          Review your package configuration and confirm your selection
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 4, md: 5 },
          gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' },
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        {}
        <Box>
          {}
          <Card 
            sx={{ 
              mb: 4,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            <Box 
              sx={{ 
                p: 2.5, 
                backgroundColor: '#f8fafc', 
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    color: '#2563eb', 
                    fontSize: '1.25rem',
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    flexShrink: 0,
                    mr: 2,
                  }}
                >
                  <FaBox />
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1e293b',
                    fontSize: '1.1rem',
                  }}
                >
                  Package Details
                </Typography>
              </Box>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b',
                  mb: 2,
                  fontSize: '1.3rem',
                }}
              >
                {packageDetails.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  lineHeight: 1.6,
                  fontSize: '0.9rem',
                  color: '#64748b',
                }}
              >
                {packageDetails.description}
              </Typography>
              <Chip
                label={`${packageDetails.testPeriod} days free trial`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563eb',
                  fontWeight: 600,
                  borderRadius: '6px',
                  px: 1,
                  '& .MuiChip-label': {
                    px: 1,
                  }
                }}
              />
            </CardContent>
          </Card>

          {}
          {selectedFeatures.length > 0 && (
            <Card 
              sx={{ 
                mb: 4,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <Box 
                sx={{ 
                  p: 2.5, 
                  backgroundColor: '#f8fafc', 
                  borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      color: '#10b981', 
                      fontSize: '1.25rem',
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      flexShrink: 0,
                      mr: 2,
                    }}
                  >
                    <FaCog />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#1e293b',
                      fontSize: '1.1rem',
                    }}
                  >
                    Core Features ({selectedFeatures.length})
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <List 
                  sx={{ 
                    py: 0,
                    '& .MuiListItem-root': {
                      borderBottom: '1px dashed rgba(226, 232, 240, 0.8)',
                      py: 2,
                      px: 3,
                      '&:last-child': {
                        borderBottom: 'none',
                      }
                    }
                  }}
                >
                  {selectedFeatures.map((feature) => (
                    <ListItem key={feature.id}>
                      <ListItemIcon 
                        sx={{ 
                          minWidth: 32,
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FaCheck size={8} style={{ color: '#10b981' }} />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.name}
                        secondary={feature.description}
                        primaryTypographyProps={{ 
                          fontWeight: 600,
                          color: '#1e293b',
                          fontSize: '0.9rem',
                          mb: 0.5,
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.8rem',
                          color: '#64748b',
                          lineHeight: 1.4,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ 
                          fontWeight: 700, 
                          color: '#1e293b',
                          fontSize: '0.9rem',
                          ml: 2,
                          flexShrink: 0,
                        }}
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
          <Card 
            sx={{ 
              position: 'sticky', 
              top: 20,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            <Box 
              sx={{ 
                p: 2.5, 
                backgroundColor: '#f8fafc', 
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
                  }}
                >
                  <FaCheck size={12} />
                </Box>
                Order Summary
              </Typography>
            </Box>

            <CardContent sx={{ p: 0 }}>
              {}
              {selectedPlanIndex !== null && (
                <Box 
                  sx={{ 
                    mb: 3,
                    p: 2,
                    mx: 3, 
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    borderRadius: '10px',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box 
                      sx={{ 
                        color: '#2563eb', 
                        fontSize: '1rem',
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        flexShrink: 0,
                        mr: 1.5,
                      }}
                    >
                      <FaCalendarAlt />
                    </Box>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '0.9rem',
                      }}
                    >
                      Billing Plan
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 5 }}>
                    {paymentPlansLoading ? (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontSize: '0.85rem',
                        }}
                      >
                        Loading...
                      </Typography>
                    ) : (
                      <>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontSize: '0.85rem',
                          }}
                        >
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
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              height: 20,
                              borderRadius: '4px',
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
                <Box 
                  sx={{ 
                    mb: 3,
                    p: 2,
                    mx: 0, 
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    borderRadius: '0', 
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    width: '100%', 
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box 
                      sx={{ 
                        color: '#10b981', 
                        fontSize: '1rem',
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        flexShrink: 0,
                        mr: 1.5,
                      }}
                    >
                      <FaHeadset />
                    </Box>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: '0.9rem',
                      }}
                    >
                      Support Level
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: '0.85rem',
                      pl: 5,
                    }}
                  >
                    {supportLevels[selectedSupportIndex]}
                  </Typography>
                </Box>
              )}

              <Box 
                sx={{ 
                  p: 2.5, 
                  mx: 3, 
                  backgroundColor: 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '10px',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  mb: 3,
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1e293b',
                    fontSize: '0.9rem',
                    mb: 2,
                  }}
                >
                  Price Breakdown
                </Typography>

                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: '0.85rem',
                      }}
                    >
                      Base Package:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#1e293b',
                        fontSize: '0.85rem',
                      }}
                    >
                      {formatPrice(selectedCurrency, basePrice)}
                    </Typography>
                  </Box>

                  {selectedAddOns.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontSize: '0.85rem',
                        }}
                      >
                        Add-ons:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1e293b',
                          fontSize: '0.85rem',
                        }}
                      >
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
                  )}

                  {selectedFeatures.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontSize: '0.85rem',
                        }}
                      >
                        Core Features:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1e293b',
                          fontSize: '0.85rem',
                        }}
                      >
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
                        alignItems: 'center',
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontSize: '0.85rem',
                        }}
                      >
                        Support:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1e293b',
                          fontSize: '0.85rem',
                        }}
                      >
                        {formatPrice(selectedCurrency, pricingState.supportPrice)}
                      </Typography>
                    </Box>
                  )}

                  {pricingState.planDiscount > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#10b981',
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <FaCheck size={10} />
                        Plan Discount:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
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
                </Stack>
              </Box>

              <Box
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 4,
                  px: 3, 
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1e293b',
                    fontSize: '1rem',
                  }}
                >
                  Total:
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ 
                    fontWeight: 800, 
                    color: '#2563eb',
                    background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '1.5rem',
                  }}
                >
                  {formatPrice(selectedCurrency, pricingState.totalPrice)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="medium" 
                onClick={handleSave}
                disabled={loading}
                sx={{
                  mx: 3, 
                  width: 'auto', 
                  maxWidth: '200px', 
                  display: 'block', 
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                  py: 1.25, 
                  px: 4, 
                  fontWeight: 700,
                  fontSize: '0.9rem', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:active': {
                    transform: 'translateY(1px)',
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span className="loading-pulse"></span>
                    Processing...
                  </Box>
                ) : (
                  'Confirm'
                )}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  mt: 2.5,
                  mx: 3, 
                  fontSize: '0.75rem',
                  color: '#64748b',
                }}
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
