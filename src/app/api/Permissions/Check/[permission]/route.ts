import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

export async function GET(
  request: Request,
  context: { params: { permission: string } }
) {
  const params = await context.params;
  const permission = params.permission;

  try {
    // Get the authorization header
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization) {
      return NextResponse.json({ hasPermission: false }, { status: 401 });
    }

    // Check if we should use mock data (from environment variable)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(`Proxying GET request to backend for permission check: ${permission}`);

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/KeycloakPermissions/Check/${encodeURIComponent(permission)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization
          },
          // Add a timeout to prevent long waits if backend is down
          signal: AbortSignal.timeout(3000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`Successfully checked permission ${permission} from backend`);
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    // For mock data, check if the permission is in the allowed list
    const allowedPermissions = [
      'users.view', 'users.create', 'users.edit', 'users.delete',
      'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
      'system.configure', 'reports.all', 'transactions.all', 'inventory.all',
      'products.view', 'products.create', 'products.edit', 'products.delete',
      'sales.create', 'customers.view', 'customers.create',
      'analytics.view', 'analytics.create'
    ];

    return NextResponse.json({ 
      hasPermission: allowedPermissions.includes(permission) 
    });
  } catch (error) {
    console.error('Error proxying request to backend:', error);
    // Return false for any error
    return NextResponse.json({ hasPermission: false });
  }
}
