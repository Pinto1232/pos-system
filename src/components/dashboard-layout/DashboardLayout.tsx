import React from "react";
import { Box } from "@mui/material";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/sidebar/Navbar";
import DashboardMainContainer from "../dashboardMain/dashboardMainContainer";

const drawerWidth = 300;

interface DashboardLayoutProps {
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  navbarBgColor?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  isDrawerOpen,
  onDrawerToggle,
  backgroundColor,
  textColor,
  iconColor,
  navbarBgColor
}) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: '#F3F4F6' }}>
      {/* SIDEBAR (fixed width) */}
      <Sidebar
        drawerWidth={drawerWidth}
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={onDrawerToggle}
        backgroundColor={backgroundColor}
        textColor={textColor}
        iconColor={iconColor}
      />

      {/* MAIN AREA */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%"
        }}
      >
        {/* NAVBAR (top) */}
        <Navbar
          drawerWidth={isDrawerOpen ? drawerWidth : 60}
          onDrawerToggle={onDrawerToggle}
          backgroundColor={navbarBgColor}
        />

        {/* DASHBOARD CONTENT (below navbar) */}
        <Box sx={{ p: 2 }}>
          <DashboardMainContainer />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
