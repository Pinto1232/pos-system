'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  useNotifications,
  useMarkNotificationsAsRead,
  useMarkAllNotificationsAsRead,
  useCreateNotification,
  useUnreadNotificationsCount,
} from '@/hooks/useNotifications';
import {
  Notification,
  NotificationFilters,
  CreateNotificationRequest,
} from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationIds: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  createNotification: (
    notification: CreateNotificationRequest
  ) => Promise<Notification>;
  refreshNotifications: () => void;
  filters: NotificationFilters;
  setFilters: (filters: NotificationFilters) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [filters, setFilters] = useState<NotificationFilters>({ limit: 10 });

  const { data, isLoading, error, refetch } = useNotifications(filters);

  const unreadCountQuery = useUnreadNotificationsCount();

  const markAsReadMutation = useMarkNotificationsAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const createNotificationMutation = useCreateNotification();

  const markAsRead = React.useCallback(
    async (notificationIds: string[]): Promise<void> => {
      await markAsReadMutation.mutateAsync({
        notificationIds,
      });
    },
    [markAsReadMutation]
  );

  const markAllAsRead = React.useCallback(async (): Promise<void> => {
    await markAllAsReadMutation.mutateAsync();
  }, [markAllAsReadMutation]);

  const addNotification = React.useCallback(
    async (notification: CreateNotificationRequest): Promise<Notification> => {
      return await createNotificationMutation.mutateAsync(notification);
    },
    [createNotificationMutation]
  );

  const refreshNotifications = React.useCallback(() => {
    refetch();
    unreadCountQuery.refetch();
  }, [refetch, unreadCountQuery]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshNotifications();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [refreshNotifications]);

  const value = React.useMemo(
    () => ({
      notifications: data?.notifications || [],
      unreadCount: unreadCountQuery.data || 0,
      totalCount: data?.totalCount || 0,
      isLoading,
      error: error || null,
      markAsRead,
      markAllAsRead,
      createNotification: addNotification,
      refreshNotifications,
      filters,
      setFilters,
    }),
    [
      data?.notifications,
      data?.totalCount,
      unreadCountQuery.data,
      isLoading,
      error,
      markAsRead,
      markAllAsRead,
      addNotification,
      refreshNotifications,
      filters,
      setFilters,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    );
  }
  return context;
};
