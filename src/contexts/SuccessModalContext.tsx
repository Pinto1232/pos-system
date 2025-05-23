'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import SuccessMessage from '@/components/ui/success-message/SuccessMessage';

interface SuccessModalContextProps {
  showSuccessModal: (props: SuccessModalProps) => void;
  hideSuccessModal: () => void;
}

interface SuccessModalProps {
  message?: string;
  onConfirm: (isSignup: boolean) => void;
  onReturn: () => void;
  selectedPackage?: {
    id: number;
    title: string;
    type:
      | 'starter'
      | 'growth'
      | 'enterprise'
      | 'custom'
      | 'custom-pro'
      | 'premium'
      | 'starter-plus'
      | 'growth-pro'
      | 'enterprise-elite'
      | 'premium-plus';
    price: number;
    currency?: string;
  };
  currentCurrency?: string;
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
  selectedFeatures?: Array<any>;
  selectedAddOns?: Array<any>;
  usageQuantities?: Record<number, number>;
  calculatedPrice?: number;
  onAddToCart?: (message: string) => void;
}

const SuccessModalContext = createContext<SuccessModalContextProps | undefined>(
  undefined
);

export const useSuccessModal = () => {
  const context = useContext(SuccessModalContext);
  if (!context) {
    throw new Error(
      'useSuccessModal must be used within a SuccessModalProvider'
    );
  }
  return context;
};

export const SuccessModalProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<SuccessModalProps | null>(null);

  const showSuccessModal = (props: SuccessModalProps) => {
    setModalProps(props);
    setIsOpen(true);
  };

  const hideSuccessModal = () => {
    setIsOpen(false);
  };

  return (
    <SuccessModalContext.Provider
      value={{
        showSuccessModal,
        hideSuccessModal,
      }}
    >
      {children}
      {modalProps && (
        <SuccessMessage
          open={isOpen}
          onClose={() => {}}
          message={modalProps.message}
          onConfirm={modalProps.onConfirm}
          onReturn={modalProps.onReturn}
          selectedPackage={modalProps.selectedPackage}
          currentCurrency={modalProps.currentCurrency}
          formData={modalProps.formData}
          selectedFeatures={modalProps.selectedFeatures}
          selectedAddOns={modalProps.selectedAddOns}
          usageQuantities={modalProps.usageQuantities}
          calculatedPrice={modalProps.calculatedPrice}
          onAddToCart={modalProps.onAddToCart}
        />
      )}
    </SuccessModalContext.Provider>
  );
};

export default SuccessModalProvider;
