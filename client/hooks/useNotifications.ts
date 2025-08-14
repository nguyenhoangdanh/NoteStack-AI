import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services';
import type { Notification } from '@/types';

// Query Keys
const QUERY_KEYS = {
  notifications: {
    all: ['notifications'] as const,
    list: (isRead?: boolean) => ['notifications', 'list', { isRead }] as const,
  },
} as const;

// Get Notifications
export function useNotifications(isRead?: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.list(isRead),
    queryFn: () => notificationService.getAll(isRead),
  });
}

// Mark Notification Read
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
}

// Mark All Notifications Read
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
}

// Delete Notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
}
