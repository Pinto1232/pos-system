import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Mock user permissions mapping
const mockUserPermissions: Record<string, string[]> = {
  '1': [ // Admin user
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
  '2': [ // Manager user
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
  '3': [ // Cashier user
    'sales.create',
    'products.view',
    'customers.view',
    'customers.create',
    'transactions.create',
  ],
  '4': [ // Inventory user
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'inventory.view',
    'inventory.edit',
    'inventory.reports',
  ],
  '5': [ // Manager user (Sarah)
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
  '6': [], // New user with no permissions yet
  '7': [], // New user with no permissions yet
};

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  const params = await context.params;
  const userId = params.userId;

  try {
    // Check if we should use mock data (from environment variable)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(`Proxying GET request to backend for user permissions: ${userId}`);

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Permissions/User/${userId}`,
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
        console.log('Successfully fetched user permissions from backend');
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
    return NextResponse.json(mockUserPermissions[userId] || []);
  } catch (error) {
    console.error('Error proxying request to backend:', error);
    // Return mock data for development
    return NextResponse.json(mockUserPermissions[userId] || []);
  }
}
