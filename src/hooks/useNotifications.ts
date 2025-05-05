import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryResult
} from '@tanstack/react-query';
import { 
  getNotifications, 
  markNotificationsAsRead, 
  createNotification,
  markAllNotificationsAsRead
} from '@/api/notificationService';
import { 
  Notification, 
  NotificationResponse, 
  NotificationFilters, 
  MarkAsReadRequest,
  CreateNotificationRequest
} from '@/types/notification';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  filters: (filters: NotificationFilters) => [...notificationKeys.all, 'filters', filters] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
};

// Hook to fetch notifications
export const useNotifications = (
  filters: NotificationFilters = {}
): UseQueryResult<NotificationResponse, Error> => {
  return useQuery({
    queryKey: notificationKeys.filters(filters),
    queryFn: () => getNotifications(filters),
    staleTime: 1000 * 60, // 1 minute
  });
};

// Hook to fetch unread count
export const useUnreadNotificationsCount = (): UseQueryResult<number, Error> => {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: async () => {
      const response = await getNotifications({ status: 'unread', limit: 0 });
      return response.unreadCount;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Hook to mark notifications as read
export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: MarkAsReadRequest) => markNotificationsAsRead(request),
    onSuccess: () => {
      // Invalidate all notification queries to refetch data
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

// Hook to mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate all notification queries to refetch data
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

// Hook to create a new notification
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: CreateNotificationRequest) => createNotification(request),
    onSuccess: () => {
      // Invalidate all notification queries to refetch data
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
