import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  Drawer,
  Box,
  List,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Skeleton,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import { sidebarItems } from '@/settings';
import { useSpinner } from '@/contexts/SpinnerContext';
import { SidebarProps } from './types';
import SidebarItem from './SidebarItem';
import useKeycloakUser from '@/hooks/useKeycloakUser';
import { useCustomization } from '@/contexts/CustomizationContext';
import eventBus, {
  UI_EVENTS,
} from '@/utils/eventBus';

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  isDrawerOpen,
  onSectionSelect,
  onSettingsClick,
  backgroundColor = '#173a79',
  textColor = '#fff',
  iconColor = '#fff',
  logoUrl = '/Pisval_Logo.jpg',
  handleItemClick = () => {},
  onDrawerToggle = () => {},
}) => {
  const { setLoading } = useSpinner();
  const { userInfo, isLoading: isUserLoading } =
    useKeycloakUser();
  const {
    sidebarColor,
    logoUrl: contextLogoUrl,
  } = useCustomization();

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCustomizationUpdate = (data: {
      sidebarColor?: string;
    }) => {
      if (
        drawerRef.current &&
        data.sidebarColor
      ) {
        drawerRef.current.style.backgroundColor =
          data.sidebarColor;
      }
    };

    eventBus.on(
      UI_EVENTS.CUSTOMIZATION_UPDATED,
      handleCustomizationUpdate
    );

    return () => {
      eventBus.off(
        UI_EVENTS.CUSTOMIZATION_UPDATED,
        handleCustomizationUpdate
      );
    };
  }, []);
  const [expandedItems, setExpandedItems] =
    useState<{
      [key: string]: boolean;
    }>({});
  const [activeItemState, setActiveItemState] =
    useState<string>('Dashboard');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(
    theme.breakpoints.down('sm')
  );
  const [localDrawerOpen, setLocalDrawerOpen] =
    useState(isDrawerOpen);

  // User activity tracking
  const [isUserActive, setIsUserActive] =
    useState(true);
  const inactivityTimerRef =
    useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_TIMEOUT = 30000; // 30 seconds of inactivity before status changes

  // User activity tracking logic
  const resetInactivityTimer = useCallback(() => {
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Set user as active
    setIsUserActive(true);

    // Start a new timer
    inactivityTimerRef.current = setTimeout(
      () => {
        setIsUserActive(false);
      },
      INACTIVITY_TIMEOUT
    );
  }, [INACTIVITY_TIMEOUT]);

  // Set up event listeners for user activity
  useEffect(() => {
    // Events to track for user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
    ];

    // Event handler
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(
        event,
        handleUserActivity
      );
    });

    // Initialize the timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(
          event,
          handleUserActivity
        );
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  // Load active menu item and expanded state from localStorage on mount
  useEffect(() => {
    try {
      // Get active item from localStorage
      const savedActiveItem =
        localStorage.getItem('sidebarActiveItem');
      if (savedActiveItem) {
        setActiveItemState(savedActiveItem);
      }

      // Get expanded items from localStorage
      const savedExpandedItems =
        localStorage.getItem(
          'sidebarExpandedItems'
        );
      if (savedExpandedItems) {
        setExpandedItems(
          JSON.parse(savedExpandedItems)
        );
      }

      // If we have a saved active item that's a sub-item, make sure its parent is expanded
      if (savedActiveItem) {
        // Find if this is a sub-item
        for (const item of sidebarItems) {
          if (item.expandable && item.subItems) {
            const isSubItem = item.subItems.some(
              (subItem) =>
                subItem.label === savedActiveItem
            );
            if (isSubItem) {
              setExpandedItems((prev) => ({
                ...prev,
                [item.label]: true,
              }));
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error(
        'Error loading sidebar state from localStorage:',
        error
      );
      // Fall back to default Dashboard
      setActiveItemState('Dashboard');
    }
  }, []);

  useEffect(() => {
    setLocalDrawerOpen(isDrawerOpen);
  }, [isDrawerOpen]);

  // Default to Dashboard if no saved state
  useEffect(() => {
    if (
      !localStorage.getItem('sidebarActiveItem')
    ) {
      const matchingSidebarItem =
        sidebarItems.find(
          (item) =>
            item.label === 'Dashboard' ||
            (item.subItems &&
              item.subItems.some(
                (subItem) =>
                  subItem.label === 'Dashboard'
              ))
        );

      if (matchingSidebarItem) {
        if (
          matchingSidebarItem.label ===
          'Dashboard'
        ) {
          setActiveItemState('Dashboard');
          localStorage.setItem(
            'sidebarActiveItem',
            'Dashboard'
          );
        } else if (matchingSidebarItem.subItems) {
          const subItem =
            matchingSidebarItem.subItems.find(
              (sub) => sub.label === 'Dashboard'
            );
          if (subItem) {
            const newExpandedItems = {
              [matchingSidebarItem.label]: true,
            };
            setExpandedItems(newExpandedItems);
            localStorage.setItem(
              'sidebarExpandedItems',
              JSON.stringify(newExpandedItems)
            );
            setActiveItemState('Dashboard');
            localStorage.setItem(
              'sidebarActiveItem',
              'Dashboard'
            );
          }
        }
      }
    }
  }, []);

  const handleDrawerClose = () => {
    if (isSmallScreen) {
      setLocalDrawerOpen(false);
      if (onDrawerToggle) {
        onDrawerToggle();
      }
    }
  };

  const handleToggle = (label: string) => {
    setExpandedItems((prev) => {
      const newState = Object.keys(prev).reduce(
        (acc, key) => {
          acc[key] =
            key === label ? !prev[key] : false;
          return acc;
        },
        {} as { [key: string]: boolean }
      );

      if (!(label in prev)) {
        newState[label] = true;
      }

      // Save expanded state to localStorage
      localStorage.setItem(
        'sidebarExpandedItems',
        JSON.stringify(newState)
      );

      return newState;
    });
  };

  const handleItemClickInternal = (
    label: string,
    parentLabel?: string
  ) => {
    setLoading(true);
    setActiveItemState(label);

    // Save active item to localStorage
    localStorage.setItem(
      'sidebarActiveItem',
      label
    );

    setExpandedItems((prev) => {
      let newState;
      if (parentLabel) {
        newState = {
          ...prev,
          [parentLabel]: true,
        };
      } else {
        newState = {};
      }

      // Save expanded state to localStorage
      localStorage.setItem(
        'sidebarExpandedItems',
        JSON.stringify(newState)
      );

      return newState;
    });

    const validSections = [
      'Dashboard',
      'Products List',
      'Add/Edit Product',
      'Product Categories',
      'Stock Levels & Alerts',
      'Low Stock Warnings',
      'Bulk Import/Export',
      'Inventory Adjustments',
      'Product Expiry Tracking',
      'New Sale',
      'Sales History',
      'Invoices & Receipts',
      'Returns & Refunds',
      'Discounts & Promotions',
      'Loyalty & Reward Points',
      'Pending Orders',
      'Completed Orders',
      'Cancelled Orders',
      'Pre-Orders',
      'Customer List',
      'Add/Edit Customer',
      'Customer Groups',
      'Customer Purchase History',
      'Loyalty Program',
      'Customer Feedback & Reviews',
      'Debt & Credit Management',
      'Supplier List',
      'Add/Edit Supplier',
      'Purchase Orders',
      'Pending Deliveries',
      'Stock Replenishment Requests',
      'Supplier Payments & Invoices',
      'Employee List',
      'Roles & Permissions',
      'Cashier Sessions',
      'Shift Management',
      'Attendance Tracking',
      'Activity Logs',
      'Sales Reports',
      'Top-Selling Products Report',
      'Profit & Loss Report',
      'Stock Movement Report',
      'Employee Performance Report',
      'Customer Purchase Trends Report',
      'Tax & Compliance Reports',
      'Payment Method Breakdown',
      'Accepted Payment Methods',
      'Transaction History',
      'Pending Payments',
      'Refund Processing',
      'Cash Management',
      'Expense Tracking',
      'Recurring Expenses',
      'Cash Flow Overview',
      'Supplier Payments',
      'Tax Calculations',
      'Create New Discount',
      'Active Promotions',
      'Coupon & Voucher Management',
      'Seasonal & Flash Sales',
      'Settings',
    ];

    if (!validSections.includes(label)) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      handleItemClick(label);
      onSectionSelect(label);
      setLoading(false);

      if (isSmallScreen) {
        handleDrawerClose();
      }
    }, 500);
  };

  return (
    <>
      <Drawer
        variant={
          isSmallScreen
            ? 'temporary'
            : 'permanent'
        }
        open={
          isSmallScreen ? localDrawerOpen : true
        }
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        slotProps={{
          paper: {
            ref: drawerRef,
          },
        }}
        sx={{
          width:
            !isSmallScreen && !localDrawerOpen
              ? 80
              : drawerWidth,
          flexShrink: 0,
          transition:
            'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1100,
          '@keyframes pulse': {
            '0%': {
              opacity: 0.6,
              transform: 'scale(0.9)',
            },
            '50%': {
              opacity: 1,
              transform: 'scale(1.1)',
            },
            '100%': {
              opacity: 0.6,
              transform: 'scale(0.9)',
            },
          },
          '& .MuiDrawer-paper': {
            width:
              !isSmallScreen && !localDrawerOpen
                ? 80
                : drawerWidth,
            transition:
              'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
            boxSizing: 'border-box',
            boxShadow:
              '0px 2px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor:
              sidebarColor || backgroundColor,
            color: textColor,
            height: '100%',
            border: 'none',
            overflowX: 'hidden',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            whiteSpace: 'nowrap',
          },
          display: {
            xs: 'block',
            sm: 'block',
            md: 'block',
          },
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {!isSmallScreen && !localDrawerOpen ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                animation: 'fadeIn 0.4s ease-out',
              }}
            >
              <Image
                src={contextLogoUrl || logoUrl}
                alt="Logo"
                width={40}
                height={40}
                style={{
                  borderRadius: '50%',
                  boxShadow:
                    '0 3px 8px rgba(0, 0, 0, 0.15)',
                }}
              />
            </Box>
          ) : (
            <>
              <Image
                src={contextLogoUrl || logoUrl}
                alt="Logo"
                width={90}
                height={90}
                style={{ borderRadius: '50%' }}
              />
              <Box
                sx={{
                  mt: 2,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  position: 'relative',
                }}
              >
                {isUserLoading ? (
                  <Skeleton
                    variant="rectangular"
                    width="80%"
                    height={36}
                    sx={{
                      borderRadius: '6px',
                      bgcolor:
                        'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '90%',
                    }}
                  >
                    <Tooltip
                      title={
                        userInfo?.email || ''
                      }
                      placement="bottom"
                      arrow
                    >
                      <Box
                        sx={{
                          background:
                            'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          width: '100%',
                          boxShadow:
                            '0 2px 8px rgba(0, 0, 0, 0.1)',
                          transition:
                            'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          '&:hover': {
                            boxShadow:
                              '0 4px 12px rgba(0, 0, 0, 0.15)',
                            transform:
                              'translateY(-2px)',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#1E3A8A',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            boxShadow:
                              '0 2px 4px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {userInfo?.name?.charAt(
                            0
                          ) ||
                            userInfo?.preferred_username?.charAt(
                              0
                            ) ||
                            'U'}
                        </Avatar>
                        <Box
                          sx={{
                            position: 'relative',
                            flexGrow: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#000',
                              fontWeight: 600,
                              fontSize:
                                isSmallScreen
                                  ? '0.875rem'
                                  : '1.1rem',
                              overflow: 'hidden',
                              textOverflow:
                                'ellipsis',
                              whiteSpace:
                                'nowrap',
                            }}
                          >
                            {userInfo?.name ||
                              userInfo?.preferred_username ||
                              'User'}
                          </Typography>
                          <Box
                            sx={{
                              position:
                                'absolute',
                              right: -8,
                              top: '50%',
                              transform:
                                'translateY(-50%)',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor:
                                isUserActive
                                  ? '#4CAF50'
                                  : '#F44336',
                              boxShadow:
                                isUserActive
                                  ? '0 0 4px #4CAF50'
                                  : '0 0 4px #F44336',
                              animation:
                                'pulse 2s infinite',
                              transition:
                                'background-color 0.3s ease, box-shadow 0.3s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    </Tooltip>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -6,
                        left: '50%',
                        transform:
                          'translateX(-50%)',
                        fontSize: '0.7rem',
                        color: isUserActive
                          ? '#4CAF50' // Green when active
                          : '#F44336', // Red when inactive
                        backgroundColor:
                          'rgba(0, 0, 0, 0.2)',
                        padding: '1px 8px',
                        borderRadius: '4px',
                        letterSpacing: '0.5px',
                        transition:
                          'color 0.3s ease',
                        fontWeight: 600,
                      }}
                    >
                      Online
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>

        <List>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              isActive={
                activeItemState === item.label
              }
              isExpanded={
                !!expandedItems[item.label]
              }
              iconColor={iconColor}
              textColor={textColor}
              onToggle={handleToggle}
              onItemClick={
                handleItemClickInternal
              }
              onSettingsClick={onSettingsClick}
              isCollapsed={
                !isSmallScreen && !localDrawerOpen
              }
            />
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
