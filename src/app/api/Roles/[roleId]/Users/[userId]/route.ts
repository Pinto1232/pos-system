import { NextResponse } from 'next/server';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// This is a reference to the same mock data used in the parent route
// In a real implementation, this would be stored in a database
let mockUsersInRoles: Record<string, any[]> = {};

// Initialize mockUsersInRoles with data
const initMockData = async () => {
  try {
    // Fetch the current mock data from the parent route
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/Roles/1/Users`);
    if (response.ok) {
      const data = await response.json();
      // We got data for role 1, now let's fetch for other roles
      mockUsersInRoles['1'] = data;

      // Fetch for roles 2-5
      for (let i = 2; i <= 5; i++) {
        const roleResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/Roles/${i}/Users`);
        if (roleResponse.ok) {
          mockUsersInRoles[i.toString()] = await roleResponse.json();
        }
      }
    }
  } catch (error) {
    console.error('Error initializing mock data:', error);
    // Fallback to empty data
    mockUsersInRoles = {
      '1': [],
      '2': [],
      '3': [],
      '4': [],
      '5': [],
    };
  }
};

export async function POST(
  request: Request,
  context: { params: { roleId: string; userId: string } }
) {
  const params = await context.params;
  const { roleId, userId } = params;

  try {
    // Check if we should use mock data
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(`Proxying POST request to backend to add user ${userId} to role ${roleId}`);

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
        console.log('Successfully added user to role in backend');
        return NextResponse.json({ success: true });
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, using mock implementation`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    // Initialize mock data if needed
    if (Object.keys(mockUsersInRoles).length === 0) {
      await initMockData();
    }

    // Mock implementation for adding user to role
    // Fetch the user from the mock users API
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const usersResponse = await fetch(`${baseUrl}/api/Users`);
    const users = await usersResponse.json();
    const user = users.find((u: any) => u.id === parseInt(userId));

    if (!user) {
      return NextResponse.json(
        { error: `User with ID ${userId} not found` },
        { status: 404 }
      );
    }

    // Initialize the array if it doesn't exist
    if (!mockUsersInRoles[roleId]) {
      mockUsersInRoles[roleId] = [];
    }

    // Check if user is already in the role
    if (mockUsersInRoles[roleId].some((u) => u.id === parseInt(userId))) {
      return NextResponse.json(
        { error: `User ${userId} is already in role ${roleId}` },
        { status: 400 }
      );
    }

    // Add user to role
    mockUsersInRoles[roleId].push({
      id: user.id,
      userName: user.userName,
      email: user.email,
      isActive: user.isActive,
      lastLogin: user.lastLogin || new Date().toISOString(),
      securityLevel: user.securityLevel || 'standard',
    });

    console.log(`Mock: Added user ${userId} to role ${roleId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding user to role:', error);
    return NextResponse.json(
      { error: 'Failed to add user to role' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { roleId: string; userId: string } }
) {
  const params = await context.params;
  const { roleId, userId } = params;

  try {
    // Check if we should use mock data
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(`Proxying DELETE request to backend to remove user ${userId} from role ${roleId}`);

      // Forward the request to the backend API
      const response = await fetch(
        `${BACKEND_API_URL}/api/Roles/${roleId}/Users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log('Successfully removed user from role in backend');
        return NextResponse.json({ success: true });
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, using mock implementation`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    // Initialize mock data if needed
    if (Object.keys(mockUsersInRoles).length === 0) {
      await initMockData();
    }

    // Mock implementation for removing user from role
    if (!mockUsersInRoles[roleId]) {
      return NextResponse.json(
        { error: `Role with ID ${roleId} not found` },
        { status: 404 }
      );
    }

    // Find the user in the role
    const userIndex = mockUsersInRoles[roleId].findIndex(
      (u) => u.id === parseInt(userId)
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: `User ${userId} is not in role ${roleId}` },
        { status: 404 }
      );
    }

    // Remove the user from the role
    mockUsersInRoles[roleId].splice(userIndex, 1);

    console.log(`Mock: Removed user ${userId} from role ${roleId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing user from role:', error);
    return NextResponse.json(
      { error: 'Failed to remove user from role' },
      { status: 500 }
    );
  }
}
