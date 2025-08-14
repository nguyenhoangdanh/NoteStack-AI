import { apiClient } from '@/lib/apiClient';
import type {
  UserActivity
} from '@/types';

class ActivityService {
  async getAll(params?: {
    noteId?: string;
    action?: string;
    limit?: number;
  }): Promise<UserActivity[]> {
    return apiClient.get<UserActivity[]>('/activities', { params });
  }

  async track(data: {
    action: string;
    noteId?: string;
    metadata?: any;
  }) {
    return apiClient.post('/activities/track', data);
  }

  async getStats() {
    return apiClient.get('/activities/stats');
  }

  async getTrending(params?: {
    window?: string;
    limit?: number;
  }) {
    return apiClient.get('/activities/trending', { params });
  }
}

export const activityService = new ActivityService();
