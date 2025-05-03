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

const DEFAULT_TIMEOUT = 10000;

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: DEFAULT_TIMEOUT,
});

const getErrorMessageForStatus = (
  status: number
): string => {
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

const useApiClient = () => {
  const spinnerContext = useContext(
    SpinnerContext
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    const requestInterceptor =
      apiClient.interceptors.request.use(
        (config) => {
          try {
            const token = localStorage.getItem(
              'accessToken'
            );
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              console.log(
                'Added token to request:',
                config.url
              );
            } else {
              console.log(
                'No token available for request:',
                config.url
              );
            }
          } catch (error) {
            console.error(
              'Error retrieving access token:',
              error
            );
          }
          if (spinnerContext) {
            spinnerContext.setLoading(true);
            spinnerContext.setError(null);
          }
          console.log('Request URL:', config.url);
          console.log(
            'Request headers:',
            config.headers
          );
          return config;
        },
        (error) => {
          console.error('Request Error:', error);
          return Promise.reject(error);
        }
      );

    const responseInterceptor =
      apiClient.interceptors.response.use(
        async (response) => {
          if (spinnerContext) {
            await new Promise((resolve) =>
              setTimeout(resolve, 500)
            );
            spinnerContext.setLoading(false);
          }
          return response;
        },
        async (error) => {
          if (spinnerContext) {
            await new Promise((resolve) =>
              setTimeout(resolve, 500)
            );
            spinnerContext.setLoading(false);

            const suppressAuthError =
              error.config?.suppressAuthErrors ===
                true &&
              error.response?.status === 401;

            if (
              !suppressAuthError &&
              error.response
            ) {
              const { status, data } =
                error.response;
              spinnerContext.setError(
                data?.message ||
                  `Error (${status}): ${getErrorMessageForStatus(status)}`
              );
            } else if (!error.response) {
              spinnerContext.setError(
                'Network error. Please check your backend server connection.'
              );
            }
          }

          if (!error.response) {
            console.error(
              'Network Error or Server Unreachable:',
              error.message
            );
            return Promise.reject(
              new Error(
                'Network error. Please try again.'
              )
            );
          }

          const { status, data } = error.response;
          switch (status) {
            case 400:
              console.error('Bad Request:', data);
              return Promise.reject(
                new Error(
                  data?.message || 'Bad request.'
                )
              );
            case 401:
              console.warn(
                'Unauthorized: Token may be expired.'
              );
              return Promise.reject(
                new Error(
                  'Unauthorized. Please log in again.'
                )
              );
            case 403:
              console.warn(
                'Forbidden: You do not have permission to access this resource.'
              );
              return Promise.reject(
                new Error(
                  'Forbidden. You do not have access.'
                )
              );
            case 404:
              console.warn('Not Found:', data);
              return Promise.reject(
                new Error(
                  'Requested resource not found.'
                )
              );
            case 500:
              console.error(
                'Server Error:',
                data
              );
              return Promise.reject(
                new Error(
                  'Internal server error. Try again later.'
                )
              );
            default:
              console.error('API Error:', data);
              return Promise.reject(
                new Error(
                  data?.message ||
                    'An unknown error occurred.'
                )
              );
          }
        }
      );

    return () => {
      apiClient.interceptors.request.eject(
        requestInterceptor
      );
      apiClient.interceptors.response.eject(
        responseInterceptor
      );
    };
  }, [spinnerContext]);

  const useFetchData = <TData = unknown>(
    queryKey: QueryKey,
    url: string,
    config?: RequestConfig
  ) => {
    return useQuery<TData, Error>({
      queryKey: Array.isArray(queryKey)
        ? queryKey
        : [queryKey],
      queryFn: async () => {
        const { data } = await apiClient.get(
          url,
          {
            timeout:
              config?.timeout || DEFAULT_TIMEOUT,
            suppressAuthErrors:
              config?.suppressAuthErrors,
          }
        );
        return data;
      },
    });
  };

  const usePostData = <
    TData = unknown,
    TVariables = Record<string, unknown>,
  >(
    url: string,
    config?: RequestConfig
  ) => {
    return useMutation<TData, Error, TVariables>({
      mutationFn: async (
        postData: TVariables
      ) => {
        const { data } =
          await apiClient.post<TData>(
            url,
            postData,
            {
              timeout:
                config?.timeout ||
                DEFAULT_TIMEOUT,
              suppressAuthErrors:
                config?.suppressAuthErrors,
            }
          );
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries();
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
      mutationFn: async (
        customization: TVariables
      ) => {
        const { data } =
          await apiClient.post<TData>(
            endpoint,
            customization,
            {
              timeout:
                config?.timeout ||
                DEFAULT_TIMEOUT,
              suppressAuthErrors:
                config?.suppressAuthErrors,
            }
          );
        return data;
      },
      onSuccess: () => {
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
): UseMutationResult<
  TData,
  Error,
  TVariables,
  unknown
> => {
  const {
    useUpdateCustomization:
      updateCustomizationHook,
  } = useApiClient();
  return updateCustomizationHook<
    TData,
    TVariables
  >(endpoint, config);
};
