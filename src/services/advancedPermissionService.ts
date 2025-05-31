import { apiClient } from '@/api/apiClient';

export interface FeatureAccessResult {
  hasAccess: boolean;
  reason: string;
  metadata: Record<string, any>;
  evaluationTimeMs: number;
  appliedRules: string[];
}

export interface FeatureUsageInfo {
  currentUsage: number;
  usageLimit?: number;
  periodStartDate: string;
  periodEndDate: string;
  hasExceededLimit: boolean;
  remainingUsage: number;
}

export interface FeatureFlag {
  id: number;
  name: string;
  description: string;
  isEnabled: boolean;
  type: string;
  configuration: string;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usagePeriod?: string;
  rolloutPercentage?: number;
  targetAudience?: string;
  requiredPackageTypes?: string;
  minimumPackageLevel?: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateFeatureFlagRequest {
  name: string;
  description: string;
  isEnabled?: boolean;
  type?: string;
  configuration?: string;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usagePeriod?: string;
  rolloutPercentage?: number;
  targetAudience?: string;
  requiredPackageTypes?: string;
  minimumPackageLevel?: number;
  priority?: number;
  createdBy?: string;
}

export interface UpdateFeatureFlagRequest {
  name: string;
  description: string;
  isEnabled: boolean;
  type: string;
  configuration?: string;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usagePeriod?: string;
  rolloutPercentage?: number;
  targetAudience?: string;
  requiredPackageTypes?: string;
  minimumPackageLevel?: number;
  priority: number;
  updatedBy?: string;
}

export interface SetUserOverrideRequest {
  isEnabled: boolean;
  reason: string;
  expiresAt?: string;
}

class AdvancedPermissionService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  private getCacheKey(userId: string, featureName?: string): string {
    return featureName ? `${userId}_${featureName}` : userId;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  async checkFeatureAccess(
    userId: string,
    featureName: string
  ): Promise<FeatureAccessResult> {
    const cacheKey = this.getCacheKey(userId, featureName);
    const cached = this.getCache<FeatureAccessResult>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<FeatureAccessResult>(
        `/api/FeatureFlag/user/${encodeURIComponent(userId)}/access/${encodeURIComponent(featureName)}`
      );

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error checking feature access for ${featureName}:`, error);
      return {
        hasAccess: false,
        reason: 'Error during feature access evaluation',
        metadata: {},
        evaluationTimeMs: 0,
        appliedRules: [],
      };
    }
  }

  async hasFeatureAccess(
    userId: string,
    featureName: string
  ): Promise<boolean> {
    const result = await this.checkFeatureAccess(userId, featureName);
    return result.hasAccess;
  }

  async getUserFeatures(userId: string): Promise<string[]> {
    const cacheKey = this.getCacheKey(userId, 'features');
    const cached = this.getCache<string[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<string[]>(
        `/api/FeatureFlag/user/${encodeURIComponent(userId)}/features`
      );

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error getting user features:`, error);
      return [];
    }
  }

  async trackFeatureUsage(
    userId: string,
    featureName: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    try {
      await apiClient.post(
        `/api/FeatureFlag/user/${encodeURIComponent(userId)}/track-usage/${encodeURIComponent(featureName)}`,
        metadata || {}
      );

      const usageCacheKey = this.getCacheKey(userId, `usage_${featureName}`);
      this.cache.delete(usageCacheKey);

      return true;
    } catch (error) {
      console.error(`Error tracking feature usage for ${featureName}:`, error);
      return false;
    }
  }

  async getFeatureUsage(
    userId: string,
    featureName: string
  ): Promise<FeatureUsageInfo> {
    const cacheKey = this.getCacheKey(userId, `usage_${featureName}`);
    const cached = this.getCache<FeatureUsageInfo>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<FeatureUsageInfo>(
        `/api/FeatureFlag/user/${encodeURIComponent(userId)}/usage/${encodeURIComponent(featureName)}`
      );

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error getting feature usage for ${featureName}:`, error);
      return {
        currentUsage: 0,
        periodStartDate: new Date().toISOString(),
        periodEndDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        hasExceededLimit: false,
        remainingUsage: 0,
      };
    }
  }

  async createFeatureFlag(request: CreateFeatureFlagRequest): Promise<boolean> {
    try {
      await apiClient.post('/api/FeatureFlag', request);

      this.cache.clear();

      return true;
    } catch (error) {
      console.error('Error creating feature flag:', error);
      return false;
    }
  }

  async updateFeatureFlag(
    flagId: number,
    request: UpdateFeatureFlagRequest
  ): Promise<boolean> {
    try {
      await apiClient.put(`/api/FeatureFlag/${flagId}`, request);

      this.cache.clear();

      return true;
    } catch (error) {
      console.error(`Error updating feature flag ${flagId}:`, error);
      return false;
    }
  }

  async setUserOverride(
    userId: string,
    featureName: string,
    request: SetUserOverrideRequest
  ): Promise<boolean> {
    try {
      await apiClient.post(
        `/api/FeatureFlag/user/${encodeURIComponent(userId)}/override/${encodeURIComponent(featureName)}`,
        request
      );

      this.invalidateUserCache(userId);

      return true;
    } catch (error) {
      console.error(`Error setting user override for ${featureName}:`, error);
      return false;
    }
  }

  async getActiveFeatureFlags(): Promise<FeatureFlag[]> {
    const cacheKey = 'active_flags';
    const cached = this.getCache<FeatureFlag[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<FeatureFlag[]>(
        '/api/FeatureFlag/active'
      );

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting active feature flags:', error);
      return [];
    }
  }

  async invalidateUserCache(userId: string): Promise<void> {
    try {
      await apiClient.delete(
        `/api/FeatureFlag/user/${encodeURIComponent(userId)}/cache`
      );

      const keysToDelete = Array.from(this.cache.keys()).filter((key) =>
        key.startsWith(userId)
      );
      keysToDelete.forEach((key) => this.cache.delete(key));
    } catch (error) {
      console.error(`Error invalidating user cache for ${userId}:`, error);
    }
  }

  async enableFeatureForUser(
    userId: string,
    featureName: string,
    reason: string,
    expiresAt?: Date
  ): Promise<boolean> {
    return this.setUserOverride(userId, featureName, {
      isEnabled: true,
      reason,
      expiresAt: expiresAt?.toISOString(),
    });
  }

  async disableFeatureForUser(
    userId: string,
    featureName: string,
    reason: string,
    expiresAt?: Date
  ): Promise<boolean> {
    return this.setUserOverride(userId, featureName, {
      isEnabled: false,
      reason,
      expiresAt: expiresAt?.toISOString(),
    });
  }

  async checkMultipleFeatures(
    userId: string,
    featureNames: string[]
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    await Promise.all(
      featureNames.map(async (featureName) => {
        results[featureName] = await this.hasFeatureAccess(userId, featureName);
      })
    );

    return results;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const advancedPermissionService = new AdvancedPermissionService();
export default advancedPermissionService;
