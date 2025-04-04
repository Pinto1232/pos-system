import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/sidebar/Navbar';
import DashboardMainContainer from '../dashboardMain/dashboardMainContainer';
import SettingsModal from '@/SettingsModal';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/axiosClient';
import { mockFetchCustomization } from '@/api/mockUserCustomization';

export interface UserCustomization {
  id: number;
  userId: string;
  sidebarColor: string;
  logoUrl: string;
  navbarColor: string;
}

const fetchCustomization = async (userId: string): Promise<UserCustomization> => {
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

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  isDrawerOpen,
  onDrawerToggle,
  backgroundColor,
  textColor = '#fff',
  iconColor = '#fff',
  navbarBgColor,
}) => {
  const userId = '1';

  const { data, isSuccess } = useQuery<UserCustomization, Error>({
    queryKey: ['userCustomization', userId],
    queryFn: () => fetchCustomization(userId),
  });

  const [customization, setCustomization] = useState<UserCustomization | null>(null);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');

  useEffect(() => {
    if (isSuccess && data) {
      setCustomization(data);
    }
  }, [isSuccess, data]);

  const handleSettingsClick = () => {
    setOpenSettingsModal(true);
  };

  const handleCloseSettings = () => {
    setOpenSettingsModal(false);
  };

  const sidebarBackground = customization?.sidebarColor || backgroundColor || '#173A79';
  const logoUrl = customization?.logoUrl || '/Pisval_Logo.jpg';
  const navbarBg = customization?.navbarColor || navbarBgColor || '#000000';

  const handleCustomizationUpdated = (updated: UserCustomization) => {
    setCustomization(updated);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F3F4F6' }}>
      <Sidebar
        drawerWidth={300}
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={onDrawerToggle}
        backgroundColor={sidebarBackground}
        textColor={textColor}
        iconColor={iconColor}
        onSettingsClick={handleSettingsClick}
        onSectionSelect={setActiveSection}
        handleItemClick={item => console.log(`Item clicked: ${item}`)}
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
          drawerWidth={isDrawerOpen ? 300 : 60}
          onDrawerToggle={onDrawerToggle}
          backgroundColor={navbarBg}
        />
        <Box sx={{ p: 2 }}>
          <DashboardMainContainer activeSection={activeSection} />
        </Box>
      </Box>
      <SettingsModal
        open={openSettingsModal}
        onClose={handleCloseSettings}
        userId={userId}
        onCustomizationUpdated={handleCustomizationUpdated}
      />
    </Box>
  );
};

export default DashboardLayout;
