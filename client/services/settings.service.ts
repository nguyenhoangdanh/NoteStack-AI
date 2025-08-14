import { apiClient } from '@/lib/apiClient';
import type {
  UpdateSettingsRequest,
  Settings,
  Usage
} from '@/types';

class SettingsService {
  async get(): Promise<Settings> {
    return apiClient.get<Settings>('/settings');
  }

  async update(data: UpdateSettingsRequest): Promise<Settings> {
    return apiClient.patch<Settings>('/settings', data);
  }

  async getUsage(days: number = 30): Promise<Usage[]> {
    return apiClient.get<Usage[]>('/settings/usage', { params: { days } });
  }
}

export const settingsService = new SettingsService();
