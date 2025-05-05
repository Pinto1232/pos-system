import React, {
  useState,
  useEffect,
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

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  isDrawerOpen,
  onSectionSelect,
  onSettingsClick,
  backgroundColor = '#173a79',
  textColor = '#fff',
  iconColor = '#fff',
  logoUrl = '/Pisval_Logo.jpg',
  handleItemClick = () => { },
  onDrawerToggle = () => { },
}) => {
  const { setLoading } = useSpinner();
  const { userInfo, isLoading: isUserLoading } = useKeycloakUser();
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

  useEffect(() => {
    setLocalDrawerOpen(isDrawerOpen);
  }, [isDrawerOpen]);

  // Sync active item with the section from props
  useEffect(() => {
    // Find the matching sidebar item for the current section
    const matchingSidebarItem = sidebarItems.find(item =>
      item.label === 'Dashboard' ||
      (item.subItems && item.subItems.some(subItem => subItem.label === 'Dashboard'))
    );

    if (matchingSidebarItem) {
      if (matchingSidebarItem.label === 'Dashboard') {
        setActiveItemState('Dashboard');
      } else if (matchingSidebarItem.subItems) {
        // If it's in a submenu, expand the parent and set the active item
        const subItem = matchingSidebarItem.subItems.find(sub => sub.label === 'Dashboard');
        if (subItem) {
          setExpandedItems(prev => ({ ...prev, [matchingSidebarItem.label]: true }));
          setActiveItemState('Dashboard');
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

      return newState;
    });
  };

  const handleItemClickInternal = (
    label: string,
    parentLabel?: string
  ) => {
    setLoading(true);
    setActiveItemState(label);

    setExpandedItems((prev) => {
      if (parentLabel) {
        return { ...prev, [parentLabel]: true };
      }
      return {};
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
      // Always use the subItem label for navigation
      handleItemClick(label);
      onSectionSelect(label);
      setLoading(false);

      if (isSmallScreen) {
        handleDrawerClose();
      }
    }, 500);
  };

  // Use a single drawer approach with different widths based on state
  return (
    <>
      <Drawer
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        open={isSmallScreen ? localDrawerOpen : true}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: !isSmallScreen && !localDrawerOpen ? 80 : drawerWidth,
          flexShrink: 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1100, // Lower than AppBar (1200) but higher than most content
          '@keyframes pulse': {
            '0%': { opacity: 0.6, transform: 'scale(0.9)' },
            '50%': { opacity: 1, transform: 'scale(1.1)' },
            '100%': { opacity: 0.6, transform: 'scale(0.9)' }
          },
          '& .MuiDrawer-paper': {
            width: !isSmallScreen && !localDrawerOpen ? 80 : drawerWidth,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxSizing: 'border-box',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor,
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
        <Box sx={{
          textAlign: 'center',
          p: 2,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {!isSmallScreen && !localDrawerOpen ? (
            // Mini drawer header
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              animation: 'fadeIn 0.4s ease-out'
            }}>
              <Image
                src={logoUrl}
                alt="Logo"
                width={40}
                height={40}
                style={{
                  borderRadius: '50%',
                  boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)'
                }}
              />
            </Box>
          ) : (
            // Full drawer header
            <>
              <Image
                src={logoUrl}
                alt="Logo"
                width={90}
                height={90}
                style={{ borderRadius: '50%' }}
              />
              <Box sx={{
                mt: 2,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                position: 'relative'
              }}>
                {isUserLoading ? (
                  <Skeleton
                    variant="rectangular"
                    width="80%"
                    height={36}
                    sx={{
                      borderRadius: '6px',
                      bgcolor: 'rgba(255, 255, 255, 0.2)'
                    }}
                  />
                ) : (
                  <Box sx={{ position: 'relative', width: '90%' }}>
                    <Tooltip title={userInfo?.email || ''} placement="bottom" arrow>
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          width: '100%',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#1E3A8A',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {userInfo?.name?.charAt(0) || userInfo?.preferred_username?.charAt(0) || 'U'}
                        </Avatar>
                        <Box sx={{ position: 'relative', flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#000',
                              fontWeight: 600,
                              fontSize: isSmallScreen ? '0.875rem' : '1.1rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {userInfo?.name || userInfo?.preferred_username || 'User'}
                          </Typography>
                          <Box
                            sx={{
                              position: 'absolute',
                              right: -8,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#4CAF50',
                              boxShadow: '0 0 4px #4CAF50',
                              animation: 'pulse 2s infinite'
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
                        transform: 'translateX(-50%)',
                        fontSize: '0.7rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        padding: '1px 8px',
                        borderRadius: '4px',
                        letterSpacing: '0.5px'
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
              isCollapsed={!isSmallScreen && !localDrawerOpen}
            />
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
