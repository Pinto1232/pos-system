import { apiClient } from './axiosClient';
import keycloak from '@/auth/keycloak';
import { KeycloakAuthzClient } from '@/auth/keycloakAuthz';

export interface PermissionInfo {
  id?: number;
  name: string;
  displayName: string;
  category: string;
  description?: string;
}

const mockPermissionCategories = [
  'User Management',
  'Role Management',
  'System',
  'Reports',
  'Transactions',
  'Inventory',
  'Products',
  'Sales',
  'Customers',
  'Analytics',
];

const mockRolePermissions: Record<number, string[]> = {
  1: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'roles.view',
    'roles.create',
    'roles.edit',
    'roles.delete',
    'system.configure',
    'reports.all',
    'transactions.all',
    'inventory.all',
  ],
  2: [
    'users.view',
    'users.create',
    'users.edit',
    'roles.view',
    'reports.view',
    'reports.create',
    'transactions.approve',
    'inventory.view',
    'inventory.edit',
  ],
  3: ['sales.create', 'products.view', 'customers.view', 'customers.create'],
  4: [
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'inventory.view',
    'inventory.edit',
    'inventory.reports',
  ],
  5: [
    'reports.view',
    'reports.create',
    'reports.export',
    'analytics.view',
    'analytics.create',
  ],
};

let keycloakAuthzClient: KeycloakAuthzClient | null = null;

const initKeycloakAuthz = () => {
  if (!keycloakAuthzClient && keycloak.authenticated) {
    keycloakAuthzClient = new KeycloakAuthzClient(keycloak);
  }
  return keycloakAuthzClient;
};

const mapKeycloakPermissions = (permissions: any[]): PermissionInfo[] => {
  return permissions.map((permission) => ({
    id: permission.id,
    name: permission.name,
    displayName: permission.displayName || permission.name,
    category: permission.type || 'Default',
    description: permission.description,
  }));
};

const permissionService = {
  getAllPermissions: async (): Promise<PermissionInfo[]> => {
    try {
      const authzClient = initKeycloakAuthz();
      if (authzClient) {
        try {
          await authzClient.getPermissions(keycloak.clientId);

          const response = await apiClient.get('/api/Permissions');
          return response.data;
        } catch (keycloakError) {
          console.error(
            'Error fetching permissions from Keycloak:',
            JSON.stringify(keycloakError, null, 2)
          );
        }
      }

      const response = await apiClient.get('/api/Permissions');
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching permissions:',
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to empty permissions list');
      return [];
    }
  },

  getPermissionCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get('/api/Permissions/Categories');
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching permission categories:',
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock permission categories');
      return mockPermissionCategories;
    }
  },

  getPermissionsByCategory: async (
    category: string
  ): Promise<PermissionInfo[]> => {
    try {
      const response = await apiClient.get(
        `/api/Permissions/ByCategory/${encodeURIComponent(category)}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for category ${category}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to empty category permissions');

      try {
        const allPermissions = await permissionService.getAllPermissions();
        return allPermissions.filter((p) => p.category === category);
      } catch {
        return [];
      }
    }
  },

  getRolePermissions: async (roleId: number): Promise<string[]> => {
    try {
      const authzClient = initKeycloakAuthz();
      if (authzClient && keycloak.authenticated) {
        try {
          const response = await apiClient.get(
            `/api/Permissions/Role/${roleId}`
          );
          return response.data;
        } catch (keycloakError) {
          console.error(
            'Error fetching permissions from Keycloak:',
            JSON.stringify(keycloakError, null, 2)
          );
        }
      }

      const response = await apiClient.get(`/api/Permissions/Role/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for role with ID ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to mock role permissions');
      return mockRolePermissions[roleId] || [];
    }
  },

  getRolePermissionsByName: async (roleName: string): Promise<string[]> => {
    try {
      const authzClient = initKeycloakAuthz();
      if (authzClient && keycloak.authenticated) {
        try {
          const response = await apiClient.get(
            `/api/Permissions/Role/ByName/${encodeURIComponent(roleName)}`
          );
          return response.data;
        } catch (keycloakError) {
          console.error(
            'Error fetching permissions from Keycloak:',
            JSON.stringify(keycloakError, null, 2)
          );
        }
      }

      const response = await apiClient.get(
        `/api/Permissions/Role/ByName/${encodeURIComponent(roleName)}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for role with name ${roleName}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to empty role permissions');

      const roleNameToId: Record<string, number> = {
        Admin: 1,
        Manager: 2,
        Cashier: 3,
        'Inventory Manager': 4,
        'Analytics User': 5,
      };

      const roleId = roleNameToId[roleName];
      if (roleId) {
        return mockRolePermissions[roleId] || [];
      }

      return [];
    }
  },

  getUserPermissions: async (userId: number): Promise<string[]> => {
    try {
      const response = await apiClient.get(`/api/Permissions/User/${userId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for user with ID ${userId}:`,
        JSON.stringify(error, null, 2)
      );
      console.log('Falling back to empty user permissions');
      return [];
    }
  },

  updateRolePermissions: async (
    roleId: number,
    permissions: string[]
  ): Promise<void> => {
    try {
      await apiClient.put(`/api/Permissions/Role/${roleId}`, permissions);
    } catch (error) {
      console.error(
        `Error updating permissions for role with ID ${roleId}:`,
        JSON.stringify(error, null, 2)
      );
      throw error;
    }
  },

  hasPermission: async (permission: string): Promise<boolean> => {
    try {
      const authzClient = initKeycloakAuthz();
      if (authzClient && keycloak.authenticated) {
        const [resource, scope] = permission.split('.');
        return await authzClient.hasPermission(resource, scope);
      }

      const response = await apiClient.get(
        `/api/Permissions/Check/${encodeURIComponent(permission)}`
      );
      return response.data.hasPermission;
    } catch (error) {
      console.error(
        `Error checking permission ${permission}:`,
        JSON.stringify(error, null, 2)
      );
      return false;
    }
  },
};

export default permissionService;
