// PackageSelectionContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

export type Package = {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: 'starter' | 'growth' | 'enterprise' | 'custom' | 'premium'; // Added premium
};

type PackageSelectionContextType = {
  selectedPackage: Package | null;
  isModalOpen: boolean;
  selectPackage: (pkg: Package) => void;
  closeModal: () => void;
};

const PackageSelectionContext = createContext<PackageSelectionContextType>({
  selectedPackage: null,
  isModalOpen: false,
  selectPackage: () => {},
  closeModal: () => {},
});

export const PackageSelectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <PackageSelectionContext.Provider
      value={{ selectedPackage, isModalOpen, selectPackage, closeModal }}
    >
      {children}
    </PackageSelectionContext.Provider>
  );
};

export const usePackageSelection = () => useContext(PackageSelectionContext);
