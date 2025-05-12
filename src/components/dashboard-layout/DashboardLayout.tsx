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
      />
    </Box>
  );
};

export default DashboardLayout;
