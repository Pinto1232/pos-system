import { NextResponse } from 'next/server';
import { CACHE_TIMES } from '@/app/cache-constants';

// Define the backend API URL
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:5107';

// Mock data for dashboard summary
const mockDashboardSummary = {
  recentSales: [
    {
      id: 1,
      date: new Date().toISOString(),
      customer: 'John Doe',
      amount: 125.99,
      status: 'completed',
      items: 3
    },
    {
      id: 2,
      date: new Date(Date.now() - 3600000).toISOString(),
      customer: 'Jane Smith',
      amount: 89.50,
      status: 'completed',
      items: 2
    },
    {
      id: 3,
      date: new Date(Date.now() - 7200000).toISOString(),
      customer: 'Robert Johnson',
      amount: 210.75,
      status: 'pending',
      items: 5
    }
  ],
  stats: {
    dailySales: 1250.99,
    weeklyRevenue: 8750.50,
    monthlyRevenue: 32500.75,
    totalCustomers: 128,
    totalProducts: 87,
    lowStockItems: 12
  },
  notifications: [
    {
      id: 1,
      type: 'alert',
      message: '12 products are low in stock',
      date: new Date().toISOString()
    },
    {
      id: 2,
      type: 'info',
      message: 'Monthly sales report is ready',
      date: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

export async function GET() {
  try {
    console.log('Fetching dashboard summary data');

    // Create cache control headers
    const headers = {
      'Cache-Control': `s-maxage=${CACHE_TIMES.DASHBOARD}, stale-while-revalidate`,
    };

    // Check if we should use mock data (from environment variable)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (!useMockData) {
      try {
        // Attempt to fetch from backend
        const response = await fetch(
          `${BACKEND_API_URL}/api/Dashboard/summary`,
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
          console.log('Successfully fetched dashboard summary from backend');
          return NextResponse.json(data, { headers });
        } else {
          console.warn(
            `Backend API returned status: ${response.status}, serving mock data`
          );
        }
      } catch (error) {
        console.error('Error fetching from backend:', error);
        console.log('Falling back to mock data');
      }
    } else {
      console.log('Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
    }

    // Return mock data with proper cache headers
    return NextResponse.json(mockDashboardSummary, { headers });
  } catch (error) {
    console.error('Error in dashboard summary API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard summary' },
      { status: 500 }
    );
  }
}
