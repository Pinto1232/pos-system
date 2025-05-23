import {
  transformBackendAddOnToFrontend,
  transformFrontendAddOnToBackend,
  BackendAddOn,
  FrontendAddOn,
} from './dataTransformers';

const backendApiResponse: BackendAddOn = {
  id: 1,
  name: 'Advanced Analytics',
  description: 'Detailed business analytics and insights',
  price: 15.0,
  currency: 'USD',
  multiCurrencyPrices: '{"USD": 15.0, "EUR": 13.5, "GBP": 11.5, "ZAR": 270.0}',
  category: 'Analytics',
  isActive: true,
  features:
    '["Real-time data visualization", "Custom report generation", "Data export capabilities", "Trend analysis"]',
  dependencies: '["Internet connection", "Modern browser"]',
  icon: 'analytics_icon',
};

const frontendAddOn: FrontendAddOn =
  transformBackendAddOnToFrontend(backendApiResponse);

console.log('Frontend AddOn (after transformation):');
console.log({
  id: frontendAddOn.id,
  name: frontendAddOn.name,
  features: frontendAddOn.features,
  dependencies: frontendAddOn.dependencies,
  multiCurrencyPrices: frontendAddOn.multiCurrencyPrices,
});

function exampleComponentUsage(addOn: FrontendAddOn) {
  const features = addOn.features || [];
  const dependencies = addOn.dependencies || [];

  return {
    featureCount: features.length,
    dependencyCount: dependencies.length,
    hasMultiCurrency: !!addOn.multiCurrencyPrices,
  };
}

const componentResult = exampleComponentUsage(frontendAddOn);
console.log('Component can safely use:', componentResult);

const updatedFrontendAddOn: Partial<FrontendAddOn> = {
  ...frontendAddOn,
  features: ['New feature 1', 'New feature 2'],
  dependencies: ['New dependency'],
};

const backendPayload = transformFrontendAddOnToBackend(updatedFrontendAddOn);

console.log('Backend payload (for API calls):');
console.log({
  features: backendPayload.features,
  dependencies: backendPayload.dependencies,
  multiCurrencyPrices: backendPayload.multiCurrencyPrices,
});

export {
  backendApiResponse,
  frontendAddOn,
  exampleComponentUsage,
  componentResult,
  backendPayload,
};
