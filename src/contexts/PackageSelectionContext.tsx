"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface PackageData {
  id: number;
  title: string;
  description: string;
  price: number;
  type: "starter" | "growth" | "enterprise" | "custom";
}

interface PackageSelectionContextProps {
  selectedPackage: PackageData | null;
  isModalOpen: boolean;
  selectPackage: (pkg: PackageData) => void;
  closeModal: () => void;
}

const PackageSelectionContext = createContext<PackageSelectionContextProps | undefined>(undefined);

export const PackageSelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const selectPackage = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <PackageSelectionContext.Provider value={{ selectedPackage, isModalOpen, selectPackage, closeModal }}>
      {children}
    </PackageSelectionContext.Provider>
  );
};

export const usePackageSelection = () => {
  const context = useContext(PackageSelectionContext);
  if (!context) throw new Error("usePackageSelection must be used within a PackageSelectionProvider");
  return context;
};
