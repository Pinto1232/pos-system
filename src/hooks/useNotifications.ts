import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  getNotifications,
  markNotificationsAsRead,
  createNotification,
  markAllNotificationsAsRead,
} from '@/api/notificationService';
import {
  Notification,
  NotificationResponse,
  NotificationFilters,
  MarkAsReadRequest,
  CreateNotificationRequest,
} from '@/types/notification';

export const notificationKeys = {
  all: ['notifications'] as const,
  filters: (filters: NotificationFilters) =>
    [...notificationKeys.all, 'filters', filters] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
};

export const useNotifications = (
  filters: NotificationFilters = {}
): UseQueryResult<NotificationResponse, Error> => {
  return useQuery({
    queryKey: notificationKeys.filters(filters),
    queryFn: () => getNotifications(filters),
    staleTime: 1000 * 60,
  });
};

export const useUnreadNotificationsCount = (): UseQueryResult<
  number,
  Error
> => {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: async () => {
      const response = await getNotifications({
        status: 'unread',
        limit: 0,
      });
      return response.unreadCount;
    },
    staleTime: 1000 * 30,
  });
};

export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MarkAsReadRequest) =>
      markNotificationsAsRead(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<Notification, Error, CreateNotificationRequest>({
    mutationFn: (request: CreateNotificationRequest) =>
      createNotification(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};
