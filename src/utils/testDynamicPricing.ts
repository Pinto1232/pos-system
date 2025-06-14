import pricingService from '@/api/pricingService';
import { getSidebarItems } from '@/Seetings/dynamicSettings';
import pricingMigrationUtils from './pricingMigration';

export async function testPricingService(): Promise<void> {
  console.log('🧪 Testing Pricing Service...');

  try {
    const packages = await pricingService.getAllPackages();
    console.log(`✅ Successfully fetched ${packages.length} packages`);

    if (packages.length > 0) {
      const firstPackage = packages[0];
      const individualPackage = await pricingService.getPackageById(
        firstPackage.id
      );
      console.log(
        `✅ Successfully fetched individual package: ${individualPackage?.title}`
      );

      const packageByName = await pricingService.getPackageByName(
        firstPackage.title
      );
      console.log(
        `✅ Successfully fetched package by name: ${packageByName?.title}`
      );

      const pricingInfo = await pricingService.getPackagePricingInfo(
        firstPackage.title
      );
      console.log(
        `✅ Successfully fetched pricing info: ${pricingInfo.currency} ${pricingInfo.minPrice}`
      );
    }
  } catch (error) {
    console.error('❌ Pricing Service Test Failed:', error);
  }
}

export async function testSidebarGeneration(): Promise<void> {
  console.log('🧪 Testing Sidebar Generation...');

  try {
    const sidebarItems = await getSidebarItems();
    console.log(
      `✅ Successfully generated ${sidebarItems.length} sidebar items`
    );

    const itemsWithPricing = sidebarItems.filter(
      (item) => item.requiredPackage
    );
    console.log(`✅ ${itemsWithPricing.length} items have pricing information`);

    const sampleItem = itemsWithPricing[0];
    if (sampleItem) {
      console.log(
        `✅ Sample item: ${sampleItem.label} - ${sampleItem.requiredPackage?.name} ($${sampleItem.requiredPackage?.minPrice})`
      );
    }
  } catch (error) {
    console.error('❌ Sidebar Generation Test Failed:', error);
  }
}

export async function testMigrationUtils(): Promise<void> {
  console.log('🧪 Testing Migration Utilities...');

  try {
    const validation = await pricingMigrationUtils.validatePackageExistence();
    console.log(`✅ Package validation complete. Valid: ${validation.valid}`);
    console.log(
      `   Available packages: ${validation.availablePackages.length}`
    );

    if (validation.missingPackages.length > 0) {
      console.log(
        `⚠️  Missing packages: ${validation.missingPackages.join(', ')}`
      );

      const sql = pricingMigrationUtils.generatePackageSeedSQL(
        validation.missingPackages
      );
      console.log(
        '📝 Generated SQL for missing packages:',
        sql.substring(0, 100) + '...'
      );
    }

    const currencyTest = await pricingMigrationUtils.testCurrencyConversion();
    console.log(
      `✅ Currency conversion test. Success: ${currencyTest.success}`
    );
    console.log(`   Tested ${currencyTest.conversions.length} conversions`);

    const perfTest = await pricingMigrationUtils.performanceTest();
    console.log(`✅ Performance test complete:`);
    console.log(
      `   Dynamic pricing: ${perfTest.dynamicPricingTime.toFixed(2)}ms`
    );
    console.log(`   Cache hit: ${perfTest.cacheHitTime.toFixed(2)}ms`);
  } catch (error) {
    console.error('❌ Migration Utils Test Failed:', error);
  }
}

export async function runAllTests(): Promise<void> {
  console.log('🚀 Starting Dynamic Pricing Tests...\n');

  await testPricingService();
  console.log('');

  await testSidebarGeneration();
  console.log('');

  await testMigrationUtils();
  console.log('');

  console.log('✨ All tests completed!');
}

/**
 * Quick validation function
 */
export async function quickValidation(): Promise<boolean> {
  try {
    const packages = await pricingService.getAllPackages();
    const sidebarItems = await getSidebarItems();

    const hasPackages = packages.length > 0;
    const hasSidebarItems = sidebarItems.length > 0;
    const hasPricing = sidebarItems.some((item) => item.requiredPackage);

    return hasPackages && hasSidebarItems && hasPricing;
  } catch {
    return false;
  }
}

// Export for console testing
if (typeof window !== 'undefined') {
  (
    window as typeof window & {
      dynamicPricingTests: {
        runAllTests: () => Promise<void>;
        testPricingService: () => Promise<void>;
        testSidebarGeneration: () => Promise<void>;
        testMigrationUtils: () => Promise<void>;
        quickValidation: () => Promise<boolean>;
      };
    }
  ).dynamicPricingTests = {
    runAllTests,
    testPricingService,
    testSidebarGeneration,
    testMigrationUtils,
    quickValidation,
  };
}
