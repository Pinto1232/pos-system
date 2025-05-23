import { NextResponse } from 'next/server';

interface Permission {
  id?: number;
  name: string;
  displayName: string;
  category: string;
  description?: string;
}

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

async function getPermissionsByCategory(category: string) {
  try {
    const url = new URL(
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    );
    const response = await fetch(`${url.origin}/api/Permissions`);

    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }

    const allPermissions = await response.json();

    return allPermissions.filter(
      (permission: Permission) => permission.category === category
    );
  } catch (error) {
    console.error(
      'Error fetching permissions by category:',
      JSON.stringify(error, null, 2)
    );
    return [];
  }
}

export async function GET(
  request: Request,
  context: { params: { category: string } }
) {
  const params = await context.params;
  const category = decodeURIComponent(params.category);

  try {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(
        `Proxying GET request to backend for permissions in category: ${category}`
      );

      const response = await fetch(
        `${BACKEND_API_URL}/api/Permissions/ByCategory/${encodeURIComponent(category)}`,
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
          'Successfully fetched permissions by category from backend'
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

    const permissions = await getPermissionsByCategory(category);
    return NextResponse.json(permissions);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      JSON.stringify(error, null, 2)
    );

    const permissions = await getPermissionsByCategory(category);
    return NextResponse.json(permissions);
  }
}
