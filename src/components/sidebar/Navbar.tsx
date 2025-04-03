import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { navbarLinks } from "../../settings";
import { FaRegBell } from "react-icons/fa";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { useLogout } from "@/hooks/useLogout";

interface NavbarProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
  backgroundColor?: string;
}

const Navbar: React.FC<NavbarProps> = ({ drawerWidth, onDrawerToggle, backgroundColor }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isLoggingOut, logout } = useLogout();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: backgroundColor || "default",
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        border: 'none'
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
          <Typography
            variant="body1"
            sx={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            Profile
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            sx={{
              marginTop: '25px',
              '& .MuiPaper-root': {
                minWidth: '200px'
              },
              '& .MuiList-root': {
                padding: 0
              }
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <FiUser fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <FiSettings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              sx={{
                backgroundColor: '#173a79',
                color: 'white',
                padding: '8px 16px',
                margin: 0,
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#1a4589'
                },
                '&.Mui-disabled': {
                  opacity: 0.7,
                  color: 'white'
                }
              }}
            >
              {isLoggingOut ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                </Box>
              ) : (
                <>
                  <ListItemIcon>
                    <FiLogOut fontSize="small" style={{ color: 'white' }} />
                  </ListItemIcon>
                  Logout
                </>
              )}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
