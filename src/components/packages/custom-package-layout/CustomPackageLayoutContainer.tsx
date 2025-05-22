'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/axiosClient';
import CustomPackageLayout from './CustomPackageLayout';
import WaveLoading from '@/components/ui/WaveLoading/WaveLoading';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useSuccessModal } from '@/contexts/SuccessModalContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAddOns } from '@/hooks/useAddOns';

import {
  Package,
  Feature,
  AddOn,
  UsagePricing,
  FeaturesResponse,
  PackageSelectionRequest,
  PriceCalculationRequest,
  PriceCalculationResponse,
} from './types';
import {
  SuccessMessageData,
  SavedPackageData,
  AddOn as IndexAddOn,
} from './types/index';
import { debounce } from 'lodash';
import LazyLoginForm from '@/components/login-form/LoginForm';

interface CustomPackageLayoutContainerProps {
  selectedPackage: Package;
}

const convertToTypesAddOn = (addOn: IndexAddOn): AddOn => {
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
  } as AddOn;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

const CustomPackageLayoutContainer: React.FC<
  CustomPackageLayoutContainerProps
> = ({ selectedPackage }) => {
  const { showSuccessModal } = useSuccessModal();
  const { currency } = useCurrency();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [usagePricing, setUsagePricing] = useState<UsagePricing[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [usageQuantities, setUsageQuantities] = useState<
    Record<number, number>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  const [calculatedPrice, setCalculatedPrice] = useState<number>(
    selectedPackage.type.toLowerCase().includes('custom') &&
      selectedPackage.price === 0
      ? 129.99
      : selectedPackage.price
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [enterpriseFeatures, setEnterpriseFeatures] = useState<
    Record<string, boolean>
  >({
    realTimeAnalytics: false,
    customReports: false,
    dataExport: false,
    predictiveAnalytics: false,
    centralizedManagement: false,
    locationSettings: false,
    crossLocationInventory: false,
    interLocationTransfers: false,
    roleBasedAccess: false,
    advancedEncryption: false,
    auditLogging: false,
    twoFactorAuth: false,
    restfulApi: false,
    webhookNotifications: false,
    customIntegration: false,
    bulkDataImport: false,
  });

  // We don't need to track package data in state anymore as we're using the context

  const defaultStepsCustom = React.useMemo(
    () => [
      'Package Details',
      'Select Core Features',
      'Choose Add-Ons',
      'Configure Usage',
      'Select Payment Plan',
      'Choose Support Level',
      'Configure Integrations',
      'Review & Confirm',
    ],
    []
  );

  const defaultStepsNonCustom = React.useMemo(
    () => [
      'Package Details',
      'Select Payment Plan',
      'Choose Support Level',
      'Configure Enterprise Features',
      'Review & Confirm',
    ],
    []
  );

  const buildSteps = useCallback(() => {
    const builtSteps = selectedPackage.isCustomizable
      ? [...defaultStepsCustom]
      : [...defaultStepsNonCustom];
    console.log('Built steps:', JSON.stringify(builtSteps, null, 2));
    return builtSteps;
  }, [
    selectedPackage.isCustomizable,
    defaultStepsCustom,
    defaultStepsNonCustom,
  ]);

  const { data: addOnsResponse, isLoading: isAddOnsLoading } = useAddOns({
    isActive: true,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const featuresResponse = await apiClient.get<FeaturesResponse>(
          '/api/pricingpackages/custom/features'
        );
        console.log(
          'Fetched core features response:',
          JSON.stringify(featuresResponse.data, null, 2)
        );

        const coreFeatures = featuresResponse.data.coreFeatures || [];
        const usageData = featuresResponse.data.usageBasedPricing || [];

        setFeatures(coreFeatures);
        setUsagePricing(usageData);

        const initialUsageQuantities = usageData.reduce(
          (acc: Record<number, number>, curr: UsagePricing) => ({
            ...acc,
            [curr.id]: curr.defaultValue,
          }),
          {} as Record<number, number>
        );
        setUsageQuantities(initialUsageQuantities);
        console.log(
          'Initial usage quantities:',
          JSON.stringify(initialUsageQuantities, null, 2)
        );

        const newSteps = buildSteps();
        setSteps(newSteps);
        setCurrentStep(0);
        console.log('Initialized steps:', JSON.stringify(newSteps, null, 2));
      } catch (error) {
        console.error(
          'Failed to load package config:',
          JSON.stringify(error, null, 2)
        );
        const newSteps = buildSteps();
        setSteps(newSteps);
        setCurrentStep(0);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    if (selectedPackage.isCustomizable) {
      fetchConfig();
    } else {
      const newSteps = buildSteps();
      setSteps(newSteps);
      setIsLoading(false);
      setCurrentStep(0);
      console.log(
        'Non-customizable package. Steps set to:',
        JSON.stringify(newSteps, null, 2)
      );
    }
  }, [selectedPackage, buildSteps]);

  useEffect(() => {
    if (addOnsResponse?.data && Array.isArray(addOnsResponse.data)) {
      console.log(
        'AddOns data from React Query:',
        JSON.stringify(addOnsResponse.data, null, 2)
      );
      setAddOns(addOnsResponse.data);
    } else if (
      addOnsResponse &&
      (!addOnsResponse.data || addOnsResponse.data.length === 0)
    ) {
      console.log(
        'AddOns response received but data is empty, using fallback data'
      );

      const fallbackAddOns = [
        {
          id: 1,
          name: 'Advanced Analytics',
          description: 'Detailed business analytics and insights',
          price: 15.0,
          currency: 'USD',
          multiCurrencyPrices: {
            USD: 15.0,
            EUR: 13.5,
            GBP: 11.5,
            ZAR: 270.0,
          },
          category: 'Analytics',
          isActive: true,
          features: [
            'Real-time data visualization',
            'Custom report generation',
          ],
          dependencies: ['Internet connection'],
          icon: 'analytics_icon',
        },
        {
          id: 2,
          name: 'API Access',
          description: 'Access to API for custom integrations',
          price: 25.0,
          currency: 'USD',
          multiCurrencyPrices: {
            USD: 25.0,
            EUR: 22.5,
            GBP: 19.5,
            ZAR: 450.0,
          },
          category: 'Integration',
          isActive: true,
          features: ['RESTful API endpoints', 'Webhook notifications'],
          dependencies: ['Developer knowledge'],
          icon: 'api_icon',
        },
        {
          id: 3,
          name: 'Custom Branding',
          description: 'White-label solution with your branding',
          price: 20.0,
          currency: 'USD',
          multiCurrencyPrices: {
            USD: 20.0,
            EUR: 18.0,
            GBP: 15.5,
            ZAR: 360.0,
          },
          category: 'Customization',
          isActive: true,
          features: ['Logo customization', 'Color scheme adjustment'],
          dependencies: ['Brand assets'],
          icon: 'branding_icon',
        },
      ];

      setAddOns(fallbackAddOns);
    }
  }, [addOnsResponse]);

  const validateCurrentStep = useCallback((): boolean => {
    const currentLabel = steps[currentStep]?.trim() || '';
    if (currentLabel === 'Select Core Features') {
      const requiredMissing = features.some(
        (feature) =>
          feature.isRequired &&
          !selectedFeatures.some((f) => f.id === feature.id)
      );
      if (requiredMissing) {
        setSnackbarMessage('Please select all required features.');
        setSnackbarOpen(true);
        return false;
      }
    }
    if (currentLabel === 'Configure Usage') {
      for (const usage of usagePricing) {
        const value = usageQuantities[usage.id] ?? usage.defaultValue;
        if (value < usage.minValue || value > usage.maxValue) {
          setSnackbarMessage(
            `For ${usage.name}, please enter a value between ${usage.minValue} and ${usage.maxValue}.`
          );
          setSnackbarOpen(true);
          return false;
        }
      }
    }
    return true;
  }, [
    steps,
    currentStep,
    features,
    selectedFeatures,
    usageQuantities,
    usagePricing,
  ]);

  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) return;
    setCurrentStep((prev) => {
      const nextStep = Math.min(prev + 1, steps.length - 1);
      console.log(`Navigating from step ${prev} to step ${nextStep}`);
      return nextStep;
    });
  }, [steps, validateCurrentStep]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
      const prevStep = Math.max(prev - 1, 0);
      console.log(`Navigating back from step ${prev} to step ${prevStep}`);
      return prevStep;
    });
  }, []);

  const handleModalConfirm = useCallback(
    (isSignup: boolean) => {
      const cartItem = {
        id: Date.now(),
        name: selectedPackage.title,
        price: calculatedPrice,
        quantity: 1,
        features: selectedFeatures.map((f) => f.name),
        addOns: selectedAddOns.map((a) => a.name),
        packageType: selectedPackage.isCustomizable ? 'Custom' : 'Standard',
      };

      const existingCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );

      const updatedCart = [...existingCartItems, cartItem];

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));

      setSnackbarMessage('Package added to cart successfully!');
      setSnackbarOpen(true);

      if (isSignup) {
        setShowLoginForm(true);
      }
    },
    [
      selectedPackage,
      calculatedPrice,
      selectedFeatures,
      selectedAddOns,
      setShowLoginForm,
    ]
  );

  const handleReturnToPackage = useCallback(() => {
    console.log('Return to package');
  }, []);

  const handleSave = useCallback(
    async (data: SavedPackageData) => {
      if (currentStep !== steps.length - 1) return;
      if (!validateCurrentStep()) return;

      setIsLoading(true);

      const request: PackageSelectionRequest = {
        packageId: selectedPackage.id,
        ...(selectedPackage.isCustomizable && {
          features: selectedFeatures.map((f) => f.id),
          addOns: selectedAddOns.map((a) => a.id),
          usage: usageQuantities,
        }),
      };

      console.log(
        'Saving package configuration with request:',
        JSON.stringify(request, null, 2)
      );
      console.log(
        'Form data captured:',
        JSON.stringify(data.formData, null, 2)
      );

      try {
        await apiClient.post('/api/pricingpackages/custom/select', request);
        console.log('Package saved successfully!');

        showSuccessModal({
          message: 'Package saved successfully!',
          onConfirm: handleModalConfirm,
          onReturn: handleReturnToPackage,
          selectedPackage: selectedPackage,
          currentCurrency: data.selectedCurrency,
          formData: data.formData,
          selectedFeatures: data.selectedFeatures,
          selectedAddOns: data.selectedAddOns,
          usageQuantities: data.usageQuantities,
          calculatedPrice: data.calculatedPrice,
        });
      } catch (error) {
        console.error('Save failed:', JSON.stringify(error, null, 2));
        setSnackbarMessage('Error saving package!');
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentStep,
      steps.length,
      selectedPackage,
      selectedFeatures,
      selectedAddOns,
      usageQuantities,
      validateCurrentStep,
      showSuccessModal,
      handleModalConfirm,
      handleReturnToPackage,
    ]
  );

  const handleShowSuccessMessage = (
    message: string,
    packageData?: SuccessMessageData
  ) => {
    showSuccessModal({
      message: message,
      onConfirm: handleModalConfirm,
      onReturn: handleReturnToPackage,
      selectedPackage: selectedPackage,
      currentCurrency: packageData?.selectedCurrency,
      formData: packageData?.formData,
      selectedFeatures: packageData?.selectedFeatures,
      selectedAddOns: packageData?.selectedAddOns,
      usageQuantities: packageData?.usageQuantities,
      calculatedPrice: packageData?.calculatedPrice,
    });
  };

  useEffect(() => {
    if (selectedPackage.isCustomizable) {
      const calculatePrice = debounce(async () => {
        const basePrice =
          selectedPackage.type.toLowerCase().includes('custom') &&
          selectedPackage.price === 0
            ? 129.99
            : selectedPackage.price;

        const requestBody: PriceCalculationRequest = {
          packageId: selectedPackage.id,
          basePrice: basePrice,
          selectedFeatures: selectedFeatures.map((f) => f.id),
          selectedAddOns: selectedAddOns.map((a) => a.id),
          usageLimits: usageQuantities,
        };

        console.log(
          'Calculating price with request body:',
          JSON.stringify(requestBody, null, 2)
        );

        try {
          const response = await apiClient.post<PriceCalculationResponse>(
            '/api/pricingpackages/custom/calculate-price',
            requestBody
          );
          console.log(
            'Price calculation response:',
            JSON.stringify(response.data, null, 2)
          );
          setCalculatedPrice(response.data.totalPrice);
        } catch (error) {
          console.error(
            'Failed to calculate price:',
            JSON.stringify(error, null, 2)
          );
        }
      }, 300);

      calculatePrice();

      return () => {
        calculatePrice.cancel();
      };
    }
  }, [selectedFeatures, selectedAddOns, usageQuantities, selectedPackage]);

  const handleEnterpriseFeatureToggle = useCallback((featureId: string) => {
    setEnterpriseFeatures((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
  }, []);

  const shouldShowLoading =
    isLoading || (selectedPackage.isCustomizable && isAddOnsLoading);

  if (shouldShowLoading) return <WaveLoading />;
  if (showLoginForm) return <LazyLoginForm />;

  return (
    <>
      <CustomPackageLayout
        isCustomizable={selectedPackage.isCustomizable}
        currentStep={currentStep}
        onShowSuccessMessage={handleShowSuccessMessage}
        steps={steps}
        features={features}
        addOns={addOns}
        usagePricing={usagePricing}
        selectedFeatures={selectedFeatures}
        selectedAddOns={selectedAddOns}
        usageQuantities={usageQuantities}
        basePrice={selectedPackage.price}
        calculatedPrice={calculatedPrice}
        packageDetails={{
          title: selectedPackage.title,
          description: selectedPackage.description,
          testPeriod: selectedPackage.testPeriodDays,
        }}
        selectedPackage={selectedPackage}
        onNext={handleNext}
        onBack={handleBack}
        onSave={handleSave}
        onFeatureToggle={(features) => {
          console.log('Toggling features:', JSON.stringify(features, null, 2));
          setSelectedFeatures(features);
        }}
        onAddOnToggle={(addOns) => {
          console.log('Toggling add-ons:', JSON.stringify(addOns, null, 2));

          const convertedAddOns = addOns.map(convertToTypesAddOn);
          setSelectedAddOns(convertedAddOns);
        }}
        onUsageChange={(quantities) => {
          console.log(
            'Updating usage quantities:',
            JSON.stringify(quantities, null, 2)
          );
          setUsageQuantities(quantities);
        }}
        setSelectedCurrency={() => {}}
        enterpriseFeatures={enterpriseFeatures}
        onEnterpriseFeatureToggle={handleEnterpriseFeatureToggle}
        currentCurrency={currency}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            snackbarMessage.includes('successfully') ? 'success' : 'warning'
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomPackageLayoutContainer;
