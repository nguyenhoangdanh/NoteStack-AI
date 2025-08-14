// Base types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'collaboration' | 'sharing' | 'system' | 'mention';
  isRead: boolean;
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

// Request types
export interface GetNotificationsParams {
  isRead?: boolean;
}

// API response types
export type GetNotificationsResponse = Notification[];

// Form types - No forms needed for notifications (read-only for users)
