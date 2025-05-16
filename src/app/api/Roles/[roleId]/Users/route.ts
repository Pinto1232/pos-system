import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Mock users in roles data
const mockUsersInRoles: Record<string, any[]> = {
  '1': [
    {
      id: 1,
      userName: 'admin',
      email: 'admin@pisvaltech.com',
      isActive: true,
      lastLogin: new Date().toISOString(),
      securityLevel: 'high',
    },
  ],
  '2': [
    {
      id: 2,
      userName: 'manager',
      email: 'manager@pisvaltech.com',
      isActive: true,
      lastLogin: new Date().toISOString(),
      securityLevel: 'medium',
    },
    {
      id: 5,
      userName: 'sarah',
      email: 'sarah@pisvaltech.com',
      isActive: true,
      lastLogin: new Date().toISOString(),
      securityLevel: 'medium',
    },
  ],
  '3': [
    {
      id: 3,
      userName: 'cashier',
      email: 'cashier@pisvaltech.com',
      isActive: true,
      lastLogin: new Date().toISOString(),
      securityLevel: 'standard',
    },
  ],
  '4': [
    {
      id: 4,
      userName: 'john',
      email: 'john@pisvaltech.com',
      isActive: true,
      lastLogin: new Date().toISOString(),
      securityLevel: 'standard',
    },
  ],
  '5': [], // Analytics User role (empty initially)
};

export async function GET(
  request: Request,
  context: { params: { roleId: string } }
) {
  const params = await context.params;
  const roleId = params.roleId;

  try {
    // Check if we should use mock data (from environment variable)
    const useMockData =
      process.env.NEXT_PUBLIC_USE_MOCK_DATA ===
      'true';

    if (!useMockData) {
      console.log(
        `Proxying GET request to backend for users in role: ${roleId}`
      );

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Roles/${roleId}/Users`,
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
          'Successfully fetched users in role from backend'
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
    return NextResponse.json(
      mockUsersInRoles[roleId] || []
    );
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      error
    );
    // Return mock data for development
    return NextResponse.json(
      mockUsersInRoles[roleId] || []
    );
  }
}

export async function POST(
  request: Request,
  context: { params: { roleId: string } }
) {
  const params = await context.params;
  const roleId = params.roleId;

  try {
    // Get the user ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId =
      pathParts[pathParts.length - 1];

    // Check if we should use mock data
    const useMockData =
      process.env.NEXT_PUBLIC_USE_MOCK_DATA ===
      'true';

    if (!useMockData) {
      console.log(
        `Proxying POST request to backend to add user ${userId} to role ${roleId}`
      );

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Roles/${roleId}/Users/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log(
          'Successfully added user to role in backend'
        );
        return NextResponse.json({
          success: true,
        });
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, using mock implementation`
        );
      }
    } else {
      console.log(
        'Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)'
      );
    }

    // Mock implementation for adding user to role
    // Fetch the user from the mock users API
    const usersResponse = await fetch(
      `${url.origin}/api/Users`
    );
    const users = await usersResponse.json();
    const user = users.find(
      (u: any) => u.id === parseInt(userId)
    );

    if (!user) {
      return NextResponse.json(
        {
          error: `User with ID ${userId} not found`,
        },
        { status: 404 }
      );
    }

    // Initialize the array if it doesn't exist
    if (!mockUsersInRoles[roleId]) {
      mockUsersInRoles[roleId] = [];
    }

    // Check if user is already in the role
    if (
      mockUsersInRoles[roleId].some(
        (u) => u.id === user.id
      )
    ) {
      return NextResponse.json(
        {
          error: `User ${userId} is already in role ${roleId}`,
        },
        { status: 400 }
      );
    }

    // Add user to role
    mockUsersInRoles[roleId].push({
      id: user.id,
      userName: user.userName,
      email: user.email,
      isActive: user.isActive,
      lastLogin:
        user.lastLogin ||
        new Date().toISOString(),
      securityLevel:
        user.securityLevel || 'standard',
    });

    console.log(
      `Mock: Added user ${userId} to role ${roleId}`
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'Error adding user to role:',
      error
    );
    return NextResponse.json(
      { error: 'Failed to add user to role' },
      { status: 500 }
    );
  }
}
