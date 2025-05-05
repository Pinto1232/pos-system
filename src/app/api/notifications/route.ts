import { NextResponse } from 'next/server';
import { 
  Notification, 
  NotificationFilters, 
  NotificationResponse 
} from '@/types/notification';

// Mock data for development
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Product inventory is running low for Premium Widget',
    type: 'warning',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'unread',
    link: '/inventory',
    data: {
      productId: '123',
      currentStock: 5,
      minimumRequired: 20,
      lastRestock: '7 days ago',
      salesRate: '10 units/day',
      timeToDepletion: '12 hours'
    },
    tags: ['Urgent', 'Inventory']
  },
  {
    id: '2',
    title: 'Payment Failed',
    message: 'Transaction #67890 could not be processed',
    type: 'error',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'unread',
    link: '/transactions/67890',
    data: {
      orderId: '67890',
      amount: 'R750.00',
      customer: 'Jane Smith',
      errorCode: 402,
      reason: 'Insufficient Funds',
      retryAttempts: '2/3'
    },
    tags: ['Payment', 'Failed']
  },
  {
    id: '3',
    title: 'System Update',
    message: 'New features available in your dashboard',
    type: 'info',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'unread',
    link: '/updates',
    data: {
      version: '2.1.0',
      releaseDate: 'Today',
      newFeatures: 5,
      bugFixes: 12,
      performanceImprovements: 3,
      securityUpdates: 2
    },
    tags: ['Update', 'System']
  },
  {
    id: '4',
    title: 'Order Completed',
    message: 'Order #12345 has been successfully processed',
    type: 'success',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'read',
    link: '/orders/12345',
    data: {
      orderId: '12345',
      customer: 'John Doe',
      amount: 'R1,250.00',
      items: 3
    },
    tags: ['Order', 'Completed']
  }
];

// GET handler for fetching notifications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query parameters
    const filters: NotificationFilters = {
      status: searchParams.get('status') as any || undefined,
      type: searchParams.get('type') as any || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset') as string) : undefined,
    };
    
    // Apply filters to mock data
    let filteredNotifications = [...MOCK_NOTIFICATIONS];
    
    if (filters.status) {
      filteredNotifications = filteredNotifications.filter(n => n.status === filters.status);
    }
    
    if (filters.type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
    }
    
    // Sort by createdAt (newest first)
    filteredNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Apply pagination
    const limit = filters.limit || filteredNotifications.length;
    const offset = filters.offset || 0;
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);
    
    const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.status === 'unread').length;
    
    const response: NotificationResponse = {
      notifications: paginatedNotifications,
      unreadCount,
      totalCount: MOCK_NOTIFICATIONS.length
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
