'use client';

import React from 'react';
import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import styles from './CustomPackageLayout.module.css';
import { CustomPackageLayoutProps } from './types/index';
import { PackageProvider } from './context/PackageContext';
import StepperComponent from './components/shared/StepperComponent';
import PackageDetailsStep from './components/steps/PackageDetailsStep';
import CoreFeaturesStep from './components/steps/CoreFeaturesStep';
import AddOnsStep from './components/steps/AddOnsStep';
import UsageStep from './components/steps/UsageStep';
import PaymentPlanStep from './components/steps/PaymentPlanStep';
import SupportLevelStep from './components/steps/SupportLevelStep';
import EnterpriseFeatureStep from './components/steps/EnterpriseFeatureStep';
import ReviewConfirmStep from './components/steps/ReviewConfirmStep';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import {
  SavedPackageData,
  SuccessMessageData,
  AddOn as IndexAddOn,
} from './types/index';
import { AddOn as TypesAddOn } from './types';

const convertAddOns = (addOns: IndexAddOn[]): TypesAddOn[] => {
  return addOns.map((addOn) => {
    let features: string[] = [];
    if (typeof addOn.features === 'string') {
      features = [addOn.features];
    } else if (Array.isArray(addOn.features)) {
      features = addOn.features;
    }

    let dependencies: string[] = [];
    if (typeof addOn.dependencies === 'string') {
      dependencies = [addOn.dependencies];
    } else if (Array.isArray(addOn.dependencies)) {
      dependencies = addOn.dependencies;
    }

    return {
      ...addOn,
      features,
      dependencies,
    } as TypesAddOn;
  });
};

const createSuccessMessage = (
  message: string,
  data: SavedPackageData
): SuccessMessageData => {
  return {
    formData: data.formData,
    selectedFeatures: data.selectedFeatures,
    selectedAddOns: data.selectedAddOns,
    usageQuantities: data.usageQuantities,
    calculatedPrice: data.calculatedPrice,
    selectedCurrency: data.selectedCurrency,
  };
};

const CustomPackageLayout: React.FC<CustomPackageLayoutProps> = (props) => {
  const { currentStep, steps } = props;

  const { setTestPeriod } = useTestPeriod();

  const initialData = {
    features: props.features,
    addOns: convertAddOns(props.addOns),
    usagePricing: props.usagePricing,
    selectedFeatures: props.selectedFeatures,
    selectedAddOns: convertAddOns(props.selectedAddOns),
    usageQuantities: props.usageQuantities,
    basePrice: props.basePrice,
    calculatedPrice: props.calculatedPrice,
    packageDetails: props.packageDetails,
    selectedPackage: props.selectedPackage,
    isCustomizable: props.isCustomizable,
    currentStep: props.currentStep,
    enterpriseFeatures: props.enterpriseFeatures,
    currentCurrency: props.currentCurrency,
  };

  const callbacks = {
    onNext: props.onNext,
    onBack: props.onBack,
    onSave: (data: SavedPackageData) => {
      setTestPeriod(props.selectedPackage.testPeriodDays);
      props.onSave(data);

      if (props.onShowSuccessMessage) {
        const successMessage = 'Package configuration saved successfully!';
        const successData = createSuccessMessage(successMessage, data);
        props.onShowSuccessMessage(successMessage, successData);
      }
    },
    onFeatureToggle: props.onFeatureToggle,
    onAddOnToggle: (addOns: IndexAddOn[]) => {
      props.onAddOnToggle(addOns);
    },
    onUsageChange: props.onUsageChange,
    setSelectedCurrency: props.setSelectedCurrency,
    onEnterpriseFeatureToggle: props.onEnterpriseFeatureToggle,
    onShowSuccessMessage: props.onShowSuccessMessage,
  };

  const renderStepContent = () => {
    const currentLabel = steps[currentStep]?.trim() || '';

    if (!currentLabel) {
      return null;
    }

    switch (currentLabel) {
      case 'Package Details':
        return <PackageDetailsStep />;
      case 'Select Core Features':
        return <CoreFeaturesStep />;
      case 'Choose Add-Ons':
        return <AddOnsStep />;
      case 'Configure Usage':
        return <UsageStep />;
      case 'Select Payment Plan':
        return <PaymentPlanStep />;
      case 'Choose Support Level':
        return <SupportLevelStep />;
      case 'Configure Enterprise Features':
        return <EnterpriseFeatureStep />;
      case 'Review & Confirm':
        return <ReviewConfirmStep />;

      default:
        return null;
    }
  };

  return (
    <PackageProvider initialData={initialData} callbacks={callbacks}>
      <Card className={styles.container} elevation={0} sx={{ borderRadius: 0 }}>
        <CardContent
          sx={{
            padding: { xs: '1rem', sm: '1.5rem' },
            '&:last-child': {
              paddingBottom: {
                xs: '1rem',
                sm: '1.5rem',
              },
            },
          }}
        >
          <StepperComponent steps={steps} currentStep={currentStep} />

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            {renderStepContent()}
          </motion.div>
        </CardContent>
      </Card>
    </PackageProvider>
  );
};

export default React.memo(CustomPackageLayout);
