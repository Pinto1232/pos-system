// Shared types for both server and client components

// Define the package type
export type Package = {
  id: number | string;
  title: string;
  description: string;
  icon: string;
  extraDescription: string;
  price: number;
  testPeriodDays: number;
  type: string;
  currency: string;
  multiCurrencyPrices: string;
};

// Define the new package types
export const packageTypes = [
  'starter-plus',
  'growth-pro',
  'enterprise-elite',
  'custom-pro',
  'premium-plus'
];

// Package order for sorting
export const packageOrder: Record<string, number> = {
  'starter-plus': 1,
  'growth-pro': 2,
  'custom-pro': 3,
  'enterprise-elite': 4,
  'premium-plus': 5
};
