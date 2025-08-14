import { apiClient } from '@/lib/apiClient';
import type {
  DuplicateDetectionResponse,
  DuplicateReportsResponse,
  DuplicateReport,
  MergeNotesRequest,
  MergeNotesResponse
} from '@/types';

class DuplicateService {
  async detect(params?: {
    noteId?: string;
    threshold?: number;
    type?: 'CONTENT' | 'TITLE' | 'SEMANTIC' | 'ALL';
  }): Promise<DuplicateDetectionResponse> {
    return apiClient.get<DuplicateDetectionResponse>('/duplicates/detect', { params });
  }

  async getReports(params?: {
    status?: 'PENDING' | 'CONFIRMED' | 'DISMISSED' | 'MERGED';
    type?: string;
    limit?: number;
  }): Promise<DuplicateReportsResponse> {
    return apiClient.get<DuplicateReportsResponse>('/duplicates/reports', { params });
  }

  async createReport(data: {
    originalNoteId: string;
    duplicateNoteId: string;
    similarity: number;
    type: 'CONTENT' | 'TITLE' | 'SEMANTIC';
  }): Promise<{ report: DuplicateReport }> {
    return apiClient.post<{ report: DuplicateReport }>('/duplicates/reports', data);
  }

  async updateReport(id: string, data: {
    status: 'CONFIRMED' | 'DISMISSED' | 'MERGED';
  }): Promise<{ report: Partial<DuplicateReport>; message: string }> {
    return apiClient.patch<{ report: Partial<DuplicateReport>; message: string }>(`/duplicates/reports/${id}`, data);
  }

  async merge(data: MergeNotesRequest): Promise<MergeNotesResponse> {
    return apiClient.post<MergeNotesResponse>('/duplicates/merge', data);
  }
}

export const duplicateService = new DuplicateService();
