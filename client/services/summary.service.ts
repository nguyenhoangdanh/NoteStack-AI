import { apiClient } from '@/lib/apiClient';
import type {
  AutoSummary,
  GenerateSummaryRequest
} from '@/types';

class SummaryService {
  async get(noteId: string): Promise<AutoSummary> {
    return apiClient.get<AutoSummary>(`/summaries/notes/${noteId}`);
  }

  async generate(noteId: string, data?: GenerateSummaryRequest): Promise<AutoSummary> {
    return apiClient.post<AutoSummary>(`/summaries/notes/${noteId}/generate`, data);
  }

  async delete(noteId: string): Promise<void> {
    return apiClient.delete<void>(`/summaries/notes/${noteId}`);
  }

  async batchGenerate(data: {
    noteIds: string[];
    model?: string;
    skipExisting?: boolean;
  }): Promise<{ jobId: string; notesQueued: number; estimatedTime: string; message: string }> {
    return apiClient.post('/summaries/batch', data);
  }

  async queue(noteId: string) {
    return apiClient.post(`/summaries/notes/${noteId}/queue`);
  }

  async getStats() {
    return apiClient.get('/summaries/user/stats');
  }
}

export const summaryService = new SummaryService();
