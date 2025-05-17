import { apiClient } from './axiosClient';
import mockRoleService from './mockRoleService';

export interface Role {
  id: number;
  name: string;
  normalizedName: string;
  permissions: string;
  permissionList?: string[];
  description?: string;
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface RoleUpdateRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UserInRole {
  id: number;
  userName: string;
  email: string;
  isActive: boolean;
}

const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const isBackendAvailable = async (): Promise<boolean> => {
  try {
    await apiClient.head('/', {
      timeout: 2000,
    });
    return true;
  } catch {
    console.warn('Backend server not available, using mock data');
    return false;
  }
};

const roleService = {
  getAllRoles: async (): Promise<Role[]> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.getAllRoles();
    }

    try {
      const response = await apiClient.get('/api/Roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', JSON.stringify(error, null, 2));
      console.log('Falling back to mock data due to error');
      return mockRoleService.getAllRoles();
    }
  },

  getRoleById: async (roleId: number): Promise<Role> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.getRoleById(roleId);
    }

    try {
      const response = await apiClient.get(`/api/Roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching role with ID ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock data due to error');
      return mockRoleService.getRoleById(roleId);
    }
  },

  getRoleByName: async (roleName: string): Promise<Role> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.getRoleByName(roleName);
    }

    try {
      const response = await apiClient.get(`/api/Roles/ByName/${roleName}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching role with name ${roleName}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock data due to error');
      return mockRoleService.getRoleByName(roleName);
    }
  },

  getUsersInRole: async (roleId: number): Promise<UserInRole[]> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.getUsersInRole(roleId);
    }

    try {
      const response = await apiClient.get(`/api/Roles/${roleId}/Users`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching users in role with ID ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock data due to error');
      return mockRoleService.getUsersInRole(roleId);
    }
  },

  createRole: async (roleData: RoleCreateRequest): Promise<Role> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.createRole(roleData);
    }

    try {
      const response = await apiClient.post('/api/Roles', roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', JSON.stringify(error, null, 2));
      console.log('Falling back to mock data due to error');
      return mockRoleService.createRole(roleData);
    }
  },

  updateRole: async (
    roleId: number,
    roleData: RoleUpdateRequest
  ): Promise<void> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.updateRole(roleId, roleData);
    }

    try {
      await apiClient.put(`/api/Roles/${roleId}`, roleData);
    } catch (error) {
      console.error(
        `Error updating role with ID ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock data due to error');
      return mockRoleService.updateRole(roleId, roleData);
    }
  },

  updateRolePermissions: async (
    roleId: number,
    permissions: string[]
  ): Promise<void> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.updateRolePermissions(roleId, permissions);
    }

    try {
      await apiClient.put(`/api/Roles/${roleId}/Permissions`, permissions);
    } catch (error) {
      console.error(
        `Error updating permissions for role with ID ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock data due to error');
      return mockRoleService.updateRolePermissions(roleId, permissions);
    }
  },

  addUserToRole: async (roleId: number, userId: number): Promise<void> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.addUserToRole(roleId, userId);
    }

    try {
      await apiClient.post(`/api/Roles/${roleId}/Users/${userId}`);
    } catch (error) {
      console.error(
        `Error adding user ${userId} to role ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock data due to error');
      return mockRoleService.addUserToRole(roleId, userId);
    }
  },

  removeUserFromRole: async (roleId: number, userId: number): Promise<void> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.removeUserFromRole(roleId, userId);
    }

    try {
      await apiClient.delete(`/api/Roles/${roleId}/Users/${userId}`);
    } catch (error) {
      console.error(
        `Error removing user ${userId} from role ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock data due to error');
      return mockRoleService.removeUserFromRole(roleId, userId);
    }
  },

  deleteRole: async (roleId: number): Promise<void> => {
    if (useMockData || !(await isBackendAvailable())) {
      return mockRoleService.deleteRole(roleId);
    }

    try {
      await apiClient.delete(`/api/Roles/${roleId}`);
    } catch (error) {
      console.error(
        `Error deleting role with ID ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock data due to error');
      return mockRoleService.deleteRole(roleId);
    }
  },
};

export default roleService;
