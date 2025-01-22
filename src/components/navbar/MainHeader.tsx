"use client";

import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Paper, useMediaQuery, ThemeProvider, createTheme, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// Importing props and styles
import { NavBarProps } from './NavBar.types';
import { styles } from './NavBar.styles';
import AppDrawer from '../Drawer/AppDrawer';

const theme = createTheme();

const MainHeader: React.FC<NavBarProps> = ({ testPeriod, onMenuClick, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClick = () => {
    setDrawerOpen((prev) => !prev);
    onMenuClick();
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'center' : 'flex-start', width: isSmallScreen ? '100%' : 'auto' }}>
            {/* Menu Icon */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
              sx={isSmallScreen ? { mr: 0 } : {}}
            >
              <MenuIcon />
            </IconButton>
            {isSmallScreen && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 0 }}>
                <IconButton color="inherit" sx={{ mr: 0 }}>
                  <ChatBubbleOutlineIcon />
                </IconButton>
                <IconButton color="inherit" sx={{ ml: 0 }}>
                  <Badge badgeContent={2} color="error">
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
              </Box>
            )}
          </Box>
          <AppDrawer open={drawerOpen} onClose={handleMenuClick} userRole="admin" />

          {/* Title */}
          {isSmallScreen ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', order: -1 }}>
              <Typography variant="h6" component="div" sx={{ ...styles.title, flexGrow: 0, textAlign: 'center', mt: 2 }}>
                Pisval Tech
              </Typography>
            </Box>
          ) : (
            <Typography variant="h6" component="div" sx={{ ...styles.title, flexGrow: 1 }}>
              Pisval Tech
            </Typography>
          )}

          {/* Test Period */}
          <Paper elevation={12} sx={{ ...styles.testPeriodBox, mt: isSmallScreen ? 2 : 0 }}>
            <AccessTimeIcon sx={styles.testPeriodIcon} />
            <Typography variant="body2" color="textPrimary">
              <span style={{ fontWeight: 'bold' }}>Testing Period:</span> {testPeriod}
            </Typography>
          </Paper>

          {!isSmallScreen && (
            <>
              {/* Chat Icon */}
              <IconButton color="inherit">
                <ChatBubbleOutlineIcon />
              </IconButton>

              {/* Notification Icon with Badge */}
              <IconButton color="inherit">
                <Badge badgeContent={2} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>
            </>
          )}
        </Toolbar>
        {children} {/* Render children */}
      </AppBar>
    </ThemeProvider>
  );
};

export default MainHeader;