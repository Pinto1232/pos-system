import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// This function fetches all permissions and filters by category
async function getPermissionsByCategory(category: string) {
  try {
    // Fetch all permissions from our mock API
    const url = new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    const response = await fetch(`${url.origin}/api/Permissions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }
    
    const allPermissions = await response.json();
    
    // Filter permissions by category
    return allPermissions.filter((permission: any) => 
      permission.category === category
    );
  } catch (error) {
    console.error('Error fetching permissions by category:', error);
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
    // Check if we should use mock data (from environment variable)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(`Proxying GET request to backend for permissions in category: ${category}`);

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Permissions/ByCategory/${encodeURIComponent(category)}`,
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
        console.log('Successfully fetched permissions by category from backend');
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    // Get permissions by category from our mock data
    const permissions = await getPermissionsByCategory(category);
    return NextResponse.json(permissions);
  } catch (error) {
    console.error('Error proxying request to backend:', error);
    
    // Get permissions by category from our mock data as fallback
    const permissions = await getPermissionsByCategory(category);
    return NextResponse.json(permissions);
  }
}
