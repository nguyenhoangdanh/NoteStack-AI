import { apiClient } from '@/lib/apiClient';
import type {
  NoteVersion,
  VersionTimelineResponse
} from '@/types';

class VersionService {
  async getVersions(noteId: string, limit?: number): Promise<NoteVersion[]> {
    return apiClient.get<NoteVersion[]>(`/versions/notes/${noteId}`, { 
      params: limit ? { limit } : undefined 
    });
  }

  async getVersion(versionId: string): Promise<NoteVersion> {
    return apiClient.get<NoteVersion>(`/versions/${versionId}`);
  }

  async create(noteId: string, data?: { changeLog?: string }) {
    return apiClient.post(`/versions/notes/${noteId}/create`, data);
  }

  async restore(versionId: string) {
    return apiClient.post(`/versions/${versionId}/restore`);
  }

  async compare(versionId: string, compareVersionId: string) {
    return apiClient.get(`/versions/${versionId}/compare/${compareVersionId}`);
  }

  async getTimeline(noteId: string): Promise<VersionTimelineResponse> {
    return apiClient.get<VersionTimelineResponse>(`/versions/notes/${noteId}/timeline`);
  }

  async getUserStats() {
    return apiClient.get('/versions/user/stats');
  }
}

export const versionService = new VersionService();
