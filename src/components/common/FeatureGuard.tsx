import React from 'react';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';
import { Box, Typography, Button, Tooltip } from '@mui/material';

export interface FeatureGuardProps {
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  mode?: 'block' | 'overlay' | 'disabled';
  disabledStyle?: React.CSSProperties;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

const FeatureGuard: React.FC<FeatureGuardProps> = ({
  featureName,
  children,
  fallback,
  mode = 'block',
  disabledStyle = {},
  tooltipPlacement = 'right',
}) => {
  const { hasFeatureAccess, subscription } = useUserSubscription();
  const hasAccess = hasFeatureAccess(featureName);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const openPackageManagement = () => {
    const event = new CustomEvent('openSettingsModal', {
      detail: {
        initialTab: 'Package Management',
      },
    });
    window.dispatchEvent(event);
  };

  const tooltipContent = (
    <>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Feature Locked
      </div>
      <div>
        The {featureName} feature is not included in your current package.
      </div>
      <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
        You are currently on the {subscription?.package?.title || 'Free'} plan.
        Upgrade your subscription to access this feature.
      </div>
      <div
        style={{ fontSize: '0.8rem', marginTop: '8px', fontStyle: 'italic' }}
      >
        Click to open package management
      </div>
    </>
  );

  if (mode === 'block') {
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
        <Typography variant="h6" gutterBottom>
          Feature Locked
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          The {featureName} feature is not available with your current
          subscription.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You are currently on the {subscription?.package?.title || 'Free'}{' '}
          plan. Upgrade your subscription or enable additional packages to
          access this feature.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={openPackageManagement}
        >
          Manage Packages
        </Button>
      </Box>
    );
  }

  if (mode === 'overlay') {
    return (
      <Tooltip
        title={tooltipContent}
        placement={tooltipPlacement}
        arrow
        enterDelay={300}
        leaveDelay={200}
      >
        <div
          style={{
            opacity: 0.6,
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.3s ease',
            filter: 'grayscale(0.7)',
            ...disabledStyle,
          }}
          onClick={(e) => {
            e.stopPropagation();
            openPackageManagement();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
            e.currentTarget.style.filter = 'grayscale(0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.6';
            e.currentTarget.style.filter = 'grayscale(0.7)';
          }}
        >
          {children}
        </div>
      </Tooltip>
    );
  }

  if (mode === 'disabled') {
    return (
      <Tooltip title={tooltipContent} placement={tooltipPlacement} arrow>
        <div
          style={{
            opacity: 0.5,
            cursor: 'not-allowed',
            ...disabledStyle,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </Tooltip>
    );
  }

  return <>{children}</>;
};

export default FeatureGuard;
