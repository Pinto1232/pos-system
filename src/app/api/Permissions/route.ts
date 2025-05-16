import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Mock permissions data with categories and descriptions
const mockPermissions = [
  // User Management Permissions
  {
    id: 1,
    name: 'users.view',
    displayName: 'View Users',
    description: 'View user accounts and profiles',
    category: 'User Management',
  },
  {
    id: 2,
    name: 'users.create',
    displayName: 'Create Users',
    description: 'Create new user accounts',
    category: 'User Management',
  },
  {
    id: 3,
    name: 'users.edit',
    displayName: 'Edit Users',
    description: 'Edit existing user accounts',
    category: 'User Management',
  },
  {
    id: 4,
    name: 'users.delete',
    displayName: 'Delete Users',
    description: 'Delete user accounts',
    category: 'User Management',
  },
  
  // Role Management Permissions
  {
    id: 5,
    name: 'roles.view',
    displayName: 'View Roles',
    description: 'View roles and permissions',
    category: 'Role Management',
  },
  {
    id: 6,
    name: 'roles.create',
    displayName: 'Create Roles',
    description: 'Create new roles',
    category: 'Role Management',
  },
  {
    id: 7,
    name: 'roles.edit',
    displayName: 'Edit Roles',
    description: 'Edit existing roles',
    category: 'Role Management',
  },
  {
    id: 8,
    name: 'roles.delete',
    displayName: 'Delete Roles',
    description: 'Delete roles',
    category: 'Role Management',
  },
  
  // System Configuration Permissions
  {
    id: 9,
    name: 'system.configure',
    displayName: 'Configure System',
    description: 'Configure system settings',
    category: 'System',
  },
  
  // Reports Permissions
  {
    id: 10,
    name: 'reports.view',
    displayName: 'View Reports',
    description: 'View reports',
    category: 'Reports',
  },
  {
    id: 11,
    name: 'reports.create',
    displayName: 'Create Reports',
    description: 'Create new reports',
    category: 'Reports',
  },
  {
    id: 12,
    name: 'reports.export',
    displayName: 'Export Reports',
    description: 'Export reports to various formats',
    category: 'Reports',
  },
  {
    id: 13,
    name: 'reports.all',
    displayName: 'All Reports Access',
    description: 'Full access to all reports',
    category: 'Reports',
  },
  
  // Transaction Permissions
  {
    id: 14,
    name: 'transactions.create',
    displayName: 'Create Transactions',
    description: 'Create new transactions',
    category: 'Transactions',
  },
  {
    id: 15,
    name: 'transactions.approve',
    displayName: 'Approve Transactions',
    description: 'Approve transactions',
    category: 'Transactions',
  },
  {
    id: 16,
    name: 'transactions.void',
    displayName: 'Void Transactions',
    description: 'Void transactions',
    category: 'Transactions',
  },
  {
    id: 17,
    name: 'transactions.all',
    displayName: 'All Transaction Access',
    description: 'Full access to all transactions',
    category: 'Transactions',
  },
  
  // Inventory Permissions
  {
    id: 18,
    name: 'inventory.view',
    displayName: 'View Inventory',
    description: 'View inventory items',
    category: 'Inventory',
  },
  {
    id: 19,
    name: 'inventory.edit',
    displayName: 'Edit Inventory',
    description: 'Edit inventory items',
    category: 'Inventory',
  },
  {
    id: 20,
    name: 'inventory.reports',
    displayName: 'Inventory Reports',
    description: 'Access to inventory reports',
    category: 'Inventory',
  },
  {
    id: 21,
    name: 'inventory.all',
    displayName: 'All Inventory Access',
    description: 'Full access to all inventory functions',
    category: 'Inventory',
  },
  
  // Product Permissions
  {
    id: 22,
    name: 'products.view',
    displayName: 'View Products',
    description: 'View products',
    category: 'Products',
  },
  {
    id: 23,
    name: 'products.create',
    displayName: 'Create Products',
    description: 'Create new products',
    category: 'Products',
  },
  {
    id: 24,
    name: 'products.edit',
    displayName: 'Edit Products',
    description: 'Edit existing products',
    category: 'Products',
  },
  {
    id: 25,
    name: 'products.delete',
    displayName: 'Delete Products',
    description: 'Delete products',
    category: 'Products',
  },
  
  // Sales Permissions
  {
    id: 26,
    name: 'sales.create',
    displayName: 'Create Sales',
    description: 'Create new sales',
    category: 'Sales',
  },
  
  // Customer Permissions
  {
    id: 27,
    name: 'customers.view',
    displayName: 'View Customers',
    description: 'View customer information',
    category: 'Customers',
  },
  {
    id: 28,
    name: 'customers.create',
    displayName: 'Create Customers',
    description: 'Create new customers',
    category: 'Customers',
  },
  
  // Analytics Permissions
  {
    id: 29,
    name: 'analytics.view',
    displayName: 'View Analytics',
    description: 'View analytics data',
    category: 'Analytics',
  },
  {
    id: 30,
    name: 'analytics.create',
    displayName: 'Create Analytics',
    description: 'Create custom analytics',
    category: 'Analytics',
  },
];

export async function GET(request: Request) {
  try {
    // Check if we should use mock data (from environment variable)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log('Proxying GET request to backend for permissions');

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Permissions`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add a timeout to prevent long waits if backend is down
          signal: AbortSignal.timeout(3000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched permissions from backend');
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    // Return mock data if backend API fails or mock data is enabled
    return NextResponse.json(mockPermissions);
  } catch (error) {
    console.error('Error proxying request to backend:', error);
    // Return mock data for development
    return NextResponse.json(mockPermissions);
  }
}
