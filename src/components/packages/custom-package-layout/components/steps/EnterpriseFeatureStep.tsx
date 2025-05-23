'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  FaChartLine,
  FaBuilding,
  FaShieldAlt,
  FaCode,
  FaExpandAlt,
  FaCheck,
} from 'react-icons/fa';
import styles from '../../CustomPackageLayout.module.css';
import { usePackageContext } from '../../context/PackageContext';
import NavigationButtons from '../shared/NavigationButtons';

const EnterpriseFeatureStep: React.FC = () => {
  const {
    enterpriseFeatures,
    handleEnterpriseFeatureToggle,
    isEnterpriseFeatureDisabled,
    handleNext,
    handleBack,
    loading,
    backLoading,
  } = usePackageContext();

  const featureCategories = [
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      icon: <FaChartLine />,
      description: 'Powerful business intelligence and reporting tools',
      color: '#3b82f6',
      features: [
        {
          key: 'realTimeAnalytics',
          name: 'Real-time Analytics',
          description:
            'Live dashboard with real-time sales, inventory, and customer data',
        },
        {
          key: 'customReports',
          name: 'Custom Reports',
          description: 'Build custom reports with drag-and-drop interface',
        },
        {
          key: 'dataExport',
          name: 'Advanced Data Export',
          description: 'Export data in multiple formats (CSV, Excel, PDF, API)',
        },
        {
          key: 'predictiveAnalytics',
          name: 'Predictive Analytics',
          description: 'AI-powered forecasting and trend analysis',
        },
      ],
    },
    {
      id: 'multiLocation',
      name: 'Multi-Location Management',
      icon: <FaBuilding />,
      description: 'Manage multiple stores and locations from one dashboard',
      color: '#10b981',
      features: [
        {
          key: 'centralizedManagement',
          name: 'Centralized Management',
          description: 'Manage all locations from a single dashboard',
        },
        {
          key: 'locationSettings',
          name: 'Location-specific Settings',
          description: 'Configure unique settings for each location',
        },
        {
          key: 'crossLocationInventory',
          name: 'Cross-location Inventory',
          description: 'View and manage inventory across all locations',
        },
        {
          key: 'interLocationTransfers',
          name: 'Inter-location Transfers',
          description: 'Transfer inventory between locations seamlessly',
        },
      ],
    },
    {
      id: 'security',
      name: 'Advanced Security',
      icon: <FaShieldAlt />,
      description: 'Enterprise-grade security and compliance features',
      color: '#f59e0b',
      features: [
        {
          key: 'roleBasedAccess',
          name: 'Role-based Access Control',
          description: 'Granular permissions and user role management',
        },
        {
          key: 'advancedEncryption',
          name: 'Advanced Encryption',
          description: 'End-to-end encryption for all sensitive data',
        },
        {
          key: 'auditLogging',
          name: 'Audit Logging',
          description: 'Comprehensive audit trails for compliance',
        },
        {
          key: 'twoFactorAuth',
          name: 'Two-Factor Authentication',
          description: 'Enhanced security with 2FA for all users',
        },
      ],
    },
    {
      id: 'api',
      name: 'API & Integrations',
      icon: <FaCode />,
      description: 'Advanced integration capabilities and custom development',
      color: '#8b5cf6',
      features: [
        {
          key: 'restfulApi',
          name: 'RESTful API Access',
          description: 'Full API access for custom integrations',
        },
        {
          key: 'webhookNotifications',
          name: 'Webhook Notifications',
          description: 'Real-time notifications for external systems',
        },
        {
          key: 'customIntegration',
          name: 'Custom Integration Support',
          description: 'Professional services for custom integrations',
        },
        {
          key: 'bulkDataImport',
          name: 'Bulk Data Import/Export',
          description: 'Advanced tools for bulk data operations',
        },
      ],
    },
  ];

  const getSelectedFeaturesCount = () => {
    if (!enterpriseFeatures) return 0;
    return Object.values(enterpriseFeatures).filter(Boolean).length;
  };

  const getCategorySelectedCount = (categoryId: string) => {
    if (!enterpriseFeatures) return 0;
    const category = featureCategories.find((cat) => cat.id === categoryId);
    if (!category) return 0;

    return category.features.filter(
      (feature) => enterpriseFeatures[feature.key]
    ).length;
  };

  return (
    <Box className={styles.featuresContainer}>
      <Box className={styles.sectionHeader}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#173a79' }}>
          Configure Enterprise Features
        </Typography>
        <Typography variant="body2" className={styles.sectionDescription}>
          Select advanced enterprise features to enhance your POS system. You
          can only select features from one category at a time.
        </Typography>

        {getSelectedFeaturesCount() > 0 && (
          <Chip
            label={`${getSelectedFeaturesCount()} features selected`}
            color="primary"
            sx={{ mt: 1 }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {featureCategories.map((category) => {
          const isDisabled = isEnterpriseFeatureDisabled(category.id);
          const selectedCount = getCategorySelectedCount(category.id);
          const hasSelectedFeatures = selectedCount > 0;

          return (
            <Accordion
              key={category.id}
              disabled={isDisabled && !hasSelectedFeatures}
              sx={{
                border: hasSelectedFeatures
                  ? `2px solid ${category.color}`
                  : '1px solid #e2e8f0',
                borderRadius: '8px !important',
                '&:before': { display: 'none' },
                '&.Mui-disabled': {
                  backgroundColor: '#f8fafc',
                  opacity: 0.6,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<FaExpandAlt />}
                sx={{
                  backgroundColor: hasSelectedFeatures
                    ? `${category.color}10`
                    : 'transparent',
                  borderRadius: '8px',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                  },
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                  <Box
                    sx={{ mr: 2, color: category.color, fontSize: '1.5rem' }}
                  >
                    {category.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {category.name}
                      {selectedCount > 0 && (
                        <Chip
                          label={`${selectedCount} selected`}
                          size="small"
                          sx={{
                            ml: 2,
                            backgroundColor: category.color,
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                  {isDisabled && !hasSelectedFeatures && (
                    <Chip
                      label="Disabled"
                      size="small"
                      variant="outlined"
                      sx={{ mr: 2 }}
                    />
                  )}
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ pt: 0 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  }}
                >
                  {category.features.map((feature) => {
                    const isFeatureSelected =
                      enterpriseFeatures?.[feature.key] || false;

                    return (
                      <Card
                        key={feature.key}
                        sx={{
                          border: isFeatureSelected
                            ? `2px solid ${category.color}`
                            : '1px solid #e2e8f0',
                          backgroundColor: isFeatureSelected
                            ? `${category.color}05`
                            : 'white',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ flex: 1, mr: 2 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, mb: 1 }}
                              >
                                {feature.name}
                                {isFeatureSelected && (
                                  <FaCheck
                                    size={14}
                                    style={{
                                      marginLeft: 8,
                                      color: category.color,
                                    }}
                                  />
                                )}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {feature.description}
                              </Typography>
                            </Box>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={isFeatureSelected}
                                  onChange={() =>
                                    handleEnterpriseFeatureToggle(
                                      feature.key,
                                      category.id
                                    )
                                  }
                                  disabled={isDisabled && !isFeatureSelected}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: category.color,
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                      {
                                        backgroundColor: category.color,
                                      },
                                  }}
                                />
                              }
                              label=""
                              sx={{ m: 0 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {getSelectedFeaturesCount() === 0 && (
        <Box
          sx={{
            mt: 3,
            p: 3,
            backgroundColor: '#f0f9ff',
            borderRadius: 2,
            border: '1px solid #bae6fd',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            💡 <strong>Tip:</strong> Enterprise features are optional. You can
            select features from one category to enhance your POS system, or
            skip this step to continue with the standard package.
          </Typography>
        </Box>
      )}

      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        isNextDisabled={false}
        isNextLoading={loading}
        isBackLoading={backLoading}
        nextLabel="Continue"
        backLabel="Back"
      />
    </Box>
  );
};

export default EnterpriseFeatureStep;
