import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Mock role permissions mapping
const mockRolePermissions: Record<string, string[]> = {
  '1': [ // Admin
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
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'sales.create',
    'customers.view',
    'customers.create',
    'analytics.view',
    'analytics.create',
  ],
  '2': [ // Manager
    'users.view',
    'users.create',
    'users.edit',
    'roles.view',
    'reports.view',
    'reports.create',
    'reports.export',
    'transactions.approve',
    'transactions.void',
    'inventory.view',
    'inventory.edit',
    'inventory.reports',
    'products.view',
    'products.create',
    'products.edit',
    'sales.create',
    'customers.view',
    'customers.create',
    'analytics.view',
  ],
  '3': [ // Cashier
    'sales.create',
    'products.view',
    'customers.view',
    'customers.create',
    'transactions.create',
  ],
  '4': [ // Inventory Manager
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'inventory.view',
    'inventory.edit',
    'inventory.reports',
  ],
  '5': [ // Analytics User
    'reports.view',
    'reports.create',
    'reports.export',
    'analytics.view',
    'analytics.create',
  ],
};

export async function GET(
  request: Request,
  context: { params: { roleId: string } }
) {
  const params = await context.params;
  const roleId = params.roleId;

  try {
    // Check if we should use mock data (from environment variable)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(`Proxying GET request to backend for role permissions: ${roleId}`);

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Permissions/Role/${roleId}`,
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
        console.log('Successfully fetched role permissions from backend');
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
    return NextResponse.json(mockRolePermissions[roleId] || []);
  } catch (error) {
    console.error('Error proxying request to backend:', error);
    // Return mock data for development
    return NextResponse.json(mockRolePermissions[roleId] || []);
  }
}

export async function PUT(
  request: Request,
  context: { params: { roleId: string } }
) {
  const params = await context.params;
  const roleId = params.roleId;

  try {
    // Get the permissions from the request body
    const permissions = await request.json();

    // Check if we should use mock data
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(`Proxying PUT request to backend for role permissions: ${roleId}`);

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Permissions/Role/${roleId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(permissions),
        }
      );

      if (response.ok) {
        console.log('Successfully updated role permissions in backend');
        return NextResponse.json({ success: true });
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, using mock implementation`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    // Update the mock data
    mockRolePermissions[roleId] = permissions;

    console.log(`Mock: Updated permissions for role ${roleId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating role permissions:', error);
    return NextResponse.json(
      { error: 'Failed to update role permissions' },
      { status: 500 }
    );
  }
}
