import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { navbarLinks } from '../../Seetings/settings';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useLogout } from '@/hooks/useLogout';
import SettingsModal from '@/Seetings/SettingsModal';
import eventBus, { UI_EVENTS } from '@/utils/eventBus';
import { useCustomization } from '@/contexts/CustomizationContext';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

interface NavbarProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
  backgroundColor?: string;
}

const Navbar: React.FC<NavbarProps> = ({ drawerWidth, onDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isLoggingOut, logout } = useLogout();
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { navbarColor, updateCustomization } = useCustomization();

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

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
    handleClose();
  };

  const appBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCustomizationUpdate = (data: {
      navbarColor?: string;
      sidebarColor?: string;
      logoUrl?: string;
    }) => {
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

  useEffect(() => {
    if (appBarRef.current) {
      appBarRef.current.style.backgroundColor = navbarColor;
    }
  }, [navbarColor]);

  return (
    <>
      <AppBar
        position="fixed"
        ref={appBarRef}
        sx={{
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          right: 0,
          transition:
            'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
          border: 'none',
          zIndex: 1050,
          backgroundColor: navbarColor,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: isMobile ? 'space-between' : 'flex-start',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{
              mr: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              width: 40,
              height: 40,
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateX(2px)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <ChevronLeftIcon
              sx={{
                fontSize: '1.5rem',
                transition: 'transform 0.3s ease',
                transform:
                  drawerWidth === 80 ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexGrow: 1,
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            {navbarLinks.map((link) => (
              <Link key={link.label} href={link.href} passHref>
                <Typography
                  variant="body1"
                  sx={{
                    cursor: 'pointer',
                    color: 'inherit',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                  }}
                >
                  {link.label}
                </Typography>
              </Link>
            ))}
          </Box>
          <Box
            sx={{
              ml: 'auto',
              display: 'flex',
              gap: 2,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NotificationDropdown />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={handleClick}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isMobile ? '32px' : '36px',
                  height: isMobile ? '32px' : '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <FiUser
                  style={{
                    fontSize: isMobile ? '1.1rem' : '1.3rem',
                    color: '#ffffff',
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  fontSize: isMobile ? '0.875rem' : '0.95rem',
                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              >
                Profile
              </Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{
                horizontal: 'right',
                vertical: 'top',
              }}
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom',
              }}
              slotProps={{
                paper: {
                  style: {
                    transition:
                      'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                },
              }}
              transitionDuration={{
                enter: 250,
                exit: 200,
              }}
              sx={{
                marginTop: '10px',
                '& .MuiPaper-root': {
                  minWidth: '220px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  animation:
                    'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transform: 'translateY(0)',
                  opacity: 1,
                  transition:
                    'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '& .MuiList-root': {
                  padding: '8px',
                },
                '@keyframes fadeIn': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(-12px) scale(0.98)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0) scale(1)',
                  },
                },
              }}
            >
              <MenuItem
                onClick={handleClose}
                sx={{
                  borderRadius: '8px',
                  padding: '10px 16px',
                  margin: '2px 0',
                  transition: 'all 0.15s ease',
                  animation:
                    'fadeInItem 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  animationDelay: '0.05s',
                  opacity: 0,
                  transform: 'translateY(8px)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    transform: 'translateY(-1px)',
                  },
                  '@keyframes fadeInItem': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(8px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: '36px',
                    color: '#64748b',
                  }}
                >
                  <FiUser fontSize="small" />
                </ListItemIcon>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                  }}
                >
                  My Profile
                </Typography>
              </MenuItem>

              <MenuItem
                onClick={handleSettingsClick}
                sx={{
                  borderRadius: '8px',
                  padding: '10px 16px',
                  margin: '2px 0',
                  transition: 'all 0.15s ease',
                  animation:
                    'fadeInItem 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  animationDelay: '0.1s',
                  opacity: 0,
                  transform: 'translateY(8px)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    transform: 'translateY(-1px)',
                  },
                  '@keyframes fadeInItem': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(8px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: '36px',
                    color: '#64748b',
                  }}
                >
                  <FiSettings fontSize="small" />
                </ListItemIcon>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                  }}
                >
                  Settings
                </Typography>
              </MenuItem>

              <Box
                sx={{
                  padding: '0 8px',
                  my: 1,
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  animation:
                    'fadeInItem 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  animationDelay: '0.15s',
                  opacity: 0,
                  '@keyframes fadeInItem': {
                    from: {
                      opacity: 0,
                    },
                    to: {
                      opacity: 1,
                    },
                  },
                }}
              />

              <MenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                sx={{
                  backgroundColor: '#173a79',
                  color: 'white',
                  padding: '10px 16px',
                  margin: '2px 0',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  animation:
                    'fadeInItem 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  animationDelay: '0.2s',
                  opacity: 0,
                  transform: 'translateY(8px)',
                  '&:hover': {
                    backgroundColor: '#1a4589',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(23, 58, 121, 0.2)',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.7,
                    color: 'white',
                  },
                  '@keyframes fadeInItem': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(8px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                {isLoggingOut ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  </Box>
                ) : (
                  <>
                    <ListItemIcon
                      sx={{
                        minWidth: '36px',
                        color: 'white',
                      }}
                    >
                      <FiLogOut fontSize="small" style={{ color: 'white' }} />
                    </ListItemIcon>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                      }}
                    >
                      Logout
                    </Typography>
                  </>
                )}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userId="current-user"
        onCustomizationUpdated={updateCustomization}
      />
    </>
  );
};

export default Navbar;
