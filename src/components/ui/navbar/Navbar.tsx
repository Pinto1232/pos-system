'use client';

import React, { memo, Suspense, useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Typography } from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ChatBubbleOutline as ChatIcon,
  AccessTime as TimeIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useSidebar } from '@/contexts/SidebarContext';
import { useLoginForm } from '@/contexts/LoginFormContext';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import styles from './Navbar.module.css';

export interface NavbarProps {
  title: string;
  // Optionally, if you plan to use these props inside Navbar, add them here:
  menuItems?: string[];
  isDrawerOpen?: boolean;
  toggleDrawer?: (open: boolean) => () => void;
}

const Navbar: React.FC<NavbarProps> = memo(({ title }) => {
  const { toggleSidebar } = useSidebar();
  const { toggleLoginForm } = useLoginForm();
  const { testPeriod } = useTestPeriod();
  const [remainingTime, setRemainingTime] = useState(testPeriod * 24 * 60 * 60); // convert days to seconds

  useEffect(() => {
    setRemainingTime(testPeriod * 24 * 60 * 60); // reset remaining time when testPeriod changes
  }, [testPeriod]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AppBar position="sticky" className={styles.navbar}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className={styles.brand}>
          {title}
        </Typography>

        <Box className={styles.testPeriodBox}>
          <TimeIcon className={styles.icon} />
          <Typography variant="body2">
            Test Period: {formatTime(remainingTime)} remaining
          </Typography>
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

Navbar.displayName = 'Navbar';
export { Navbar };

const LazyNavbar: React.FC<NavbarProps> = props => (
  <Suspense fallback={<div>Loading...</div>}>
    <Navbar {...props} />
  </Suspense>
);

export default LazyNavbar;
