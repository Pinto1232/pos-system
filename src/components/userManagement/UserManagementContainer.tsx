'use client';

import React from 'react';
import { UserManagementProvider } from '@/contexts/UserManagementContext';
import UserManagement from './UserManagement';
import {
  Box,
  CircularProgress,
} from '@mui/material';

// Mock data for development
const mockUsers = [
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

const mockRoles = [
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

const mockPermissions = [
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

// Override the UserManagementProvider with a simplified version for the Settings Modal
class MockUserManagementProvider extends React.Component<{
  children: React.ReactNode;
}> {
  render() {
    return (
      <UserManagementProvider>
        {this.props.children}
      </UserManagementProvider>
    );
  }
}

// Export mock data for testing
export { mockUsers, mockRoles, mockPermissions };

const UserManagementContainer: React.FC = () => {
  // If the component fails to load properly, this will ensure we still see something
  try {
    return (
      <MockUserManagementProvider>
        <UserManagement />
      </MockUserManagementProvider>
    );
  } catch (error) {
    console.error(
      'Error rendering UserManagement:',
      error
    );
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <div>Loading User Management...</div>
      </Box>
    );
  }
};

export default UserManagementContainer;
