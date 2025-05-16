import {
  Role,
  RoleCreateRequest,
  RoleUpdateRequest,
  UserInRole,
} from './roleService';

// Mock roles data
const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    normalizedName: 'ADMIN',
    permissions: JSON.stringify([
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'roles.view',
      'roles.create',
      'roles.edit',
      'roles.delete',
    ]),
    permissionList: [
      'users.view',
      'users.create',
      'users.edit',
      'users.delete',
      'roles.view',
      'roles.create',
      'roles.edit',
      'roles.delete',
    ],
  },
  {
    id: 2,
    name: 'Manager',
    normalizedName: 'MANAGER',
    permissions: JSON.stringify([
      'users.view',
      'users.create',
      'users.edit',
      'roles.view',
    ]),
    permissionList: [
      'users.view',
      'users.create',
      'users.edit',
      'roles.view',
    ],
  },
  {
    id: 3,
    name: 'Cashier',
    normalizedName: 'CASHIER',
    permissions: JSON.stringify([
      'sales.create',
      'products.view',
    ]),
    permissionList: [
      'sales.create',
      'products.view',
    ],
  },
  {
    id: 4,
    name: 'Inventory Manager',
    normalizedName: 'INVENTORY_MANAGER',
    permissions: JSON.stringify([
      'products.view',
      'products.create',
      'products.edit',
      'products.delete',
    ]),
    permissionList: [
      'products.view',
      'products.create',
      'products.edit',
      'products.delete',
    ],
  },
];

// Mock users in roles
const mockUsersInRoles: Record<
  number,
  UserInRole[]
> = {
  1: [
    {
      id: 1,
      userName: 'admin',
      email: 'admin@pisvaltech.com',
      isActive: true,
    },
  ],
  2: [
    {
      id: 2,
      userName: 'manager',
      email: 'manager@pisvaltech.com',
      isActive: true,
    },
    {
      id: 5,
      userName: 'sarah',
      email: 'sarah@pisvaltech.com',
      isActive: true,
    },
  ],
  3: [
    {
      id: 3,
      userName: 'cashier',
      email: 'cashier@pisvaltech.com',
      isActive: true,
    },
  ],
  4: [
    {
      id: 4,
      userName: 'john',
      email: 'john@pisvaltech.com',
      isActive: true,
    },
  ],
};

// Simulate API delay
const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const mockRoleService = {
  // Get all roles
  getAllRoles: async (): Promise<Role[]> => {
    console.log(
      'Using mock role service - getAllRoles'
    );
    await delay(500); // Simulate network delay
    return [...mockRoles];
  },

  // Get role by ID
  getRoleById: async (
    roleId: number
  ): Promise<Role> => {
    console.log(
      `Using mock role service - getRoleById(${roleId})`
    );
    await delay(300);
    const role = Array.isArray(mockRoles)
      ? mockRoles.find(
          (r) => r && r.id === roleId
        )
      : undefined;
    if (!role) {
      throw new Error(
        `Role with ID ${roleId} not found`
      );
    }
    return { ...role };
  },

  // Get role by name
  getRoleByName: async (
    roleName: string
  ): Promise<Role> => {
    console.log(
      `Using mock role service - getRoleByName(${roleName})`
    );
    await delay(300);
    const role = Array.isArray(mockRoles)
      ? mockRoles.find(
          (r) => r && r.name === roleName
        )
      : undefined;
    if (!role) {
      throw new Error(
        `Role with name ${roleName} not found`
      );
    }
    return { ...role };
  },

  // Get users in role
  getUsersInRole: async (
    roleId: number
  ): Promise<UserInRole[]> => {
    console.log(
      `Using mock role service - getUsersInRole(${roleId})`
    );
    await delay(400);
    const users = mockUsersInRoles[roleId];
    if (!users) {
      return [];
    }
    return [...users];
  },

  // Create a new role
  createRole: async (
    roleData: RoleCreateRequest
  ): Promise<Role> => {
    console.log(
      `Using mock role service - createRole(${JSON.stringify(roleData)})`
    );
    await delay(600);
    const newRole: Role = {
      id:
        Math.max(...mockRoles.map((r) => r.id)) +
        1,
      name: roleData.name,
      normalizedName: roleData.name.toUpperCase(),
      permissions: JSON.stringify(
        roleData.permissions || []
      ),
      permissionList: roleData.permissions || [],
    };
    mockRoles.push(newRole);
    return { ...newRole };
  },

  // Update a role
  updateRole: async (
    roleId: number,
    roleData: RoleUpdateRequest
  ): Promise<void> => {
    console.log(
      `Using mock role service - updateRole(${roleId}, ${JSON.stringify(roleData)})`
    );
    await delay(500);
    const roleIndex = Array.isArray(mockRoles)
      ? mockRoles.findIndex(
          (r) => r && r.id === roleId
        )
      : -1;
    if (roleIndex === -1) {
      throw new Error(
        `Role with ID ${roleId} not found`
      );
    }
    mockRoles[roleIndex] = {
      ...mockRoles[roleIndex],
      name: roleData.name,
      normalizedName: roleData.name.toUpperCase(),
      permissions: roleData.permissions
        ? JSON.stringify(roleData.permissions)
        : mockRoles[roleIndex].permissions,
      permissionList:
        roleData.permissions ||
        mockRoles[roleIndex].permissionList,
    };
  },

  // Update role permissions
  updateRolePermissions: async (
    roleId: number,
    permissions: string[]
  ): Promise<void> => {
    console.log(
      `Using mock role service - updateRolePermissions(${roleId}, ${JSON.stringify(permissions)})`
    );
    await delay(500);
    const roleIndex = Array.isArray(mockRoles)
      ? mockRoles.findIndex(
          (r) => r && r.id === roleId
        )
      : -1;
    if (roleIndex === -1) {
      throw new Error(
        `Role with ID ${roleId} not found`
      );
    }
    mockRoles[roleIndex] = {
      ...mockRoles[roleIndex],
      permissions: JSON.stringify(permissions),
      permissionList: permissions,
    };
  },

  // Add user to role
  addUserToRole: async (
    roleId: number,
    userId: number
  ): Promise<void> => {
    console.log(
      `Using mock role service - addUserToRole(${roleId}, ${userId})`
    );
    await delay(500);

    try {
      // Fetch user data from the mock API
      const response = await fetch('/api/Users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      const userToAdd = users.find(
        (u: any) => u.id === userId
      );

      if (!userToAdd) {
        throw new Error(
          `User with ID ${userId} not found`
        );
      }

      // Check if the user is already in the role
      if (
        mockUsersInRoles[roleId]?.some(
          (u) => u.id === userId
        )
      ) {
        console.log(
          `User ${userId} is already in role ${roleId}`
        );
        return;
      }

      // Add user to role
      const userInRole: UserInRole = {
        id: userToAdd.id,
        userName: userToAdd.userName,
        email: userToAdd.email,
        isActive: userToAdd.isActive,
      };

      // Initialize the array if it doesn't exist
      if (!mockUsersInRoles[roleId]) {
        mockUsersInRoles[roleId] = [];
      }

      // Add the user to the role
      mockUsersInRoles[roleId].push(userInRole);
      console.log(
        `Mock: Added user ${userId} to role ${roleId}`
      );

      // Log the operation for audit purposes
      const timestamp = new Date().toISOString();
      console.log(
        `[AUDIT] ${timestamp} - User ${userId} added to role ${roleId}`
      );
    } catch (error) {
      console.error(
        'Error adding user to role:',
        error
      );
      throw error;
    }
  },

  // Remove user from role
  removeUserFromRole: async (
    roleId: number,
    userId: number
  ): Promise<void> => {
    console.log(
      `Using mock role service - removeUserFromRole(${roleId}, ${userId})`
    );
    await delay(500);

    try {
      // Check if the role exists
      if (!mockUsersInRoles[roleId]) {
        throw new Error(
          `Role with ID ${roleId} not found or has no users`
        );
      }

      // Check if the user is in the role
      const userIndex = mockUsersInRoles[
        roleId
      ].findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        throw new Error(
          `User ${userId} is not in role ${roleId}`
        );
      }

      // Remove the user from the role
      mockUsersInRoles[roleId].splice(
        userIndex,
        1
      );
      console.log(
        `Mock: Removed user ${userId} from role ${roleId}`
      );

      // Log the operation for audit purposes
      const timestamp = new Date().toISOString();
      console.log(
        `[AUDIT] ${timestamp} - User ${userId} removed from role ${roleId}`
      );
    } catch (error) {
      console.error(
        'Error removing user from role:',
        error
      );
      throw error;
    }
  },

  // Delete a role
  deleteRole: async (
    roleId: number
  ): Promise<void> => {
    console.log(
      `Using mock role service - deleteRole(${roleId})`
    );
    await delay(500);
    const roleIndex = Array.isArray(mockRoles)
      ? mockRoles.findIndex(
          (r) => r && r.id === roleId
        )
      : -1;
    if (roleIndex === -1) {
      throw new Error(
        `Role with ID ${roleId} not found`
      );
    }
    mockRoles.splice(roleIndex, 1);
  },
};

export default mockRoleService;
