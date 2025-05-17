import {
  Role,
  RoleCreateRequest,
  RoleUpdateRequest,
  UserInRole,
} from './roleService';

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
    permissionList: ['users.view', 'users.create', 'users.edit', 'roles.view'],
  },
  {
    id: 3,
    name: 'Cashier',
    normalizedName: 'CASHIER',
    permissions: JSON.stringify(['sales.create', 'products.view']),
    permissionList: ['sales.create', 'products.view'],
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

const mockUsersInRoles: Record<number, UserInRole[]> = {
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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockRoleService = {
  getAllRoles: async (): Promise<Role[]> => {
    console.log('Using mock role service - getAllRoles');
    await delay(500);
    return [...mockRoles];
  },

  getRoleById: async (roleId: number): Promise<Role> => {
    console.log(`Using mock role service - getRoleById(${roleId})`);
    await delay(300);
    const role = Array.isArray(mockRoles)
      ? mockRoles.find((r) => r && r.id === roleId)
      : undefined;
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    return { ...role };
  },

  getRoleByName: async (roleName: string): Promise<Role> => {
    console.log(`Using mock role service - getRoleByName(${roleName})`);
    await delay(300);
    const role = Array.isArray(mockRoles)
      ? mockRoles.find((r) => r && r.name === roleName)
      : undefined;
    if (!role) {
      throw new Error(`Role with name ${roleName} not found`);
    }
    return { ...role };
  },

  getUsersInRole: async (roleId: number): Promise<UserInRole[]> => {
    console.log(`Using mock role service - getUsersInRole(${roleId})`);
    await delay(400);
    const users = mockUsersInRoles[roleId];
    if (!users) {
      return [];
    }
    return [...users];
  },

  createRole: async (roleData: RoleCreateRequest): Promise<Role> => {
    console.log(
      `Using mock role service - createRole(${JSON.stringify(roleData)})`
    );
    await delay(600);
    const newRole: Role = {
      id: Math.max(...mockRoles.map((r) => r.id)) + 1,
      name: roleData.name,
      normalizedName: roleData.name.toUpperCase(),
      permissions: JSON.stringify(roleData.permissions || []),
      permissionList: roleData.permissions || [],
    };
    mockRoles.push(newRole);
    return { ...newRole };
  },

  updateRole: async (
    roleId: number,
    roleData: RoleUpdateRequest
  ): Promise<void> => {
    console.log(
      `Using mock role service - updateRole(${roleId}, ${JSON.stringify(roleData)})`
    );
    await delay(500);
    const roleIndex = Array.isArray(mockRoles)
      ? mockRoles.findIndex((r) => r && r.id === roleId)
      : -1;
    if (roleIndex === -1) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    mockRoles[roleIndex] = {
      ...mockRoles[roleIndex],
      name: roleData.name,
      normalizedName: roleData.name.toUpperCase(),
      permissions: roleData.permissions
        ? JSON.stringify(roleData.permissions)
        : mockRoles[roleIndex].permissions,
      permissionList:
        roleData.permissions || mockRoles[roleIndex].permissionList,
    };
  },

  updateRolePermissions: async (
    roleId: number,
    permissions: string[]
  ): Promise<void> => {
    console.log(
      `Using mock role service - updateRolePermissions(${roleId}, ${JSON.stringify(permissions)})`
    );
    await delay(500);
    const roleIndex = Array.isArray(mockRoles)
      ? mockRoles.findIndex((r) => r && r.id === roleId)
      : -1;
    if (roleIndex === -1) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    mockRoles[roleIndex] = {
      ...mockRoles[roleIndex],
      permissions: JSON.stringify(permissions),
      permissionList: permissions,
    };
  },

  addUserToRole: async (roleId: number, userId: number): Promise<void> => {
    console.log(
      `Using mock role service - addUserToRole(${roleId}, ${userId})`
    );
    await delay(500);

    try {
      const response = await fetch('/api/Users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      const userToAdd = users.find((u: any) => u.id === userId);

      if (!userToAdd) {
        throw new Error(`User with ID ${userId} not found`);
      }

      if (mockUsersInRoles[roleId]?.some((u) => u.id === userId)) {
        console.log(`User ${userId} is already in role ${roleId}`);
        return;
      }

      const userInRole: UserInRole = {
        id: userToAdd.id,
        userName: userToAdd.userName,
        email: userToAdd.email,
        isActive: userToAdd.isActive,
      };

      if (!mockUsersInRoles[roleId]) {
        mockUsersInRoles[roleId] = [];
      }

      mockUsersInRoles[roleId].push(userInRole);
      console.log(`Mock: Added user ${userId} to role ${roleId}`);

      const timestamp = new Date().toISOString();
      console.log(
        `[AUDIT] ${timestamp} - User ${userId} added to role ${roleId}`
      );
    } catch (error) {
      console.error(
        'Error adding user to role:',
        JSON.stringify(error, null, 2)
      );
      throw error;
    }
  },

  removeUserFromRole: async (roleId: number, userId: number): Promise<void> => {
    console.log(
      `Using mock role service - removeUserFromRole(${roleId}, ${userId})`
    );
    await delay(500);

    try {
      if (!mockUsersInRoles[roleId]) {
        throw new Error(`Role with ID ${roleId} not found or has no users`);
      }

      const userIndex = mockUsersInRoles[roleId].findIndex(
        (u) => u.id === userId
      );
      if (userIndex === -1) {
        throw new Error(`User ${userId} is not in role ${roleId}`);
      }

      mockUsersInRoles[roleId].splice(userIndex, 1);
      console.log(`Mock: Removed user ${userId} from role ${roleId}`);

      const timestamp = new Date().toISOString();
      console.log(
        `[AUDIT] ${timestamp} - User ${userId} removed from role ${roleId}`
      );
    } catch (error) {
      console.error(
        'Error removing user from role:',
        JSON.stringify(error, null, 2)
      );
      throw error;
    }
  },

  deleteRole: async (roleId: number): Promise<void> => {
    console.log(`Using mock role service - deleteRole(${roleId})`);
    await delay(500);
    const roleIndex = Array.isArray(mockRoles)
      ? mockRoles.findIndex((r) => r && r.id === roleId)
      : -1;
    if (roleIndex === -1) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
    mockRoles.splice(roleIndex, 1);
  },
};

export default mockRoleService;
