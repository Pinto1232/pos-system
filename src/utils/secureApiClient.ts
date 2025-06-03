import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class SecureApiClient {
  private static instance: SecureApiClient;
  private axiosInstance: AxiosInstance;
  private csrfToken: string | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      if (this.csrfToken) {
        config.headers['X-CSRF-Token'] = this.csrfToken;
      }

      config.headers['X-Requested-With'] = 'XMLHttpRequest';

      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            try {
              await this.refreshToken();

              return this.axiosInstance(error.config);
            } catch (refreshError) {
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }

          if (error.response.status === 403) {
            if (error.response.data?.error === 'Invalid CSRF token') {
              await this.refreshCsrfToken();
              return this.axiosInstance(error.config);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): SecureApiClient {
    if (!SecureApiClient.instance) {
      SecureApiClient.instance = new SecureApiClient();
    }
    return SecureApiClient.instance;
  }

  public setCsrfToken(token: string) {
    this.csrfToken = token;
  }

  private async refreshToken(): Promise<void> {
    try {
      await this.axiosInstance.post('/auth/refresh');
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  private async refreshCsrfToken(): Promise<void> {
    try {
      const response = await this.axiosInstance.get('/auth/csrf');
      this.setCsrfToken(response.data.token);
    } catch (error) {
      console.error('CSRF token refresh failed:', error);
      throw error;
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}
