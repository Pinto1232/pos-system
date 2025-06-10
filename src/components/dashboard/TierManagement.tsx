'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpwardIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTierAccess, TIER_FEATURES } from '@/hooks/useTierAccess';
import TierBadge from '@/components/tier/TierBadge';
import TierUpgradePrompt from './TierUpgradePrompt';
import { useRouter } from 'next/navigation';

const StyledCard = styled(Card)<{ current?: boolean }>(
  ({ theme, current }) => ({
    height: '100%',
    border: current
      ? `2px solid ${theme.palette.primary.main}`
      : `1px solid ${theme.palette.divider}`,
    backgroundColor: current
      ? theme.palette.primary.main + '10'
      : 'transparent',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  })
);

const FeatureList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

const TierManagement: React.FC = () => {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const router = useRouter();

  const {
    subscriptionData,
    currentTierLevel,
    currentTierName,
    getAvailableFeatures,
    getLockedFeatures,
    getNextTierFeatures,
  } = useTierAccess();

  const availableFeatures = getAvailableFeatures();
  const lockedFeatures = getLockedFeatures();
  const nextTierFeatures = getNextTierFeatures();

  const tiers = [
    {
      level: 1,
      name: 'Starter Plus',
      description: 'Essential features for small businesses',
      price: '$39.99',
      features: [
        'Basic POS functionality',
        'Inventory management',
        'Single store support',
        'Email support',
        'Basic reporting',
      ],
    },
    {
      level: 2,
      name: 'Growth Pro',
      description: 'Advanced features for growing businesses',
      price: '$79.99',
      features: [
        'Everything in Starter Plus',
        'Advanced Analytics',
        'Multi-Location Support',
        'Priority support',
        'Customer loyalty program',
      ],
    },
    {
      level: 3,
      name: 'Custom Pro',
      description: 'Flexible solutions for unique needs',
      price: '$129.99',
      features: [
        'Everything in Growth Pro',
        'Custom Integrations',
        'API Access',
        'Advanced reporting',
        'Custom workflows',
      ],
    },
    {
      level: 4,
      name: 'Enterprise Elite',
      description: 'Comprehensive solutions for large organizations',
      price: '$249.99',
      features: [
        'Everything in Custom Pro',
        'Enterprise Features',
        'White Label Options',
        'Dedicated support',
        'Custom development',
      ],
    },
    {
      level: 5,
      name: 'Premium Plus',
      description: 'Ultimate POS experience with cutting-edge features',
      price: '$349.99',
      features: [
        'Everything in Enterprise Elite',
        'AI-Powered Insights',
        'Premium Support',
        'Quarterly business reviews',
        'Predictive analytics',
      ],
    },
  ];

  const maxTier = 5;
  const progress = (currentTierLevel / maxTier) * 100;

  const handleUpgradeClick = () => {
    setUpgradeDialogOpen(true);
  };

  const handleUpgrade = (tierLevel: number) => {
    router.push(`/pricing-packages?selectedTier=${tierLevel}`);
  };

  const isFeatureInTier = (featureName: string, tierLevel: number): boolean => {
    const feature = TIER_FEATURES[featureName];
    return feature ? feature.requiredTierLevel === tierLevel : false;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Tier Management
      </Typography>

      {}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <StarIcon color="primary" />
                  Current Subscription
                </Typography>
                <TierBadge
                  tierLevel={currentTierLevel}
                  tierName={currentTierName}
                  tierDescription={subscriptionData?.package?.tierDescription}
                  size="medium"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Active since:{' '}
                  {subscriptionData?.startDate
                    ? new Date(subscriptionData.startDate).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tier Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {currentTierLevel}/{maxTier} - {Math.round(progress)}%
                  Complete
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                Available Features
              </Typography>
              <Typography variant="h3" color="success.main">
                {availableFeatures.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Features you can use
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="warning.main">
                Locked Features
              </Typography>
              <Typography variant="h3" color="warning.main">
                {lockedFeatures.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Features requiring upgrade
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="info.main">
                Next Tier Features
              </Typography>
              <Typography variant="h3" color="info.main">
                {nextTierFeatures.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unlock with next upgrade
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {}
      {nextTierFeatures.length > 0 && (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleUpgradeClick}>
              Upgrade Now
            </Button>
          }
          sx={{ mb: 4 }}
        >
          <Typography variant="body2">
            <strong>Upgrade to Tier {currentTierLevel + 1}</strong> to unlock{' '}
            {nextTierFeatures.length} new feature
            {nextTierFeatures.length > 1 ? 's' : ''}:{' '}
            {nextTierFeatures.map((f) => f.name).join(', ')}
          </Typography>
        </Alert>
      )}

      {/* All Tiers Overview */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        All Available Tiers
      </Typography>

      <Grid container spacing={3}>
        {tiers.map((tier) => (
          <Grid item xs={12} md={6} lg={4} key={tier.level}>
            <StyledCard current={tier.level === currentTierLevel}>
              <CardContent>
                <Box mb={2}>
                  <TierBadge
                    tierLevel={tier.level}
                    tierName={tier.name}
                    size="small"
                  />
                  {tier.level === currentTierLevel && (
                    <Chip
                      label="Current"
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>

                <Typography variant="h6" gutterBottom>
                  {tier.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {tier.description}
                </Typography>

                <Typography
                  variant="h5"
                  color="primary"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  {tier.price}
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    /month
                  </Typography>
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <FeatureList dense>
                  {tier.features.map((feature, index) => {
                    const isAvailable = tier.level <= currentTierLevel;
                    const isSpecialFeature = isFeatureInTier(
                      feature,
                      tier.level
                    );

                    return (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {isAvailable ? (
                            <CheckCircleIcon color="success" fontSize="small" />
                          ) : (
                            <LockIcon color="action" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              color={
                                isAvailable ? 'text.primary' : 'text.secondary'
                              }
                              fontWeight={isSpecialFeature ? 'bold' : 'normal'}
                            >
                              {feature}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </FeatureList>

                {tier.level > currentTierLevel && (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ArrowUpwardIcon />}
                    onClick={handleUpgradeClick}
                    sx={{ mt: 2 }}
                  >
                    Upgrade to {tier.name}
                  </Button>
                )}

                {tier.level === currentTierLevel && (
                  <Button variant="contained" fullWidth disabled sx={{ mt: 2 }}>
                    Current Plan
                  </Button>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {}
      <TierUpgradePrompt
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        currentTierLevel={currentTierLevel}
        onUpgrade={handleUpgrade}
      />
    </Box>
  );
};

export default TierManagement;
