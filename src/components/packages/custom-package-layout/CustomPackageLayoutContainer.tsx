'use client';

import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { apiClient } from '@/api/axiosClient';
import CustomPackageLayout from './CustomPackageLayout';
import SuccessMessage from '@/components/ui/success-message/SuccessMessage';
import WaveLoading from '@/components/ui/WaveLoading/WaveLoading';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {
  AlertProps,
} from '@mui/material/Alert';

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
  const [calculatedPrice, setCalculatedPrice] =
    useState<number>(selectedPackage.price);
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [modalMessage, setModalMessage] =
    useState('');
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

  const [
    currentPackageData,
    setCurrentPackageData,
  ] = useState<any>(null);

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

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response =
          await apiClient.get<FeaturesResponse>(
            '/api/pricingpackages/custom/features'
          );
        console.log(
          'Fetched config response:',
          response.data
        );

        const coreFeatures =
          response.data.coreFeatures || [];
        const addOnsData =
          response.data.addOns || [];
        const usageData =
          response.data.usageBasedPricing || [];

        setFeatures(coreFeatures);
        setAddOns(addOnsData);
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

      setModalMessage('Saving package...');
      setIsModalOpen(true);
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
        setModalMessage(
          'Package saved successfully!'
        );
      } catch (error) {
        console.error('Save failed:', error);
        setModalMessage('Error saving package!');
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
    ]
  );

  const handleModalConfirm = (
    isSignup: boolean
  ) => {
    const cartItem = {
      id: Date.now(),
      name: selectedPackage.title,
      price: calculatedPrice,
      quantity: 1,
      features: selectedFeatures.map(
        (f) => f.name
      ),
      addOns: selectedAddOns.map((a) => a.name),
      packageType: selectedPackage.isCustomizable
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

    // Close the modal
    setIsModalOpen(false);

    setSnackbarMessage(
      'Package added to cart successfully!'
    );
    setSnackbarOpen(true);

    if (isSignup) {
      setShowLoginForm(true);
    }
  };

  const handleShowSuccessMessage = (
    message: string,
    packageData?: {
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
        [key: string]: any;
      };
      selectedFeatures?: Feature[];
      selectedAddOns?: AddOn[];
      usageQuantities?: Record<number, number>;
      calculatedPrice?: number;
      selectedCurrency?: string;
    }
  ) => {
    setModalMessage(message);
    setIsModalOpen(true);
    setCurrentPackageData(packageData);
  };

  const handleReturnToPackage = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedPackage.isCustomizable) {
      const calculatePrice = debounce(
        async () => {
          const requestBody: PriceCalculationRequest =
            {
              packageId: selectedPackage.id,
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

  if (isLoading) return <WaveLoading />;
  if (showLoginForm) return <LazyLoginForm />;

  return (
    <>
      {!isModalOpen && (
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
        />
      )}
      <SuccessMessage
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
        onConfirm={handleModalConfirm}
        onReturn={handleReturnToPackage}
        selectedPackage={selectedPackage}
        currentCurrency={
          currentPackageData?.selectedCurrency
        }
        formData={currentPackageData?.formData}
        selectedFeatures={
          currentPackageData?.selectedFeatures
        }
        selectedAddOns={
          currentPackageData?.selectedAddOns
        }
        usageQuantities={
          currentPackageData?.usageQuantities
        }
        calculatedPrice={
          currentPackageData?.calculatedPrice
        }
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
