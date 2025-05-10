import axios from 'axios';
import {
  User,
  Role,
  Permission,
  UserFormData,
  RoleFormData,
} from '@/types/userManagement';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5107/api';

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
  const response =
    await api.get<User[]>('/api/users');
  return response.data;
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
  const response = await api.post<User>(
    '/api/users',
    userData
  );
  return response.data;
};

export const updateUser = async (
  id: number,
  userData: UserFormData
): Promise<void> => {
  await api.put(`/api/users/${id}`, {
    ...userData,
    id,
  });
};

export const deleteUser = async (
  id: number
): Promise<void> => {
  await api.delete(`/api/users/${id}`);
};

export const assignRolesToUser = async (
  userId: number,
  roles: string[]
): Promise<void> => {
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
