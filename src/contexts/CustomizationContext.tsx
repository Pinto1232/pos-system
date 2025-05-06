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
import eventBus, {
  UI_EVENTS,
} from '@/utils/eventBus';

interface CustomizationContextType {
  customization: UserCustomization | null;
  updateCustomization: (
    updated: UserCustomization
  ) => void;
  navbarColor: string;
  sidebarColor: string;
  logoUrl: string;
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

  // Default values
  const DEFAULT_NAVBAR_COLOR = '#173A79';
  const DEFAULT_SIDEBAR_COLOR = '#173A79';
  const DEFAULT_LOGO_URL = '/Pisval_Logo.jpg';

  // Derived state for direct access to commonly used values
  const [navbarColor, setNavbarColor] = useState(
    DEFAULT_NAVBAR_COLOR
  );
  const [sidebarColor, setSidebarColor] =
    useState(DEFAULT_SIDEBAR_COLOR);
  const [logoUrl, setLogoUrl] = useState(
    DEFAULT_LOGO_URL
  );

  useEffect(() => {
    const fetchUserCustomization = async () => {
      try {
        console.log(
          'CustomizationContext: Fetching user customization for userId:',
          userId
        );
        const data =
          await mockFetchCustomization(userId);
        console.log(
          'CustomizationContext: Received customization data:',
          data
        );
        setCustomization(data);

        // Update the derived state
        console.log(
          'CustomizationContext: Setting navbarColor to:',
          data.navbarColor || DEFAULT_NAVBAR_COLOR
        );
        setNavbarColor(
          data.navbarColor || DEFAULT_NAVBAR_COLOR
        );
        setSidebarColor(
          data.sidebarColor ||
            DEFAULT_SIDEBAR_COLOR
        );
        setLogoUrl(
          data.logoUrl || DEFAULT_LOGO_URL
        );

        // Emit event to notify all components about the initial state
        console.log(
          'CustomizationContext: Emitting initial customization event'
        );
        eventBus.emit(
          UI_EVENTS.CUSTOMIZATION_UPDATED,
          {
            navbarColor:
              data.navbarColor ||
              DEFAULT_NAVBAR_COLOR,
            sidebarColor:
              data.sidebarColor ||
              DEFAULT_SIDEBAR_COLOR,
            logoUrl:
              data.logoUrl || DEFAULT_LOGO_URL,
          }
        );
      } catch (error) {
        console.error(
          'Failed to fetch customization:',
          error
        );
      }
    };

    fetchUserCustomization();
  }, [userId]);

  // Update derived state whenever customization changes
  useEffect(() => {
    if (customization) {
      setNavbarColor(
        customization.navbarColor ||
          DEFAULT_NAVBAR_COLOR
      );
      setSidebarColor(
        customization.sidebarColor ||
          DEFAULT_SIDEBAR_COLOR
      );
      setLogoUrl(
        customization.logoUrl || DEFAULT_LOGO_URL
      );
    }
  }, [customization]);

  const updateCustomization = (
    updated: UserCustomization
  ) => {
    console.log(
      'CustomizationContext: Updating customization',
      updated
    );

    // Update the main state
    setCustomization(updated);

    // Immediately update the derived state for faster UI updates
    setNavbarColor(
      updated.navbarColor || DEFAULT_NAVBAR_COLOR
    );
    setSidebarColor(
      updated.sidebarColor ||
        DEFAULT_SIDEBAR_COLOR
    );
    setLogoUrl(
      updated.logoUrl || DEFAULT_LOGO_URL
    );

    // Emit event to notify all components about the update
    console.log(
      'CustomizationContext: Emitting customization update event with navbarColor:',
      updated.navbarColor || DEFAULT_NAVBAR_COLOR
    );
    eventBus.emit(
      UI_EVENTS.CUSTOMIZATION_UPDATED,
      {
        navbarColor:
          updated.navbarColor ||
          DEFAULT_NAVBAR_COLOR,
        sidebarColor:
          updated.sidebarColor ||
          DEFAULT_SIDEBAR_COLOR,
        logoUrl:
          updated.logoUrl || DEFAULT_LOGO_URL,
      }
    );
  };

  return (
    <CustomizationContext.Provider
      value={{
        customization,
        updateCustomization,
        navbarColor,
        sidebarColor,
        logoUrl,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};
