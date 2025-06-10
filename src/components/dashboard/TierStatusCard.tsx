'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpwardIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import TierBadge from '@/components/tier/TierBadge';
import { UserSubscriptionData } from '@/app/dashboard/types';

interface TierStatusCardProps {
  subscriptionData: UserSubscriptionData | null;
  onUpgradeClick?: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledLinearProgress = styled(LinearProgress)<{ tierlevel: number }>(({
  theme,
  tierlevel,
}) => {
  const getTierColor = (level: number) => {
    switch (level) {
      case 1:
        return theme.palette.success.main;
      case 2:
        return theme.palette.info.main;
      case 3:
        return theme.palette.secondary.main;
      case 4:
        return theme.palette.error.main;
      case 5:
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.grey[200],
    '& .MuiLinearProgress-bar': {
      backgroundColor: getTierColor(tierlevel),
      borderRadius: 4,
    },
  };
});

const TierStatusCard: React.FC<TierStatusCardProps> = ({
  subscriptionData,
  onUpgradeClick,
}) => {
  const tierLevel = subscriptionData?.package?.tierLevel || 1;
  const tierName = subscriptionData?.package?.tierName || 'Starter Plus';
  const tierDescription = subscriptionData?.package?.tierDescription || '';
  const maxTier = 5;
  const progress = (tierLevel / maxTier) * 100;

  const getTierBenefits = (level: number): string[] => {
    switch (level) {
      case 1:
        return [
          'Basic POS functionality',
          'Inventory management',
          'Email support',
        ];
      case 2:
        return [
          'Advanced analytics',
          'Multi-location support',
          'Priority support',
        ];
      case 3:
        return ['Custom integrations', 'Advanced reporting', 'API access'];
      case 4:
        return [
          'Enterprise features',
          'Dedicated support',
          'White-label options',
        ];
      case 5:
        return ['AI-powered insights', 'Premium support', 'Custom development'];
      default:
        return ['Basic features'];
    }
  };

  const getNextTierBenefits = (currentLevel: number): string[] => {
    if (currentLevel >= maxTier) return [];
    return getTierBenefits(currentLevel + 1);
  };

  const currentBenefits = getTierBenefits(tierLevel);
  const nextTierBenefits = getNextTierBenefits(tierLevel);
  const isMaxTier = tierLevel >= maxTier;

  return (
    <StyledCard>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              display="flex"
              alignItems="center"
              gap={1}
            >
              <StarIcon color="primary" />
              Current Tier
            </Typography>
            <TierBadge
              tierLevel={tierLevel}
              tierName={tierName}
              tierDescription={tierDescription}
              size="medium"
            />
          </Box>
          {!isMaxTier && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowUpwardIcon />}
              onClick={onUpgradeClick}
              sx={{ minWidth: 'auto' }}
            >
              Upgrade
            </Button>
          )}
        </Box>

        <ProgressContainer>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2" color="text.secondary">
              Tier Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tierLevel}/{maxTier}
            </Typography>
          </Box>
          <StyledLinearProgress
            variant="determinate"
            value={progress}
            tierlevel={tierLevel}
          />
        </ProgressContainer>

        <Box mb={2}>
          <Typography
            variant="subtitle2"
            gutterBottom
            display="flex"
            alignItems="center"
            gap={1}
          >
            <TrendingUpIcon fontSize="small" />
            Current Benefits
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {currentBenefits.map((benefit, index) => (
              <Chip
                key={index}
                label={benefit}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Box>

        {!isMaxTier && nextTierBenefits.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Unlock with Tier {tierLevel + 1}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {nextTierBenefits.slice(0, 3).map((benefit, index) => (
                <Tooltip key={index} title="Available in next tier" arrow>
                  <Chip
                    label={benefit}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ opacity: 0.7 }}
                  />
                </Tooltip>
              ))}
              {nextTierBenefits.length > 3 && (
                <Chip
                  label={`+${nextTierBenefits.length - 3} more`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{ opacity: 0.7 }}
                />
              )}
            </Box>
          </Box>
        )}

        {isMaxTier && (
          <Box textAlign="center" mt={2}>
            <Chip
              label="🎉 Maximum Tier Reached!"
              color="success"
              variant="filled"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default TierStatusCard;
