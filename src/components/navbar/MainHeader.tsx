"use client";

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useData } from '@hooks/useData'; // Import the useData hook

// Importing props and styles
import { NavBarProps } from './NavBar.types';
import { styles } from './NavBar.styles';

const MainHeader: React.FC<NavBarProps> = ({ testPeriod, onMenuClick }) => {
  const { data, error, isLoading } = useData(); // Use the useData hook

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("Pricing Packages Data:", data);
  console.log("Error:", error);

  return (
    <AppBar position="static" sx={styles.appBar}>
      <Toolbar>
        {/* Menu Icon */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" component="div" sx={styles.title}>
          Pisval Tech
        </Typography>

        {/* Test Period */}
        <Box sx={styles.testPeriodBox}>
          <AccessTimeIcon sx={styles.testPeriodIcon} />
          <Typography variant="body2" color="textPrimary">
            Test Period: {testPeriod}
          </Typography>
        </Box>

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
      </Toolbar>
    </AppBar>
  );
};

export default MainHeader;