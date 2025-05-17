'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress, Divider } from '@mui/material';
import NotificationItem from './NotificationItem';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { styled } from '@mui/material/styles';

const NotificationListContainer = styled(Box)(({ theme }) => ({
  maxHeight: '400px',
  overflowY: 'auto',
  padding: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.text.disabled,
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
}));

const NotificationList: React.FC = () => {
  const { notifications, isLoading, error, markAsRead, markAllAsRead, refreshNotifications, unreadCount } = useNotificationContext();

  const handleMarkAsRead = async (id: string) => {
    await markAsRead([id]);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <EmptyState>
        <Typography variant="body2" color="error" gutterBottom>
          Error loading notifications
        </Typography>
        <Button variant="outlined" size="small" onClick={refreshNotifications} sx={{ mt: 1 }}>
          Retry
        </Button>
      </EmptyState>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState>
        <Typography variant="body2" gutterBottom>
          No notifications yet
        </Typography>
        <Typography variant="caption" color="text.disabled">
          We'll notify you when something important happens
        </Typography>
      </EmptyState>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="subtitle2">Notifications {unreadCount > 0 && `(${unreadCount} unread)`}</Typography>
        {unreadCount > 0 && (
          <Button size="small" onClick={handleMarkAllAsRead} sx={{ fontSize: '0.75rem' }}>
            Mark all as read
          </Button>
        )}
      </Box>

      <Divider />

      <NotificationListContainer>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
        ))}
      </NotificationListContainer>
    </Box>
  );
};

export default NotificationList;
