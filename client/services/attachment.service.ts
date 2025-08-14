import { apiClient } from '@/lib/apiClient';
import type {
  Attachment
} from '@/types';

class AttachmentService {
  async upload(noteId: string, file: File): Promise<Attachment> {
    return apiClient.upload<Attachment>(`/attachments/${noteId}/upload`, file);
  }

  async getByNote(noteId: string): Promise<Attachment[]> {
    return apiClient.get<Attachment[]>(`/attachments/${noteId}`);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/attachments/${id}`);
  }

  async download(attachmentId: string) {
    return apiClient.get(`/attachments/${attachmentId}/download`);
  }

  async search(query: string, limit?: number) {
    return apiClient.get(`/attachments/search/${query}`, { 
      params: { limit } 
    });
  }

  async getAnalytics(days?: number) {
    return apiClient.get('/attachments/analytics/overview', { 
      params: { days } 
    });
  }

  async requestOCR(attachmentId: string) {
    return apiClient.post(`/attachments/${attachmentId}/ocr`);
  }

  async getSupportedTypes() {
    return apiClient.get('/attachments/types/supported');
  }
}

export const attachmentService = new AttachmentService();
