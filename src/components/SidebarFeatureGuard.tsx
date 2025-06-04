import React from 'react';
import { Tooltip, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';
import { sidebarItems } from '../Seetings/settings';

interface SidebarFeatureGuardProps {
  featureName: string;
  parentFeature?: string;
  children: React.ReactNode;
}

export const SidebarFeatureGuard: React.FC<SidebarFeatureGuardProps> = ({
  featureName,
  parentFeature,
  children,
}) => {
  const { hasFeatureAccess: checkFeatureAccess, subscription } =
    useUserSubscription();

  const hasParentAccess = parentFeature
    ? checkFeatureAccess(parentFeature)
    : true;
  const hasCurrentFeatureAccess = checkFeatureAccess(featureName);
  const hasAccess = hasParentAccess && hasCurrentFeatureAccess;
  const getRequiredPackage = () => {
    if (subscription?.package?.type.toLowerCase() === 'premium plus') {
      return null;
    }

    if (parentFeature) {
      for (const item of sidebarItems) {
        if (item.label === parentFeature && item.requiredPackage) {
          return item.requiredPackage;
        }
      }
    }

    for (const item of sidebarItems) {
      if (item.label === featureName && item.requiredPackage) {
        return item.requiredPackage;
      }
      if (item.subItems) {
        const subItem = item.subItems.find((sub) => sub.label === featureName);
        if (subItem?.requiredPackage) {
          return subItem.requiredPackage;
        }
      }
    }
    return null;
  };

  const requiredPackage = getRequiredPackage();

  if (!hasAccess && requiredPackage) {
    const currentPackage = subscription?.package;
    const tooltipTitle = currentPackage
      ? `Upgrade to ${requiredPackage.name} package ($${requiredPackage.minPrice}/month) to access this feature. Current package: ${currentPackage.title}`
      : `This feature requires the ${requiredPackage.name} package ($${requiredPackage.minPrice}/month)`;

    return (
      <Tooltip title={tooltipTitle} placement="right">
        <Box
          sx={{
            opacity: 0.5,
            cursor: 'not-allowed',
            position: 'relative',
            '&:hover': {
              opacity: 0.7,
            },
          }}
        >
          {children}
          <LockIcon
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 16,
              opacity: 0.8,
            }}
          />
        </Box>
      </Tooltip>
    );
  }

  return <>{children}</>;
};
