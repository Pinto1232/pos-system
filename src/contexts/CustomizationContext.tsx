'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { UserCustomization } from '@/types/settingsTypes';
import { mockFetchCustomization } from '@/api/mockUserCustomization';
import eventBus, { UI_EVENTS } from '@/utils/eventBus';

interface CustomizationContextType {
  customization: UserCustomization | null;
  updateCustomization: (updated: UserCustomization) => void;
  navbarColor: string;
  sidebarColor: string;
  logoUrl: string;
}

const CustomizationContext = createContext<
  CustomizationContextType | undefined
>(undefined);

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
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

export const CustomizationProvider: React.FC<CustomizationProviderProps> = ({
  children,
  userId,
}) => {
  const [customization, setCustomization] = useState<UserCustomization | null>(
    null
  );

  const DEFAULT_NAVBAR_COLOR = '#173A79';
  const DEFAULT_SIDEBAR_COLOR = '#173A79';
  const DEFAULT_LOGO_URL = '/Pisval_Logo.jpg';

  const [navbarColor, setNavbarColor] = useState(DEFAULT_NAVBAR_COLOR);
  const [sidebarColor, setSidebarColor] = useState(DEFAULT_SIDEBAR_COLOR);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);

  useEffect(() => {
    const fetchUserCustomization = async () => {
      try {
        console.log(
          'CustomizationContext: Fetching user customization for userId:',
          JSON.stringify(userId, null, 2)
        );
        const data = await mockFetchCustomization(userId);
        console.log(
          'CustomizationContext: Received customization data:',
          JSON.stringify(data, null, 2)
        );
        setCustomization(data);

        console.log(
          'CustomizationContext: Setting navbarColor to:',
          JSON.stringify(data.navbarColor || DEFAULT_NAVBAR_COLOR, null, 2)
        );
        setNavbarColor(data.navbarColor || DEFAULT_NAVBAR_COLOR);
        setSidebarColor(data.sidebarColor || DEFAULT_SIDEBAR_COLOR);
        setLogoUrl(data.logoUrl || DEFAULT_LOGO_URL);

        console.log(
          'CustomizationContext: Emitting initial customization event'
        );
        eventBus.emit(UI_EVENTS.CUSTOMIZATION_UPDATED, {
          navbarColor: data.navbarColor || DEFAULT_NAVBAR_COLOR,
          sidebarColor: data.sidebarColor || DEFAULT_SIDEBAR_COLOR,
          logoUrl: data.logoUrl || DEFAULT_LOGO_URL,
        });
      } catch (error) {
        console.error(
          'Failed to fetch customization:',
          JSON.stringify(error, null, 2)
        );
      }
    };

    fetchUserCustomization();
  }, [userId]);

  useEffect(() => {
    if (customization) {
      setNavbarColor(customization.navbarColor || DEFAULT_NAVBAR_COLOR);
      setSidebarColor(customization.sidebarColor || DEFAULT_SIDEBAR_COLOR);
      setLogoUrl(customization.logoUrl || DEFAULT_LOGO_URL);
    }
  }, [customization]);

  const updateCustomization = useCallback(
    (updated: UserCustomization) => {
      console.log(
        'CustomizationContext: Updating customization',
        JSON.stringify(updated, null, 2)
      );

      setCustomization(updated);

      setNavbarColor(updated.navbarColor || DEFAULT_NAVBAR_COLOR);
      setSidebarColor(updated.sidebarColor || DEFAULT_SIDEBAR_COLOR);
      setLogoUrl(updated.logoUrl || DEFAULT_LOGO_URL);

      console.log(
        'CustomizationContext: Emitting customization update event with navbarColor:',
        JSON.stringify(updated.navbarColor || DEFAULT_NAVBAR_COLOR, null, 2)
      );
      eventBus.emit(UI_EVENTS.CUSTOMIZATION_UPDATED, {
        navbarColor: updated.navbarColor || DEFAULT_NAVBAR_COLOR,
        sidebarColor: updated.sidebarColor || DEFAULT_SIDEBAR_COLOR,
        logoUrl: updated.logoUrl || DEFAULT_LOGO_URL,
      });
    },
    [DEFAULT_NAVBAR_COLOR, DEFAULT_SIDEBAR_COLOR, DEFAULT_LOGO_URL]
  );

  const contextValue = useMemo(
    () => ({
      customization,
      updateCustomization,
      navbarColor,
      sidebarColor,
      logoUrl,
    }),
    [customization, updateCustomization, navbarColor, sidebarColor, logoUrl]
  );

  return (
    <CustomizationContext.Provider value={contextValue}>
      {children}
    </CustomizationContext.Provider>
  );
};
