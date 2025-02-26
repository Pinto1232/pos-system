"use client";

import { memo } from "react";
import { AppBar, Toolbar, IconButton, Box, Typography } from "@mui/material";
import { Menu as MenuIcon, Notifications as NotificationsIcon, ChatBubbleOutline as ChatIcon, AccessTime as TimeIcon, Login as LoginIcon } from "@mui/icons-material";
import { useSidebar } from "@/contexts/SidebarContext";
import { useLoginForm } from "@/contexts/LoginFormContext";
import styles from "./Navbar.module.css";

interface NavbarProps {
  title: string;
  testPeriod: number;
}

const Navbar: React.FC<NavbarProps> = memo(({ title, testPeriod }) => {
  const { toggleSidebar } = useSidebar();
  const { toggleLoginForm } = useLoginForm();

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className={styles.brand}>
          {title}
        </Typography>

        <Box className={styles.testPeriodBox}>
          <TimeIcon className={styles.icon} />
          <Typography variant="body2">Test Period: {testPeriod} days remaining</Typography>
        </Box>

        <IconButton color="inherit">
          <ChatIcon />
        </IconButton>
        
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>

        <IconButton color="inherit" onClick={toggleLoginForm}>
          <LoginIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
