import { NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

const mockRolePermissionsByName: Record<string, string[]> = {
  Admin: [
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
  Manager: [
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
  Cashier: [
    'sales.create',
    'products.view',
    'customers.view',
    'customers.create',
    'transactions.create',
  ],
  'Inventory Manager': [
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'inventory.view',
    'inventory.edit',
    'inventory.reports',
  ],
  'Analytics User': [
    'reports.view',
    'reports.create',
    'reports.export',
    'analytics.view',
    'analytics.create',
  ],
};

export async function GET(
  request: Request,
  context: { params: { roleName: string } }
) {
  const params = await context.params;
  const roleName = decodeURIComponent(params.roleName);

  try {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(
        `Proxying GET request to backend for role permissions by name: ${roleName}`
      );

      const response = await fetch(
        `${BACKEND_API_URL}/api/Permissions/Role/ByName/${encodeURIComponent(roleName)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },

          signal: AbortSignal.timeout(3000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          'Successfully fetched role permissions by name from backend'
        );
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    return NextResponse.json(mockRolePermissionsByName[roleName] || []);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      JSON.stringify(error, null, 2)
    );

    return NextResponse.json(mockRolePermissionsByName[roleName] || []);
  }
}
