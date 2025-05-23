import { NextResponse } from 'next/server';
import { MarkAsReadRequest } from '@/types/notification';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Product inventory is running low for Premium Widget',
    type: 'warning',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'unread',
  },
  {
    id: '2',
    title: 'Payment Failed',
    message: 'Transaction #67890 could not be processed',
    type: 'error',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'unread',
  },
  {
    id: '3',
    title: 'System Update',
    message: 'New features available in your dashboard',
    type: 'info',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'unread',
  },
  {
    id: '4',
    title: 'Order Completed',
    message: 'Order #12345 has been successfully processed',
    type: 'success',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'read',
  },
];

export async function POST(request: Request) {
  try {
    const body: MarkAsReadRequest = await request.json();

    if (!body.notificationIds || !Array.isArray(body.notificationIds)) {
      return NextResponse.json(
        {
          error: 'Invalid request. notificationIds array is required.',
        },
        { status: 400 }
      );
    }

    body.notificationIds.forEach((id) => {
      const notification = MOCK_NOTIFICATIONS.find((n) => n.id === id);
      if (notification) {
        notification.status = 'read';
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'Error marking notifications as read:',
      JSON.stringify(error, null, 2)
    );
    return NextResponse.json(
      {
        error: 'Failed to mark notifications as read',
      },
      { status: 500 }
    );
  }
}

export async function PUT() {
  try {
    MOCK_NOTIFICATIONS.forEach((notification) => {
      notification.status = 'read';
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      'Error marking all notifications as read:',
      JSON.stringify(error, null, 2)
    );
    return NextResponse.json(
      {
        error: 'Failed to mark all notifications as read',
      },
      { status: 500 }
    );
  }
}
