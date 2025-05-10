'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  User,
  Role,
  Permission,
  UserFormData,
  RoleFormData,
  SecuritySettings,
} from '@/types/userManagement';
import * as api from '@/api/userManagementApi';

// Default security settings
const defaultSecuritySettings: SecuritySettings =
  {
    passwordPolicy: {
      minLength: 8,
      requireSpecialChars: true,
      expiryDays: 90,
      twoFactorEnabled: false,
    },
    sessionSettings: {
      autoLogoutMinutes: 30,
      maxConcurrentSessions: 1,
    },
  };

interface UserManagementContextType {
  // Data
  users: User[];
  roles: Role[];
  permissions: Permission[];
  modules: string[];
  securitySettings: SecuritySettings;

  // Loading states
  isLoadingUsers: boolean;
  isLoadingRoles: boolean;
  isLoadingPermissions: boolean;

  // Error states
  usersError: Error | null;
  rolesError: Error | null;
  permissionsError: Error | null;

  // User operations
  createUser: (
    userData: UserFormData
  ) => Promise<User>;
  updateUser: (
    id: number,
    userData: UserFormData
  ) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  assignRolesToUser: (
    userId: number,
    roles: string[]
  ) => Promise<void>;

  // Role operations
  createRole: (
    roleData: RoleFormData
  ) => Promise<Role>;
  updateRole: (
    id: number,
    roleData: RoleFormData
  ) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
  assignPermissionsToRole: (
    roleId: number,
    permissions: string[]
  ) => Promise<void>;

  // Security settings
  updateSecuritySettings: (
    settings: SecuritySettings
  ) => void;
}

const UserManagementContext = createContext<
  UserManagementContextType | undefined
>(undefined);

export const UserManagementProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const queryClient = useQueryClient();
  const [securitySettings, setSecuritySettings] =
    useState<SecuritySettings>(
      defaultSecuritySettings
    );

  // Mock data for development
  const mockUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@pisvaltech.com',
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z',
      lastLogin: '2023-05-15T10:30:00Z',
      roles: ['Administrator'],
      permissions: [
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
      ],
    },
    {
      id: 2,
      username: 'manager',
      email: 'manager@pisvaltech.com',
      isActive: true,
      createdAt: '2023-02-15T00:00:00Z',
      lastLogin: '2023-05-14T14:20:00Z',
      roles: ['Manager'],
      permissions: [
        'users.view',
        'products.view',
        'products.edit',
      ],
    },
  ];

  const mockRoles: Role[] = [
    {
      id: 1,
      name: 'Administrator',
      description: 'Full system access',
      isSystemRole: true,
      userCount: 1,
      permissions: [
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
      ],
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Department management',
      isSystemRole: false,
      userCount: 1,
      permissions: [
        'users.view',
        'products.view',
        'products.edit',
      ],
    },
    {
      id: 3,
      name: 'Cashier',
      description: 'Sales operations',
      isSystemRole: false,
      userCount: 0,
      permissions: [
        'sales.create',
        'products.view',
      ],
    },
  ];

  const mockPermissions: Permission[] = [
    {
      id: 1,
      name: 'View Users',
      code: 'users.view',
      description: 'Can view user list',
      module: 'User Management',
      isActive: true,
    },
    {
      id: 2,
      name: 'Create Users',
      code: 'users.create',
      description: 'Can create new users',
      module: 'User Management',
      isActive: true,
    },
    {
      id: 3,
      name: 'Edit Users',
      code: 'users.edit',
      description: 'Can edit existing users',
      module: 'User Management',
      isActive: true,
    },
    {
      id: 4,
      name: 'Delete Users',
      code: 'users.delete',
      description: 'Can delete users',
      module: 'User Management',
      isActive: true,
    },
    {
      id: 5,
      name: 'View Products',
      code: 'products.view',
      description: 'Can view product list',
      module: 'Product Management',
      isActive: true,
    },
    {
      id: 6,
      name: 'Edit Products',
      code: 'products.edit',
      description: 'Can edit products',
      module: 'Product Management',
      isActive: true,
    },
    {
      id: 7,
      name: 'Create Sales',
      code: 'sales.create',
      description: 'Can create sales',
      module: 'Sales',
      isActive: true,
    },
  ];

  const mockModules: string[] = [
    'User Management',
    'Product Management',
    'Sales',
  ];

  // Fetch users with fallback to mock data
  const {
    data: users = mockUsers,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await api.fetchUsers();
      } catch (error) {
        console.log('Using mock user data');
        return mockUsers;
      }
    },
    retry: false,
  });

  // Fetch roles with fallback to mock data
  const {
    data: roles = mockRoles,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: async () => {
      try {
        return await api.fetchRoles();
      } catch (error) {
        console.log('Using mock role data');
        return mockRoles;
      }
    },
    retry: false,
  });

  // Fetch permissions with fallback to mock data
  const {
    data: permissions = mockPermissions,
    isLoading: isLoadingPermissions,
    error: permissionsError,
  } = useQuery<Permission[], Error>({
    queryKey: ['permissions'],
    queryFn: async () => {
      try {
        return await api.fetchPermissions();
      } catch (error) {
        console.log('Using mock permission data');
        return mockPermissions;
      }
    },
    retry: false,
  });

  // Fetch modules with fallback to mock data
  const { data: modules = mockModules } =
    useQuery<string[], Error>({
      queryKey: ['modules'],
      queryFn: async () => {
        try {
          return await api.fetchModules();
        } catch (error) {
          console.log('Using mock module data');
          return mockModules;
        }
      },
      retry: false,
    });

  // User mutations
  const createUserMutation = useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: number;
      userData: UserFormData;
    }) => api.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });

  const assignRolesToUserMutation = useMutation({
    mutationFn: ({
      userId,
      roles,
    }: {
      userId: number;
      roles: string[];
    }) => api.assignRolesToUser(userId, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });

  // Role mutations
  const createRoleMutation = useMutation({
    mutationFn: api.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({
      id,
      roleData,
    }: {
      id: number;
      roleData: RoleFormData;
    }) => api.updateRole(id, roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: api.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    },
  });

  const assignPermissionsToRoleMutation =
    useMutation({
      mutationFn: ({
        roleId,
        permissions,
      }: {
        roleId: number;
        permissions: string[];
      }) =>
        api.assignPermissionsToRole(
          roleId,
          permissions
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['roles'],
        });
      },
    });

  // Wrapper functions for mutations with mock data fallback
  const createUser = async (
    userData: UserFormData
  ): Promise<User> => {
    try {
      return await createUserMutation.mutateAsync(
        userData
      );
    } catch (error) {
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
        roles: userData.roles,
        permissions: [],
      };

      // Update the mock data
      mockUsers.push(newUser);

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });

      return newUser;
    }
  };

  const updateUser = async (
    id: number,
    userData: UserFormData
  ): Promise<void> => {
    try {
      return await updateUserMutation.mutateAsync(
        { id, userData }
      );
    } catch (error) {
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
          roles: userData.roles,
        };
      }

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    }
  };

  const deleteUser = async (
    id: number
  ): Promise<void> => {
    try {
      return await deleteUserMutation.mutateAsync(
        id
      );
    } catch (error) {
      console.log(
        'Using mock deleteUser implementation'
      );

      // Remove the user from mock data
      const userIndex = mockUsers.findIndex(
        (u) => u.id === id
      );
      if (userIndex >= 0) {
        mockUsers.splice(userIndex, 1);
      }

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    }
  };

  const assignRolesToUser = async (
    userId: number,
    roles: string[]
  ): Promise<void> => {
    try {
      return await assignRolesToUserMutation.mutateAsync(
        { userId, roles }
      );
    } catch (error) {
      console.log(
        'Using mock assignRolesToUser implementation'
      );

      // Find and update the user's roles in mock data
      const userIndex = mockUsers.findIndex(
        (u) => u.id === userId
      );
      if (userIndex >= 0) {
        mockUsers[userIndex].roles = roles;
      }

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    }
  };

  const createRole = async (
    roleData: RoleFormData
  ): Promise<Role> => {
    try {
      return await createRoleMutation.mutateAsync(
        roleData
      );
    } catch (error) {
      console.log(
        'Using mock createRole implementation'
      );

      // Create a mock role with the provided data
      const newRole: Role = {
        id: mockRoles.length + 1,
        name: roleData.name,
        description: roleData.description || '',
        isSystemRole: false,
        userCount: 0,
        permissions: roleData.permissions,
      };

      // Update the mock data
      mockRoles.push(newRole);

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });

      return newRole;
    }
  };

  const updateRole = async (
    id: number,
    roleData: RoleFormData
  ): Promise<void> => {
    try {
      return await updateRoleMutation.mutateAsync(
        { id, roleData }
      );
    } catch (error) {
      console.log(
        'Using mock updateRole implementation'
      );

      // Find and update the role in mock data
      const roleIndex = mockRoles.findIndex(
        (r) => r.id === id
      );
      if (roleIndex >= 0) {
        mockRoles[roleIndex] = {
          ...mockRoles[roleIndex],
          name: roleData.name,
          description: roleData.description || '',
          permissions: roleData.permissions,
        };
      }

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    }
  };

  const deleteRole = async (
    id: number
  ): Promise<void> => {
    try {
      return await deleteRoleMutation.mutateAsync(
        id
      );
    } catch (error) {
      console.log(
        'Using mock deleteRole implementation'
      );

      // Remove the role from mock data
      const roleIndex = mockRoles.findIndex(
        (r) => r.id === id
      );
      if (roleIndex >= 0) {
        mockRoles.splice(roleIndex, 1);
      }

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    }
  };

  const assignPermissionsToRole = async (
    roleId: number,
    permissions: string[]
  ): Promise<void> => {
    try {
      return await assignPermissionsToRoleMutation.mutateAsync(
        { roleId, permissions }
      );
    } catch (error) {
      console.log(
        'Using mock assignPermissionsToRole implementation'
      );

      // Find and update the role's permissions in mock data
      const roleIndex = mockRoles.findIndex(
        (r) => r.id === roleId
      );
      if (roleIndex >= 0) {
        mockRoles[roleIndex].permissions =
          permissions;
      }

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    }
  };

  const updateSecuritySettings = (
    settings: SecuritySettings
  ) => {
    setSecuritySettings(settings);
    // In a real app, you would save these settings to the backend
  };

  const contextValue: UserManagementContextType =
    {
      users,
      roles,
      permissions,
      modules,
      securitySettings,
      isLoadingUsers,
      isLoadingRoles,
      isLoadingPermissions,
      usersError: usersError as Error | null,
      rolesError: rolesError as Error | null,
      permissionsError:
        permissionsError as Error | null,
      createUser,
      updateUser,
      deleteUser,
      assignRolesToUser,
      createRole,
      updateRole,
      deleteRole,
      assignPermissionsToRole,
      updateSecuritySettings,
    };

  return (
    <UserManagementContext.Provider
      value={contextValue}
    >
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(
    UserManagementContext
  );
  if (context === undefined) {
    throw new Error(
      'useUserManagement must be used within a UserManagementProvider'
    );
  }
  return context;
};
