import { NextResponse } from 'next/server';

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

const mockPermissionCategories = [
  'User Management',
  'Role Management',
  'System',
  'Reports',
  'Transactions',
  'Inventory',
  'Products',
  'Sales',
  'Customers',
  'Analytics',
];

export async function GET(request: Request) {
  try {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log('Proxying GET request to backend for permission categories');

      const response = await fetch(
        `${BACKEND_API_URL}/api/Permissions/Categories`,
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
        console.log('Successfully fetched permission categories from backend');
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    return NextResponse.json(mockPermissionCategories);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      JSON.stringify(error, null, 2)
    );

    return NextResponse.json(mockPermissionCategories);
  }
}
