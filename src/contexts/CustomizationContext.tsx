'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { UserCustomization } from '@/SettingsModal';
import { mockFetchCustomization } from '@/api/mockUserCustomization';

interface CustomizationContextType {
  customization: UserCustomization | null;
  updateCustomization: (
    updated: UserCustomization
  ) => void;
}

const CustomizationContext = createContext<
  CustomizationContextType | undefined
>(undefined);

export const useCustomization = () => {
  const context = useContext(
    CustomizationContext
  );
  if (!context) {
    throw new Error(
      'useCustomization must be used within a CustomizationProvider'
    );
  }
  return context;
};

interface CustomizationProviderProps {
  children: ReactNode;
  userId: string;
}

export const CustomizationProvider: React.FC<
  CustomizationProviderProps
> = ({ children, userId }) => {
  const [customization, setCustomization] =
    useState<UserCustomization | null>(null);

  useEffect(() => {
    const fetchUserCustomization = async () => {
      try {
        const data =
          await mockFetchCustomization(userId);
        setCustomization(data);
      } catch (error) {
        console.error(
          'Failed to fetch customization:',
          error
        );
      }
    };

    fetchUserCustomization();
  }, [userId]);

  const updateCustomization = (
    updated: UserCustomization
  ) => {
    setCustomization(updated);
  };

  return (
    <CustomizationContext.Provider
      value={{
        customization,
        updateCustomization,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};
