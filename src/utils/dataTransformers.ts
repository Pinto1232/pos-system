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
    features: features, 
    dependencies: dependencies, 
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
export function isValidBackendAddOn(obj: unknown): obj is BackendAddOn {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.price === 'number' &&
    typeof candidate.currency === 'string' &&
    typeof candidate.multiCurrencyPrices === 'string' &&
    typeof candidate.category === 'string' &&
    typeof candidate.isActive === 'boolean' &&
    typeof candidate.features === 'string' &&
    typeof candidate.dependencies === 'string' &&
    typeof candidate.icon === 'string'
  );
}

export function isValidFrontendAddOn(obj: unknown): obj is FrontendAddOn {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.price === 'number' &&
    (candidate.currency === undefined ||
      typeof candidate.currency === 'string') &&
    (candidate.multiCurrencyPrices === undefined ||
      typeof candidate.multiCurrencyPrices === 'object') &&
    (candidate.category === undefined ||
      typeof candidate.category === 'string') &&
    (candidate.isActive === undefined ||
      typeof candidate.isActive === 'boolean') &&
    (candidate.features === undefined || Array.isArray(candidate.features)) &&
    (candidate.dependencies === undefined ||
      Array.isArray(candidate.dependencies)) &&
    (candidate.icon === undefined || typeof candidate.icon === 'string')
  );
}
