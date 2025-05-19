import { getCacheOptions } from '@/app/caching-config';
import { CACHE_TAGS, CACHE_TIMES } from '@/app/cache-constants';

function getMockDashboardData(): DashboardSummary {
  return {
    recentSales: [
      {
        id: 1,
        date: new Date().toISOString(),
        customer: 'John Doe',
        amount: 125.99,
        status: 'completed',
        items: 3,
      },
      {
        id: 2,
        date: new Date(Date.now() - 3600000).toISOString(),
        customer: 'Jane Smith',
        amount: 89.5,
        status: 'completed',
        items: 2,
      },
      {
        id: 3,
        date: new Date(Date.now() - 7200000).toISOString(),
        customer: 'Robert Johnson',
        amount: 210.75,
        status: 'pending',
        items: 5,
      },
    ],
    stats: {
      dailySales: 1250.99,
      weeklyRevenue: 8750.5,
      monthlyRevenue: 32500.75,
      totalCustomers: 128,
      totalProducts: 87,
      lowStockItems: 12,
    },
    topProducts: [
      {
        id: 1,
        name: 'Premium Package',
        sales: 45,
        revenue: 4500,
        growth: 12.5,
      },
      {
        id: 2,
        name: 'Basic Package',
        sales: 78,
        revenue: 3900,
        growth: 8.3,
      },
      {
        id: 3,
        name: 'Enterprise Solution',
        sales: 18,
        revenue: 9000,
        growth: 23.1,
      },
    ],
    salesByCategory: [
      {
        category: 'Electronics',
        value: 35,
        color: '#3498db',
      },
      {
        category: 'Clothing',
        value: 25,
        color: '#2ecc71',
      },
      {
        category: 'Food',
        value: 20,
        color: '#f1c40f',
      },
      {
        category: 'Books',
        value: 15,
        color: '#e74c3c',
      },
      {
        category: 'Other',
        value: 5,
        color: '#9b59b6',
      },
    ],
    revenueByMonth: [
      {
        month: 'Jan',
        revenue: 15000,
      },
      {
        month: 'Feb',
        revenue: 18000,
      },
      {
        month: 'Mar',
        revenue: 16500,
      },
      {
        month: 'Apr',
        revenue: 21000,
      },
      {
        month: 'May',
        revenue: 19500,
      },
      {
        month: 'Jun',
        revenue: 22500,
      },
    ],
  };
}

export interface DashboardSummary {
  recentSales: {
    id: number;
    date: string;
    customer: string;
    amount: number;
    status: string;
    items: number;
  }[];
  stats: {
    dailySales: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    lowStockItems: number;
  };
  topProducts: {
    id: number;
    name: string;
    sales: number;
    revenue: number;
    growth: number;
  }[];
  salesByCategory: {
    category: string;
    value: number;
    color: string;
  }[];
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  try {
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMockData) {
      console.log(
        'Using mock data for dashboard summary (NEXT_PUBLIC_USE_MOCK_DATA=true)'
      );

      return getMockDashboardData();
    }

    const BACKEND_API_URL =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5107';

    console.log(
      `Fetching dashboard summary from: ${BACKEND_API_URL}/api/Dashboard/summary`
    );

    const cacheOptions = await getCacheOptions(CACHE_TIMES.DASHBOARD, [
      CACHE_TAGS.DASHBOARD,
    ]);

    const response = await fetch(`${BACKEND_API_URL}/api/Dashboard/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...cacheOptions,

      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch dashboard summary: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      'Error fetching dashboard summary:',
      error instanceof Error ? error.message : JSON.stringify(error, null, 2)
    );

    console.log('Returning mock data as fallback due to API error');
    return getMockDashboardData();
  }
}
