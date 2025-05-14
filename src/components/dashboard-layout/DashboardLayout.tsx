import React, {
  useState,
  useEffect,
} from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/sidebar/Navbar';
import DashboardMainContainer from '../dashboardMain/dashboardMainContainer';
import SettingsModal, {
  UserCustomization,
} from '@/SettingsModal';
import { useQuery } from '@tanstack/react-query';
import useKeycloakUser from '@/hooks/useKeycloakUser';
import { mockFetchCustomization } from '@/api/mockUserCustomization';

const fetchCustomization = async (
  userId: string
): Promise<UserCustomization> => {
  try {
    console.log(
      `Fetching user customization for user ID: ${userId}`
    );

    // Special handling for current-user endpoint
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
        data
      );
      return data;
    } else {
      console.warn(
        `API call failed with status ${response.status}, falling back to mock data`
      );
      // Fall back to mock data if API call fails
      return mockFetchCustomization(userId);
    }
  } catch (error) {
    console.error(
      'Error fetching customization, using mock data:',
      error
    );
    // Fall back to mock data if there's an error
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

const DashboardLayout: React.FC<
  DashboardLayoutProps
> = ({
  isDrawerOpen,
  onDrawerToggle,
  backgroundColor,
  textColor = '#fff',
  iconColor = '#fff',
  navbarBgColor,
}) => {
  // Get the authenticated user's information from Keycloak
  const { userInfo, isLoading: isUserLoading } =
    useKeycloakUser();

  // Use the user's sub (subject identifier) from Keycloak as the userId
  // Fall back to 'current-user' if not available
  const userId = userInfo?.sub || 'current-user';

  console.log(
    'Current authenticated user:',
    userInfo?.name || 'Unknown'
  );
  console.log(
    'Using user ID for customization:',
    userId
  );

  const { data, isSuccess } = useQuery<
    UserCustomization,
    Error
  >({
    queryKey: ['userCustomization', userId],
    queryFn: () => fetchCustomization(userId),
    // Only fetch when we have user info or know we're using the fallback
    enabled: !isUserLoading,
  });

  const [customization, setCustomization] =
    useState<UserCustomization | null>(null);
  const [
    openSettingsModal,
    setOpenSettingsModal,
  ] = useState(false);
  const [
    initialSettingsTab,
    setInitialSettingsTab,
  ] = useState('General Settings');
  const [activeSection, setActiveSection] =
    useState(() => {
      // Initialize from localStorage if available, otherwise default to Dashboard
      try {
        const savedActiveItem =
          localStorage.getItem(
            'sidebarActiveItem'
          );
        return savedActiveItem || 'Dashboard';
      } catch (error) {
        console.error(
          'Error reading active section from localStorage:',
          error
        );
        return 'Dashboard';
      }
    });

  // Update activeSection when localStorage changes (for cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (
      e: StorageEvent
    ) => {
      if (
        e.key === 'sidebarActiveItem' &&
        e.newValue
      ) {
        setActiveSection(e.newValue);
      }
    };

    window.addEventListener(
      'storage',
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      );
    };
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      console.log(
        'Dashboard received customization data:',
        data
      );
      console.log(
        'Tax settings in dashboard:',
        data.taxSettings
      );
      setCustomization(data);
    }
  }, [isSuccess, data]);

  // Listen for events to open settings modal with specific tab
  useEffect(() => {
    const handleOpenSettingsModal = (
      event: CustomEvent
    ) => {
      if (event.detail?.initialTab) {
        setInitialSettingsTab(
          event.detail.initialTab
        );
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
    customization?.sidebarColor ||
    backgroundColor ||
    '#173A79';
  const logoUrl =
    customization?.logoUrl || '/Pisval_Logo.jpg';
  const navbarBg =
    customization?.navbarColor ||
    navbarBgColor ||
    '#000000';

  const handleCustomizationUpdated = (
    updated: UserCustomization
  ) => {
    console.log(
      'Customization updated in dashboard:',
      updated
    );
    console.log(
      'Updated tax settings:',
      updated.taxSettings
    );
    setCustomization(updated);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: isDrawerOpen
            ? '320px 1fr'
            : '80px 1fr',
        },
        gridTemplateRows: '1fr',
        minHeight: '100vh',
        bgcolor: '#F3F4F6',
        transition:
          'grid-template-columns 0.3s ease',
      }}
    >
      {/* Sidebar in its own grid column */}
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
            localStorage.setItem(
              'sidebarActiveItem',
              section
            );
          }}
          handleItemClick={(item) => {
            console.log(`Item clicked: ${item}`);
            setActiveSection(item);
            localStorage.setItem(
              'sidebarActiveItem',
              item
            );
          }}
          logoUrl={logoUrl}
        />
      </Box>

      {/* Main content in its own grid column */}
      <Box
        component="main"
        sx={{
          gridColumn: {
            xs: '1 / 2', // On mobile, take full width
            sm: '2 / 3', // On desktop, take second column
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
            pt: 8, // Space for fixed navbar
            pb: 2,
            px: { xs: 1, sm: 2 },
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <DashboardMainContainer
            activeSection={activeSection}
          />
        </Box>
      </Box>
      <SettingsModal
        open={openSettingsModal}
        onClose={handleCloseSettings}
        userId={userId}
        onCustomizationUpdated={
          handleCustomizationUpdated
        }
        initialSetting={initialSettingsTab}
      />
    </Box>
  );
};

export default DashboardLayout;
