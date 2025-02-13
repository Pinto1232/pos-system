"use client";

import { memo } from "react";
import { AppBar, Toolbar, IconButton, Box, Typography } from "@mui/material";
import { Menu as MenuIcon, Notifications as NotificationsIcon, ChatBubbleOutline as ChatIcon, AccessTime as TimeIcon } from "@mui/icons-material";
import { useSidebar } from "@/contexts/SidebarContext";
import styles from "./Navbar.module.css";

interface NavbarProps {
  title: string;
  testPeriod: number;
}

const Navbar: React.FC<NavbarProps> = memo(({ title, testPeriod }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar>
        {/* Hamburger Menu */}
        <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>

        {/* Brand Name */}
        <Typography variant="h6" className={styles.brand}>
          {title}
        </Typography>

        {/* Test Period Notification */}
        <Box className={styles.testPeriodBox}>
          <TimeIcon className={styles.icon} />
          <Typography variant="body2">Test Period: {testPeriod} days remaining</Typography>
        </Box>

        {/* Chat & Notifications Icons */}
        <IconButton color="inherit">
          <ChatIcon />
        </IconButton>

        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
