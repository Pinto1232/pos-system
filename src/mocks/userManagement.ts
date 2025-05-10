import {
  User,
  Role,
  Permission,
  SecuritySettings,
} from '@/types/userManagement';

// Mock users for development and fallback
export const mockUsers: User[] = [
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
  {
    id: 3,
    username: 'cashier',
    email: 'cashier@pisvaltech.com',
    isActive: true,
    createdAt: '2023-03-10T00:00:00Z',
    lastLogin: '2023-05-15T09:15:00Z',
    roles: ['Cashier'],
    permissions: [
      'sales.create',
      'products.view',
    ],
  },
];

// Mock roles for development and fallback
export const mockRoles: Role[] = [
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
      'roles.view',
      'roles.create',
      'roles.edit',
      'roles.delete',
      'products.view',
      'products.create',
      'products.edit',
      'products.delete',
      'sales.view',
      'sales.create',
    ],
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Store management access',
    isSystemRole: false,
    userCount: 1,
    permissions: [
      'users.view',
      'products.view',
      'products.edit',
      'sales.view',
      'sales.create',
    ],
  },
  {
    id: 3,
    name: 'Cashier',
    description: 'Sales and basic product access',
    isSystemRole: false,
    userCount: 1,
    permissions: [
      'products.view',
      'sales.create',
    ],
  },
];

// Mock permissions for development and fallback
export const mockPermissions: Permission[] = [
  {
    id: 1,
    name: 'View Users',
    code: 'users.view',
    description: 'Can view users',
    module: 'User Management',
    isActive: true,
  },
  {
    id: 2,
    name: 'Create Users',
    code: 'users.create',
    description: 'Can create users',
    module: 'User Management',
    isActive: true,
  },
  {
    id: 3,
    name: 'Edit Users',
    code: 'users.edit',
    description: 'Can edit users',
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
    description: 'Can view products',
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

// Mock modules for development and fallback
export const mockModules: string[] = [
  'User Management',
  'Product Management',
  'Sales',
  'Reporting',
];

// Mock security settings for development and fallback
export const mockSecuritySettings: SecuritySettings =
  {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiryDays: 90,
    },
    loginPolicy: {
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 30,
      sessionTimeoutMinutes: 60,
      requireMfa: false,
    },
  };
