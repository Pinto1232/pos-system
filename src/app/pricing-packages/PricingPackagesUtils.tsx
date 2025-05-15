'use client';

// Import types from the shared types file
import { Package, packageTypes, packageOrder } from './types';

// Client-side function to refresh pricing packages data
export async function refreshPricingPackages(): Promise<Package[]> {
  try {
    const response = await fetch('/api/pricing-packages?refresh=true');
    if (!response.ok) {
      throw new Error(`Failed to refresh pricing packages: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error refreshing pricing packages:', error);
    throw error;
  }
}

// Client-side function to fetch pricing packages without server-only APIs
export async function fetchPricingPackagesClient(): Promise<Package[]> {
  try {
    const response = await fetch('/api/pricing-packages');
    if (!response.ok) {
      throw new Error(`Failed to fetch pricing packages: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching pricing packages:', error);
    throw error;
  }
}

// Function to sort packages in the correct order (client-side version)
export function sortPackages(packages: Package[]): Package[] {
  return [...packages].sort((a, b) => {
    const orderA = packageOrder[a.type as string] || 999;
    const orderB = packageOrder[b.type as string] || 999;
    return orderA - orderB;
  });
}
