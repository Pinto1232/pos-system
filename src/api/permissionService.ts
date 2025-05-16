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

// Mock permission categories for fallback
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

// Mock role permissions mapping for fallback
const mockRolePermissions: Record<
  number,
  string[]
> = {
  1: [
    // Admin
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
    // Manager
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
  3: [
    // Cashier
    'sales.create',
    'products.view',
    'customers.view',
    'customers.create',
  ],
  4: [
    // Inventory Manager
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'inventory.view',
    'inventory.edit',
    'inventory.reports',
  ],
  5: [
    // Analytics User
    'reports.view',
    'reports.create',
    'reports.export',
    'analytics.view',
    'analytics.create',
  ],
};

// Create Keycloak Authorization client
let keycloakAuthzClient: KeycloakAuthzClient | null =
  null;

// Initialize the Keycloak Authorization client
const initKeycloakAuthz = () => {
  if (
    !keycloakAuthzClient &&
    keycloak.authenticated
  ) {
    keycloakAuthzClient = new KeycloakAuthzClient(
      keycloak
    );
  }
  return keycloakAuthzClient;
};

// Map Keycloak permissions to our application's permission format
const mapKeycloakPermissions = (
  permissions: any[]
): PermissionInfo[] => {
  return permissions.map((permission) => ({
    id: permission.id,
    name: permission.name,
    displayName:
      permission.displayName || permission.name,
    category: permission.type || 'Default',
    description: permission.description,
  }));
};

const permissionService = {
  // Get all permissions
  getAllPermissions: async (): Promise<
    PermissionInfo[]
  > => {
    try {
      // Try to use Keycloak if authenticated
      const authzClient = initKeycloakAuthz();
      if (authzClient) {
        try {
          // Get permissions from Keycloak
          await authzClient.getPermissions(
            keycloak.clientId
          );

          // For now, fall back to API call since we need to map the permissions
          const response = await apiClient.get(
            '/api/Permissions'
          );
          return response.data;
        } catch (keycloakError) {
          console.error(
            'Error fetching permissions from Keycloak:',
            keycloakError
          );
          // Fall back to API call
        }
      }

      const response = await apiClient.get(
        '/api/Permissions'
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching permissions:',
        error
      );
      console.log(
        'Falling back to empty permissions list'
      );
      return [];
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
      console.log(
        'Falling back to mock permission categories'
      );
      return mockPermissionCategories;
    }
  },

  // Get permissions by category
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
        error
      );
      console.log(
        'Falling back to empty category permissions'
      );

      // Try to get all permissions and filter by category
      try {
        const allPermissions =
          await permissionService.getAllPermissions();
        return allPermissions.filter(
          (p) => p.category === category
        );
      } catch {
        return [];
      }
    }
  },

  // Get permissions for a role by role ID
  getRolePermissions: async (
    roleId: number
  ): Promise<string[]> => {
    try {
      // Try to use Keycloak if authenticated
      const authzClient = initKeycloakAuthz();
      if (authzClient && keycloak.authenticated) {
        try {
          // For Keycloak, we need to map role ID to role name
          // This would require an additional API call to get the role name
          // For now, we'll use the API endpoint
          const response = await apiClient.get(
            `/api/Permissions/Role/${roleId}`
          );
          return response.data;
        } catch (keycloakError) {
          console.error(
            'Error fetching permissions from Keycloak:',
            keycloakError
          );
          // Fall back to API call
        }
      }

      const response = await apiClient.get(
        `/api/Permissions/Role/${roleId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for role with ID ${roleId}:`,
        error
      );
      console.log(
        'Falling back to mock role permissions'
      );
      return mockRolePermissions[roleId] || [];
    }
  },

  // Get permissions for a role by role name
  getRolePermissionsByName: async (
    roleName: string
  ): Promise<string[]> => {
    try {
      // Try to use Keycloak if authenticated
      const authzClient = initKeycloakAuthz();
      if (authzClient && keycloak.authenticated) {
        try {
          // For Keycloak, we would need to query role permissions by name
          // This is a placeholder for Keycloak integration
          // For now, we'll use the API endpoint
          const response = await apiClient.get(
            `/api/Permissions/Role/ByName/${encodeURIComponent(roleName)}`
          );
          return response.data;
        } catch (keycloakError) {
          console.error(
            'Error fetching permissions from Keycloak:',
            keycloakError
          );
          // Fall back to API call
        }
      }

      const response = await apiClient.get(
        `/api/Permissions/Role/ByName/${encodeURIComponent(roleName)}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for role with name ${roleName}:`,
        error
      );
      console.log(
        'Falling back to empty role permissions'
      );

      // Try to map role name to ID for fallback
      const roleNameToId: Record<string, number> =
        {
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

  // Get permissions for a user
  getUserPermissions: async (
    userId: number
  ): Promise<string[]> => {
    try {
      // If using Keycloak, we would get the user's permissions from Keycloak
      // For now, we'll use the API endpoint
      const response = await apiClient.get(
        `/api/Permissions/User/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching permissions for user with ID ${userId}:`,
        error
      );
      console.log(
        'Falling back to empty user permissions'
      );
      return [];
    }
  },

  // Update role permissions
  updateRolePermissions: async (
    roleId: number,
    permissions: string[]
  ): Promise<void> => {
    try {
      // If using Keycloak, we would update the role's permissions in Keycloak
      // For now, we'll use the API endpoint
      await apiClient.put(
        `/api/Permissions/Role/${roleId}`,
        permissions
      );
    } catch (error) {
      console.error(
        `Error updating permissions for role with ID ${roleId}:`,
        error
      );
      throw error;
    }
  },

  // Check if the current user has a specific permission
  hasPermission: async (
    permission: string
  ): Promise<boolean> => {
    try {
      const authzClient = initKeycloakAuthz();
      if (authzClient && keycloak.authenticated) {
        // Extract resource and scope from permission string (e.g., "users.view" -> resource="users", scope="view")
        const [resource, scope] =
          permission.split('.');
        return await authzClient.hasPermission(
          resource,
          scope
        );
      }

      // Fallback to API call
      const response = await apiClient.get(
        `/api/Permissions/Check/${encodeURIComponent(permission)}`
      );
      return response.data.hasPermission;
    } catch (error) {
      console.error(
        `Error checking permission ${permission}:`,
        error
      );
      return false;
    }
  },
};

export default permissionService;
