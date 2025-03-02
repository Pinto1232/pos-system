"use client";

import React, { useState, useEffect, useCallback } from "react";
import { axiosClient } from "@/api/axiosClient";
import CustomPackageLayout from "./CustomPackageLayout";
import Modal from "@/components/ui/modal/Modal";
import {
    Package,
    Feature,
    AddOn,
    UsagePricing,
    FeaturesResponse,
    PackageSelectionRequest,
    PriceCalculationRequest,
    PriceCalculationResponse,
} from "./types";
import { Button } from "@/components/ui/button/Button";
import { debounce } from 'lodash';

interface CustomPackageLayoutContainerProps {
    selectedPackage: Package;
}

const CustomPackageLayoutContainer: React.FC<CustomPackageLayoutContainerProps> = ({
    selectedPackage,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<string[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [addOns, setAddOns] = useState<AddOn[]>([]);
    const [usagePricing, setUsagePricing] = useState<UsagePricing[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
    const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
    const [usageQuantities, setUsageQuantities] = useState<Record<number, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [calculatedPrice, setCalculatedPrice] = useState<number>(selectedPackage.price);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const defaultStepsCustom = React.useMemo(() => [
        "Package Details",
        "Select Core Features",
        "Choose Add-Ons",
        "Configure Usage",
        "Review & Confirm",
    ], []);

    const defaultStepsNonCustom = React.useMemo(() => [
        "Package Details",
        "Review & Confirm",
    ], []);

    const buildSteps = useCallback(() => {
        const builtSteps = selectedPackage.isCustomizable ? [...defaultStepsCustom] : [...defaultStepsNonCustom];
        console.log("Built steps:", builtSteps);
        return builtSteps;
    }, [selectedPackage.isCustomizable, defaultStepsCustom, defaultStepsNonCustom]);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axiosClient.get<FeaturesResponse>(
                    "PricingPackages/custom/features"
                );
                console.log("Fetched config response:", response.data);

                const coreFeatures = response.data.coreFeatures || [];
                const addOnsData = response.data.addOns || [];
                const usageData = response.data.usageBasedPricing || [];

                setFeatures(coreFeatures);
                setAddOns(addOnsData);
                setUsagePricing(usageData);
                const initialUsageQuantities = usageData.reduce((acc: Record<number, number>, curr: UsagePricing) => ({
                    ...acc,
                    [curr.id]: curr.defaultValue,
                }), {} as Record<number, number>);
                setUsageQuantities(initialUsageQuantities);
                console.log("Initial usage quantities:", initialUsageQuantities);

                const newSteps = buildSteps();
                setSteps(newSteps);
                setCurrentStep(0);
                console.log("Initialized steps:", newSteps);
            } catch (error) {
                console.error("Failed to load package config:", error);
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
            console.log("Non-customizable package. Steps set to:", newSteps);
        }
    }, [selectedPackage, buildSteps]);

    // Wrap validation in useCallback to stabilize its reference.
    const validateCurrentStep = useCallback((): boolean => {
        const currentLabel = steps[currentStep]?.trim() || "";
        if (currentLabel === "Select Core Features") {
            const requiredMissing = features.some(
                (feature) => feature.isRequired && !selectedFeatures.some(f => f.id === feature.id)
            );
            if (requiredMissing) {
                alert("Please select all required features.");
                return false;
            }
        }
        if (currentLabel === "Configure Usage") {
            for (const usage of usagePricing) {
                const value = usageQuantities[usage.id] ?? usage.defaultValue;
                if (value < usage.minValue || value > usage.maxValue) {
                    alert(`For ${usage.name}, please enter a value between ${usage.minValue} and ${usage.maxValue}.`);
                    return false;
                }
            }
        }
        return true;
    }, [steps, currentStep, features, selectedFeatures, usageQuantities, usagePricing]);

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

    const handleSave = useCallback(async () => {
        if (currentStep !== steps.length - 1) return;
        if (!validateCurrentStep()) return;

        const request: PackageSelectionRequest = {
            packageId: selectedPackage.id,
            ...(selectedPackage.isCustomizable && {
                features: selectedFeatures.map((f) => f.id),
                addOns: selectedAddOns.map((a) => a.id),
                usage: usageQuantities,
            }),
        };
        console.log("Saving package configuration with request:", request);

        try {
            await axiosClient.post("PricingPackages/custom/select", request);
            console.log("Package saved successfully!");
            console.log("Form data:", {
                selectedFeatures,
                selectedAddOns,
                usageQuantities,
                calculatedPrice,
            });
            setModalMessage("Package saved successfully!");
        } catch (error) {
            console.error("Save failed:", error);
            setModalMessage("Error saving package!");
        } finally {
            setIsLoading(false);
            setIsModalOpen(true);
        }
    }, [currentStep, steps.length, selectedPackage, selectedFeatures, selectedAddOns, usageQuantities, validateCurrentStep, calculatedPrice]);

    const handleModalConfirm = (isSignup: boolean) => {
  setIsModalOpen(false);

  const keycloakAuthUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/auth`;
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || `${window.location.origin}/after-auth`;

  const authParams = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid",
    state: "xyz123",
  });

  if (isSignup) {
    // Use kc_idp_hint=register instead of kc_action
    authParams.append("kc_idp_hint", "register");
  }

  const fullRedirectUrl = `${keycloakAuthUrl}?${authParams.toString()}`;
  console.log("Redirecting user to:", fullRedirectUrl);
  window.location.href = fullRedirectUrl;
};


    // Dynamic Price Calculation Effect
    useEffect(() => {
        if (selectedPackage.isCustomizable) {
            const calculatePrice = debounce(async () => {
                const requestBody: PriceCalculationRequest = {
                    packageId: selectedPackage.id,
                    selectedFeatures: selectedFeatures.map((f) => f.id),
                    selectedAddOns: selectedAddOns.map((a) => a.id),
                    usageLimits: usageQuantities,
                };

                console.log("Calculating price with request body:", requestBody);

                try {
                    const response = await axiosClient.post<PriceCalculationResponse>(
                        "PricingPackages/custom/calculate-price",
                        requestBody
                    );
                    console.log("Price calculation response:", response.data);
                    setCalculatedPrice(response.data.totalPrice);
                } catch (error) {
                    console.error("Failed to calculate price:", error);
                }
            }, 300); // Debounce for 300ms

            calculatePrice();

            return () => {
                calculatePrice.cancel();
            };
        }
    }, [selectedFeatures, selectedAddOns, usageQuantities, selectedPackage]);

    if (isLoading)
        return <div className="loading">Loading package configuration...</div>;

    return (
        <>
            <CustomPackageLayout
                isCustomizable={selectedPackage.isCustomizable}
                currentStep={currentStep}
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
                onNext={handleNext}
                onBack={handleBack}
                onSave={handleSave}
                onFeatureToggle={(features) => {
                    console.log("Toggling features:", features);
                    setSelectedFeatures(features);
                }}
                onAddOnToggle={(addOns) => {
                    console.log("Toggling add-ons:", addOns);
                    setSelectedAddOns(addOns);
                }}
                onUsageChange={(quantities) => {
                    console.log("Updating usage quantities:", quantities);
                    setUsageQuantities(quantities);
                }}
            />
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Package Save Status"
                textColor="#333"
                headingSize="1.75rem"
                width="600px"
                height="200px"
                bgColor="#f0f0f0"
                showCloseIcon={true}
            >
                <>
                    <div>{modalMessage}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                        <Button onClick={() => handleModalConfirm(false)}>
                            Login
                        </Button>
                        <Button onClick={() => handleModalConfirm(true)}>
                            Sign Up
                        </Button>
                    </div>
                </>
            </Modal>
        </>
    );
};

export default CustomPackageLayoutContainer;
