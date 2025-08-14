import { apiClient } from '@/lib/apiClient';
import type {
  Notification
} from '@/types';

class NotificationService {
  async getAll(isRead?: boolean): Promise<Notification[]> {
    return apiClient.get<Notification[]>('/notifications', {
      params: isRead !== undefined ? { isRead } : undefined
    });
  }

  async markRead(id: string): Promise<void> {
    return apiClient.patch<void>(`/notifications/${id}/read`);
  }

  async markAllRead(): Promise<void> {
    return apiClient.patch<void>('/notifications/mark-all-read');
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/notifications/${id}`);
  }
}

export const notificationService = new NotificationService();
