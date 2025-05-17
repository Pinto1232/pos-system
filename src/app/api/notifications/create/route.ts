import { NextResponse } from 'next/server';
import { CreateNotificationRequest, Notification } from '@/types/notification';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Product inventory is running low for Premium Widget',
    type: 'warning',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'unread',
    link: '/inventory',
    tags: ['Urgent', 'Inventory'],
  },
  {
    id: '2',
    title: 'Payment Failed',
    message: 'Transaction #67890 could not be processed',
    type: 'error',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'unread',
    link: '/transactions/67890',
    tags: ['Payment', 'Failed'],
  },
  {
    id: '3',
    title: 'System Update',
    message: 'New features available in your dashboard',
    type: 'info',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'unread',
    link: '/updates',
    tags: ['Update', 'System'],
  },
  {
    id: '4',
    title: 'Order Completed',
    message: 'Order #12345 has been successfully processed',
    type: 'success',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'read',
    link: '/orders/12345',
    tags: ['Order', 'Completed'],
  },
];

export async function POST(request: Request) {
  try {
    const body: CreateNotificationRequest = await request.json();

    if (!body.title || !body.message || !body.type) {
      return NextResponse.json(
        {
          error: 'Invalid request. title, message, and type are required.',
        },
        { status: 400 }
      );
    }

    const newNotification: Notification = {
      id: String(MOCK_NOTIFICATIONS.length + 1),
      title: body.title,
      message: body.message,
      type: body.type,
      createdAt: new Date().toISOString(),
      status: 'unread',
      link: body.link,
      data: body.data,
      tags: body.tags,
    };

    MOCK_NOTIFICATIONS.unshift(newNotification);

    return NextResponse.json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', JSON.stringify(error, null, 2));
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
