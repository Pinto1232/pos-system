import React from "react";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface NavbarProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
  backgroundColor?: string; // Add backgroundColor prop
}

const Navbar: React.FC<NavbarProps> = ({ drawerWidth, onDrawerToggle, backgroundColor }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: backgroundColor || "default", // Apply background color
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ ml: "auto" }}>
          <Typography variant="body1" sx={{ cursor: "pointer" }}>
            Logout
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
