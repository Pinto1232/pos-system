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
  Collapse,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Login as LoginIcon,
  Menu as MenuIcon,
  KeyboardArrowDown,
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
import { TranslatedText } from '@/i18n';
import MegaMenu, { MegaMenuItem } from '@/components/mega-menu';
import { megaMenuItems } from '@/Seetings/settings';

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

const HomeNavbar: React.FC<NavbarProps> = memo(({ title }) => {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { toggleLoginForm } = useLoginForm();
  const { testPeriod } = useTestPeriod();
  const { selectedPackage } = usePackageSelection();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { navbarColor } = useCustomization();
  const { startLoading } = useSpinner();

  const menuItems = useMemo(() => megaMenuItems, []);

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

  useEffect(() => {
    const storedTimerState = safeLocalStorage.getItem(TIMER_STATE_KEY);
    const storedPackageId = safeLocalStorage.getItem(SELECTED_PACKAGE_KEY);
    const storedPackageData = safeLocalStorage.getItem(
      SELECTED_PACKAGE_DATA_KEY
    );

    if (storedTimerState && storedPackageId) {
      try {
        const parsedTimerState = JSON.parse(storedTimerState);
        const parsedPackageId = JSON.parse(storedPackageId);

        if (
          typeof parsedTimerState === 'number' &&
          parsedTimerState > 0 &&
          typeof parsedPackageId === 'number'
        ) {
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

            if (storedPackageData) {
              try {
                const packageData = JSON.parse(storedPackageData);
                console.log(`For package: ${packageData.title}`);
              } catch (e) {
                console.error('Error parsing stored package data:', e);
              }
            }

            return;
          } else {
            setRemainingTime(parsedTimerState);
            lastSelectedPackageIdRef.current = parsedPackageId;
            console.log(
              `Timer restored from localStorage (no timestamp): ${formatTime(parsedTimerState)}`
            );
            return;
          }
        }
      } catch (error) {
        console.error('Error parsing stored timer state:', error);
      }
    }

    if (testPeriod > 0) {
      const initialTime = testPeriod * 24 * 60 * 60;
      setRemainingTime(initialTime);
      console.log(
        `Timer initialized with default test period: ${formatTime(initialTime)}`
      );
    } else {
      console.log('No test period available for initialization');
    }
  }, [safeLocalStorage, testPeriod, formatTime]);

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

  const handleMenuItemClick = (item: MegaMenuItem) => {
    if (item.link) {
      startLoading({ timeout: 2000 });
      router.push(item.link);
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

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
                display: { xs: 'flex', lg: 'none' },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              onClick={handleLogoClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                marginRight: { xs: 1, sm: 2 },
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
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {title}
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                flexGrow: 1,
              }}
            >
              <MegaMenu items={menuItems} onItemClick={handleMenuItemClick} />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1, md: 2 },
            }}
          >
            {}
            <Box
              sx={{
                display: { xs: 'block', lg: 'none' },
                marginRight: 1,
              }}
            >
              <IconButton
                color="inherit"
                onClick={toggleMobileMenu}
                sx={{
                  padding: {
                    xs: '8px',
                    sm: '10px',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    marginRight: '4px',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Menu
                </Typography>
                <KeyboardArrowDown
                  sx={{
                    transform: isMobileMenuOpen
                      ? 'rotate(180deg)'
                      : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </IconButton>

              {}
              <Collapse
                in={isMobileMenuOpen}
                timeout="auto"
                unmountOnExit
                sx={{
                  position: 'absolute',
                  top: { xs: '56px', sm: '64px' },
                  left: 0,
                  right: 0,
                  zIndex: 1200,
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  maxHeight: 'calc(100vh - 64px)',
                  overflowY: 'auto',
                }}
              >
                <Box sx={{ p: 2 }}>
                  <MegaMenu
                    items={menuItems}
                    onItemClick={handleMenuItemClick}
                  />
                </Box>
              </Collapse>
            </Box>

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
                <span className={styles.timeLabel}>
                  <TranslatedText
                    i18nKey="packages.testPeriod"
                    defaultValue="Test Period:"
                  />
                </span>
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
                <span className={styles.timeRemaining}>
                  <TranslatedText
                    i18nKey="packages.remaining"
                    defaultValue="remaining"
                  />
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

HomeNavbar.displayName = 'Navbar';
export { HomeNavbar };

const LazyNavbar: React.FC<NavbarProps> = (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <HomeNavbar {...props} />
  </Suspense>
);

export default LazyNavbar;
