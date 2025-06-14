import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  Grid,
  IconButton,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useKeycloakUser } from '@/hooks/useKeycloakUser';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';
import { useTranslation } from 'react-i18next';

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onClose,
}) => {
  const { userInfo, isLoading, error } = useKeycloakUser();
  const { subscription } = useUserSubscription();
  const { t } = useTranslation();

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPackageColor = (
    packageType: string
  ):
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning' => {
    switch (packageType?.toLowerCase()) {
      case 'premium plus':
        return 'success';
      case 'basic':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '500px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {t('common.profile')}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'grey.500',
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <Typography>Loading profile...</Typography>
          </Box>
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <Typography color="error">
              Error loading profile: {error}
            </Typography>
          </Box>
        ) : (
          <Box>
            {}
            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 3,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {userInfo?.name ? (
                      getUserInitials(userInfo.name)
                    ) : (
                      <PersonIcon />
                    )}
                  </Avatar>
                  <Box flex={1}>
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {userInfo?.name || 'Unknown User'}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
                      @{userInfo?.preferred_username || 'N/A'}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {userInfo?.email || 'No email provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        First Name
                      </Typography>
                      <Typography variant="body1">
                        {userInfo?.given_name || 'Not provided'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Last Name
                      </Typography>
                      <Typography variant="body1">
                        {userInfo?.family_name || 'Not provided'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        User ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                      >
                        {userInfo?.sub || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {}
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Subscription Information
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Current Package
                      </Typography>
                      <Chip
                        label={subscription?.package?.title || 'Free'}
                        color={getPackageColor(
                          subscription?.package?.type || ''
                        )}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Package Type
                      </Typography>
                      <Typography variant="body1">
                        {subscription?.package?.type || 'Free Plan'}
                      </Typography>
                    </Box>
                  </Grid>
                  {subscription?.package?.price && (
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Monthly Price
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, color: 'success.main' }}
                        >
                          ${subscription.package.price}/month
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Package ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace' }}
                      >
                        #{subscription?.package?.id || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {subscription?.features && subscription.features.length > 0 && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Available Features
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {subscription.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button
          onClick={() => {
            const event = new CustomEvent('openSettingsModal', {
              detail: {
                initialTab: 'Package Management',
              },
            });
            window.dispatchEvent(event);
            onClose();
          }}
          variant="outlined"
          color="primary"
        >
          Manage Subscription
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileModal;
