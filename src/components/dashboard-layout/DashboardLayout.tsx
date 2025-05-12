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
import { mockFetchCustomization } from '@/api/mockUserCustomization';

const fetchCustomization = async (
  userId: string
): Promise<UserCustomization> => {
  return mockFetchCustomization(userId);
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
  const userId = '1';

  const { data, isSuccess } = useQuery<
    UserCustomization,
    Error
  >({
    queryKey: ['userCustomization', userId],
    queryFn: () => fetchCustomization(userId),
  });

  const [customization, setCustomization] =
    useState<UserCustomization | null>(null);
  const [
    openSettingsModal,
    setOpenSettingsModal,
  ] = useState(false);
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
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#F3F4F6',
        position: 'relative',
        overflow: 'hidden',
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
          // Update localStorage (redundant but for safety)
          localStorage.setItem(
            'sidebarActiveItem',
            section
          );
        }}
        handleItemClick={(item) => {
          console.log(`Item clicked: ${item}`);
          setActiveSection(item);
          // Update localStorage (redundant but for safety)
          localStorage.setItem(
            'sidebarActiveItem',
            item
          );
        }}
        logoUrl={logoUrl}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Navbar
          drawerWidth={isDrawerOpen ? 320 : 80}
          onDrawerToggle={onDrawerToggle}
          backgroundColor={navbarBg}
        />
        <Box sx={{ p: 2 }}>
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
      />
    </Box>
  );
};

export default DashboardLayout;
