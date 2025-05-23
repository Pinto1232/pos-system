import { safeJsonParse, safeJsonStringify } from './jsonUtils';

export interface BackendAddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  multiCurrencyPrices: string;
  category: string;
  isActive: boolean;
  features: string;
  dependencies: string;
  icon: string;
}

export interface FrontendAddOn {
  id: number;
  name: string;
  description: string;
  price: number;
  currency?: string;
  multiCurrencyPrices?: Record<string, number>;
  category?: string;
  isActive?: boolean;
  features?: string[];
  dependencies?: string[];
  icon?: string;
}

export function transformBackendAddOnToFrontend(
  backendAddOn: BackendAddOn
): FrontendAddOn {
  const features =
    safeJsonParse<string[]>(
      backendAddOn.features || '[]',
      (obj): obj is string[] =>
        Array.isArray(obj) && obj.every((item) => typeof item === 'string'),
      []
    ) || [];

  const dependencies =
    safeJsonParse<string[]>(
      backendAddOn.dependencies || '[]',
      (obj): obj is string[] =>
        Array.isArray(obj) && obj.every((item) => typeof item === 'string'),
      []
    ) || [];

  const multiCurrencyPrices =
    safeJsonParse<Record<string, number>>(
      backendAddOn.multiCurrencyPrices || '{}',
      (obj): obj is Record<string, number> => {
        return (
          typeof obj === 'object' &&
          obj !== null &&
          Object.values(obj).every((value) => typeof value === 'number')
        );
      },
      {}
    ) || {};

  return {
    id: backendAddOn.id,
    name: backendAddOn.name,
    description: backendAddOn.description,
    price: backendAddOn.price,
    currency: backendAddOn.currency || undefined,
    multiCurrencyPrices:
      Object.keys(multiCurrencyPrices).length > 0
        ? multiCurrencyPrices
        : undefined,
    category: backendAddOn.category || undefined,
    isActive: backendAddOn.isActive,
    features: features.length > 0 ? features : undefined,
    dependencies: dependencies.length > 0 ? dependencies : undefined,
    icon: backendAddOn.icon || undefined,
  };
}

export function transformFrontendAddOnToBackend(
  frontendAddOn: Partial<FrontendAddOn>
): Partial<BackendAddOn> {
  const features = safeJsonStringify(frontendAddOn.features || []) || '[]';

  const dependencies =
    safeJsonStringify(frontendAddOn.dependencies || []) || '[]';

  const multiCurrencyPrices =
    safeJsonStringify(frontendAddOn.multiCurrencyPrices || {}) || '{}';

  return {
    id: frontendAddOn.id,
    name: frontendAddOn.name || '',
    description: frontendAddOn.description || '',
    price: frontendAddOn.price || 0,
    currency: frontendAddOn.currency || 'USD',
    multiCurrencyPrices,
    category: frontendAddOn.category || '',
    isActive:
      frontendAddOn.isActive !== undefined ? frontendAddOn.isActive : true,
    features,
    dependencies,
    icon: frontendAddOn.icon || '',
  };
}

/**
 * Transform array of backend AddOns to frontend format
 */
export function transformBackendAddOnsToFrontend(
  backendAddOns: BackendAddOn[]
): FrontendAddOn[] {
  return backendAddOns.map(transformBackendAddOnToFrontend);
}

/**
 * Transform array of frontend AddOns to backend format
 */
export function transformFrontendAddOnsToBackend(
  frontendAddOns: Partial<FrontendAddOn>[]
): Partial<BackendAddOn>[] {
  return frontendAddOns.map(transformFrontendAddOnToBackend);
}

/**
 * Validate if an object is a valid backend AddOn
 */
export function isValidBackendAddOn(obj: any): obj is BackendAddOn {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.currency === 'string' &&
    typeof obj.multiCurrencyPrices === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.isActive === 'boolean' &&
    typeof obj.features === 'string' &&
    typeof obj.dependencies === 'string' &&
    typeof obj.icon === 'string'
  );
}

export function isValidFrontendAddOn(obj: any): obj is FrontendAddOn {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.price === 'number' &&
    (obj.currency === undefined || typeof obj.currency === 'string') &&
    (obj.multiCurrencyPrices === undefined ||
      typeof obj.multiCurrencyPrices === 'object') &&
    (obj.category === undefined || typeof obj.category === 'string') &&
    (obj.isActive === undefined || typeof obj.isActive === 'boolean') &&
    (obj.features === undefined || Array.isArray(obj.features)) &&
    (obj.dependencies === undefined || Array.isArray(obj.dependencies)) &&
    (obj.icon === undefined || typeof obj.icon === 'string')
  );
}
