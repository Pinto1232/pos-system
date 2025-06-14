import { apiClient } from './axiosClient';

export interface PricingPackageData {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  tierLevel: number;
  type: string;
  testPeriodDays: number;
  multiCurrencyPrices: string;
}

export interface PricingApiResponse {
  totalItems: number;
  data: PricingPackageData[];
}

class PricingService {
  private cachedPackages: Map<string, PricingPackageData[]> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  async getAllPackages(): Promise<PricingPackageData[]> {
    const cacheKey = 'all_packages';
    const now = Date.now();

    if (this.cachedPackages.has(cacheKey)) {
      const cacheTime = this.cacheExpiry.get(cacheKey) || 0;
      if (now - cacheTime < this.CACHE_DURATION) {
        return this.cachedPackages.get(cacheKey)!;
      }
    }

    try {
      const response = await apiClient.get<PricingApiResponse>(
        '/api/PricingPackages'
      );
      const packages = response.data.data;

      this.cachedPackages.set(cacheKey, packages);
      this.cacheExpiry.set(cacheKey, now);

      return packages;
    } catch (error) {
      console.error('Failed to fetch pricing packages:', error);

      return this.cachedPackages.get(cacheKey) || [];
    }
  }

  async getPackageById(id: number): Promise<PricingPackageData | null> {
    const cacheKey = `package_${id}`;
    const now = Date.now();

    if (this.cachedPackages.has(cacheKey)) {
      const cacheTime = this.cacheExpiry.get(cacheKey) || 0;
      if (now - cacheTime < this.CACHE_DURATION) {
        const cached = this.cachedPackages.get(cacheKey)!;
        return cached[0] || null;
      }
    }

    try {
      const response = await apiClient.get<PricingPackageData>(
        `/api/PricingPackages/${id}`
      );
      const packageData = response.data;

      this.cachedPackages.set(cacheKey, [packageData]);
      this.cacheExpiry.set(cacheKey, now);

      return packageData;
    } catch (error) {
      console.error(`Failed to fetch pricing package ${id}:`, error);
      return null;
    }
  }

  async getPackageByName(name: string): Promise<PricingPackageData | null> {
    const packages = await this.getAllPackages();
    return (
      packages.find(
        (pkg) =>
          pkg.title.toLowerCase() === name.toLowerCase() ||
          pkg.type.toLowerCase() === name.toLowerCase()
      ) || null
    );
  }

  async getMinPriceByPackageName(packageName: string): Promise<number> {
    const packageData = await this.getPackageByName(packageName);
    return packageData?.price || 0;
  }

  clearCache(): void {
    this.cachedPackages.clear();
    this.cacheExpiry.clear();
  }

  async getPackagePricingInfo(packageName: string): Promise<{
    name: string;
    minPrice: number;
    currency: string;
    exists: boolean;
  }> {
    const packageData = await this.getPackageByName(packageName);

    return {
      name: packageName,
      minPrice: packageData?.price || 0,
      currency: packageData?.currency || 'USD',
      exists: !!packageData,
    };
  }
}

export const pricingService = new PricingService();
export default pricingService;
