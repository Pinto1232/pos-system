'use client';

import axios from 'axios';
import { SpinnerContext } from '@/contexts/SpinnerContext';
import { useContext, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  QueryKey,
} from '@tanstack/react-query';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
}

interface RequestConfig {
  timeout?: number;
  suppressAuthErrors?: boolean;
}

const DEFAULT_TIMEOUT = 30000; 

const CACHE_MAX_AGE = 60 * 1000;

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

const requestCache = new Map<string, CacheEntry>();

const getBaseURL = () => {
  
  
  const frontendBaseURL =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  console.log('Using frontend baseURL for API routes:', frontendBaseURL);
  return frontendBaseURL;
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: DEFAULT_TIMEOUT,
});

console.log(
  'API Client initialized with baseURL:',
  JSON.stringify(apiClient.defaults.baseURL, null, 2)
);

const getErrorMessageForStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'The server encountered an error. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
};



const ANONYMOUS_ENDPOINTS = [
  '/api/currency/location',
  '/api/currency/available',
  '/api/pricing-packages/custom/features',
  '/api/pricing-packages/custom/calculate-price',
  '/api/pricing-packages/custom/select',
  '/api/health',
];

const useApiClient = () => {
  const spinnerContext = useContext(SpinnerContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        try {
          
          const isAnonymousEndpoint = ANONYMOUS_ENDPOINTS.some((endpoint) =>
            config.url?.includes(endpoint)
          );

          if (!isAnonymousEndpoint) {
            const token = localStorage.getItem('accessToken');
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              console.log(
                'Added token to request:',
                JSON.stringify(config.url, null, 2)
              );
            } else {
              console.log(
                'No token available for request:',
                JSON.stringify(config.url, null, 2)
              );
            }
          } else {
            console.log(
              'Skipping token for anonymous endpoint:',
              JSON.stringify(config.url, null, 2)
            );
          }
        } catch (error) {
          console.error(
            'Error retrieving access token:',
            JSON.stringify(error, null, 2)
          );
        }
        if (spinnerContext) {
          spinnerContext.setLoading(true);
          spinnerContext.setError(null);
        }
        console.log('Request URL:', JSON.stringify(config.url, null, 2));
        console.log(
          'Request headers:',
          JSON.stringify(config.headers, null, 2)
        );
        return config;
      },
      (error) => {
        console.error('Request Error:', JSON.stringify(error, null, 2));
        return Promise.reject(error);
      }
    );

    const responseInterceptor = apiClient.interceptors.response.use(
      async (response) => {
        if (spinnerContext) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          spinnerContext.setLoading(false);
        }
        return response;
      },
      async (error) => {
        if (spinnerContext) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          spinnerContext.setLoading(false);

          const suppressAuthError =
            error.config?.suppressAuthErrors === true &&
            error.response?.status === 401;

          if (!suppressAuthError && error.response) {
            const { status, data } = error.response;
            spinnerContext.setError(
              data?.message ||
                `Error (${status}): ${getErrorMessageForStatus(status)}`
            );
          } else if (!error.response) {
            spinnerContext.setError(
              'Network error. Please check your connection and try again.'
            );
          }
        }

        if (!error.response) {
          console.error(
            'Network Error or Server Unreachable:',
            JSON.stringify(error.message, null, 2)
          );
          console.error('Full error object:', error);
          console.error('Error code:', error.code);
          console.error('Error config:', error.config);

          const baseUrl = apiClient.defaults.baseURL || 'http://localhost:3000';
          console.error(
            `Unable to connect to frontend API at ${baseUrl}. Please ensure the frontend server is running.`
          );

          
          if (
            error.code === 'ECONNABORTED' ||
            error.message.includes('timeout')
          ) {
            console.error(
              'Request timed out - this may indicate server overload or network issues'
            );
            return Promise.reject(
              new Error(
                `Request timeout: The API at ${baseUrl} took too long to respond. Please try again or check your network connection.`
              )
            );
          }

          return Promise.reject(
            new Error(
              `Network error: Unable to connect to API at ${baseUrl}. Please ensure the frontend server is running and try again.`
            )
          );
        }

        const { status, data } = error.response;
        switch (status) {
          case 400:
            console.error('Bad Request:', JSON.stringify(data, null, 2));
            return Promise.reject(new Error(data?.message || 'Bad request.'));
          case 401:
            console.warn('Unauthorized: Token may be expired.');
            return Promise.reject(
              new Error('Unauthorized. Please log in again.')
            );
          case 403:
            console.warn(
              'Forbidden: You do not have permission to access this resource.'
            );
            return Promise.reject(
              new Error('Forbidden. You do not have access.')
            );
          case 404:
            console.warn('Not Found:', JSON.stringify(data, null, 2));
            return Promise.reject(new Error('Requested resource not found.'));
          case 500:
            console.error('Server Error:', JSON.stringify(data, null, 2));
            return Promise.reject(
              new Error('Internal server error. Try again later.')
            );
          default:
            console.error('API Error:', JSON.stringify(data, null, 2));
            return Promise.reject(
              new Error(data?.message || 'An unknown error occurred.')
            );
        }
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [spinnerContext]);

  const useFetchData = <TData = unknown>(
    queryKey: QueryKey,
    url: string,
    config?: RequestConfig & {
      skipCache?: boolean;
      cacheTTL?: number;
    }
  ) => {
    return useQuery<TData, Error>({
      queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      queryFn: async () => {
        const startTime = performance.now();

        try {
          const { data } = await apiClient.get(url, {
            timeout: config?.timeout || DEFAULT_TIMEOUT,
            suppressAuthErrors: config?.suppressAuthErrors,
          });

          if (!config?.skipCache) {
            const cacheKey = `${url}-${JSON.stringify(queryKey)}`;
            requestCache.set(cacheKey, {
              data,
              timestamp: Date.now(),
            });
          }

          const requestTime = performance.now() - startTime;
          if (requestTime > 500) {
            console.warn(
              `Slow request detected: ${url} took ${requestTime.toFixed(2)}ms`
            );
          }

          return data;
        } catch (error) {
          if (!config?.skipCache) {
            const cacheKey = `${url}-${JSON.stringify(queryKey)}`;
            const cachedResponse = requestCache.get(cacheKey);

            if (
              cachedResponse &&
              Date.now() - cachedResponse.timestamp <
                (config?.cacheTTL || CACHE_MAX_AGE)
            ) {
              console.log(
                `Using cached data as fallback for ${url} due to request failure`
              );
              return cachedResponse.data as TData;
            }
          }

          throw error;
        }
      },

      staleTime: config?.cacheTTL,
    });
  };

  const usePostData = <TData = unknown, TVariables = Record<string, unknown>>(
    url: string,
    config?: RequestConfig & {
      invalidateQueries?: QueryKey[];
      optimisticUpdate?: (oldData: unknown, newData: TVariables) => unknown;
    }
  ) => {
    return useMutation<TData, Error, TVariables>({
      mutationFn: async (postData: TVariables): Promise<TData> => {
        const startTime = performance.now();

        const response = await apiClient.post<TData>(url, postData, {
          timeout: config?.timeout || DEFAULT_TIMEOUT,
          suppressAuthErrors: config?.suppressAuthErrors,
        });

        const requestTime = performance.now() - startTime;
        if (requestTime > 500) {
          console.warn(
            `Slow mutation detected: ${url} took ${requestTime.toFixed(2)}ms`
          );
        }

        return response.data;
      },
      onSuccess: () => {
        if (config?.invalidateQueries && config.invalidateQueries.length > 0) {
          config.invalidateQueries.forEach((queryKey) => {
            queryClient.invalidateQueries({
              queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
            });
          });
        } else {
          queryClient.invalidateQueries();
        }
      },
    });
  };

  const useUpdateCustomization = <
    TData = unknown,
    TVariables = Record<string, unknown>,
  >(
    endpoint = '/api/UserCustomization',
    config?: RequestConfig
  ) => {
    return useMutation<TData, Error, TVariables>({
      mutationFn: async (customization: TVariables): Promise<TData> => {
        console.log(
          'Updating customization with endpoint:',
          JSON.stringify(endpoint, null, 2)
        );
        console.log(
          'Customization data:',
          JSON.stringify(customization, null, 2)
        );

        try {
          const response = await apiClient.post<TData>(
            endpoint,
            customization,
            {
              timeout: config?.timeout || DEFAULT_TIMEOUT,
              suppressAuthErrors: config?.suppressAuthErrors,
            }
          );
          console.log(
            'Customization update successful, received data:',
            JSON.stringify(response.data, null, 2)
          );
          return response.data;
        } catch (error) {
          console.error(
            'Error updating customization:',
            JSON.stringify(error, null, 2)
          );
          throw error;
        }
      },
      onSuccess: () => {
        console.log(
          'Invalidating customization queries after successful update'
        );
        queryClient.invalidateQueries({
          queryKey: ['customization'],
        });
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

export { apiClient, useApiClient };

export const useUpdateCustomization = <
  TData = unknown,
  TVariables = Record<string, unknown>,
>(
  endpoint = '/api/UserCustomization',
  config?: RequestConfig
): UseMutationResult<TData, Error, TVariables, unknown> => {
  const { useUpdateCustomization: updateCustomizationHook } = useApiClient();
  return updateCustomizationHook<TData, TVariables>(endpoint, config);
};
