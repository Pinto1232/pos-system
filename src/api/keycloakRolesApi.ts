import axios, { AxiosError } from 'axios';
import {
  KeycloakRole,
  RolePermissionMapping,
} from '@/types/keycloakRoles';
import {
  mockKeycloakRoles,
  mockUserRoles,
} from '@/mocks/keycloakRoles';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5107/api';
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA ===
    'true' || false;

// Configure axios with authentication
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // For development, use a hardcoded token if no token is in localStorage
    const token =
      localStorage.getItem('accessToken') ||
      'dev-token-for-testing';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For development, add this to bypass authentication checks
    if (process.env.NODE_ENV === 'development') {
      config.headers['X-Dev-Override-Auth'] =
        'true';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Keycloak Roles API
export const fetchKeycloakRoles =
  async (): Promise<KeycloakRole[]> => {
    // If mock data is enabled, return mock roles immediately
    if (USE_MOCK_DATA) {
      console.log(
        'Using mock Keycloak roles data'
      );
      return mockKeycloakRoles;
    }

    try {
      const response = await api.get<
        KeycloakRole[]
      >('/api/KeycloakRoles');
      return response.data;
    } catch (error) {
      // Log detailed error information
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(
          'Error fetching Keycloak roles:',
          {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText:
              axiosError.response?.statusText,
            data: axiosError.response?.data,
          }
        );
      } else {
        console.error(
          'Error fetching Keycloak roles:',
          error
        );
      }

      // Return mock data as fallback
      console.log(
        'Falling back to mock Keycloak roles data'
      );
      return mockKeycloakRoles;
    }
  };

export const fetchCurrentUserRoles =
  async (): Promise<string[]> => {
    // If mock data is enabled, return mock user roles immediately
    if (USE_MOCK_DATA) {
      console.log(
        'Using mock current user roles data'
      );
      return mockUserRoles;
    }

    try {
      const response = await api.get<{
        roles: string[];
      }>('/api/KeycloakRoles/current');
      return response.data.roles;
    } catch (error) {
      // Log detailed error information
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(
          'Error fetching current user roles:',
          {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText:
              axiosError.response?.statusText,
            data: axiosError.response?.data,
          }
        );
      } else {
        console.error(
          'Error fetching current user roles:',
          error
        );
      }

      // Return mock data as fallback
      console.log(
        'Falling back to mock current user roles data'
      );
      return mockUserRoles;
    }
  };

export const fetchUserRoles = async (
  userId: string
): Promise<KeycloakRole[]> => {
  // If mock data is enabled, return mock roles immediately
  if (USE_MOCK_DATA) {
    console.log(
      `Using mock roles data for user ${userId}`
    );
    return mockKeycloakRoles.filter((role) =>
      mockUserRoles.includes(role.name)
    );
  }

  try {
    const response = await api.get<
      KeycloakRole[]
    >(`/api/KeycloakRoles/user/${userId}`);
    return response.data;
  } catch (error) {
    // Log detailed error information
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(
        `Error fetching roles for user ${userId}:`,
        {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText:
            axiosError.response?.statusText,
          data: axiosError.response?.data,
        }
      );
    } else {
      console.error(
        `Error fetching roles for user ${userId}:`,
        error
      );
    }

    // Return filtered mock data as fallback
    console.log(
      `Falling back to mock roles data for user ${userId}`
    );
    return mockKeycloakRoles.filter((role) =>
      mockUserRoles.includes(role.name)
    );
  }
};

export const assignRoleToUser = async (
  userId: string,
  roleName: string
): Promise<boolean> => {
  // If mock data is enabled, simulate success
  if (USE_MOCK_DATA) {
    console.log(
      `Mock: Assigned role ${roleName} to user ${userId}`
    );
    return true;
  }

  try {
    await api.post(
      `/api/KeycloakRoles/user/${userId}/role/${roleName}`
    );
    return true;
  } catch (error) {
    // Log detailed error information
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(
        `Error assigning role ${roleName} to user ${userId}:`,
        {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText:
            axiosError.response?.statusText,
          data: axiosError.response?.data,
        }
      );
    } else {
      console.error(
        `Error assigning role ${roleName} to user ${userId}:`,
        error
      );
    }
    return false;
  }
};

// Role Mapping API
export const syncRoles =
  async (): Promise<boolean> => {
    // If mock data is enabled, simulate success
    if (USE_MOCK_DATA) {
      console.log('Mock: Synchronized roles');
      return true;
    }

    try {
      await api.post('/api/RoleMappings/sync');
      return true;
    } catch (error) {
      // Log detailed error information
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(
          'Error synchronizing roles:',
          {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText:
              axiosError.response?.statusText,
            data: axiosError.response?.data,
          }
        );
      } else {
        console.error(
          'Error synchronizing roles:',
          error
        );
      }
      return false;
    }
  };

export const mapRoleToPermissions = async (
  roleName: string,
  permissionCodes: string[]
): Promise<boolean> => {
  // If mock data is enabled, simulate success
  if (USE_MOCK_DATA) {
    console.log(
      `Mock: Mapped permissions to role ${roleName}`,
      permissionCodes
    );
    return true;
  }

  try {
    await api.post('/api/RoleMappings/map', {
      roleName,
      permissionCodes,
    });
    return true;
  } catch (error) {
    // Log detailed error information
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(
        `Error mapping permissions to role ${roleName}:`,
        {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText:
            axiosError.response?.statusText,
          data: axiosError.response?.data,
        }
      );
    } else {
      console.error(
        `Error mapping permissions to role ${roleName}:`,
        error
      );
    }
    return false;
  }
};

export const syncUserRoles = async (
  userId: number,
  keycloakUserId: string
): Promise<boolean> => {
  // If mock data is enabled, simulate success
  if (USE_MOCK_DATA) {
    console.log(
      `Mock: Synchronized roles for user ${userId} with Keycloak user ${keycloakUserId}`
    );
    return true;
  }

  try {
    await api.post(
      `/api/RoleMappings/user/${userId}/sync`,
      {
        keycloakUserId,
      }
    );
    return true;
  } catch (error) {
    // Log detailed error information
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(
        `Error synchronizing roles for user ${userId}:`,
        {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText:
            axiosError.response?.statusText,
          data: axiosError.response?.data,
        }
      );
    } else {
      console.error(
        `Error synchronizing roles for user ${userId}:`,
        error
      );
    }
    return false;
  }
};
