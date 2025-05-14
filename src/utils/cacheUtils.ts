import { QueryClient } from '@tanstack/react-query';
import { addOnKeys } from '@/hooks/useAddOns';

/**
 * Utility functions for managing cache in the application
 */

/**
 * Invalidates all AddOns-related queries in the cache
 * @param queryClient The React Query client instance
 */
export const invalidateAddOnsQueries = (queryClient: QueryClient): void => {
  console.log('Invalidating all AddOns queries');
  queryClient.invalidateQueries({ queryKey: addOnKeys.all });
};

/**
 * Invalidates a specific AddOn query by ID
 * @param queryClient The React Query client instance
 * @param id The ID of the AddOn to invalidate
 */
export const invalidateAddOnQuery = (queryClient: QueryClient, id: number): void => {
  console.log(`Invalidating AddOn query for ID: ${id}`);
  queryClient.invalidateQueries({ queryKey: addOnKeys.detail(id) });
};

/**
 * Invalidates AddOn list queries with optional filters
 * @param queryClient The React Query client instance
 * @param filters Optional filters to target specific list queries
 */
export const invalidateAddOnListQueries = (
  queryClient: QueryClient,
  filters?: Record<string, unknown>
): void => {
  if (filters) {
    console.log(`Invalidating AddOn list queries with filters: ${JSON.stringify(filters)}`);
    queryClient.invalidateQueries({ queryKey: addOnKeys.list(filters) });
  } else {
    console.log('Invalidating all AddOn list queries');
    queryClient.invalidateQueries({ queryKey: addOnKeys.lists() });
  }
};

/**
 * Invalidates AddOn categories queries
 * @param queryClient The React Query client instance
 */
export const invalidateAddOnCategoriesQueries = (queryClient: QueryClient): void => {
  console.log('Invalidating AddOn categories queries');
  queryClient.invalidateQueries({ queryKey: addOnKeys.categories() });
};

/**
 * Forces a refetch of all AddOns-related queries
 * @param queryClient The React Query client instance
 */
export const refetchAddOnsQueries = async (queryClient: QueryClient): Promise<void> => {
  console.log('Forcing refetch of all AddOns queries');
  await queryClient.refetchQueries({ queryKey: addOnKeys.all });
};

/**
 * Clears the entire cache and forces a refetch of active queries
 * Use this as a last resort when you need to completely reset the cache state
 * @param queryClient The React Query client instance
 */
export const resetEntireCache = async (queryClient: QueryClient): Promise<void> => {
  console.log('Resetting entire cache and refetching active queries');
  queryClient.clear();
  await queryClient.refetchQueries();
};
