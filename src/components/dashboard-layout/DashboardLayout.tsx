import React from "react";
import { Box } from "@mui/material";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/sidebar/Navbar";

const drawerWidth = 300;

interface DashboardLayoutProps {
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  navbarBgColor?: string;
}

const DashboardLayout:
  React.FC<DashboardLayoutProps> = ({
    isDrawerOpen,
    onDrawerToggle,
    backgroundColor,
    textColor,
    iconColor,
    navbarBgColor
  }) => {

    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar (MUI Drawer) */}
        <Sidebar
          drawerWidth={drawerWidth}
          isDrawerOpen={isDrawerOpen}
          onDrawerToggle={onDrawerToggle}
          backgroundColor={backgroundColor}
          textColor={textColor}
          iconColor={iconColor}
        />
        {/* Main Section */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            mt: 8,
            ml: { sm: isDrawerOpen ? `${drawerWidth}px` : '60px' },
          }}
        >
          {/* Top Navbar */}
          <Navbar
            drawerWidth={isDrawerOpen ? drawerWidth : 60}
            onDrawerToggle={onDrawerToggle}
            backgroundColor={navbarBgColor}
          />
        </Box>
      </Box>
    );
  };

export default DashboardLayout;
