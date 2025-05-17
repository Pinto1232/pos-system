import React from 'react';
import { useUserSubscription } from '@/contexts/UserSubscriptionContext';
import { Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
`;

const AnimatedLockIcon = styled(LockIcon)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  animation: ${pulseAnimation} 2s infinite ease-in-out;
`;

interface SidebarFeatureGuardProps {
  featureName: string;
  children: React.ReactNode;
  disabledStyle?: React.CSSProperties;
}

const SidebarFeatureGuard: React.FC<SidebarFeatureGuardProps> = ({
  featureName,
  children,
  disabledStyle = {},
}) => {
  const { hasFeatureAccess, subscription } = useUserSubscription();
  const hasAccess = hasFeatureAccess(featureName);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      title={
        <>
          <div
            style={{
              fontWeight: 'bold',
              marginBottom: '4px',
            }}
          >
            Feature Locked
          </div>
          <div>
            The {featureName} feature is not included in your current package.
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              marginTop: '4px',
            }}
          >
            You are currently on the {subscription?.package?.title || 'Free'}{' '}
            plan. Upgrade your subscription to access this feature.
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              marginTop: '8px',
              fontStyle: 'italic',
            }}
          >
            Click to open package management
          </div>
        </>
      }
      placement="right"
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

          const event = new CustomEvent('openSettingsModal', {
            detail: {
              initialTab: 'Package Management',
            },
          });
          window.dispatchEvent(event);
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
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '50%',
            padding: '2px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <AnimatedLockIcon data-testid="lock-icon" />
        </div>
      </div>
    </Tooltip>
  );
};

export default SidebarFeatureGuard;
