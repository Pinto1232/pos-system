import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

const mockUsers = [
  {
    id: 1,
    userName: 'admin',
    email: 'admin@pisvaltech.com',
    isActive: true,
    roles: ['Admin'],
    transactionLimit: 10000,
    securityLevel: 'high',
    requiresMFA: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: 2,
    userName: 'manager',
    email: 'manager@pisvaltech.com',
    isActive: true,
    roles: ['Manager'],
    transactionLimit: 5000,
    securityLevel: 'medium',
    requiresMFA: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: 3,
    userName: 'cashier',
    email: 'cashier@pisvaltech.com',
    isActive: true,
    roles: ['Cashier'],
    transactionLimit: 1000,
    securityLevel: 'standard',
    requiresMFA: false,
    lastLogin: new Date().toISOString(),
  },
  {
    id: 4,
    userName: 'john',
    email: 'john@pisvaltech.com',
    isActive: true,
    roles: ['Inventory Manager'],
    transactionLimit: 2000,
    securityLevel: 'standard',
    requiresMFA: false,
    lastLogin: new Date().toISOString(),
  },
  {
    id: 5,
    userName: 'sarah',
    email: 'sarah@pisvaltech.com',
    isActive: true,
    roles: ['Manager'],
    transactionLimit: 5000,
    securityLevel: 'medium',
    requiresMFA: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: 6,
    userName: 'alex',
    email: 'alex@pisvaltech.com',
    isActive: true,
    roles: [],
    transactionLimit: 0,
    securityLevel: 'low',
    requiresMFA: false,
    lastLogin: null,
  },
  {
    id: 7,
    userName: 'emma',
    email: 'emma@pisvaltech.com',
    isActive: true,
    roles: [],
    transactionLimit: 0,
    securityLevel: 'low',
    requiresMFA: false,
    lastLogin: null,
  },
];

export async function GET(request: Request) {
  try {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      console.log('Proxying GET request to backend for users');

      const response = await fetch(`${BACKEND_API_URL}/api/Users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched users from backend');
        return NextResponse.json(data);
      } else {
        console.warn(`Backend API returned status: ${response.status}, serving mock data`);
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    return NextResponse.json(mockUsers);
  } catch (error) {
    console.error('Error proxying request to backend:', JSON.stringify(error, null, 2));

    return NextResponse.json(mockUsers);
  }
}
