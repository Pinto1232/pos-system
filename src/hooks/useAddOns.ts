import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/axiosClient';
import { AddOn } from '@/components/packages/custom-package-layout/types';
import {
  transformBackendAddOnToFrontend,
  transformBackendAddOnsToFrontend,
  transformFrontendAddOnToBackend,
  BackendAddOn,
} from '@/utils/dataTransformers';

export const addOnKeys = {
  all: ['addOns'] as const,
  lists: () => [...addOnKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...addOnKeys.lists(), filters] as const,
  details: () => [...addOnKeys.all, 'detail'] as const,
  detail: (id: number) => [...addOnKeys.details(), id] as const,
  categories: () => [...addOnKeys.all, 'categories'] as const,
};

interface BackendAddOnsResponse {
  totalItems: number;
  data: BackendAddOn[];
}

interface AddOnsResponse {
  totalItems: number;
  data: AddOn[];
}

interface AddOnFilters {
  category?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export const useAddOns = (filters: AddOnFilters = {}) => {
  return useQuery<AddOnsResponse, Error>({
    queryKey: addOnKeys.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.isActive !== undefined)
        params.append('isActive', filters.isActive.toString());
      if (filters.pageNumber)
        params.append('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize)
        params.append('pageSize', filters.pageSize.toString());

      const queryString = params.toString() ? `?${params.toString()}` : '';

      console.log(`Fetching AddOns with filters: ${queryString}`);
      const response = await apiClient.get<BackendAddOnsResponse>(
        `/api/AddOns${queryString}`
      );

      // Transform backend data to frontend format
      const transformedData: AddOnsResponse = {
        totalItems: response.data.totalItems,
        data: transformBackendAddOnsToFrontend(response.data.data),
      };

      return transformedData;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch a single AddOn by ID
 */
export const useAddOn = (id: number) => {
  return useQuery<AddOn, Error>({
    queryKey: addOnKeys.detail(id),
    queryFn: async () => {
      console.log(`Fetching AddOn with ID: ${id}`);
      const response = await apiClient.get<BackendAddOn>(`/api/AddOns/${id}`);

      // Transform backend data to frontend format
      return transformBackendAddOnToFrontend(response.data);
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch AddOn categories
 */
export const useAddOnCategories = () => {
  return useQuery<string[], Error>({
    queryKey: addOnKeys.categories(),
    queryFn: async () => {
      console.log('Fetching AddOn categories');
      const response = await apiClient.get('/api/AddOns/categories');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAddOn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAddOn: Omit<AddOn, 'id'>) => {
      console.log('Creating new AddOn:', JSON.stringify(newAddOn, null, 2));

      const backendAddOn = transformFrontendAddOnToBackend(newAddOn);

      const response = await apiClient.post<BackendAddOn>(
        '/api/AddOns',
        backendAddOn
      );

      return transformBackendAddOnToFrontend(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addOnKeys.lists(),
      });
    },
  });
};

export const useUpdateAddOn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AddOn> }) => {
      console.log(
        `Updating AddOn with ID ${id}:`,
        JSON.stringify(data, null, 2)
      );

      const backendData = transformFrontendAddOnToBackend(data);

      const response = await apiClient.put<BackendAddOn>(
        `/api/AddOns/${id}`,
        backendData
      );

      return transformBackendAddOnToFrontend(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: addOnKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: addOnKeys.lists(),
      });
    },
  });
};

export const useDeleteAddOn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      console.log(`Deleting AddOn with ID: ${id}`);
      await apiClient.delete(`/api/AddOns/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({
        queryKey: addOnKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: addOnKeys.lists(),
      });
    },
  });
};
