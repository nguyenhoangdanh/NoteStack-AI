import { apiClient } from '@/lib/apiClient';
import type {
  RelatedNotesResponse,
  RelatedNote
} from '@/types';

class RelationService {
  async getRelated(noteId: string, params?: {
    limit?: number;
    minRelevance?: number;
    types?: string[];
  }): Promise<RelatedNotesResponse> {
    return apiClient.get<RelatedNotesResponse>(`/relations/notes/${noteId}/related`, { params });
  }

  async getStored(noteId: string, params?: {
    type?: string;
    limit?: number;
  }): Promise<{ relations: RelatedNote[]; count: number; noteTitle: string }> {
    return apiClient.get(`/relations/notes/${noteId}/stored`, { params });
  }

  async create(noteId: string, data: {
    targetNoteId: string;
    type: 'SEMANTIC' | 'CONTEXTUAL' | 'TEMPORAL' | 'REFERENCE';
    relevance?: number;
    description?: string;
  }): Promise<{ relation: RelatedNote; message: string }> {
    return apiClient.post<{ relation: RelatedNote; message: string }>(`/relations/notes/${noteId}/save-relation`, data);
  }

  async analyze(noteId: string, data?: {
    includeTypes?: string[];
    minRelevance?: number;
    maxRelations?: number;
  }): Promise<{ jobId: string; estimatedTime: string; noteTitle: string }> {
    return apiClient.post<{ jobId: string; estimatedTime: string; noteTitle: string }>(`/relations/notes/${noteId}/analyze`, data);
  }

  async getGraph(noteId: string, params?: {
    depth?: number;
    minRelevance?: number;
    maxNodes?: number;
  }) {
    return apiClient.get(`/relations/notes/${noteId}/graph`, { params });
  }
}

export const relationService = new RelationService();
