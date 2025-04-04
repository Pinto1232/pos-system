// src/api/axiosClient.ts
import axios from 'axios';
import { SpinnerContext } from '@/contexts/SpinnerContext';
import { useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
});

// Hook to setup axios interceptors and provide query hooks.
const useApiClient = () => {
  const spinnerContext = useContext(SpinnerContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      config => {
        try {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error retrieving access token:', error);
        }
        if (spinnerContext) {
          spinnerContext.setLoading(true);
          spinnerContext.setError(null);
        }
        console.log('Request URL:', config.url);
        console.log('Request headers:', config.headers);
        return config;
      },
      error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = apiClient.interceptors.response.use(
      async response => {
        if (spinnerContext) {
          await new Promise(resolve => setTimeout(resolve, 500));
          spinnerContext.setLoading(false);
        }
        return response;
      },
      async error => {
        if (spinnerContext) {
          await new Promise(resolve => setTimeout(resolve, 500));
          spinnerContext.setLoading(false);
          spinnerContext.setError('Failed to load data from the server.');
        }
        if (!error.response) {
          console.error('Network Error or Server Unreachable:', error.message);
          return Promise.reject(new Error('Network error. Please try again.'));
        }
        const { status, data } = error.response;
        switch (status) {
          case 400:
            console.error('Bad Request:', data);
            return Promise.reject(new Error(data?.message || 'Bad request.'));
          case 401:
            console.warn('Unauthorized: Token may be expired.');
            localStorage.removeItem('accessToken');
            return Promise.reject(new Error('Unauthorized. Please log in again.'));
          case 403:
            console.warn('Forbidden: You do not have permission to access this resource.');
            return Promise.reject(new Error('Forbidden. You do not have access.'));
          case 404:
            console.warn('Not Found:', data);
            return Promise.reject(new Error('Requested resource not found.'));
          case 500:
            console.error('Server Error:', data);
            return Promise.reject(new Error('Internal server error. Try again later.'));
          default:
            console.error('API Error:', data);
            return Promise.reject(new Error(data?.message || 'An unknown error occurred.'));
        }
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [spinnerContext]);

  const useFetchData = <TData = unknown>(queryKey: string, url: string) => {
    return useQuery<TData, Error>({
      queryKey: [queryKey],
      queryFn: async () => {
        const { data } = await apiClient.get(url);
        return data;
      },
    });
  };

  const usePostData = <TData = unknown>(url: string) => {
    return useMutation<TData, Error, Record<string, unknown>>({
      mutationFn: async (postData: Record<string, unknown>) => {
        const { data } = await apiClient.post<TData>(url, postData);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    });
  };

  // Define useUpdateCustomization hook.
  const useUpdateCustomization = <TData = unknown>() => {
    return useMutation<TData, Error, Record<string, unknown>>({
      mutationFn: async (customization: Record<string, unknown>) => {
        const { data } = await apiClient.post<TData>('/api/UserCustomization', customization);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customization'] });
      },
    });
  };

  return {
    apiClient,
    useFetchData,
    usePostData,
    useUpdateCustomization,
  };
};

// Export individual hooks
export { apiClient, useApiClient };
// Export useUpdateCustomization with an explicit type annotation
export const useUpdateCustomization = (): UseMutationResult<
  unknown,
  Error,
  Record<string, unknown>,
  unknown
> => {
  return useApiClient().useUpdateCustomization();
};
