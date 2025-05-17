import axios from 'axios';
import {
  Notification,
  NotificationResponse,
  NotificationFilters,
  MarkAsReadRequest,
  CreateNotificationRequest,
} from '@/types/notification';

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
      timeToDepletion: '12 hours',
    },
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
    data: {
      orderId: '67890',
      amount: 'R750.00',
      customer: 'Jane Smith',
      errorCode: 402,
      reason: 'Insufficient Funds',
      retryAttempts: '2/3',
    },
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
    data: {
      version: '2.1.0',
      releaseDate: 'Today',
      newFeatures: 5,
      bugFixes: 12,
      performanceImprovements: 3,
      securityUpdates: 2,
    },
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
    data: {
      orderId: '12345',
      customer: 'John Doe',
      amount: 'R1,250.00',
      items: 3,
    },
    tags: ['Order', 'Completed'],
  },
];

const API_ENDPOINTS = {
  GET_NOTIFICATIONS: '/api/notifications',
  MARK_AS_READ: '/api/notifications/mark-read',
  CREATE_NOTIFICATION: '/api/notifications/create',
};

export const getNotifications = async (
  filters: NotificationFilters = {}
): Promise<NotificationResponse> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      let filteredNotifications = Array.isArray(MOCK_NOTIFICATIONS)
        ? [...MOCK_NOTIFICATIONS]
        : [];

      if (filters.status) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n && n.status === filters.status
        );
      }

      if (filters.type) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n && n.type === filters.type
        );
      }

      filteredNotifications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const limit = filters.limit || filteredNotifications.length;
      const offset = filters.offset || 0;
      const paginatedNotifications = filteredNotifications.slice(
        offset,
        offset + limit
      );

      const unreadCount = Array.isArray(MOCK_NOTIFICATIONS)
        ? MOCK_NOTIFICATIONS.filter((n) => n && n.status === 'unread').length
        : 0;

      return {
        notifications: paginatedNotifications,
        unreadCount,
        totalCount: MOCK_NOTIFICATIONS.length,
      };
    }

    const { data } = await axios.get(API_ENDPOINTS.GET_NOTIFICATIONS, {
      params: filters,
    });
    return data;
  } catch (error) {
    console.error(
      'Error fetching notifications:',
      JSON.stringify(error, null, 2)
    );
    throw error;
  }
};

export const markNotificationsAsRead = async (
  request: MarkAsReadRequest
): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      if (Array.isArray(request.notificationIds)) {
        request.notificationIds.forEach((id) => {
          if (!id) return;

          const notification = Array.isArray(MOCK_NOTIFICATIONS)
            ? MOCK_NOTIFICATIONS.find((n) => n && n.id === id)
            : undefined;

          if (notification) {
            notification.status = 'read';
          }
        });
      }
      return;
    }

    await axios.post(API_ENDPOINTS.MARK_AS_READ, request);
  } catch (error) {
    console.error(
      'Error marking notifications as read:',
      JSON.stringify(error, null, 2)
    );
    throw error;
  }
};

export const createNotification = async (
  request: CreateNotificationRequest
): Promise<Notification> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const newNotification: Notification = {
        id: String(MOCK_NOTIFICATIONS.length + 1),
        title: request.title,
        message: request.message,
        type: request.type,
        createdAt: new Date().toISOString(),
        status: 'unread',
        link: request.link,
        data: request.data,
        tags: request.tags,
      };

      MOCK_NOTIFICATIONS.unshift(newNotification);
      return newNotification;
    }

    const { data } = await axios.post(
      API_ENDPOINTS.CREATE_NOTIFICATION,
      request
    );
    return data;
  } catch (error) {
    console.error(
      'Error creating notification:',
      JSON.stringify(error, null, 2)
    );
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      if (Array.isArray(MOCK_NOTIFICATIONS)) {
        MOCK_NOTIFICATIONS.forEach((notification) => {
          if (notification) {
            notification.status = 'read';
          }
        });
      }
      return;
    }

    await axios.post(`${API_ENDPOINTS.MARK_AS_READ}/all`);
  } catch (error) {
    console.error(
      'Error marking all notifications as read:',
      JSON.stringify(error, null, 2)
    );
    throw error;
  }
};
