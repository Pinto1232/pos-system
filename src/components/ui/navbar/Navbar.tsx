'use client';
import React, {
  memo,
  Suspense,
  useEffect,
  useState,
  useRef,
} from 'react';
import eventBus, {
  UI_EVENTS,
} from '@/utils/eventBus';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Badge,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useSidebar } from '@/contexts/SidebarContext';
import { useLoginForm } from '@/contexts/LoginFormContext';
import { useTestPeriod } from '@/contexts/TestPeriodContext';
import { usePackageSelection } from '@/contexts/PackageSelectionContext';
import LanguageDropdown from '@/components/language/LanguageDropdown';
import { IoCartOutline } from 'react-icons/io5';
import CartSidebar from '@/components/cart/CartSidebar';
import styles from './Navbar.module.css';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useCustomization } from '@/contexts/CustomizationContext';

export interface NavbarProps {
  title: string;
  menuItems?: string[];
  isDrawerOpen?: boolean;
  toggleDrawer?: (open: boolean) => () => void;
}

const Navbar: React.FC<NavbarProps> = memo(
  ({ title }) => {
    const router = useRouter();
    const { toggleSidebar } = useSidebar();
    const { toggleLoginForm } = useLoginForm();
    const { testPeriod } = useTestPeriod();
    const { selectedPackage } =
      usePackageSelection();
    const [remainingTime, setRemainingTime] =
      useState(testPeriod * 24 * 60 * 60);
    const [isCartOpen, setIsCartOpen] =
      useState(false);
    const { cartCount } = useCart();
    const { navbarColor } = useCustomization();

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

    const appBarRef =
      useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleCustomizationUpdate = (data: {
        navbarColor?: string;
      }) => {
        if (
          appBarRef.current &&
          data.navbarColor
        ) {
          appBarRef.current.style.backgroundColor =
            data.navbarColor;
        }
      };

      eventBus.on(
        UI_EVENTS.CUSTOMIZATION_UPDATED,
        handleCustomizationUpdate
      );

      handleCustomizationUpdate({ navbarColor });

      return () => {
        eventBus.off(
          UI_EVENTS.CUSTOMIZATION_UPDATED,
          handleCustomizationUpdate
        );
      };
    }, [navbarColor]);

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

    const handleLogoClick = () => {
      router.push('/');
    };

    useEffect(() => {
      if (appBarRef.current) {
        appBarRef.current.style.backgroundColor =
          navbarColor;
      }
    }, [navbarColor]);

    return (
      <>
        <AppBar
          position="fixed"
          className={styles.navbar}
          ref={appBarRef}
          sx={{
            backgroundColor: navbarColor,
            transition:
              'background-color 0.3s ease',
            boxShadow:
              '0 2px 4px rgba(0,0,0,0.1)',
            height: { xs: '56px', sm: '64px' },
            width: '100%',
            left: 0,
            right: 0,
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: {
                xs: '0 4px',
                sm: '0 8px',
                md: '0 16px',
              },
              minHeight: {
                xs: '56px',
                sm: '64px',
              },
            }}
          >
            <Box
              onClick={handleLogoClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSidebar();
                }}
                sx={{
                  padding: {
                    xs: '4px',
                    sm: '8px',
                  },
                  marginRight: {
                    xs: '0',
                    sm: '4px',
                  },
                }}
              ></IconButton>
              <Image
                src="/Pisval_Logo.jpg"
                alt="Pisval Logo"
                width={40}
                height={40}
                style={{
                  marginRight: 8,
                  objectFit: 'contain',
                  borderRadius: '50%',
                }}
                sizes="(max-width: 600px) 32px, (max-width: 768px) 36px, 40px"
              />
              <Typography
                variant="h6"
                className={styles.brand}
                sx={{
                  fontSize: {
                    xs: '1rem',
                    sm: '1.1rem',
                    md: '1.25rem',
                  },
                }}
              >
                {title}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1, md: 2 },
              }}
            >
              <Box
                className={styles.testPeriodBox}
              >
                <TimeIcon
                  className={styles.icon}
                />
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
                    className={styles.timeLabel}
                  >
                    Test Period:
                  </span>
                  <span
                    className={styles.timeValue}
                    style={{
                      color: selectedPackage
                        ? '#F59E0B'
                        : '#ffffff',
                    }}
                  >
                    {formatTime(remainingTime)}
                  </span>
                  <span
                    className={
                      styles.timeRemaining
                    }
                  >
                    remaining
                  </span>
                </Typography>
              </Box>

              <Box
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              >
                <LanguageDropdown />
              </Box>

              <IconButton
                color="inherit"
                onClick={() => {
                  toggleLoginForm();
                }}
                sx={{
                  padding: {
                    xs: '8px',
                    sm: '12px',
                  },
                  fontSize: {
                    xs: '1.2rem',
                    sm: '1.4rem',
                  },
                }}
              >
                <LoginIcon fontSize="inherit" />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={handleCartClick}
                sx={{
                  padding: {
                    xs: '8px',
                    sm: '12px',
                  },
                  fontSize: {
                    xs: '1.2rem',
                    sm: '1.4rem',
                  },
                }}
              >
                <Badge
                  badgeContent={cartCount}
                  color="error"
                >
                  <IoCartOutline size="1em" />
                </Badge>
              </IconButton>
            </Box>
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
