export type NotificationType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type NotificationStatus =
  | 'read'
  | 'unread';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  status: NotificationStatus;
  link?: string;
  data?: Record<string, unknown>;
  tags?: string[];
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
}

export interface NotificationFilters {
  status?: NotificationStatus;
  type?: NotificationType;
  limit?: number;
  offset?: number;
}

export interface MarkAsReadRequest {
  notificationIds: string[];
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  data?: Record<string, unknown>;
  tags?: string[];
}
