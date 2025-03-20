import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/sidebar/Navbar";
import DashboardMainContainer from "../dashboardMain/dashboardMainContainer";
import SettingsModal from "@/SettingsModal";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axiosClient";

export interface UserCustomization {
  id: number;
  userId: string;
  sidebarColor: string;
  logoUrl: string;
  navbarColor: string;
}

const fetchCustomization = async (userId: string): Promise<UserCustomization> => {
  // Use the configured apiClient to fetch from the correct backend URL.
  const response = await apiClient.get(`/UserCustomization/${userId}`);
  return response.data;
};

interface DashboardLayoutProps {
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isDrawerOpen, onDrawerToggle }) => {
  const userId = "1"; // Replace with dynamic user ID as needed

  // Fetch initial customization data.
  const { data } = useQuery<UserCustomization, Error>({
    queryKey: ["userCustomization", userId],
    queryFn: () => fetchCustomization(userId),
  });

  const [customization, setCustomization] = useState<UserCustomization | null>(null);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  useEffect(() => {
    if (data) {
      setCustomization(data);
    }
  }, [data]);

  const handleSettingsClick = () => {
    setOpenSettingsModal(true);
  };

  const handleCloseSettings = () => {
    setOpenSettingsModal(false);
  };

  // When customization doesn't exist, fallback defaults remain.
  const sidebarBackground = customization?.sidebarColor || "#173A79";
  const logoUrl = customization?.logoUrl || "/Pisval_Logo.jpg";
  const navbarBg = customization?.navbarColor || "#000000";

  const handleCustomizationUpdated = (updated: UserCustomization) => {
    setCustomization(updated);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F3F4F6" }}>
      <Sidebar
        drawerWidth={300}
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={onDrawerToggle}
        backgroundColor={sidebarBackground}
        textColor="#fff"
        iconColor="#fff"
        onSettingsClick={handleSettingsClick}
        logoUrl={logoUrl}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Navbar
          drawerWidth={isDrawerOpen ? 300 : 60}
          onDrawerToggle={onDrawerToggle}
          backgroundColor={navbarBg}
        />
        <Box sx={{ p: 2 }}>
          <DashboardMainContainer />
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
