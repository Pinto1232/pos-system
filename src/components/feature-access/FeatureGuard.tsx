'use client';

import React from 'react';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';
import { Box, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface FeatureGuardProps {
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({ featureName, children, fallback }) => {
  const { hasFeatureAccess, subscription } = useUserSubscription();
  const hasAccess = hasFeatureAccess(featureName);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        border: '1px dashed #ccc',
        borderRadius: 2,
        bgcolor: '#f9f9f9',
        minHeight: 200,
      }}
    >
      <LockIcon
        sx={{
          fontSize: 48,
          color: '#999',
          mb: 2,
        }}
      />
      <Typography variant="h6" gutterBottom>
        Feature Locked
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        The {featureName} feature is not available with your current subscription.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        You are currently on the {subscription?.package?.title || 'Free'} plan. Upgrade your subscription or enable additional packages to
        access this feature.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          const event = new CustomEvent('openSettingsModal', {
            detail: {
              initialTab: 'Package Management',
            },
          });
          window.dispatchEvent(event);
        }}
      >
        Manage Packages
      </Button>
    </Box>
  );
};

export default FeatureGuard;
