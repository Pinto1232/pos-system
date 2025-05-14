'use client';

import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { apiClient } from '@/api/axiosClient';
import CustomPackageLayout from './CustomPackageLayout';
import WaveLoading from '@/components/ui/WaveLoading/WaveLoading';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {
  AlertProps,
} from '@mui/material/Alert';
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
import { debounce } from 'lodash';
import LazyLoginForm from '@/components/login-form/LoginForm';

interface CustomPackageLayoutContainerProps {
  selectedPackage: Package;
}

const Alert = React.forwardRef<
  HTMLDivElement,
  AlertProps
>(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
    />
  );
});

const CustomPackageLayoutContainer: React.FC<
  CustomPackageLayoutContainerProps
> = ({ selectedPackage }) => {
  const { showSuccessModal } = useSuccessModal();
  const { currency } = useCurrency();
  const [currentStep, setCurrentStep] =
    useState(0);
  const [steps, setSteps] = useState<string[]>(
    []
  );
  const [features, setFeatures] = useState<
    Feature[]
  >([]);
  const [addOns, setAddOns] = useState<AddOn[]>(
    []
  );
  const [usagePricing, setUsagePricing] =
    useState<UsagePricing[]>([]);
  const [selectedFeatures, setSelectedFeatures] =
    useState<Feature[]>([]);
  const [selectedAddOns, setSelectedAddOns] =
    useState<AddOn[]>([]);
  const [usageQuantities, setUsageQuantities] =
    useState<Record<number, number>>({});
  const [isLoading, setIsLoading] =
    useState(true);
  // Initialize with the base price from the selected package
  // For custom packages, this will typically be 129.99 (set in PricingPackageCard)
  const [calculatedPrice, setCalculatedPrice] =
    useState<number>(selectedPackage.type.toLowerCase().includes('custom') && selectedPackage.price === 0
      ? 129.99
      : selectedPackage.price);
  const [snackbarOpen, setSnackbarOpen] =
    useState(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState('');
  const [showLoginForm, setShowLoginForm] =
    useState(false);
  const [
    enterpriseFeatures,
    setEnterpriseFeatures,
  ] = useState<Record<string, boolean>>({
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
    const builtSteps =
      selectedPackage.isCustomizable
        ? [...defaultStepsCustom]
        : [...defaultStepsNonCustom];
    console.log('Built steps:', builtSteps);
    return builtSteps;
  }, [
    selectedPackage.isCustomizable,
    defaultStepsCustom,
    defaultStepsNonCustom,
  ]);

  // Use the new useAddOns hook to fetch add-ons
  const { data: addOnsResponse, isLoading: isAddOnsLoading } = useAddOns({
    isActive: true,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Fetch core features from the original endpoint
        const featuresResponse =
          await apiClient.get<FeaturesResponse>(
            '/api/pricingpackages/custom/features'
          );
        console.log(
          'Fetched core features response:',
          featuresResponse.data
        );

        const coreFeatures =
          featuresResponse.data.coreFeatures || [];
        const usageData =
          featuresResponse.data.usageBasedPricing || [];

        setFeatures(coreFeatures);
        setUsagePricing(usageData);

        const initialUsageQuantities =
          usageData.reduce(
            (
              acc: Record<number, number>,
              curr: UsagePricing
            ) => ({
              ...acc,
              [curr.id]: curr.defaultValue,
            }),
            {} as Record<number, number>
          );
        setUsageQuantities(
          initialUsageQuantities
        );
        console.log(
          'Initial usage quantities:',
          initialUsageQuantities
        );

        const newSteps = buildSteps();
        setSteps(newSteps);
        setCurrentStep(0);
        console.log(
          'Initialized steps:',
          newSteps
        );
      } catch (error) {
        console.error(
          'Failed to load package config:',
          error
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
        newSteps
      );
    }
  }, [selectedPackage, buildSteps]);

  // Update addOns state when the data from useAddOns hook changes
  useEffect(() => {
    if (addOnsResponse?.data) {
      console.log('AddOns data from React Query:', addOnsResponse.data);
      setAddOns(addOnsResponse.data);
    }
  }, [addOnsResponse]);

  const validateCurrentStep =
    useCallback((): boolean => {
      const currentLabel =
        steps[currentStep]?.trim() || '';
      if (
        currentLabel === 'Select Core Features'
      ) {
        const requiredMissing = features.some(
          (feature) =>
            feature.isRequired &&
            !selectedFeatures.some(
              (f) => f.id === feature.id
            )
        );
        if (requiredMissing) {
          setSnackbarMessage(
            'Please select all required features.'
          );
          setSnackbarOpen(true);
          return false;
        }
      }
      if (currentLabel === 'Configure Usage') {
        for (const usage of usagePricing) {
          const value =
            usageQuantities[usage.id] ??
            usage.defaultValue;
          if (
            value < usage.minValue ||
            value > usage.maxValue
          ) {
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
      const nextStep = Math.min(
        prev + 1,
        steps.length - 1
      );
      console.log(
        `Navigating from step ${prev} to step ${nextStep}`
      );
      return nextStep;
    });
  }, [steps, validateCurrentStep]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
      const prevStep = Math.max(prev - 1, 0);
      console.log(
        `Navigating back from step ${prev} to step ${prevStep}`
      );
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
        features: selectedFeatures.map(
          (f) => f.name
        ),
        addOns: selectedAddOns.map((a) => a.name),
        packageType:
          selectedPackage.isCustomizable
            ? 'Custom'
            : 'Standard',
      };

      const existingCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );

      // Add new item to cart
      const updatedCart = [
        ...existingCartItems,
        cartItem,
      ];

      // Save updated cart to localStorage
      localStorage.setItem(
        'cartItems',
        JSON.stringify(updatedCart)
      );

      setSnackbarMessage(
        'Package added to cart successfully!'
      );
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

  const handleReturnToPackage =
    useCallback(() => {
      // No need to set modal state as it's handled by the context
      console.log('Return to package');
    }, []);

  const handleSave = useCallback(
    async (data: {
      selectedFeatures: Feature[];
      selectedAddOns: AddOn[];
      usageQuantities: Record<number, number>;
      calculatedPrice: number;
      selectedCurrency: string;
      formData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        country: string;
        state: string;
        city: string;
        zipCode: string;
      };
    }) => {
      if (currentStep !== steps.length - 1)
        return;
      if (!validateCurrentStep()) return;

      setIsLoading(true);

      const request: PackageSelectionRequest = {
        packageId: selectedPackage.id,
        ...(selectedPackage.isCustomizable && {
          features: selectedFeatures.map(
            (f) => f.id
          ),
          addOns: selectedAddOns.map((a) => a.id),
          usage: usageQuantities,
        }),
      };

      console.log(
        'Saving package configuration with request:',
        request
      );
      console.log(
        'Form data captured:',
        data.formData
      );

      try {
        await apiClient.post(
          '/api/pricingpackages/custom/select',
          request
        );
        console.log(
          'Package saved successfully!'
        );

        // Show success message using context
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
        console.error('Save failed:', error);
        setSnackbarMessage(
          'Error saving package!'
        );
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

  type PackageDataType = {
    formData?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      address?: string;
      country?: string;
      state?: string;
      city?: string;
      zipCode?: string;
      [key: string]: string | undefined;
    };
    selectedFeatures?: Feature[];
    selectedAddOns?: AddOn[];
    usageQuantities?: Record<number, number>;
    calculatedPrice?: number;
    selectedCurrency?: string;
  } | null;

  const handleShowSuccessMessage = (
    message: string,
    packageData?: PackageDataType
  ) => {
    // Use the SuccessModalContext to show the success modal
    showSuccessModal({
      message: message,
      onConfirm: handleModalConfirm,
      onReturn: handleReturnToPackage,
      selectedPackage: selectedPackage,
      currentCurrency:
        packageData?.selectedCurrency,
      formData: packageData?.formData,
      selectedFeatures:
        packageData?.selectedFeatures,
      selectedAddOns: packageData?.selectedAddOns,
      usageQuantities:
        packageData?.usageQuantities,
      calculatedPrice:
        packageData?.calculatedPrice,
    });
  };

  useEffect(() => {
    if (selectedPackage.isCustomizable) {
      const calculatePrice = debounce(
        async () => {
          // Ensure we're using the correct base price for custom packages
          const basePrice = selectedPackage.type.toLowerCase().includes('custom') && selectedPackage.price === 0
            ? 129.99
            : selectedPackage.price;

          const requestBody: PriceCalculationRequest =
            {
              packageId: selectedPackage.id,
              basePrice: basePrice, // Add the base price to the request
              selectedFeatures:
                selectedFeatures.map((f) => f.id),
              selectedAddOns: selectedAddOns.map(
                (a) => a.id
              ),
              usageLimits: usageQuantities,
            };

          console.log(
            'Calculating price with request body:',
            requestBody
          );

          try {
            const response =
              await apiClient.post<PriceCalculationResponse>(
                '/api/pricingpackages/custom/calculate-price',
                requestBody
              );
            console.log(
              'Price calculation response:',
              response.data
            );
            setCalculatedPrice(
              response.data.totalPrice
            );
          } catch (error) {
            console.error(
              'Failed to calculate price:',
              error
            );
          }
        },
        300
      );

      calculatePrice();

      return () => {
        calculatePrice.cancel();
      };
    }
  }, [
    selectedFeatures,
    selectedAddOns,
    usageQuantities,
    selectedPackage,
  ]);

  const handleEnterpriseFeatureToggle =
    useCallback((featureId: string) => {
      setEnterpriseFeatures((prev) => ({
        ...prev,
        [featureId]: !prev[featureId],
      }));
    }, []);

  if (isLoading || isAddOnsLoading) return <WaveLoading />;
  if (showLoginForm) return <LazyLoginForm />;

  return (
    <>
      <CustomPackageLayout
        isCustomizable={
          selectedPackage.isCustomizable
        }
        currentStep={currentStep}
        onShowSuccessMessage={
          handleShowSuccessMessage
        }
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
          description:
            selectedPackage.description,
          testPeriod:
            selectedPackage.testPeriodDays,
        }}
        selectedPackage={selectedPackage}
        onNext={handleNext}
        onBack={handleBack}
        onSave={handleSave}
        onFeatureToggle={(features) => {
          console.log(
            'Toggling features:',
            features
          );
          setSelectedFeatures(features);
        }}
        onAddOnToggle={(addOns) => {
          console.log(
            'Toggling add-ons:',
            addOns
          );
          setSelectedAddOns(addOns);
        }}
        onUsageChange={(quantities) => {
          console.log(
            'Updating usage quantities:',
            quantities
          );
          setUsageQuantities(quantities);
        }}
        setSelectedCurrency={() => {}}
        enterpriseFeatures={enterpriseFeatures}
        onEnterpriseFeatureToggle={
          handleEnterpriseFeatureToggle
        }
        // Pass the current currency from CurrencyContext
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
            snackbarMessage.includes(
              'successfully'
            )
              ? 'success'
              : 'warning'
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomPackageLayoutContainer;
