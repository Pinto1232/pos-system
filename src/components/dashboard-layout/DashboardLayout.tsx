import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/sidebar/Navbar';
import DashboardMainContainer from '../dashboardMain/dashboardMainContainer';
import SettingsModal, { UserCustomization } from '@/SettingsModal';
import { useQuery } from '@tanstack/react-query';
import useKeycloakUser from '@/hooks/useKeycloakUser';
import { mockFetchCustomization } from '@/api/mockUserCustomization';

const fetchCustomization = async (
  userId: string
): Promise<UserCustomization> => {
  try {
    console.log(`Fetching user customization for user ID: ${userId}`);

    const endpoint =
      userId === 'current-user'
        ? '/api/UserCustomization/current-user'
        : `/api/UserCustomization/${userId}`;

    console.log(`Using endpoint: ${endpoint}`);

    const response = await fetch(endpoint);

    if (response.ok) {
      const data = await response.json();
      console.log(
        'Fetched customization from API:',
        JSON.stringify(data, null, 2)
      );
      return data;
    } else {
      console.warn(
        `API call failed with status ${response.status}, falling back to mock data`
      );

      return mockFetchCustomization(userId);
    }
  } catch (error) {
    console.error(
      'Error fetching customization, using mock data:',
      JSON.stringify(error, null, 2)
    );

    return mockFetchCustomization(userId);
  }
};

interface DashboardLayoutProps {
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  navbarBgColor?: string;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  isDrawerOpen,
  onDrawerToggle,
  backgroundColor,
  textColor = '#fff',
  iconColor = '#fff',
  navbarBgColor,
}) => {
  const { userInfo, isLoading: isUserLoading } = useKeycloakUser();

  const userId = userInfo?.sub || 'current-user';

  console.log(
    'Current authenticated user:',
    JSON.stringify(userInfo?.name || 'Unknown', null, 2)
  );
  console.log(
    'Using user ID for customization:',
    JSON.stringify(userId, null, 2)
  );

  const { data, isSuccess } = useQuery<UserCustomization, Error>({
    queryKey: ['userCustomization', userId],
    queryFn: () => fetchCustomization(userId),

    enabled: !isUserLoading,
  });

  const [customization, setCustomization] = useState<UserCustomization | null>(
    null
  );
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [initialSettingsTab, setInitialSettingsTab] =
    useState('General Settings');
  const [activeSection, setActiveSection] = useState(() => {
    try {
      const savedActiveItem = localStorage.getItem('sidebarActiveItem');
      return savedActiveItem || 'Dashboard';
    } catch (error) {
      console.error(
        'Error reading active section from localStorage:',
        JSON.stringify(error, null, 2)
      );
      return 'Dashboard';
    }
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebarActiveItem' && e.newValue) {
        setActiveSection(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      console.log(
        'Dashboard received customization data:',
        JSON.stringify(data, null, 2)
      );
      console.log(
        'Tax settings in dashboard:',
        JSON.stringify(data.taxSettings, null, 2)
      );
      setCustomization(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    const handleOpenSettingsModal = (event: CustomEvent) => {
      if (event.detail?.initialTab) {
        setInitialSettingsTab(event.detail.initialTab);
      }
      setOpenSettingsModal(true);
    };

    window.addEventListener(
      'openSettingsModal',
      handleOpenSettingsModal as EventListener
    );

    return () => {
      window.removeEventListener(
        'openSettingsModal',
        handleOpenSettingsModal as EventListener
      );
    };
  }, []);

  const handleSettingsClick = () => {
    setOpenSettingsModal(true);
  };

  const handleCloseSettings = () => {
    setOpenSettingsModal(false);
  };

  const sidebarBackground =
    customization?.sidebarColor || backgroundColor || '#173A79';
  const logoUrl = customization?.logoUrl || '/Pisval_Logo.jpg';
  const navbarBg = customization?.navbarColor || navbarBgColor || '#000000';

  const handleCustomizationUpdated = (updated: UserCustomization) => {
    console.log(
      'Customization updated in dashboard:',
      JSON.stringify(updated, null, 2)
    );
    console.log(
      'Updated tax settings:',
      JSON.stringify(updated.taxSettings, null, 2)
    );
    setCustomization(updated);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: isDrawerOpen ? '320px 1fr' : '80px 1fr',
        },
        gridTemplateRows: '1fr',
        minHeight: '100vh',
        bgcolor: '#F3F4F6',
        transition: 'grid-template-columns 0.3s ease',
      }}
    >
      {}
      <Box
        sx={{
          gridColumn: '1 / 2',
          gridRow: '1 / 2',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 1200,
        }}
      >
        <Sidebar
          drawerWidth={320}
          isDrawerOpen={isDrawerOpen}
          onDrawerToggle={onDrawerToggle}
          backgroundColor={sidebarBackground}
          textColor={textColor}
          iconColor={iconColor}
          onSettingsClick={handleSettingsClick}
          onSectionSelect={(section) => {
            setActiveSection(section);
            localStorage.setItem('sidebarActiveItem', section);
          }}
          handleItemClick={(item) => {
            console.log(`Item clicked: ${item}`);
            setActiveSection(item);
            localStorage.setItem('sidebarActiveItem', item);
          }}
          logoUrl={logoUrl}
        />
      </Box>

      {}
      <Box
        component="main"
        sx={{
          gridColumn: {
            xs: '1 / 2',
            sm: '2 / 3',
          },
          gridRow: '1 / 2',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          width: '100%',
          height: '100vh',
        }}
      >
        <Navbar
          drawerWidth={isDrawerOpen ? 320 : 80}
          onDrawerToggle={onDrawerToggle}
          backgroundColor={navbarBg}
        />

        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            pt: 8,
            pb: 2,
            px: { xs: 1, sm: 2 },
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <DashboardMainContainer activeSection={activeSection} />
        </Box>
      </Box>
      <SettingsModal
        open={openSettingsModal}
        onClose={handleCloseSettings}
        userId={userId}
        onCustomizationUpdated={handleCustomizationUpdated}
        initialSetting={initialSettingsTab}
      />
    </Box>
  );
};

export default DashboardLayout;
