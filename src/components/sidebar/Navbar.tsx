import React from "react";
import Link from "next/link"; // Import Link from Next.js
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"; // Import ChevronLeftIcon
import { navbarLinks } from "../../settings"; // Import navbarLinks

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
        backgroundColor: backgroundColor || "default",
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
          <ChevronLeftIcon />
        </IconButton>
        <Box sx={{ display: "flex", gap: 2 }}>
          {navbarLinks.map((link) => (
            <Link key={link.label} href={link.href} passHref>
              <Typography variant="body1" sx={{ cursor: "pointer", color: "inherit" }}>
                {link.label}
              </Typography>
            </Link>
          ))}
        </Box>
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
