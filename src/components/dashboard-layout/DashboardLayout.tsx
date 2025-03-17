import React from "react";
import { Box } from "@mui/material";
import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/sidebar/Navbar";

const drawerWidth = 300; // Increased width

interface DashboardLayoutProps {
  isDrawerOpen: boolean;
  onDrawerToggle: () => void;
  backgroundColor?: string; // Add backgroundColor prop
  textColor?: string; // Add textColor prop
  iconColor?: string; // Add iconColor prop
  navbarBgColor?: string; // Add navbarBgColor prop
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isDrawerOpen, onDrawerToggle, backgroundColor, textColor, iconColor, navbarBgColor }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar (MUI Drawer) */}
      <Sidebar
        drawerWidth={drawerWidth}
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={onDrawerToggle}
        backgroundColor={backgroundColor} // Pass backgroundColor prop
        textColor={textColor} // Pass textColor prop
        iconColor={iconColor} // Pass iconColor prop
      />
      {/* Main Section */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          mt: 8, // Adjust for the height of the AppBar
          ml: { sm: isDrawerOpen ? `${drawerWidth}px` : '60px' }, // Adjust for Mini variant
        }}
      >
        {/* Top Navbar */}
        <Navbar drawerWidth={isDrawerOpen ? drawerWidth : 60} onDrawerToggle={onDrawerToggle} backgroundColor={navbarBgColor} /> {/* Pass navbarBgColor prop */}
  
      </Box>
    </Box>
  );
};

export default DashboardLayout;
