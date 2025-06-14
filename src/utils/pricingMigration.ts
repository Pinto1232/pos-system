import { getSidebarItems, LegacySidebarItem } from '@/Seetings/dynamicSettings';
import pricingService from '@/api/pricingService';

export interface MigrationResult {
  success: boolean;
  changes: Array<{
    item: string;
    oldPrice: number;
    newPrice: number;
    currency: string;
  }>;
  errors: string[];
}

export async function comparePricing(
  oldSidebarItems: LegacySidebarItem[]
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    changes: [],
    errors: [],
  };

  try {
    const newSidebarItems = await getSidebarItems();

    for (let i = 0; i < oldSidebarItems.length; i++) {
      const oldItem = oldSidebarItems[i];
      const newItem = newSidebarItems[i];

      if (
        oldItem &&
        newItem &&
        oldItem.requiredPackage &&
        newItem.requiredPackage
      ) {
        if (
          oldItem.requiredPackage.minPrice !== newItem.requiredPackage.minPrice
        ) {
          result.changes.push({
            item: `${oldItem.label} (Main)`,
            oldPrice: oldItem.requiredPackage.minPrice,
            newPrice: newItem.requiredPackage.minPrice,
            currency: 'USD',
          });
        }
      }

      if (oldItem?.subItems && newItem?.subItems) {
        for (let j = 0; j < oldItem.subItems.length; j++) {
          const oldSubItem = oldItem.subItems[j];
          const newSubItem = newItem.subItems[j];

          if (oldSubItem?.requiredPackage && newSubItem?.requiredPackage) {
            if (
              oldSubItem.requiredPackage.minPrice !==
              newSubItem.requiredPackage.minPrice
            ) {
              result.changes.push({
                item: `${oldItem.label} -> ${oldSubItem.label}`,
                oldPrice: oldSubItem.requiredPackage.minPrice,
                newPrice: newSubItem.requiredPackage.minPrice,
                currency: 'USD',
              });
            }
          }
        }
      }
    }
  } catch (error) {
    result.success = false;
    result.errors.push(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  return result;
}

export async function validatePackageExistence(): Promise<{
  valid: boolean;
  missingPackages: string[];
  availablePackages: Array<{ name: string; price: number; currency: string }>;
}> {
  const result = {
    valid: true,
    missingPackages: [] as string[],
    availablePackages: [] as Array<{
      name: string;
      price: number;
      currency: string;
    }>,
  };

  try {
    const packages = await pricingService.getAllPackages();
    const packageNames = packages.map((p) => p.title.toLowerCase());

    result.availablePackages = packages.map((p) => ({
      name: p.title,
      price: p.price,
      currency: p.currency,
    }));

    const requiredPackages = [
      'Basic',
      'Professional',
      'Enterprise',
      'Premium Plus',
    ];

    for (const packageName of requiredPackages) {
      if (!packageNames.includes(packageName.toLowerCase())) {
        result.valid = false;
        result.missingPackages.push(packageName);
      }
    }
  } catch (error) {
    result.valid = false;
    console.error('Error validating package existence:', error);
  }

  return result;
}

export function generatePackageSeedSQL(missingPackages: string[]): string {
  const defaultPrices: Record<string, number> = {
    Basic: 29.99,
    Professional: 49.99,
    Enterprise: 99.99,
    'Premium Plus': 149.99,
  };

  const insertStatements = missingPackages.map((packageName) => {
    const price = defaultPrices[packageName] || 0;
    return `
INSERT INTO PricingPackages (Title, Description, Price, Currency, Type, TierLevel, TestPeriodDays)
VALUES ('${packageName}', '${packageName} package with standard features', ${price}, 'USD', 'standard', ${getTierLevel(packageName)}, 14);`;
  });

  return `-- SQL to seed missing packages
${insertStatements.join('\n')}`;
}

function getTierLevel(packageName: string): number {
  const tierMap: Record<string, number> = {
    Basic: 1,
    Professional: 2,
    Enterprise: 3,
    'Premium Plus': 4,
  };
  return tierMap[packageName] || 1;
}

export async function testCurrencyConversion(): Promise<{
  success: boolean;
  conversions: Array<{
    package: string;
    usdPrice: number;
    convertedPrice: number;
    currency: string;
  }>;
  errors: string[];
}> {
  const result = {
    success: true,
    conversions: [] as Array<{
      package: string;
      usdPrice: number;
      convertedPrice: number;
      currency: string;
    }>,
    errors: [] as string[],
  };

  try {
    const packages = await pricingService.getAllPackages();

    for (const pkg of packages) {
      const pricingInfo = await pricingService.getPackagePricingInfo(pkg.title);

      result.conversions.push({
        package: pkg.title,
        usdPrice: pkg.price,
        convertedPrice: pricingInfo.minPrice,
        currency: pricingInfo.currency,
      });
    }
  } catch (error) {
    result.success = false;
    result.errors.push(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }

  return result;
}

export async function performanceTest(): Promise<{
  dynamicPricingTime: number;
  cacheHitTime: number;
  recommendations: string[];
}> {
  const result = {
    dynamicPricingTime: 0,
    cacheHitTime: 0,
    recommendations: [] as string[],
  };

  try {
    pricingService.clearCache();
    const start1 = performance.now();
    await getSidebarItems();
    const end1 = performance.now();
    result.dynamicPricingTime = end1 - start1;

    const start2 = performance.now();
    await getSidebarItems();
    const end2 = performance.now();
    result.cacheHitTime = end2 - start2;

    if (result.dynamicPricingTime > 1000) {
      result.recommendations.push(
        'Consider implementing server-side caching for pricing data'
      );
    }

    if (result.cacheHitTime > 50) {
      result.recommendations.push('Client-side cache may need optimization');
    }

    if (result.dynamicPricingTime > 500) {
      result.recommendations.push(
        'Consider preloading pricing data on app initialization'
      );
    }

    const cacheEfficiency =
      ((result.dynamicPricingTime - result.cacheHitTime) /
        result.dynamicPricingTime) *
      100;
    result.recommendations.push(
      `Cache efficiency: ${cacheEfficiency.toFixed(1)}%`
    );
  } catch (error) {
    result.recommendations.push(`Error during performance test: ${error}`);
  }

  return result;
}

const pricingMigrationUtils = {
  comparePricing,
  validatePackageExistence,
  generatePackageSeedSQL,
  testCurrencyConversion,
  performanceTest,
};

export default pricingMigrationUtils;
