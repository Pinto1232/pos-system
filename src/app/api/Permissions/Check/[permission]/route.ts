import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

export async function GET(request: Request, context: { params: { permission: string } }) {
  const params = await context.params;
  const permission = params.permission;

  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization) {
      return NextResponse.json({ hasPermission: false }, { status: 401 });
    }

    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(`Proxying GET request to backend for permission check: ${permission}`);

      const response = await fetch(`${BACKEND_API_URL}/api/KeycloakPermissions/Check/${encodeURIComponent(permission)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },

        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Successfully checked permission ${permission} from backend`);
        return NextResponse.json(data);
      } else {
        console.warn(`Backend API returned status: ${response.status}, serving mock data`);
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    const allowedPermissions = [
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
    ];

    return NextResponse.json({
      hasPermission: allowedPermissions.includes(permission),
    });
  } catch (error) {
    console.error('Error proxying request to backend:', JSON.stringify(error, null, 2));

    return NextResponse.json({
      hasPermission: false,
    });
  }
}
