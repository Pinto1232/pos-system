'use client';

import React, {
  memo,
  Suspense,
  useEffect,
  useState,
} from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccessTime as TimeIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useSidebar } from '@/contexts/SidebarContext';
import { useLoginForm } from '@/contexts/LoginFormContext';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import { IoCartOutline } from 'react-icons/io5';
import CartSidebar from '@/components/cart/CartSidebar';
import styles from './Navbar.module.css';

export interface NavbarProps {
  title: string;
  menuItems?: string[];
  isDrawerOpen?: boolean;
  toggleDrawer?: (open: boolean) => () => void;
}

const Navbar: React.FC<NavbarProps> = memo(
  ({ title }) => {
    const { toggleSidebar } = useSidebar();
    const { toggleLoginForm } = useLoginForm();
    const { testPeriod } = useTestPeriod();
    const { selectedPackage } =
      usePackageSelection();
    const [remainingTime, setRemainingTime] =
      useState(testPeriod * 24 * 60 * 60);
    const [isCartOpen, setIsCartOpen] =
      useState(false);

    useEffect(() => {
      setRemainingTime(testPeriod * 24 * 60 * 60);
    }, [testPeriod]);

    useEffect(() => {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) =>
          prevTime > 0 ? prevTime - 1 : 0
        );
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor(
        (seconds % 3600) / 60
      );
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(
          2,
          '0'
        )}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCartClick = () => {
      setIsCartOpen(true);
    };

    const handleCartClose = () => {
      setIsCartOpen(false);
    };

    return (
      <>
        <AppBar
          position="sticky"
          className={styles.navbar}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleSidebar}
            ></IconButton>

            <Typography
              variant="h6"
              className={styles.brand}
            >
              {title}
            </Typography>

            <Box className={styles.testPeriodBox}>
              <TimeIcon className={styles.icon} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    opacity: 0.95,
                  }}
                >
                  Test Period:
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '1.125rem',
                    letterSpacing: '0.5px',
                    color: selectedPackage
                      ? '#F59E0B'
                      : '#ffffff',
                  }}
                >
                  {formatTime(remainingTime)}
                </span>
                <span style={{ opacity: 0.85 }}>
                  remaining
                </span>
              </Typography>
            </Box>

            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={toggleLoginForm}
            >
              <LoginIcon />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleCartClick}
            >
              <Badge
                badgeContent={3}
                color="error"
              >
                <IoCartOutline />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <CartSidebar
          open={isCartOpen}
          onClose={handleCartClose}
        />
      </>
    );
  }
);

Navbar.displayName = 'Navbar';
export { Navbar };

const LazyNavbar: React.FC<NavbarProps> = (
  props
) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Navbar {...props} />
  </Suspense>
);

export default LazyNavbar;
