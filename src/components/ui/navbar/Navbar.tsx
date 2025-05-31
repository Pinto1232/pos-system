'use client';
import React, {
  memo,
  Suspense,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import eventBus, { UI_EVENTS } from '@/utils/eventBus';
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
import {
  usePackageSelection,
  Package,
} from '@/contexts/PackageSelectionContext';
import LanguageDropdown from '@/components/language/LanguageDropdown';
import { IoCartOutline } from 'react-icons/io5';
import CartSidebar from '@/components/cart/CartSidebar';
import styles from './Navbar.module.css';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useCustomization } from '@/contexts/CustomizationContext';
import { useSpinner } from '@/contexts/SpinnerContext';

const TIMER_STATE_KEY = 'testPeriodTimerState';
const SELECTED_PACKAGE_KEY = 'testPeriodSelectedPackage';
const SELECTED_PACKAGE_DATA_KEY = 'testPeriodSelectedPackageData';
const TIMER_LAST_UPDATED_KEY = 'timerLastUpdated';

export interface NavbarProps {
  title: string;
  menuItems?: string[];
  isDrawerOpen?: boolean;
  toggleDrawer?: (open: boolean) => () => void;
}

const Navbar: React.FC<NavbarProps> = memo(({ title }) => {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { toggleLoginForm } = useLoginForm();
  const { testPeriod } = useTestPeriod();
  const { selectedPackage } = usePackageSelection();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  const { navbarColor } = useCustomization();
  const { startLoading } = useSpinner();

  const lastSelectedPackageIdRef = useRef<number | null>(null);

  const safeLocalStorage = useMemo(
    () => ({
      getItem: (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error(`Error reading ${key} from localStorage:`, error);
          return null;
        }
      },
      setItem: (key: string, value: string): boolean => {
        if (typeof window === 'undefined') return false;
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (error) {
          console.error(`Error writing ${key} to localStorage:`, error);
          return false;
        }
      },
      removeItem: (key: string): boolean => {
        if (typeof window === 'undefined') return false;
        try {
          localStorage.removeItem(key);
          return true;
        } catch (error) {
          console.error(`Error removing ${key} from localStorage:`, error);
          return false;
        }
      },
    }),
    []
  );

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const resetTimer = useCallback(
    (pkg: Package) => {
      const newTime = pkg.testPeriodDays * 24 * 60 * 60;
      setRemainingTime(newTime);
      lastSelectedPackageIdRef.current = pkg.id;

      safeLocalStorage.setItem(TIMER_STATE_KEY, JSON.stringify(newTime));
      safeLocalStorage.setItem(SELECTED_PACKAGE_KEY, JSON.stringify(pkg.id));
      safeLocalStorage.setItem(TIMER_LAST_UPDATED_KEY, Date.now().toString());
      safeLocalStorage.setItem(SELECTED_PACKAGE_DATA_KEY, JSON.stringify(pkg));

      console.log(
        `Timer reset to ${formatTime(newTime)} for package: ${pkg.title}`
      );
      return newTime;
    },
    [safeLocalStorage, formatTime]
  );

  const isValidTimerData = useCallback(
    (timerState: unknown, packageId: unknown): boolean => {
      return (
        typeof timerState === 'number' &&
        timerState > 0 &&
        typeof packageId === 'number'
      );
    },
    []
  );

  const parseStoredTimerData = useCallback(() => {
    const storedTimerState = safeLocalStorage.getItem(TIMER_STATE_KEY);
    const storedPackageId = safeLocalStorage.getItem(SELECTED_PACKAGE_KEY);

    if (!storedTimerState || !storedPackageId) {
      return null;
    }

    try {
      const parsedTimerState = JSON.parse(storedTimerState);
      const parsedPackageId = JSON.parse(storedPackageId);

      if (isValidTimerData(parsedTimerState, parsedPackageId)) {
        return { parsedTimerState, parsedPackageId };
      }
    } catch (error) {
      console.error('Error parsing stored timer state:', error);
    }

    return null;
  }, [safeLocalStorage, isValidTimerData]);

  const restoreTimerWithTimestamp = useCallback(
    (parsedTimerState: number, parsedPackageId: number) => {
      const lastUpdated = safeLocalStorage.getItem(TIMER_LAST_UPDATED_KEY);

      if (lastUpdated) {
        const elapsedSeconds = Math.floor(
          (Date.now() - parseInt(lastUpdated)) / 1000
        );
        const adjustedTime = Math.max(0, parsedTimerState - elapsedSeconds);
        setRemainingTime(adjustedTime);
        lastSelectedPackageIdRef.current = parsedPackageId;

        console.log(
          `Timer restored from localStorage: ${formatTime(adjustedTime)}`
        );

        const storedPackageData = safeLocalStorage.getItem(
          SELECTED_PACKAGE_DATA_KEY
        );
        if (storedPackageData) {
          try {
            const packageData = JSON.parse(storedPackageData);
            console.log(`For package: ${packageData.title}`);
          } catch (e) {
            console.error('Error parsing stored package data:', e);
          }
        }

        return true;
      }

      return false;
    },
    [safeLocalStorage, formatTime]
  );

  const restoreTimerWithoutTimestamp = useCallback(
    (parsedTimerState: number, parsedPackageId: number) => {
      setRemainingTime(parsedTimerState);
      lastSelectedPackageIdRef.current = parsedPackageId;
      console.log(
        `Timer restored from localStorage (no timestamp): ${formatTime(parsedTimerState)}`
      );
    },
    [formatTime]
  );

  const initializeDefaultTimer = useCallback(() => {
    if (testPeriod > 0) {
      const initialTime = testPeriod * 24 * 60 * 60;
      setRemainingTime(initialTime);
      console.log(
        `Timer initialized with default test period: ${formatTime(initialTime)}`
      );
    } else {
      console.log('No test period available for initialization');
    }
  }, [testPeriod, formatTime]);

  useEffect(() => {
    const timerData = parseStoredTimerData();

    if (timerData) {
      const { parsedTimerState, parsedPackageId } = timerData;
      const restored = restoreTimerWithTimestamp(
        parsedTimerState,
        parsedPackageId
      );

      if (!restored) {
        restoreTimerWithoutTimestamp(parsedTimerState, parsedPackageId);
      }
    } else {
      initializeDefaultTimer();
    }
  }, [
    parseStoredTimerData,
    restoreTimerWithTimestamp,
    restoreTimerWithoutTimestamp,
    initializeDefaultTimer,
  ]);

  useEffect(() => {
    if (selectedPackage) {
      resetTimer(selectedPackage);
    }
  }, [selectedPackage, resetTimer]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0;

        if (lastSelectedPackageIdRef.current !== null) {
          safeLocalStorage.setItem(TIMER_STATE_KEY, JSON.stringify(newTime));
          safeLocalStorage.setItem(
            TIMER_LAST_UPDATED_KEY,
            Date.now().toString()
          );

          if (newTime % 60 === 0 && newTime > 0) {
            console.log(`Timer update: ${formatTime(newTime)} remaining`);
          }
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [safeLocalStorage, formatTime]);

  const appBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleCustomizationUpdate = (data: { navbarColor?: string }) => {
      if (appBarRef.current && data.navbarColor) {
        appBarRef.current.style.backgroundColor = data.navbarColor;
      }
    };

    eventBus.on(UI_EVENTS.CUSTOMIZATION_UPDATED, handleCustomizationUpdate);

    handleCustomizationUpdate({ navbarColor });

    return () => {
      eventBus.off(UI_EVENTS.CUSTOMIZATION_UPDATED, handleCustomizationUpdate);
    };
  }, [navbarColor]);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleLogoClick = () => {
    startLoading({ timeout: 3000 });
    router.push('/');
  };

  const iconButtonStyles = useMemo(
    () => ({
      padding: {
        xs: '8px',
        sm: '12px',
      },
      fontSize: {
        xs: '1.2rem',
        sm: '1.4rem',
      },
    }),
    []
  );

  useEffect(() => {
    if (appBarRef.current) {
      appBarRef.current.style.backgroundColor = navbarColor;
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
          transition: 'background-color 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
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

            <Box
              onClick={handleLogoClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
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
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1, md: 2 },
            }}
          >
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
                <span className={styles.timeLabel}>Test Period:</span>
                <span
                  className={styles.timeValue}
                  style={{
                    color:
                      selectedPackage ||
                      lastSelectedPackageIdRef.current !== null
                        ? '#F59E0B'
                        : '#ffffff',
                  }}
                >
                  {formatTime(remainingTime)}
                </span>
                <span className={styles.timeRemaining}>remaining</span>
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
              sx={iconButtonStyles}
            >
              <LoginIcon fontSize="inherit" />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleCartClick}
              sx={iconButtonStyles}
            >
              <Badge badgeContent={cartCount} color="error">
                <IoCartOutline size="1em" />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <CartSidebar open={isCartOpen} onClose={handleCartClose} />
    </>
  );
});

Navbar.displayName = 'Navbar';
export { Navbar };

const LazyNavbar: React.FC<NavbarProps> = (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Navbar {...props} />
  </Suspense>
);

export default LazyNavbar;
