import { apiClient } from '@/lib/apiClient';
import type {
  Tag,
  CreateTagRequest
} from '@/types';

class TagService {
  async getAll(): Promise<Tag[]> {
    return apiClient.get<Tag[]>('/tags');
  }

  async create(data: CreateTagRequest): Promise<Tag> {
    return apiClient.post<Tag>('/tags', data);
  }

  async update(id: string, data: Partial<CreateTagRequest>): Promise<Tag> {
    return apiClient.patch<Tag>(`/tags/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/tags/${id}`);
  }

  async getAnalytics(days?: number) {
    return apiClient.get('/tags/analytics', { params: { days } });
  }

  async suggest(noteId: string, content: string) {
    return apiClient.post(`/tags/suggest/${noteId}`, { content });
  }

  async bulkOperation(data: {
    type: string;
    noteIds: string[];
    tagIds: string[];
    replacementTagId?: string;
  }) {
    return apiClient.post('/tags/bulk-operation', data);
  }
}

export const tagService = new TagService();
