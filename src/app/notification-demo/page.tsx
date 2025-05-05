'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar
} from '@mui/material';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { NotificationType, CreateNotificationRequest } from '@/types/notification';
import NotificationItem from '@/components/notifications/NotificationItem';

const NotificationDemo = () => {
  const {
    notifications,
    unreadCount,
    totalCount,
    createNotification,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  } = useNotificationContext();

  const [formData, setFormData] = useState<CreateNotificationRequest>({
    title: '',
    message: '',
    type: 'info',
    link: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: any) => {
    setFormData(prev => ({ ...prev, type: e.target.value as NotificationType }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreateNotification = async () => {
    try {
      await createNotification(formData);
      setFormData({
        title: '',
        message: '',
        type: 'info',
        link: '',
        tags: []
      });
      setSnackbarMessage('Notification created successfully!');
      setSnackbarOpen(true);
      refreshNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      setSnackbarMessage('Failed to create notification');
      setSnackbarOpen(true);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead([id]);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Notification Service Demo
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create New Notification
            </Typography>

            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={3}
                required
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={handleTypeChange}
                  label="Type"
                >
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Link (optional)"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                margin="normal"
                placeholder="e.g., /dashboard"
              />

              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tags
                </Typography>

                <Box sx={{ display: 'flex', mb: 1 }}>
                  <TextField
                    size="small"
                    label="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddTag}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleCreateNotification}
                disabled={!formData.title || !formData.message}
              >
                Create Notification
              </Button>
            </Box>
          </Paper>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Stats
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Total Notifications:</Typography>
                <Typography fontWeight="bold">{totalCount}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Unread Notifications:</Typography>
                <Typography fontWeight="bold" color="error">
                  {unreadCount}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark All as Read
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Notifications ({notifications.length})
              </Typography>

              <Button
                size="small"
                onClick={refreshNotifications}
              >
                Refresh
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{
              flex: 1,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
              },
            }}>
              {notifications.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No notifications to display
                </Alert>
              ) : (
                notifications.map((notification) => (
                  <Box key={notification.id} sx={{ mb: 2 }}>
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default NotificationDemo;
