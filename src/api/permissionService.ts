import { apiClient } from './axiosClient';

export interface PermissionInfo {
  name: string;
  displayName: string;
  category: string;
  description?: string;
}

const permissionService = {
  // Get all permissions
  getAllPermissions: async (): Promise<
    PermissionInfo[]
  > => {
    try {
      const response = await apiClient.get(
        '/api/Permissions'
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching permissions:',
        error
      );
      throw error;
    }
  },

  // Get all permission categories
  getPermissionCategories: async (): Promise<
    string[]
  > => {
    try {
      const response = await apiClient.get(
        '/api/Permissions/Categories'
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching permission categories:',
        error
      );
      throw error;
    }
  },

  // Get permissions by category
  getPermissionsByCategory: async (
    category: string
  ): Promise<PermissionInfo[]> => {
    try {
      const response = await apiClient.get(
        `/api/Permissions/ByCategory/${category}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for category ${category}:`,
        error
      );
      throw error;
    }
  },

  // Get permissions for a role by role ID
  getRolePermissions: async (
    roleId: number
  ): Promise<string[]> => {
    try {
      const response = await apiClient.get(
        `/api/Permissions/Role/${roleId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for role with ID ${roleId}:`,
        error
      );
      throw error;
    }
  },

  // Get permissions for a role by role name
  getRolePermissionsByName: async (
    roleName: string
  ): Promise<string[]> => {
    try {
      const response = await apiClient.get(
        `/api/Permissions/Role/ByName/${roleName}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for role with name ${roleName}:`,
        error
      );
      throw error;
    }
  },

  // Get permissions for a user
  getUserPermissions: async (
    userId: number
  ): Promise<string[]> => {
    try {
      const response = await apiClient.get(
        `/api/Permissions/User/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for user with ID ${userId}:`,
        error
      );
      throw error;
    }
  },
};

export default permissionService;
