import { apiClient } from '@/lib/apiClient';
import type {
  ShareLink,
  CreateShareLinkRequest,
  ShareLinkAnalyticsResponse,
  UserStatsResponse
} from '@/types';

class ShareService {
  async createLink(noteId: string, data?: CreateShareLinkRequest): Promise<ShareLink> {
    return apiClient.post<ShareLink>(`/share/notes/${noteId}/create`, data);
  }

  async getLinks(noteId: string): Promise<ShareLink[]> {
    return apiClient.get<ShareLink[]>(`/share/notes/${noteId}/links`);
  }

  async updateLink(shareId: string, data: Partial<CreateShareLinkRequest>): Promise<ShareLink> {
    return apiClient.patch<ShareLink>(`/share/${shareId}`, data);
  }

  async deleteLink(shareId: string): Promise<void> {
    return apiClient.delete<void>(`/share/${shareId}`);
  }

  async accessShared(token: string, password?: string) {
    return apiClient.publicGet(`/share/${token}`, { 
      params: password ? { password } : undefined 
    });
  }

  async getAnalytics(shareId: string): Promise<ShareLinkAnalyticsResponse> {
    return apiClient.get<ShareLinkAnalyticsResponse>(`/share/${shareId}/analytics`);
  }

  async getUserStats(): Promise<UserStatsResponse> {
    return apiClient.get<UserStatsResponse>('/share/user/stats');
  }
}

export const shareService = new ShareService();
