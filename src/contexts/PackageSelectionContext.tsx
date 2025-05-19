'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const SELECTED_PACKAGE_STORAGE_KEY = 'selectedPackage';

export type Package = {
  id: number;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: 'custom' | 'starter' | 'growth' | 'enterprise' | 'premium';
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
  isPurchasedPackage: (pkgId: number) => boolean;
  getSavedPackage: () => Package | null;
};

const PackageSelectionContext = createContext<PackageSelectionContextType>({
  selectedPackage: null,
  isModalOpen: false,
  selectPackage: () => {},
  closeModal: () => {},
  isPackageBeingCustomized: false,
  isPackageDisabled: () => false,
  isPurchasedPackage: () => false,
  getSavedPackage: () => null,
});

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  },
  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },
};

export const PackageSelectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPackageBeingCustomized, setIsPackageBeingCustomized] =
    useState(false);
  const [purchasedPackageId, setPurchasedPackageId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const savedPackageJson = safeLocalStorage.getItem(
      SELECTED_PACKAGE_STORAGE_KEY
    );
    if (savedPackageJson) {
      try {
        const savedPackage = JSON.parse(savedPackageJson);
        setSelectedPackage(savedPackage);
        setPurchasedPackageId(savedPackage.id);
        console.log(
          'Loaded saved package from localStorage:',
          savedPackage.title
        );
      } catch (error) {
        console.error(
          'Failed to parse saved package from localStorage:',
          error
        );
        safeLocalStorage.removeItem(SELECTED_PACKAGE_STORAGE_KEY);
      }
    }
  }, []);

  const getSavedPackage = (): Package | null => {
    const savedPackageJson = safeLocalStorage.getItem(
      SELECTED_PACKAGE_STORAGE_KEY
    );
    if (savedPackageJson) {
      try {
        return JSON.parse(savedPackageJson);
      } catch (error) {
        console.error(
          'Failed to parse saved package from localStorage:',
          error
        );
        return null;
      }
    }
    return null;
  };

  const selectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
    setIsPackageBeingCustomized(true);
    setPurchasedPackageId(pkg.id);

    safeLocalStorage.setItem(SELECTED_PACKAGE_STORAGE_KEY, JSON.stringify(pkg));

    if (typeof window !== 'undefined') {
      const packageSelectedEvent = new CustomEvent('packageSelected', {
        detail: { packageId: pkg.id },
      });
      window.dispatchEvent(packageSelectedEvent);
      console.log(
        `Package selected event dispatched for package ID: ${pkg.id}`
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPackageBeingCustomized(false);
  };

  const isPackageDisabled = (pkgId: number): boolean => {
    return (
      isPackageBeingCustomized &&
      selectedPackage !== null &&
      selectedPackage.id !== pkgId
    );
  };

  const isPurchasedPackage = (pkgId: number): boolean => {
    return purchasedPackageId === pkgId;
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
        isPurchasedPackage,
        getSavedPackage,
      }}
    >
      {children}
    </PackageSelectionContext.Provider>
  );
};

export const usePackageSelection = () => useContext(PackageSelectionContext);
