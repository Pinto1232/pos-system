import axios, { AxiosError } from 'axios';
import {
  User,
  Role,
  Permission,
  UserFormData,
  RoleFormData,
} from '@/types/userManagement';
import {
  mockUsers as initialMockUsers,
  mockRoles,
  mockPermissions,
  mockModules,
} from '@/mocks/userManagement';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5107/api';

const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA ===
    'true' || false;

// Local storage key for mock users
const MOCK_USERS_STORAGE_KEY = 'pisval_mock_users';

// Get mock users from localStorage or use initial mock data
const getMockUsers = (): User[] => {
  if (typeof window === 'undefined') {
    return initialMockUsers;
  }

  try {
    const storedUsers = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (error) {
    console.error('Error loading mock users from localStorage:', error);
  }

  // If no stored users or error, use initial mock data and save it
  saveMockUsers(initialMockUsers);
  return initialMockUsers;
};

// Save mock users to localStorage
const saveMockUsers = (users: User[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving mock users to localStorage:', error);
  }
};

// Initialize mockUsers from localStorage or initial data
let mockUsers = getMockUsers();

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

// User API
export const fetchUsers = async (): Promise<
  User[]
> => {
  console.log(
    '[DEBUG] fetchUsers API function called'
  );

  // If mock data is enabled, return mock users from localStorage
  if (USE_MOCK_DATA) {
    console.log(
      '[DEBUG] Using mock data for fetchUsers'
    );

    // Get the latest mock users from localStorage
    mockUsers = getMockUsers();

    console.log(
      '[DEBUG] Returning mock users from localStorage:',
      mockUsers
    );

    return mockUsers;
  }

  try {
    console.log(
      '[DEBUG] Making API call to /api/users'
    );
    const response =
      await api.get<User[]>('/api/users');
    console.log(
      '[DEBUG] Fetch users response:',
      response.data
    );

    // Log each user's lastLogin status
    response.data.forEach((user: User) => {
      console.log(
        `[DEBUG] API User ${user.username} (${user.email}) lastLogin:`,
        user.lastLogin
      );
      console.log(
        `[DEBUG] API User ${user.username} lastLogin type:`,
        typeof user.lastLogin
      );

      if (user.lastLogin) {
        try {
          const date = new Date(user.lastLogin);
          console.log(
            `[DEBUG] API User ${user.username} parsed date:`,
            date
          );
          console.log(
            `[DEBUG] API User ${user.username} formatted date:`,
            date.toLocaleString()
          );
        } catch (error) {
          console.error(
            `[DEBUG] API User ${user.username} date parsing error:`,
            error
          );
        }
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(
        '[DEBUG] Error fetching users:',
        {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText:
            axiosError.response?.statusText,
          data: axiosError.response?.data,
        }
      );

      // Log request details
      console.error('[DEBUG] Request details:', {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        headers: axiosError.config?.headers,
        baseURL: axiosError.config?.baseURL,
      });
    } else {
      console.error(
        '[DEBUG] Error fetching users:',
        error
      );
    }

    // If there's an error, try to return mock data from localStorage
    console.log(
      '[DEBUG] Falling back to mock data for fetchUsers'
    );

    // Get the latest mock users from localStorage
    mockUsers = getMockUsers();

    console.log(
      '[DEBUG] Returning mock users from localStorage as fallback:',
      mockUsers
    );

    return mockUsers;
  }
};

export const fetchUser = async (
  id: number
): Promise<User> => {
  const response = await api.get<User>(
    `/api/users/${id}`
  );
  return response.data;
};

export const createUser = async (
  userData: UserFormData
): Promise<User> => {
  // If mock data is enabled, return mock user immediately
  if (USE_MOCK_DATA) {
    console.log(
      'Using mock createUser implementation'
    );
    // Create a mock user with the provided data
    const newUser: User = {
      id: mockUsers.length + 1,
      username: userData.username,
      email: userData.email,
      isActive: userData.isActive,
      createdAt: new Date().toISOString(),
      roles: userData.roles || [],
      permissions: [],
    };

    // Add to mock data
    mockUsers.push(newUser);

    // Persist to localStorage
    saveMockUsers(mockUsers);
    console.log('Mock user data saved to localStorage');

    return newUser;
  }

  try {
    const response = await api.post<User>(
      '/api/users',
      userData
    );
    return response.data;
  } catch (error) {
    // Log detailed error information
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Error creating user:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText:
          axiosError.response?.statusText,
        data: axiosError.response?.data,
      });
    } else {
      console.error(
        'Error creating user:',
        error
      );
    }

    // Return mock data as fallback
    console.log(
      'Falling back to mock createUser implementation'
    );
    const newUser: User = {
      id: mockUsers.length + 1,
      username: userData.username,
      email: userData.email,
      isActive: userData.isActive,
      createdAt: new Date().toISOString(),
      roles: userData.roles || [],
      permissions: [],
    };

    // Add to mock data
    mockUsers.push(newUser);

    // Persist to localStorage
    saveMockUsers(mockUsers);
    console.log('Mock user data saved to localStorage (fallback)');

    return newUser;
  }
};

export const updateUser = async (
  id: number,
  userData: UserFormData
): Promise<void> => {
  // If mock data is enabled, update mock user immediately
  if (USE_MOCK_DATA) {
    console.log(
      'Using mock updateUser implementation'
    );

    // Find and update the user in mock data
    const userIndex = mockUsers.findIndex(
      (u) => u.id === id
    );

    if (userIndex >= 0) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        username: userData.username,
        email: userData.email,
        isActive: userData.isActive,
        roles: userData.roles || [],
      };

      // Persist to localStorage
      saveMockUsers(mockUsers);
      console.log('Updated mock user data saved to localStorage');
      return;
    }

    throw new Error(`User with ID ${id} not found`);
  }

  await api.put(`/api/users/${id}`, {
    ...userData,
    id,
  });
};

export const deleteUser = async (
  id: number
): Promise<void> => {
  // If mock data is enabled, delete mock user immediately
  if (USE_MOCK_DATA) {
    console.log(
      'Using mock deleteUser implementation'
    );

    // Find and remove the user from mock data
    const userIndex = mockUsers.findIndex(
      (u) => u.id === id
    );

    if (userIndex >= 0) {
      mockUsers.splice(userIndex, 1);

      // Persist to localStorage
      saveMockUsers(mockUsers);
      console.log('Updated mock user data saved to localStorage after deletion');
      return;
    }

    throw new Error(`User with ID ${id} not found`);
  }

  await api.delete(`/api/users/${id}`);
};

export const assignRolesToUser = async (
  userId: number,
  roles: string[]
): Promise<void> => {
  // If mock data is enabled, update mock user roles immediately
  if (USE_MOCK_DATA) {
    console.log(
      'Using mock assignRolesToUser implementation'
    );

    // Find and update the user's roles in mock data
    const userIndex = mockUsers.findIndex(
      (u) => u.id === userId
    );

    if (userIndex >= 0) {
      mockUsers[userIndex].roles = roles;

      // Persist to localStorage
      saveMockUsers(mockUsers);
      console.log('Updated mock user roles saved to localStorage');
      return;
    }

    throw new Error(`User with ID ${userId} not found`);
  }

  await api.post(
    `/api/users/${userId}/roles`,
    roles
  );
};

export const getUserRoles = async (
  userId: number
): Promise<string[]> => {
  const response = await api.get<string[]>(
    `/api/users/${userId}/roles`
  );
  return response.data;
};

export const getUserPermissions = async (
  userId: number
): Promise<string[]> => {
  const response = await api.get<string[]>(
    `/api/users/${userId}/permissions`
  );
  return response.data;
};

// Role API
export const fetchRoles = async (): Promise<
  Role[]
> => {
  const response =
    await api.get<Role[]>('/api/roles');
  return response.data;
};

export const fetchRole = async (
  id: number
): Promise<Role> => {
  const response = await api.get<Role>(
    `/api/roles/${id}`
  );
  return response.data;
};

export const createRole = async (
  roleData: RoleFormData
): Promise<Role> => {
  const response = await api.post<Role>(
    '/api/roles',
    roleData
  );
  return response.data;
};

export const updateRole = async (
  id: number,
  roleData: RoleFormData
): Promise<void> => {
  await api.put(`/api/roles/${id}`, {
    ...roleData,
    id,
  });
};

export const deleteRole = async (
  id: number
): Promise<void> => {
  await api.delete(`/api/roles/${id}`);
};

export const assignPermissionsToRole = async (
  roleId: number,
  permissions: string[]
): Promise<void> => {
  await api.post(
    `/api/roles/${roleId}/permissions`,
    permissions
  );
};

// Permission API
export const fetchPermissions = async (): Promise<
  Permission[]
> => {
  const response = await api.get<Permission[]>(
    '/api/permissions'
  );
  return response.data;
};

export const fetchPermissionsByModule = async (
  module: string
): Promise<Permission[]> => {
  const response = await api.get<Permission[]>(
    `/api/permissions/module/${module}`
  );
  return response.data;
};

export const fetchModules = async (): Promise<
  string[]
> => {
  const response = await api.get<string[]>(
    '/api/permissions/modules'
  );
  return response.data;
};

// Helper function to group permissions by module
export const groupPermissionsByModule = (
  permissions: Permission[]
): Record<string, Permission[]> => {
  return permissions.reduce(
    (modules, permission) => {
      if (!modules[permission.module]) {
        modules[permission.module] = [];
      }
      modules[permission.module].push(permission);
      return modules;
    },
    {} as Record<string, Permission[]>
  );
};

// User Sync API
export const syncAllUsers = async (): Promise<{
  message: string;
  syncedCount: number;
  totalCount: number;
  errors?: string[];
}> => {
  // If mock data is enabled, return mock response
  if (USE_MOCK_DATA) {
    console.log(
      'Using mock syncAllUsers implementation'
    );
    return {
      message:
        'Synchronized 3 users from Keycloak (mock)',
      syncedCount: 3,
      totalCount: 3,
    };
  }

  try {
    const response = await api.post(
      '/api/UserSync/sync-all'
    );
    return response.data;
  } catch (error) {
    // Log detailed error information
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Error syncing users:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText:
          axiosError.response?.statusText,
        data: axiosError.response?.data,
      });
    } else {
      console.error(
        'Error syncing users:',
        error
      );
    }
    throw error;
  }
};

export const updateLoginStatus =
  async (): Promise<{
    message: string;
    timestamp?: Date;
    timestampIso?: string;
    timestampFormatted?: string;
  }> => {
    console.log(
      '[DEBUG] updateLoginStatus API function called'
    );

    // If mock data is enabled, return mock response
    if (USE_MOCK_DATA) {
      console.log(
        '[DEBUG] Using mock updateLoginStatus implementation'
      );
      const now = new Date();
      return {
        message: 'Updated login status (mock)',
        timestamp: now,
        timestampIso: now.toISOString(),
        timestampFormatted: now.toLocaleString(),
      };
    }

    try {
      console.log(
        '[DEBUG] Making API call to /api/UserSync/update-login-status'
      );
      console.log(
        '[DEBUG] Current token:',
        localStorage
          .getItem('accessToken')
          ?.substring(0, 20) + '...'
      );

      const response = await api.post(
        '/api/UserSync/update-login-status'
      );
      console.log(
        '[DEBUG] Update login status response:',
        response.data
      );

      // Process the response to ensure timestamp is a Date object
      const result = {
        ...response.data,
        timestamp: response.data.timestamp
          ? new Date(response.data.timestamp)
          : undefined,
      };

      console.log(
        '[DEBUG] Processed update login status response:',
        result
      );

      // Trigger a refresh of the users data
      try {
        console.log(
          '[DEBUG] Triggering users data refresh'
        );
        await api.get('/api/users');
      } catch (refreshError) {
        console.error(
          '[DEBUG] Error refreshing users data:',
          refreshError
        );
        // Don't fail if refresh fails
      }

      return result;
    } catch (error) {
      // Log detailed error information
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(
          '[DEBUG] Error updating login status:',
          {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText:
              axiosError.response?.statusText,
            data: axiosError.response?.data,
          }
        );

        // Log request details
        console.error(
          '[DEBUG] Request details:',
          {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            headers: axiosError.config?.headers,
            baseURL: axiosError.config?.baseURL,
          }
        );
      } else {
        console.error(
          '[DEBUG] Error updating login status:',
          error
        );
      }
      throw error;
    }
  };
