import {
  transformBackendAddOnToFrontend,
  transformFrontendAddOnToBackend,
  transformBackendAddOnsToFrontend,
  transformFrontendAddOnsToBackend,
  isValidBackendAddOn,
  isValidFrontendAddOn,
  BackendAddOn,
  FrontendAddOn,
} from '../dataTransformers';

describe('dataTransformers', () => {
  const mockBackendAddOn: BackendAddOn = {
    id: 1,
    name: 'Test AddOn',
    description: 'Test description',
    price: 10.99,
    currency: 'USD',
    multiCurrencyPrices: '{"USD": 10.99, "EUR": 9.99}',
    category: 'Test Category',
    isActive: true,
    features: '["Feature 1", "Feature 2", "Feature 3"]',
    dependencies: '["Dependency 1", "Dependency 2"]',
    icon: 'test-icon',
  };

  const mockFrontendAddOn: FrontendAddOn = {
    id: 1,
    name: 'Test AddOn',
    description: 'Test description',
    price: 10.99,
    currency: 'USD',
    multiCurrencyPrices: { USD: 10.99, EUR: 9.99 },
    category: 'Test Category',
    isActive: true,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    dependencies: ['Dependency 1', 'Dependency 2'],
    icon: 'test-icon',
  };

  describe('transformBackendAddOnToFrontend', () => {
    it('should transform backend AddOn to frontend format', () => {
      const result = transformBackendAddOnToFrontend(mockBackendAddOn);

      expect(result).toEqual(mockFrontendAddOn);
      expect(Array.isArray(result.features)).toBe(true);
      expect(Array.isArray(result.dependencies)).toBe(true);
      expect(typeof result.multiCurrencyPrices).toBe('object');
    });

    it('should handle empty JSON strings', () => {
      const backendAddOn: BackendAddOn = {
        ...mockBackendAddOn,
        features: '[]',
        dependencies: '[]',
        multiCurrencyPrices: '{}',
      };

      const result = transformBackendAddOnToFrontend(backendAddOn);

      expect(result.features).toBeUndefined();
      expect(result.dependencies).toBeUndefined();
      expect(result.multiCurrencyPrices).toBeUndefined();
    });

    it('should handle invalid JSON strings gracefully', () => {
      const backendAddOn: BackendAddOn = {
        ...mockBackendAddOn,
        features: 'invalid json',
        dependencies: 'invalid json',
        multiCurrencyPrices: 'invalid json',
      };

      const result = transformBackendAddOnToFrontend(backendAddOn);

      expect(result.features).toBeUndefined();
      expect(result.dependencies).toBeUndefined();
      expect(result.multiCurrencyPrices).toBeUndefined();
    });
  });

  describe('transformFrontendAddOnToBackend', () => {
    it('should transform frontend AddOn to backend format', () => {
      const result = transformFrontendAddOnToBackend(mockFrontendAddOn);

      expect(result.id).toBe(mockBackendAddOn.id);
      expect(result.name).toBe(mockBackendAddOn.name);
      expect(typeof result.features).toBe('string');
      expect(typeof result.dependencies).toBe('string');
      expect(typeof result.multiCurrencyPrices).toBe('string');

      // Parse the JSON strings to verify content
      expect(JSON.parse(result.features!)).toEqual(mockFrontendAddOn.features);
      expect(JSON.parse(result.dependencies!)).toEqual(
        mockFrontendAddOn.dependencies
      );
      expect(JSON.parse(result.multiCurrencyPrices!)).toEqual(
        mockFrontendAddOn.multiCurrencyPrices
      );
    });

    it('should handle undefined optional fields', () => {
      const frontendAddOn: Partial<FrontendAddOn> = {
        id: 1,
        name: 'Test',
        description: 'Test',
        price: 10,
      };

      const result = transformFrontendAddOnToBackend(frontendAddOn);

      expect(result.features).toBe('[]');
      expect(result.dependencies).toBe('[]');
      expect(result.multiCurrencyPrices).toBe('{}');
      expect(result.currency).toBe('USD');
      expect(result.isActive).toBe(true);
    });
  });

  describe('array transformations', () => {
    it('should transform arrays of AddOns correctly', () => {
      const backendAddOns = [mockBackendAddOn, { ...mockBackendAddOn, id: 2 }];
      const frontendAddOns = [
        mockFrontendAddOn,
        { ...mockFrontendAddOn, id: 2 },
      ];

      const backendToFrontend = transformBackendAddOnsToFrontend(backendAddOns);
      const frontendToBackend =
        transformFrontendAddOnsToBackend(frontendAddOns);

      expect(backendToFrontend).toHaveLength(2);
      expect(frontendToBackend).toHaveLength(2);
      expect(backendToFrontend[0]).toEqual(mockFrontendAddOn);
      expect(frontendToBackend[0].id).toBe(mockBackendAddOn.id);
    });
  });

  describe('validation functions', () => {
    it('should validate backend AddOn correctly', () => {
      expect(isValidBackendAddOn(mockBackendAddOn)).toBe(true);
      expect(isValidBackendAddOn({ ...mockBackendAddOn, id: 'invalid' })).toBe(
        false
      );
      expect(isValidBackendAddOn(null)).toBe(false);
      expect(isValidBackendAddOn(undefined)).toBe(false);
    });

    it('should validate frontend AddOn correctly', () => {
      expect(isValidFrontendAddOn(mockFrontendAddOn)).toBe(true);
      expect(
        isValidFrontendAddOn({ ...mockFrontendAddOn, id: 'invalid' })
      ).toBe(false);
      expect(isValidFrontendAddOn(null)).toBe(false);
      expect(isValidFrontendAddOn(undefined)).toBe(false);
    });
  });
});
