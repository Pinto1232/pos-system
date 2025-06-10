'use client';

import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import TierStatusCard from '@/components/dashboard/TierStatusCard';
import TierUpgradePrompt from '@/components/dashboard/TierUpgradePrompt';
import TierFeatureGate from '@/components/dashboard/TierFeatureGate';
import { UserSubscriptionData } from '@/app/dashboard/types';

interface TierManagementContentProps {
  subscriptionData: UserSubscriptionData | null | undefined;
}

const TierManagementContent: React.FC<TierManagementContentProps> = ({
  subscriptionData,
}) => {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const router = useRouter();

  const currentTierLevel = subscriptionData?.package?.tierLevel || 1;

  const handleUpgradeClick = () => {
    setUpgradeDialogOpen(true);
  };

  const handleUpgrade = (tierLevel: number) => {
    router.push(`/pricing-packages?selectedTier=${tierLevel}`);
  };

  const renderTierGatedFeatures = () => {
    const features = [
      {
        name: 'Advanced Analytics',
        description:
          'Get detailed insights into your business performance with advanced charts and reports.',
        requiredTier: 2,
        requiredTierName: 'Growth Pro',
        content: (
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              📊 Advanced Analytics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View detailed sales trends, customer behavior, and inventory
              insights.
            </Typography>
          </Box>
        ),
      },
      {
        name: 'Custom Integrations',
        description:
          'Connect with third-party services and build custom workflows.',
        requiredTier: 3,
        requiredTierName: 'Custom Pro',
        content: (
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              🔗 API & Integrations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect with external services and automate your workflows.
            </Typography>
          </Box>
        ),
      },
      {
        name: 'Enterprise Features',
        description:
          'Access enterprise-level features including white-label options.',
        requiredTier: 4,
        requiredTierName: 'Enterprise Elite',
        content: (
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              🏢 Enterprise Suite
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Multi-tenant management, white-label options, and enterprise
              security.
            </Typography>
          </Box>
        ),
      },
      {
        name: 'AI-Powered Insights',
        description:
          'Leverage artificial intelligence for predictive analytics and recommendations.',
        requiredTier: 5,
        requiredTierName: 'Premium Plus',
        content: (
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              🤖 AI Business Intelligence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get AI-powered recommendations and predictive insights for your
              business.
            </Typography>
          </Box>
        ),
      },
    ];

    return (
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <TierFeatureGate
              currentTierLevel={currentTierLevel}
              requiredTierLevel={feature.requiredTier}
              requiredTierName={feature.requiredTierName}
              featureName={feature.name}
              featureDescription={feature.description}
              onUpgradeClick={handleUpgradeClick}
              variant="card"
            >
              {feature.content}
            </TierFeatureGate>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Subscription & Tier Management
      </Typography>

      <Grid container spacing={3}>
        {}
        <Grid item xs={12} lg={4}>
          <TierStatusCard
            subscriptionData={subscriptionData || null}
            onUpgradeClick={handleUpgradeClick}
          />
        </Grid>

        {}
        <Grid item xs={12} lg={8}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Available Features by Tier
            </Typography>
            {renderTierGatedFeatures()}
          </Box>
        </Grid>
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

export default TierManagementContent;
