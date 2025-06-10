'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import {
  Lock as LockIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpwardIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import TierBadge from '@/components/tier/TierBadge';

interface TierFeatureGateProps {
  currentTierLevel: number;
  requiredTierLevel: number;
  requiredTierName: string;
  featureName: string;
  featureDescription?: string;
  children?: React.ReactNode;
  onUpgradeClick?: () => void;
  variant?: 'card' | 'overlay' | 'alert';
}

const LockedCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  opacity: 0.7,
  background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
  border: `2px dashed ${theme.palette.grey[400]}`,
  borderRadius: theme.spacing(2),
}));

const OverlayContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
    opacity: 0.9,
    zIndex: 1,
    borderRadius: 'inherit',
  },
}));

const OverlayContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 2,
  textAlign: 'center',
  padding: theme.spacing(2),
  minWidth: '200px',
}));

const TierFeatureGate: React.FC<TierFeatureGateProps> = ({
  currentTierLevel,
  requiredTierLevel,
  requiredTierName,
  featureName,
  featureDescription,
  children,
  onUpgradeClick,
  variant = 'card',
}) => {
  const isFeatureUnlocked = currentTierLevel >= requiredTierLevel;

  if (isFeatureUnlocked) {
    return <>{children}</>;
  }

  const renderUpgradeContent = () => (
    <Box textAlign="center">
      <LockIcon
        sx={{
          fontSize: 48,
          color: 'text.secondary',
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        gutterBottom
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <StarIcon color="primary" />
        {featureName}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {featureDescription ||
          `This feature requires ${requiredTierName} or higher.`}
      </Typography>
      <Box my={2}>
        <TierBadge
          tierLevel={requiredTierLevel}
          tierName={requiredTierName}
          size="small"
        />
      </Box>
      <Button
        variant="contained"
        startIcon={<ArrowUpwardIcon />}
        onClick={onUpgradeClick}
        size="small"
      >
        Upgrade to Unlock
      </Button>
    </Box>
  );

  switch (variant) {
    case 'alert':
      return (
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<ArrowUpwardIcon />}
              onClick={onUpgradeClick}
            >
              Upgrade
            </Button>
          }
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">
              <strong>{featureName}</strong> requires{' '}
              <Chip
                label={`Tier ${requiredTierLevel}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Typography>
          </Box>
        </Alert>
      );

    case 'overlay':
      return (
        <OverlayContainer>
          {children}
          <OverlayContent>{renderUpgradeContent()}</OverlayContent>
        </OverlayContainer>
      );

    case 'card':
    default:
      return (
        <LockedCard>
          <CardContent sx={{ py: 4 }}>{renderUpgradeContent()}</CardContent>
        </LockedCard>
      );
  }
};

export default TierFeatureGate;
