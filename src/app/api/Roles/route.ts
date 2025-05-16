import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Mock roles data with enhanced business logic
const mockRoles = [
  {
    id: 1,
    name: 'Admin',
    normalizedName: 'ADMIN',
    description:
      'Complete system access with configuration privileges',
    permissions: JSON.stringify([
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
      'system.configure',
      'reports.all',
      'transactions.all',
      'inventory.all',
    ],
    transactionLimit: 10000,
    securityLevel: 'high',
    requiresMFA: true,
    timeRestrictions: null,
    locationRestrictions: null,
  },
  {
    id: 2,
    name: 'Manager',
    normalizedName: 'MANAGER',
    description:
      'Store operations, reporting, and staff management',
    permissions: JSON.stringify([
      'users.view',
      'users.create',
      'users.edit',
      'roles.view',
      'reports.view',
      'reports.create',
      'transactions.approve',
      'inventory.view',
      'inventory.edit',
    ]),
    permissionList: [
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
    transactionLimit: 5000,
    securityLevel: 'medium',
    requiresMFA: true,
    timeRestrictions: null,
    locationRestrictions: null,
  },
  {
    id: 3,
    name: 'Cashier',
    normalizedName: 'CASHIER',
    description:
      'Transaction processing and basic customer service',
    permissions: JSON.stringify([
      'sales.create',
      'products.view',
      'customers.view',
      'customers.create',
      'transactions.create',
    ]),
    permissionList: [
      'sales.create',
      'products.view',
      'customers.view',
      'customers.create',
      'transactions.create',
    ],
    transactionLimit: 1000,
    securityLevel: 'standard',
    requiresMFA: false,
    timeRestrictions: {
      type: 'shift',
      hours: [8, 20], // 8 AM to 8 PM
    },
    locationRestrictions: {
      type: 'store',
      locations: ['main'],
    },
  },
  {
    id: 4,
    name: 'Inventory Manager',
    normalizedName: 'INVENTORY_MANAGER',
    description:
      'Stock management without sales capabilities',
    permissions: JSON.stringify([
      'products.view',
      'products.create',
      'products.edit',
      'products.delete',
      'inventory.view',
      'inventory.edit',
      'inventory.reports',
    ]),
    permissionList: [
      'products.view',
      'products.create',
      'products.edit',
      'products.delete',
      'inventory.view',
      'inventory.edit',
      'inventory.reports',
    ],
    transactionLimit: 2000,
    securityLevel: 'standard',
    requiresMFA: false,
    timeRestrictions: null,
    locationRestrictions: null,
  },
  {
    id: 5,
    name: 'Analytics User',
    normalizedName: 'ANALYTICS_USER',
    description:
      'Access to advanced analytics and reporting',
    permissions: JSON.stringify([
      'reports.view',
      'reports.create',
      'reports.export',
      'analytics.view',
      'analytics.create',
    ]),
    permissionList: [
      'reports.view',
      'reports.create',
      'reports.export',
      'analytics.view',
      'analytics.create',
    ],
    transactionLimit: 0,
    securityLevel: 'medium',
    requiresMFA: true,
    timeRestrictions: null,
    locationRestrictions: null,
    isPremium: true,
  },
];

export async function GET(request: Request) {
  try {
    // Check if we should use mock data (from environment variable)
    const useMockData =
      process.env.NEXT_PUBLIC_USE_MOCK_DATA ===
      'true';

    if (!useMockData) {
      console.log(
        'Proxying GET request to backend for roles'
      );

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Roles`,
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
        console.log(
          'Successfully fetched roles from backend'
        );
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log(
        'Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)'
      );
    }

    // Return mock data if backend API fails or mock data is enabled
    return NextResponse.json(mockRoles);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      error
    );
    // Return mock data for development
    return NextResponse.json(mockRoles);
  }
}
