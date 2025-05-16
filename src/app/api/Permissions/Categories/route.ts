import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Mock permission categories
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
    // Check if we should use mock data (from environment variable)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log('Proxying GET request to backend for permission categories');

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Permissions/Categories`,
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

    // Return mock data if backend API fails or mock data is enabled
    return NextResponse.json(mockPermissionCategories);
  } catch (error) {
    console.error('Error proxying request to backend:', error);
    // Return mock data for development
    return NextResponse.json(mockPermissionCategories);
  }
}
