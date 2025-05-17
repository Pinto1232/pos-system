'use client';

import React, { useState } from 'react';
import { IconButton, Badge, Popover, Box, Typography, Divider, Button } from '@mui/material';
import { Notifications as NotificationsIcon, Settings as SettingsIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import NotificationList from './NotificationList';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#ef4444',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.65rem',
    minWidth: '18px',
    height: '18px',
    padding: '0 4px',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const NotificationDropdown: React.FC = () => {
  const { unreadCount } = useNotificationContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} aria-describedby={id}>
        <StyledBadge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </StyledBadge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Notifications
          </Typography>

          <Box>
            <IconButton size="small" sx={{ mr: 0.5 }}>
              <FilterListIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <NotificationList />

        <Divider />

        <Box sx={{ p: 1.5, textAlign: 'center' }}>
          <Button
            variant="text"
            fullWidth
            onClick={() => {
              handleClose();
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationDropdown;
