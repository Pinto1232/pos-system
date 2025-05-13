// PackageSelectionContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
} from 'react';

export type Package = {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type:
    | 'starter'
    | 'growth'
    | 'enterprise'
    | 'custom'
    | 'premium';
  currency?: string;
  multiCurrencyPrices?: string;
};

type PackageSelectionContextType = {
  selectedPackage: Package | null;
  isModalOpen: boolean;
  selectPackage: (pkg: Package) => void;
  closeModal: () => void;
  isPackageBeingCustomized: boolean;
  isPackageDisabled: (pkgId: number) => boolean;
};

const PackageSelectionContext =
  createContext<PackageSelectionContextType>({
    selectedPackage: null,
    isModalOpen: false,
    selectPackage: () => {},
    closeModal: () => {},
    isPackageBeingCustomized: false,
    isPackageDisabled: () => false,
  });

export const PackageSelectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] =
    useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [
    isPackageBeingCustomized,
    setIsPackageBeingCustomized,
  ] = useState(false);

  const selectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
    setIsPackageBeingCustomized(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
    setIsPackageBeingCustomized(false);
  };

  const isPackageDisabled = (
    pkgId: number
  ): boolean => {
    return (
      isPackageBeingCustomized &&
      selectedPackage !== null &&
      selectedPackage.id !== pkgId
    );
  };

  return (
    <PackageSelectionContext.Provider
      value={{
        selectedPackage,
        isModalOpen,
        selectPackage,
        closeModal,
        isPackageBeingCustomized,
        isPackageDisabled,
      }}
    >
      {children}
    </PackageSelectionContext.Provider>
  );
};

export const usePackageSelection = () =>
  useContext(PackageSelectionContext);
