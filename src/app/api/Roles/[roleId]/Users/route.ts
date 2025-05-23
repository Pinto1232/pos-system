import { NextResponse } from 'next/server';

interface User {
  id: number;
  userName: string;
  email: string;
  isActive: boolean;
  lastLogin: string | null;
  securityLevel: string;
}

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

const mockUsersInRoles: Record<string, User[]> = {
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
  '5': [],
};

export async function GET(
  request: Request,
  context: { params: { roleId: string } }
) {
  const params = await context.params;
  const roleId = params.roleId;

  try {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(
        `Proxying GET request to backend for users in role: ${roleId}`
      );

      const response = await fetch(
        `${BACKEND_API_URL}/api/Roles/${roleId}/Users`,
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
        console.log('Successfully fetched users in role from backend');
        return NextResponse.json(data);
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, serving mock data`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    return NextResponse.json(mockUsersInRoles[roleId] || []);
  } catch (error) {
    console.error(
      'Error proxying request to backend:',
      JSON.stringify(error, null, 2)
    );

    return NextResponse.json(mockUsersInRoles[roleId] || []);
  }
}

export async function POST(
  request: Request,
  context: { params: { roleId: string } }
) {
  const params = await context.params;
  const roleId = params.roleId;

  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];

    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log(
        `Proxying POST request to backend to add user ${userId} to role ${roleId}`
      );

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
        return NextResponse.json({
          success: true,
        });
      } else {
        console.warn(
          `Backend API returned status: ${response.status}, using mock implementation`
        );
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    const usersResponse = await fetch(`${url.origin}/api/Users`);
    const users = await usersResponse.json();
    const user = users.find((u: User) => u.id === parseInt(userId));

    if (!user) {
      return NextResponse.json(
        {
          error: `User with ID ${userId} not found`,
        },
        { status: 404 }
      );
    }

    if (!mockUsersInRoles[roleId]) {
      mockUsersInRoles[roleId] = [];
    }

    if (mockUsersInRoles[roleId].some((u) => u.id === user.id)) {
      return NextResponse.json(
        {
          error: `User ${userId} is already in role ${roleId}`,
        },
        { status: 400 }
      );
    }

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
    console.error('Error adding user to role:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Failed to add user to role' },
      { status: 500 }
    );
  }
}
