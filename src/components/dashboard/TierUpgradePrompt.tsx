'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import TierBadge from '@/components/tier/TierBadge';

interface TierUpgradePromptProps {
  open: boolean;
  onClose: () => void;
  currentTierLevel: number;
  onUpgrade: (tierLevel: number) => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    maxWidth: '800px',
    width: '100%',
    minHeight: '400px',
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    minHeight: '200px',
  },
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const TierCard = styled(Card)<{ selected?: boolean; current?: boolean }>(
  ({ theme, selected, current }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    border: selected
      ? `2px solid ${theme.palette.primary.main}`
      : current
        ? `2px solid ${theme.palette.success.main}`
        : `1px solid ${theme.palette.divider}`,
    backgroundColor: selected
      ? theme.palette.primary.main + '10'
      : current
        ? theme.palette.success.main + '10'
        : 'transparent',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  })
);

const FeatureList = styled(Box)(({ theme }) => ({
  '& .feature-item': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    fontSize: '0.875rem',
  },
}));

const TierUpgradePrompt: React.FC<TierUpgradePromptProps> = ({
  open,
  onClose,
  currentTierLevel,
  onUpgrade,
}) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  console.log('TierUpgradePrompt - currentTierLevel:', currentTierLevel);
  console.log('TierUpgradePrompt - open:', open);

  const tiers = [
    {
      level: 1,
      name: 'Starter Plus',
      description: 'Essential features for small businesses',
      price: 'Free',
      packageName: 'Free',
      features: [
        'Basic POS functionality',
        'Dashboard access',
        'Basic inventory management',
        'Simple sales tracking',
        'Email support',
      ],
    },
    {
      level: 2,
      name: 'Growth Pro',
      description: 'Advanced features for growing businesses',
      price: '$29.99',
      packageName: 'Basic',
      features: [
        'Everything in Starter Plus',
        'Sales management',
        'Order management',
        'Customer management',
        'Payment processing',
        'Basic reports',
      ],
    },
    {
      level: 3,
      name: 'Custom Pro',
      description: 'Professional tools for established businesses',
      price: '$49.99',
      packageName: 'Professional',
      features: [
        'Everything in Growth Pro',
        'Supplier management',
        'Employee management',
        'Advanced reports & analytics',
        'Expense tracking',
        'Promotions & discounts',
      ],
    },
    {
      level: 4,
      name: 'Enterprise Elite',
      description: 'Enterprise solutions for large organizations',
      price: '$99.99',
      packageName: 'Enterprise',
      features: [
        'Everything in Custom Pro',
        'Advanced inventory features',
        'Loyalty programs',
        'Shift management',
        'Performance tracking',
        'Tax calculations',
      ],
    },
    {
      level: 5,
      name: 'Premium Plus',
      description: 'Ultimate POS experience with all features',
      price: '$149.99',
      packageName: 'Premium Plus',
      features: [
        'Everything in Enterprise Elite',
        'All premium inventory features',
        'Product expiry tracking',
        'Bulk import/export',
        'Low stock warnings',
        'Priority support',
      ],
    },
  ];

  const safeTierLevel =
    typeof currentTierLevel === 'number' && currentTierLevel > 0
      ? currentTierLevel
      : 1;
  const availableTiers = tiers.filter((tier) => tier.level > safeTierLevel);

  console.log('TierUpgradePrompt - currentTierLevel:', currentTierLevel);
  console.log('TierUpgradePrompt - safeTierLevel:', safeTierLevel);
  console.log('TierUpgradePrompt - availableTiers:', availableTiers);
  console.log(
    'TierUpgradePrompt - availableTiers.length:',
    availableTiers.length
  );
  console.log('TierUpgradePrompt - all tiers:', tiers);

  const handleTierSelect = (tierLevel: number) => {
    setSelectedTier(tierLevel);
  };

  const handleUpgrade = () => {
    if (selectedTier) {
      onUpgrade(selectedTier);
      onClose();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <StarIcon color="primary" />
            <Typography variant="h6">Upgrade Your Tier</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ minHeight: '300px' }}>
        {}
        <Box
          sx={{
            mb: 2,
            p: 1,
            bgcolor: 'grey.100',
            borderRadius: 1,
            fontSize: '0.75rem',
          }}
        >
          <Typography variant="caption">
            Debug: currentTierLevel={currentTierLevel}, safeTierLevel=
            {safeTierLevel}, availableTiers.length={availableTiers.length}
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You&#39;re currently on <strong>Tier {safeTierLevel}</strong>.
            {availableTiers.length > 0
              ? ' Upgrade to unlock more powerful features and grow your business.'
              : ' You are already on the highest tier! Enjoy all premium features.'}
          </Typography>
        </Box>

        {availableTiers.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              bgcolor: 'success.light',
              borderRadius: 2,
              color: 'success.contrastText',
            }}
          >
            <Typography variant="h6" gutterBottom>
              🎉 Congratulations!
            </Typography>
            <Typography variant="body1">
              You&#39;re already enjoying our highest tier with all premium
              features unlocked.
            </Typography>
          </Box>
        ) : availableTiers.length > 0 ? (
          <Grid container spacing={2}>
            {availableTiers.map((tier) => (
              <Grid item xs={12} sm={6} md={4} key={tier.level}>
                <TierCard
                  selected={selectedTier === tier.level}
                  onClick={() => handleTierSelect(tier.level)}
                  sx={{
                    minHeight: '300px',
                    border: '1px solid #ccc',
                    backgroundColor: 'background.paper',
                  }}
                >
                  <CardContent>
                    <Box mb={2}>
                      <TierBadge
                        tierLevel={tier.level}
                        tierName={tier.name}
                        tierDescription={tier.description}
                        size="small"
                      />
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      {tier.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {tier.description}
                    </Typography>

                    <Box mb={2}>
                      <Typography
                        variant="h5"
                        color="primary"
                        fontWeight="bold"
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
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <FeatureList>
                      {tier.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <CheckCircleIcon
                            fontSize="small"
                            color="success"
                            sx={{ flexShrink: 0 }}
                          />
                          <Typography variant="body2">{feature}</Typography>
                        </div>
                      ))}
                    </FeatureList>

                    {tier.level > currentTierLevel + 1 && (
                      <Box mt={2}>
                        <Chip
                          label={`+${tier.level - currentTierLevel - 1} tier jump`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </CardContent>
                </TierCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              bgcolor: 'warning.light',
              borderRadius: 2,
              color: 'warning.contrastText',
            }}
          >
            <Typography variant="h6" gutterBottom>
              ⚠️ No Tiers Available
            </Typography>
            <Typography variant="body1">
              There seems to be an issue loading available tiers. Please try
              again later.
            </Typography>
          </Box>
        )}

        {selectedTier && availableTiers.length > 0 && (
          <Box
            mt={3}
            p={2}
            bgcolor="primary.main"
            color="primary.contrastText"
            borderRadius={1}
          >
            <Typography variant="body2" textAlign="center">
              <strong>Selected:</strong> Tier {selectedTier} -{' '}
              {tiers.find((t) => t.level === selectedTier)?.name} (
              {tiers.find((t) => t.level === selectedTier)?.price}/month)
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          {availableTiers.length === 0 ? 'Close' : 'Cancel'}
        </Button>
        {availableTiers.length > 0 && (
          <Button
            onClick={handleUpgrade}
            variant="contained"
            disabled={!selectedTier}
            size="large"
          >
            Upgrade to Tier {selectedTier}
          </Button>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default TierUpgradePrompt;
