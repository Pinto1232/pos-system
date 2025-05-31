import { useState, useEffect, useCallback, useMemo } from 'react';
import { useKeycloakUser } from '@/hooks/useKeycloakUser';
import advancedPermissionService, {
  FeatureAccessResult,
  FeatureUsageInfo,
  FeatureFlag,
  CreateFeatureFlagRequest,
  UpdateFeatureFlagRequest,
} from '@/services/advancedPermissionService';

export interface UseAdvancedPermissionsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  trackUsage?: boolean;
}

export interface PermissionState {
  features: string[];
  featureFlags: FeatureFlag[];
  loading: boolean;
  error: string | null;
}

export interface FeatureAccessState {
  [featureName: string]: {
    hasAccess: boolean;
    result?: FeatureAccessResult;
    usage?: FeatureUsageInfo;
    loading: boolean;
    error?: string;
  };
}

export const useAdvancedPermissions = (
  options: UseAdvancedPermissionsOptions = {}
) => {
  const { userId } = useKeycloakUser();
  const {
    autoRefresh = false,
    refreshInterval = 300000,
    trackUsage = true,
  } = options;

  const [state, setState] = useState<PermissionState>({
    features: [],
    featureFlags: [],
    loading: true,
    error: null,
  });

  const [featureAccess, setFeatureAccess] = useState<FeatureAccessState>({});

  const loadPermissionData = useCallback(async () => {
    if (!userId) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [features, featureFlags] = await Promise.all([
        advancedPermissionService.getUserFeatures(userId),
        advancedPermissionService.getActiveFeatureFlags(),
      ]);

      setState({
        features,
        featureFlags,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load permission data';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [userId]);

  const checkFeatureAccess = useCallback(
    async (featureName: string): Promise<boolean> => {
      if (!userId) return false;

      try {
        setFeatureAccess((prev) => ({
          ...prev,
          [featureName]: {
            ...prev[featureName],
            loading: true,
            error: undefined,
          },
        }));

        const result = await advancedPermissionService.checkFeatureAccess(
          userId,
          featureName
        );
        const usage = result.hasAccess
          ? await advancedPermissionService.getFeatureUsage(userId, featureName)
          : undefined;

        setFeatureAccess((prev) => ({
          ...prev,
          [featureName]: {
            hasAccess: result.hasAccess,
            result,
            usage,
            loading: false,
          },
        }));

        return result.hasAccess;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to check feature access';
        setFeatureAccess((prev) => ({
          ...prev,
          [featureName]: {
            hasAccess: false,
            loading: false,
            error: errorMessage,
          },
        }));
        return false;
      }
    },
    [userId]
  );

  const trackFeatureUsage = useCallback(
    async (
      featureName: string,
      metadata?: Record<string, any>
    ): Promise<boolean> => {
      if (!userId || !trackUsage) return false;

      try {
        const success = await advancedPermissionService.trackFeatureUsage(
          userId,
          featureName,
          metadata
        );

        if (success) {
          const usage = await advancedPermissionService.getFeatureUsage(
            userId,
            featureName
          );
          setFeatureAccess((prev) => ({
            ...prev,
            [featureName]: {
              ...prev[featureName],
              usage,
            },
          }));
        }

        return success;
      } catch (error) {
        console.error('Error tracking feature usage:', error);
        return false;
      }
    },
    [userId, trackUsage]
  );

  const checkMultipleFeatures = useCallback(
    async (featureNames: string[]): Promise<Record<string, boolean>> => {
      if (!userId) return {};

      const results = await advancedPermissionService.checkMultipleFeatures(
        userId,
        featureNames
      );

      const updates: FeatureAccessState = {};
      for (const [featureName, hasAccess] of Object.entries(results)) {
        updates[featureName] = {
          hasAccess,
          loading: false,
        };
      }

      setFeatureAccess((prev) => ({ ...prev, ...updates }));
      return results;
    },
    [userId]
  );

  const createFeatureFlag = useCallback(
    async (request: CreateFeatureFlagRequest): Promise<boolean> => {
      try {
        const success =
          await advancedPermissionService.createFeatureFlag(request);
        if (success) {
          await loadPermissionData();
        }
        return success;
      } catch (error) {
        console.error('Error creating feature flag:', error);
        return false;
      }
    },
    [loadPermissionData]
  );

  const updateFeatureFlag = useCallback(
    async (
      flagId: number,
      request: UpdateFeatureFlagRequest
    ): Promise<boolean> => {
      try {
        const success = await advancedPermissionService.updateFeatureFlag(
          flagId,
          request
        );
        if (success) {
          await loadPermissionData();
        }
        return success;
      } catch (error) {
        console.error('Error updating feature flag:', error);
        return false;
      }
    },
    [loadPermissionData]
  );

  const enableFeatureForUser = useCallback(
    async (
      targetUserId: string,
      featureName: string,
      reason: string,
      expiresAt?: Date
    ): Promise<boolean> => {
      try {
        const success = await advancedPermissionService.enableFeatureForUser(
          targetUserId,
          featureName,
          reason,
          expiresAt
        );

        if (success && targetUserId === userId) {
          await checkFeatureAccess(featureName);
        }

        return success;
      } catch (error) {
        console.error('Error enabling feature for user:', error);
        return false;
      }
    },
    [userId, checkFeatureAccess]
  );

  const disableFeatureForUser = useCallback(
    async (
      targetUserId: string,
      featureName: string,
      reason: string,
      expiresAt?: Date
    ): Promise<boolean> => {
      try {
        const success = await advancedPermissionService.disableFeatureForUser(
          targetUserId,
          featureName,
          reason,
          expiresAt
        );

        if (success && targetUserId === userId) {
          await checkFeatureAccess(featureName);
        }

        return success;
      } catch (error) {
        console.error('Error disabling feature for user:', error);
        return false;
      }
    },
    [userId, checkFeatureAccess]
  );

  const invalidateCache = useCallback(
    async (targetUserId?: string): Promise<void> => {
      try {
        if (targetUserId) {
          await advancedPermissionService.invalidateUserCache(targetUserId);
        } else {
          advancedPermissionService.clearCache();
        }

        if (!targetUserId || targetUserId === userId) {
          await loadPermissionData();
          setFeatureAccess({});
        }
      } catch (error) {
        console.error('Error invalidating cache:', error);
      }
    },
    [userId, loadPermissionData]
  );

  const hasFeature = useCallback(
    (featureName: string): boolean => {
      return state.features.includes(featureName);
    },
    [state.features]
  );

  const getFeatureAccess = useCallback(
    (featureName: string) => {
      return featureAccess[featureName];
    },
    [featureAccess]
  );

  const getUsageInfo = useCallback(
    (featureName: string): FeatureUsageInfo | undefined => {
      return featureAccess[featureName]?.usage;
    },
    [featureAccess]
  );

  const isLoading = useMemo(() => {
    return (
      state.loading ||
      Object.values(featureAccess).some((access) => access.loading)
    );
  }, [state.loading, featureAccess]);

  const hasErrors = useMemo(() => {
    return (
      !!state.error ||
      Object.values(featureAccess).some((access) => access.error)
    );
  }, [state.error, featureAccess]);

  const accessibleFeatures = useMemo(() => {
    return Object.entries(featureAccess)
      .filter(([, access]) => access.hasAccess)
      .map(([featureName]) => featureName);
  }, [featureAccess]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(loadPermissionData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, loadPermissionData]);

  useEffect(() => {
    loadPermissionData();
  }, [loadPermissionData]);

  return {
    ...state,
    featureAccess,
    isLoading,
    hasErrors,
    accessibleFeatures,

    checkFeatureAccess,
    checkMultipleFeatures,
    hasFeature,
    getFeatureAccess,
    getUsageInfo,

    trackFeatureUsage,

    createFeatureFlag,
    updateFeatureFlag,
    enableFeatureForUser,
    disableFeatureForUser,

    invalidateCache,
    refresh: loadPermissionData,
  };
};
