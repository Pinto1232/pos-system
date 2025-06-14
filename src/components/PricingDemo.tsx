import React, { useState } from 'react';
import {
  useDynamicPricing,
  useSidebarPricing,
} from '@/hooks/useDynamicPricing';
import { runAllTests } from '@/utils/testDynamicPricing';

export const PricingDemo: React.FC = () => {
  const [testResults, setTestResults] = useState<string>('');
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Example of using the pricing hook
  const { packages, loading, error, getPackagePrice, refreshPricing } =
    useDynamicPricing({ autoRefresh: true });

  // Example of using the sidebar pricing hook
  const { getMinPrice, getCurrency, packageExists } = useSidebarPricing();

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setTestResults('Running tests...\n');

    const originalLog = console.log;
    const logs: string[] = [];

    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };

    try {
      await runAllTests();
      setTestResults(logs.join('\n'));
    } catch (error) {
      setTestResults(`Error running tests: ${error}`);
    } finally {
      console.log = originalLog;
      setIsRunningTests(false);
    }
  };

  const handleGetPrice = async (packageName: string) => {
    try {
      const pricing = await getPackagePrice(packageName);
      alert(`${packageName}: ${pricing.currency} ${pricing.minPrice}`);
    } catch (error) {
      alert(`Error getting price for ${packageName}: ${error}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading pricing data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error Loading Pricing</h3>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={refreshPricing}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Dynamic Pricing System Demo
        </h1>
        <p className="text-gray-600 mb-6">
          This demo shows how the new dynamic pricing system works with real
          data from your backend.
        </p>

        {}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Available Packages ({packages.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium text-gray-900">{pkg.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{pkg.type}</p>
                <div className="mt-2">
                  <span className="text-lg font-bold text-green-600">
                    {pkg.currency} {pkg.price.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => handleGetPrice(pkg.title)}
                  className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  Get Price
                </button>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Sidebar Pricing Examples
          </h2>
          <div className="space-y-2">
            {['Basic', 'Professional', 'Enterprise', 'Premium Plus'].map(
              (packageName) => {
                const price = getMinPrice(packageName);
                const currency = getCurrency(packageName);
                const exists = packageExists(packageName);

                return (
                  <div
                    key={packageName}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{packageName}</span>
                    <div className="flex items-center space-x-2">
                      {exists ? (
                        <span className="text-green-600 font-semibold">
                          {currency} {price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-red-600 text-sm">
                          Not Available
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          exists
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {exists ? 'Available' : 'Missing'}
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={refreshPricing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Pricing
          </button>
          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isRunningTests ? 'Running Tests...' : 'Run Tests'}
          </button>
        </div>

        {}
        {testResults && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Test Results
            </h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto max-h-96 overflow-y-auto">
              {testResults}
            </pre>
          </div>
        )}
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Usage Examples
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              1. Using the Hook
            </h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {`const { packages, loading, getPackagePrice } = useDynamicPricing();

// Get price for a specific package
const pricing = await getPackagePrice('Basic');
console.log(\`Price: \${pricing.currency} \${pricing.minPrice}\`);`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              2. Using Sidebar Pricing
            </h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {`const { getMinPrice, getCurrency } = useSidebarPricing();

const basicPrice = getMinPrice('Basic');
const currency = getCurrency('Basic');
console.log(\`Basic: \${currency} \${basicPrice}\`);`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              3. Using Dynamic Sidebar
            </h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {`import { getSidebarItems } from '@/Seetings/dynamicSettings';

const items = await getSidebarItems();
items.forEach(item => {
  if (item.requiredPackage) {
    console.log(\`\${item.label}: \${item.requiredPackage.name} (\$\${item.requiredPackage.minPrice})\`);
  }
});`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingDemo;
