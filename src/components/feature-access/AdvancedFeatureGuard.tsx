'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useKeycloakUser } from '@/hooks/useKeycloakUser';
import {
  Box,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import { Lock, Warning, Info, TrendingUp } from '@mui/icons-material';
import advancedPermissionService, {
  FeatureAccessResult,
  FeatureUsageInfo,
} from '@/services/advancedPermissionService';

interface AdvancedFeatureGuardProps {
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  trackUsage?: boolean;
  showUsageInfo?: boolean;
  showAccessReason?: boolean;
  onAccessDenied?: (reason: string) => void;
  onUsageTracked?: (usageInfo: FeatureUsageInfo) => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

const AdvancedFeatureGuard: React.FC<AdvancedFeatureGuardProps> = ({
  featureName,
  children,
  fallback,
  trackUsage = true,
  showUsageInfo = false,
  showAccessReason = false,
  onAccessDenied,
  onUsageTracked,
  loadingComponent,
  errorComponent,
}) => {
  const { userId } = useKeycloakUser();
  const [accessResult, setAccessResult] = useState<FeatureAccessResult | null>(
    null
  );
  const [usageInfo, setUsageInfo] = useState<FeatureUsageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAccess = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await advancedPermissionService.checkFeatureAccess(
        userId,
        featureName
      );
      setAccessResult(result);

      if (result.hasAccess && showUsageInfo) {
        const usage = await advancedPermissionService.getFeatureUsage(
          userId,
          featureName
        );
        setUsageInfo(usage);
      }

      if (!result.hasAccess && onAccessDenied) {
        onAccessDenied(result.reason);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error checking feature access:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, featureName, showUsageInfo, onAccessDenied]);

  const trackFeatureUsage = useCallback(async () => {
    if (!userId || !accessResult?.hasAccess || !trackUsage) return;

    try {
      const metadata = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        evaluationTime: accessResult.evaluationTimeMs,
      };

      await advancedPermissionService.trackFeatureUsage(
        userId,
        featureName,
        metadata
      );

      if (showUsageInfo) {
        const updatedUsage = await advancedPermissionService.getFeatureUsage(
          userId,
          featureName
        );
        setUsageInfo(updatedUsage);

        if (onUsageTracked) {
          onUsageTracked(updatedUsage);
        }
      }
    } catch (err) {
      console.error('Error tracking feature usage:', err);
    }
  }, [
    userId,
    featureName,
    accessResult,
    trackUsage,
    showUsageInfo,
    onUsageTracked,
  ]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  useEffect(() => {
    if (accessResult?.hasAccess) {
      trackFeatureUsage();
    }
  }, [accessResult, trackFeatureUsage]);

  if (loading) {
    return (
      loadingComponent || (
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
          <LinearProgress sx={{ width: '100%', mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Checking feature access...
          </Typography>
        </Box>
      )
    );
  }

  if (error) {
    return (
      errorComponent || (
        <Alert severity="error" sx={{ m: 2 }}>
          <Typography variant="body2">
            Error checking feature access: {error}
          </Typography>
          <Button size="small" onClick={checkAccess} sx={{ mt: 1 }}>
            Retry
          </Button>
        </Alert>
      )
    );
  }

  if (!accessResult || !accessResult.hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
        sx={{
          border: '1px dashed #ccc',
          borderRadius: 2,
          backgroundColor: '#f9f9f9',
          textAlign: 'center',
        }}
      >
        <Lock
          sx={{
            fontSize: 48,
            color: '#999',
            mb: 2,
          }}
        />
        <Typography variant="h6" gutterBottom>
          Feature Access Restricted
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          The {featureName} feature is not available.
        </Typography>

        {showAccessReason && accessResult && (
          <Alert severity="info" sx={{ mb: 2, maxWidth: 400 }}>
            <Typography variant="body2">
              <strong>Reason:</strong> {accessResult.reason}
            </Typography>
            {accessResult.appliedRules.length > 0 && (
              <Box mt={1}>
                <Typography variant="caption" display="block">
                  Applied Rules:
                </Typography>
                {accessResult.appliedRules.map((rule, index) => (
                  <Chip
                    key={index}
                    label={rule}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const event = new CustomEvent('openSettingsModal', {
              detail: {
                initialTab: 'Subscription Management',
              },
            });
            window.dispatchEvent(event);
          }}
        >
          Upgrade Access
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {showUsageInfo && usageInfo && (
        <Box mb={2}>
          <Alert
            severity={usageInfo.hasExceededLimit ? 'warning' : 'info'}
            icon={usageInfo.hasExceededLimit ? <Warning /> : <TrendingUp />}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body2">
                <strong>Usage:</strong> {usageInfo.currentUsage}
                {usageInfo.usageLimit && ` / ${usageInfo.usageLimit}`}
                {usageInfo.usageLimit && (
                  <span> ({usageInfo.remainingUsage} remaining)</span>
                )}
              </Typography>
              {usageInfo.usageLimit && (
                <Box ml={2} minWidth={100}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (usageInfo.currentUsage / usageInfo.usageLimit) * 100
                    }
                    color={usageInfo.hasExceededLimit ? 'warning' : 'primary'}
                  />
                </Box>
              )}
            </Box>
            <Typography variant="caption" display="block" mt={0.5}>
              Period: {new Date(usageInfo.periodStartDate).toLocaleDateString()}{' '}
              - {new Date(usageInfo.periodEndDate).toLocaleDateString()}
            </Typography>
          </Alert>
        </Box>
      )}

      {showAccessReason && accessResult && (
        <Box mb={2}>
          <Alert severity="success" icon={<Info />}>
            <Typography variant="body2">
              <strong>Access granted:</strong> {accessResult.reason}
            </Typography>
            <Typography variant="caption" display="block">
              Evaluation time: {accessResult.evaluationTimeMs}ms
            </Typography>
            {accessResult.appliedRules.length > 0 && (
              <Box mt={1}>
                <Typography variant="caption" display="block">
                  Applied Rules:
                </Typography>
                {accessResult.appliedRules.map((rule, index) => (
                  <Chip
                    key={index}
                    label={rule}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Alert>
        </Box>
      )}

      {children}
    </Box>
  );
};

export default AdvancedFeatureGuard;
