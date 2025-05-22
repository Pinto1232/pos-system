'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Feature, AddOn, UsagePricing, Package } from '../types';
import type {
  FormData,
  PricingState,
  EnterpriseFeatures,
  PackageDetails,
  SavedPackageData,
  SuccessMessageData,
} from '../types/index';
import {
  toggleItemSelection,
  updateUsageQuantity,
  toggleCheckboxWithReset,
} from '../utils/selectionUtils';
import { getItemPrice } from '../utils/priceUtils';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PackageContextType {
  currentStep: number;
  features: Feature[];
  addOns: AddOn[];
  usagePricing: UsagePricing[];
  selectedFeatures: Feature[];
  selectedAddOns: AddOn[];
  usageQuantities: Record<number, number>;
  formData: FormData;
  checkboxStates: Record<string, boolean>;
  selectedPlanIndex: number | null;
  selectedSupportIndex: number | null;
  enterpriseFeatures?: EnterpriseFeatures;
  activeEnterpriseCategory: string | null;
  dialogOpen: boolean;
  loading: boolean;
  backLoading: boolean;

  basePrice: number;
  pricingState: PricingState;

  packageDetails: PackageDetails;
  selectedPackage: Package;
  isCustomizable: boolean;

  setCurrentStep: (step: number) => void;
  handleFeatureToggle: (feature: Feature) => void;
  handleAddOnToggle: (addOn: AddOn) => void;
  handleUsageUpdate: (id: number, value: string) => void;
  handleTextFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;
  handleCheckboxChange: (id: string) => void;
  handlePlanSelect: (index: number) => void;
  handleSupportSelect: (index: number) => void;
  handleEnterpriseFeatureToggle: (
    featureName: string,
    category: string
  ) => void;
  handleDialogClose: () => void;
  handleInfoClick: () => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSave: () => void;
  isAnyCheckboxSelected: () => boolean;
  isAnyEnterpriseFeatureSelected: () => boolean;
  isEnterpriseFeatureDisabled: (category: string) => boolean;

  selectedCurrency: string;
  formatPrice: (currency: string, price: number) => string;
  getCurrencySymbol: (currency: string) => string;
  getCurrentCurrencySymbol: () => string;
  convertPrice: (price: number) => number;
  formatCurrencyPrice: (price: number) => string;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

interface PackageProviderProps {
  children: ReactNode;
  initialData: {
    features: Feature[];
    addOns: AddOn[];
    usagePricing: UsagePricing[];
    selectedFeatures: Feature[];
    selectedAddOns: AddOn[];
    usageQuantities: Record<number, number>;
    basePrice: number;
    calculatedPrice: number;
    packageDetails: PackageDetails;
    selectedPackage: Package;
    isCustomizable: boolean;
    currentStep: number;
    enterpriseFeatures?: EnterpriseFeatures;
    currentCurrency?: string;
  };
  callbacks: {
    onNext: () => void;
    onBack: () => void;
    onSave: (data: SavedPackageData) => void;
    onFeatureToggle: (features: Feature[]) => void;
    onAddOnToggle: (addOns: AddOn[]) => void;
    onUsageChange: (quantities: Record<number, number>) => void;
    setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
    onEnterpriseFeatureToggle?: (featureId: string) => void;
    onShowSuccessMessage?: (
      message: string,
      packageData?: SuccessMessageData
    ) => void;
  };
}

export const PackageProvider: React.FC<PackageProviderProps> = ({
  children,
  initialData,
  callbacks,
}) => {
  const {
    features,
    addOns,
    usagePricing,
    selectedFeatures: initialSelectedFeatures,
    selectedAddOns: initialSelectedAddOns,
    usageQuantities: initialUsageQuantities,
    basePrice,
    packageDetails,
    selectedPackage,
    isCustomizable,
    currentStep: initialStep,
    enterpriseFeatures: initialEnterpriseFeatures,
    currentCurrency: propsCurrency,
  } = initialData;

  const {
    onNext,
    onBack,
    onSave,
    onFeatureToggle,
    onAddOnToggle,
    onUsageChange,
    setSelectedCurrency,
    onEnterpriseFeatureToggle,
    onShowSuccessMessage,
  } = callbacks;

  const {
    currency: contextCurrency,
    formatPrice: formatCurrencyPrice,
    rate,
    currencySymbol,
  } = useCurrency();

  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>(
    initialSelectedFeatures
  );
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>(
    initialSelectedAddOns
  );
  const [usageQuantities, setUsageQuantities] = useState<
    Record<number, number>
  >(initialUsageQuantities);
  const [loading, setLoading] = useState<boolean>(false);
  const [backLoading, setBackLoading] = useState<boolean>(false);
  const [selectedCurrency, setInternalCurrency] = useState<string>(
    propsCurrency || contextCurrency
  );
  const [enterpriseFeatures, setEnterpriseFeatures] = useState<
    EnterpriseFeatures | undefined
  >(initialEnterpriseFeatures);
  const [activeEnterpriseCategory, setActiveEnterpriseCategory] = useState<
    string | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(
    null
  );
  const [selectedSupportIndex, setSelectedSupportIndex] = useState<
    number | null
  >(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
  });

  // Checkbox states for package selection
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>(
    addOns.reduce(
      (acc, addOn) => {
        acc[`business-${addOn.id}`] = false;
        acc[`startup-${addOn.id}`] = false;
        acc[`personal-${addOn.id}`] = false;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  // Pricing state
  const [pricingState, setPricingState] = useState<PricingState>({
    totalFeaturePrice: 0,
    featurePrices: {},
    planDiscount: 0,
    supportPrice: 0,
    totalPrice: basePrice,
  });

  // Initialize feature prices when features are loaded
  React.useEffect(() => {
    if (features.length > 0) {
      const priceMap: Record<number, number> = {};

      // Process features
      features.forEach((feature) => {
        priceMap[feature.id] = getItemPrice(
          feature,
          selectedCurrency,
          {},
          'basePrice'
        );
      });

      addOns.forEach((addOn) => {
        priceMap[addOn.id] = getItemPrice(addOn, selectedCurrency, {}, 'price');
      });

      usagePricing.forEach((item) => {
        priceMap[item.id] = getItemPrice(
          item,
          selectedCurrency,
          {},
          'pricePerUnit'
        );
      });

      setPricingState((prev: PricingState) => ({
        ...prev,
        featurePrices: priceMap,
      }));
    }
  }, [features, addOns, usagePricing, selectedCurrency]);

  React.useEffect(() => {
    const featureTotal = selectedFeatures.reduce((sum, feature) => {
      const featurePrice =
        pricingState.featurePrices[feature.id] ||
        getItemPrice(
          feature,
          selectedCurrency,
          pricingState.featurePrices,
          'basePrice'
        );
      return sum + featurePrice;
    }, 0);

    const addOnTotal = selectedAddOns.reduce((sum, addOn) => {
      const addOnPrice =
        pricingState.featurePrices[addOn.id] ||
        getItemPrice(
          addOn,
          selectedCurrency,
          pricingState.featurePrices,
          'price'
        );
      return sum + addOnPrice;
    }, 0);

    const usageTotal = Object.entries(usageQuantities).reduce(
      (sum, [idStr, quantity]) => {
        const id = parseInt(idStr);
        const usageItem = usagePricing.find((item) => item.id === id);
        if (!usageItem) return sum;

        const usagePrice =
          pricingState.featurePrices[id] ||
          getItemPrice(
            usageItem,
            selectedCurrency,
            pricingState.featurePrices,
            'pricePerUnit'
          );

        const itemTotal = usagePrice * quantity;
        return sum + itemTotal;
      },
      0
    );

    const featuresSum = featureTotal + addOnTotal + usageTotal;

    const subtotal = basePrice + featuresSum + pricingState.supportPrice;
    const discount = subtotal * pricingState.planDiscount;
    const finalTotal = subtotal - discount;

    setPricingState((prev: PricingState) => ({
      ...prev,
      totalFeaturePrice: featuresSum,
      totalPrice: finalTotal,
    }));
  }, [
    selectedFeatures,
    selectedAddOns,
    usageQuantities,
    pricingState.featurePrices,
    selectedCurrency,
    pricingState.planDiscount,
    pricingState.supportPrice,
    basePrice,
    usagePricing,
  ]);

  React.useEffect(() => {
    if (!enterpriseFeatures) return;

    const categories = {
      analytics: ['realTimeAnalytics', 'customReports', 'dataExport'],
      multiLocation: [
        'centralizedManagement',
        'locationSettings',
        'crossLocationInventory',
      ],
      security: ['roleBasedAccess', 'advancedEncryption', 'auditLogging'],
      api: ['restfulApi', 'webhookNotifications', 'customIntegration'],
    };

    let activeCategory: string | null = null;

    for (const [category, features] of Object.entries(categories)) {
      if (features.some((feature) => enterpriseFeatures[feature])) {
        activeCategory = category;
        break;
      }
    }

    setActiveEnterpriseCategory(activeCategory);
  }, [enterpriseFeatures]);

  const handleFeatureToggle = useCallback(
    (feature: Feature) => {
      const newFeatures = toggleItemSelection(feature, selectedFeatures);
      setSelectedFeatures(newFeatures);
      onFeatureToggle(newFeatures);
    },
    [selectedFeatures, onFeatureToggle]
  );

  const handleAddOnToggle = useCallback(
    (addOn: AddOn) => {
      const newAddOns = toggleItemSelection(addOn, selectedAddOns);
      setSelectedAddOns(newAddOns);
      onAddOnToggle(newAddOns);
    },
    [selectedAddOns, onAddOnToggle]
  );

  const handleUsageUpdate = useCallback(
    (id: number, value: string) => {
      const newQuantities = updateUsageQuantity(id, value, usageQuantities);
      setUsageQuantities(newQuantities);
      onUsageChange(newQuantities);
    },
    [usageQuantities, onUsageChange]
  );

  const handleTextFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev: FormData) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      const { name, value } = e.target;
      if (name) {
        setFormData((prev: FormData) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  const handleCheckboxChange = useCallback((id: string) => {
    setCheckboxStates((prevState) => toggleCheckboxWithReset(id, prevState));
  }, []);

  const handlePlanSelect = useCallback(
    (index: number) => {
      const planDiscounts = [0, 0.1, 0.15, 0.2, 0];

      if (selectedPlanIndex === index) {
        setSelectedPlanIndex(null);
        setPricingState((prev: PricingState) => ({
          ...prev,
          planDiscount: 0,
        }));
      } else {
        setSelectedPlanIndex(index);
        const newDiscount =
          index < planDiscounts.length ? planDiscounts[index] : 0;
        setPricingState((prev: PricingState) => ({
          ...prev,
          planDiscount: newDiscount,
        }));
      }
    },
    [selectedPlanIndex]
  );

  const handleSupportSelect = useCallback(
    (index: number) => {
      const supportMultipliers = [0, 0.2, 0.4];

      if (selectedSupportIndex === index) {
        setSelectedSupportIndex(null);
        setPricingState((prev: PricingState) => ({
          ...prev,
          supportPrice: 0,
        }));
      } else {
        setSelectedSupportIndex(index);

        const baseForSupport = basePrice + pricingState.totalFeaturePrice;
        const multiplier =
          index < supportMultipliers.length ? supportMultipliers[index] : 0;
        const newSupportPrice = baseForSupport * multiplier;

        setPricingState((prev: PricingState) => ({
          ...prev,
          supportPrice: newSupportPrice,
        }));
      }
    },
    [selectedSupportIndex, basePrice, pricingState.totalFeaturePrice]
  );

  const updateEnterpriseFeature = useCallback(
    (featureName: string, value: boolean) => {
      if (!enterpriseFeatures) return;

      setEnterpriseFeatures((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [featureName]: value,
        };
      });
    },
    [enterpriseFeatures]
  );

  const handleEnterpriseFeatureToggle = useCallback(
    (featureName: string, category: string) => {
      if (!onEnterpriseFeatureToggle) return;

      if (enterpriseFeatures && enterpriseFeatures[featureName]) {
        updateEnterpriseFeature(featureName, false);
        onEnterpriseFeatureToggle(featureName);
        return;
      }

      if (
        activeEnterpriseCategory !== null &&
        activeEnterpriseCategory !== category
      ) {
        return;
      }

      updateEnterpriseFeature(featureName, true);
      onEnterpriseFeatureToggle(featureName);
    },
    [
      enterpriseFeatures,
      activeEnterpriseCategory,
      onEnterpriseFeatureToggle,
      updateEnterpriseFeature,
    ]
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleInfoClick = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleNext = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onNext();
    } finally {
      setLoading(false);
    }
  }, [onNext]);

  const handleBack = useCallback(async () => {
    setBackLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSelectedPlanIndex(null);
      onBack();
    } finally {
      setBackLoading(false);
    }
  }, [onBack]);

  const handleSave = useCallback(() => {
    const fullData = {
      selectedFeatures,
      selectedAddOns,
      usageQuantities,
      calculatedPrice: pricingState.totalPrice,
      selectedCurrency,
      formData,
      planDiscount: pricingState.planDiscount,
      supportLevel: selectedSupportIndex,
      supportPrice: pricingState.supportPrice,
    };

    onSave(fullData);
  }, [
    selectedFeatures,
    selectedAddOns,
    usageQuantities,
    pricingState.totalPrice,
    pricingState.planDiscount,
    pricingState.supportPrice,
    selectedCurrency,
    formData,
    selectedSupportIndex,
    onSave,
  ]);

  const isAnyCheckboxSelected = useCallback(() => {
    return Object.values(checkboxStates).some((value) => value === true);
  }, [checkboxStates]);

  const isAnyEnterpriseFeatureSelected = useCallback(() => {
    if (!enterpriseFeatures) return false;
    return Object.values(enterpriseFeatures).some((value) => value === true);
  }, [enterpriseFeatures]);

  const isEnterpriseFeatureDisabled = useCallback(
    (category: string) => {
      return (
        activeEnterpriseCategory !== null &&
        activeEnterpriseCategory !== category
      );
    },
    [activeEnterpriseCategory]
  );

  const getCurrencySymbol = useCallback((currency: string) => {
    if (currency === 'ZAR') {
      return 'R';
    } else if (currency === 'Kz') {
      return 'Kz';
    } else {
      const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        ZAR: 'R',
        Kz: 'Kz',
      };
      return symbols[currency] || currency;
    }
  }, []);

  const getCurrentCurrencySymbol = useCallback(() => {
    return currencySymbol;
  }, [currencySymbol]);

  const convertPrice = useCallback(
    (price: number): number => {
      if (selectedCurrency !== 'USD') {
        return price * rate;
      }
      return price;
    },
    [selectedCurrency, rate]
  );

  const handleCurrencyChange = useCallback(
    (currency: string) => {
      setInternalCurrency(currency);
      setSelectedCurrency(currency);
    },
    [setSelectedCurrency]
  );

  const handleShowSuccessMessage = useCallback(
    (message: string, packageData?: SuccessMessageData) => {
      if (onShowSuccessMessage) {
        onShowSuccessMessage(message, packageData);
      }
    },
    [onShowSuccessMessage]
  );

  const formatPrice = useCallback(
    (currency: string, price: number) => {
      let displayPrice = price;

      if (currency !== 'USD' && selectedPackage.currency === 'USD') {
        let multiCurrency: Record<string, number> | null = null;
        if (selectedPackage.multiCurrencyPrices) {
          try {
            multiCurrency = JSON.parse(selectedPackage.multiCurrencyPrices);
            displayPrice =
              multiCurrency && multiCurrency[currency]
                ? multiCurrency[currency]
                : price * rate;
          } catch {
            displayPrice = price * rate;
          }
        } else {
          displayPrice = price * rate;
        }
      }

      let result;
      if (currency === 'Kz') {
        result = `${Math.round(displayPrice)}${currency}`;
      } else {
        result = `${getCurrencySymbol(currency)} ${formatCurrencyPrice(displayPrice)}`;
      }

      return result;
    },
    [selectedPackage, rate, getCurrencySymbol, formatCurrencyPrice]
  );

  const contextValue = useMemo(
    () => ({
      currentStep,
      features,
      addOns,
      usagePricing,
      selectedFeatures,
      selectedAddOns,
      usageQuantities,
      formData,
      checkboxStates,
      selectedPlanIndex,
      selectedSupportIndex,
      enterpriseFeatures,
      activeEnterpriseCategory,
      dialogOpen,
      loading,
      backLoading,

      basePrice,
      pricingState,

      packageDetails,
      selectedPackage,
      isCustomizable,

      setCurrentStep,
      handleFeatureToggle,
      handleAddOnToggle,
      handleUsageUpdate,
      handleTextFieldChange,
      handleSelectChange,
      handleCheckboxChange,
      handlePlanSelect,
      handleSupportSelect,
      handleEnterpriseFeatureToggle,
      updateEnterpriseFeature,
      handleDialogClose,
      handleInfoClick,
      handleNext,
      handleBack,
      handleSave,
      isAnyCheckboxSelected,
      isAnyEnterpriseFeatureSelected,
      isEnterpriseFeatureDisabled,

      selectedCurrency,
      handleCurrencyChange,
      formatPrice,
      getCurrencySymbol,
      getCurrentCurrencySymbol,
      convertPrice,
      formatCurrencyPrice,

      handleShowSuccessMessage,
    }),
    [
      currentStep,
      features,
      addOns,
      usagePricing,
      selectedFeatures,
      selectedAddOns,
      usageQuantities,
      formData,
      checkboxStates,
      selectedPlanIndex,
      selectedSupportIndex,
      enterpriseFeatures,
      activeEnterpriseCategory,
      dialogOpen,
      loading,
      backLoading,
      basePrice,
      pricingState,
      packageDetails,
      selectedPackage,
      isCustomizable,
      setCurrentStep,
      handleFeatureToggle,
      handleAddOnToggle,
      handleUsageUpdate,
      handleTextFieldChange,
      handleSelectChange,
      handleCheckboxChange,
      handlePlanSelect,
      handleSupportSelect,
      handleEnterpriseFeatureToggle,
      updateEnterpriseFeature,
      handleDialogClose,
      handleInfoClick,
      handleNext,
      handleBack,
      handleSave,
      isAnyCheckboxSelected,
      isAnyEnterpriseFeatureSelected,
      isEnterpriseFeatureDisabled,
      selectedCurrency,
      handleCurrencyChange,
      formatPrice,
      getCurrencySymbol,
      getCurrentCurrencySymbol,
      convertPrice,
      formatCurrencyPrice,
      handleShowSuccessMessage,
    ]
  );

  return (
    <PackageContext.Provider value={contextValue}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackageContext = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackageContext must be used within a PackageProvider');
  }
  return context;
};
