"use client";

import React, { createContext, useContext, useState } from "react";

interface PackageData {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: "starter" | "growth" | "enterprise" | "custom";
}

interface PackageSelectionContextProps {
  selectedPackage: PackageData | null;
  isModalOpen: boolean;
  selectPackage: (pkg: PackageData) => void;
  closeModal: () => void;
}

const PackageSelectionContext = createContext<PackageSelectionContextProps | undefined>(undefined);

export const usePackageSelection = () => {
  const context = useContext(PackageSelectionContext);
  if (!context) {
    throw new Error("usePackageSelection must be used within a PackageSelectionProvider");
  }
  return context;
};

export const PackageSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectPackage = (pkg: PackageData) => {
    console.log('🏷️ Package selected:', pkg.type);
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <PackageSelectionContext.Provider value={{ selectedPackage, isModalOpen, selectPackage, closeModal }}>
      {children}
    </PackageSelectionContext.Provider>
  );
};
