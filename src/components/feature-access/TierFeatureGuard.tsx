'use client';

import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Lock as LockIcon, Star as StarIcon } from '@mui/icons-material';
import { useTierAccess } from '@/hooks/useTierAccess';
import TierBadge from '@/components/tier/TierBadge';
import TierUpgradePrompt from '@/components/dashboard/TierUpgradePrompt';
import { useRouter } from 'next/navigation';

interface TierFeatureGuardProps {
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  variant?: 'full' | 'compact' | 'alert';
}

const TierFeatureGuard: React.FC<TierFeatureGuardProps> = ({
  featureName,
  children,
  fallback,
  variant = 'full',
}) => {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const router = useRouter();

  const {
    hasFeatureAccess,
    getFeatureRequirement,
    currentTierLevel,
    currentTierName,
  } = useTierAccess();

  const hasAccess = hasFeatureAccess(featureName);
  const featureRequirement = getFeatureRequirement(featureName);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!featureRequirement) {
    return <>{children}</>;
  }

  const handleUpgradeClick = () => {
    setUpgradeDialogOpen(true);
  };

  const handleUpgrade = (tierLevel: number) => {
    router.push(`/pricing-packages?selectedTier=${tierLevel}`);
  };

  const renderCompactView = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        border: '1px dashed #ccc',
        borderRadius: 1,
        bgcolor: '#f9f9f9',
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <LockIcon color="action" />
        <Typography variant="body2">
          <strong>{featureName}</strong> requires{' '}
          <TierBadge
            tierLevel={featureRequirement.requiredTierLevel}
            tierName={featureRequirement.requiredTierName}
            size="small"
          />
        </Typography>
      </Box>
      <Button size="small" variant="outlined" onClick={handleUpgradeClick}>
        Upgrade
      </Button>
    </Box>
  );

  const renderFullView = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        textAlign: 'center',
        border: '2px dashed #ccc',
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
      <Typography
        variant="h6"
        gutterBottom
        display="flex"
        alignItems="center"
        gap={1}
      >
        <StarIcon color="primary" />
        {featureName}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {featureRequirement.description ||
          `This feature requires ${featureRequirement.requiredTierName} or higher.`}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Current Tier:
        </Typography>
        <TierBadge
          tierLevel={currentTierLevel}
          tierName={currentTierName}
          size="small"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Required Tier:
        </Typography>
        <TierBadge
          tierLevel={featureRequirement.requiredTierLevel}
          tierName={featureRequirement.requiredTierName}
          size="small"
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpgradeClick}
        size="large"
      >
        Upgrade to {featureRequirement.requiredTierName}
      </Button>
    </Box>
  );

  return (
    <>
      {variant === 'compact' ? renderCompactView() : renderFullView()}

      <TierUpgradePrompt
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        currentTierLevel={currentTierLevel}
        onUpgrade={handleUpgrade}
      />
    </>
  );
};

export default TierFeatureGuard;
