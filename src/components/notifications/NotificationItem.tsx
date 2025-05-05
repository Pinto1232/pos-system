'use client';

import React from 'react';
import { Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Notification } from '@/types/notification';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
  },
}));

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const router = useRouter();

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: '#22c55e' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#f59e0b' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#ef4444' }} />;
      case 'info':
        return <InfoIcon sx={{ color: '#3b82f6' }} />;
      default:
        return <InfoIcon sx={{ color: '#6b7280' }} />;
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'success':
        return '#22c55e';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const handleClick = () => {
    if (notification.status === 'unread') {
      onMarkAsRead(notification.id);
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  return (
    <NotificationItemContainer
      onClick={handleClick}
      sx={{
        opacity: notification.status === 'read' ? 0.7 : 1,
        '&::before': {
          backgroundColor: getNotificationColor(),
        },
      }}
    >
      <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'flex-start', pt: 0.5 }}>
        {getNotificationIcon()}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {notification.title}
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {formattedTime}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {notification.message}
        </Typography>

        {notification.tags && notification.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
            {notification.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  backgroundColor: `${getNotificationColor()}20`,
                  color: getNotificationColor(),
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box>
        <Tooltip title="More options">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Add more options menu here
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </NotificationItemContainer>
  );
};

export default NotificationItem;
