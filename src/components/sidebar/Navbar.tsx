import React from "react";
import Link from "next/link";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { navbarLinks } from "../../settings";
import { FaRegBell } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

interface NavbarProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
  backgroundColor?: string;
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
        <Box sx={{
          ml: "auto",
          display: "flex",
          gap: 2,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
        >
          <Typography variant="body1" sx={{ cursor: "pointer" }}>
            <FaRegBell style={{
              padding: "5px",
              cursor: "pointer",
              fontSize: "2.3rem",
            }} />
          </Typography>
          <Typography variant="body1" sx={{ cursor: "pointer" }}>
            <FiUser style={{
              border: "2px solid	#ffffff",
              padding: "5px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1.9rem",
            }} />
          </Typography>
          <Typography variant="body1" sx={{ cursor: "pointer" }}>
            Profile
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
