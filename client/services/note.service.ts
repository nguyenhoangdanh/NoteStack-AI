import { apiClient } from '@/lib/apiClient';
import type {
  CreateNoteRequest,
  UpdateNoteRequest,
  GetNotesQuery,
  SearchNotesQuery,
  Note
} from '@/types';

class NoteService {
  async getAll(params?: GetNotesQuery): Promise<Note[]> {
    return apiClient.get<Note[]>('/notes', { params });
  }

  async getById(id: string): Promise<Note> {
    return apiClient.get<Note>(`/notes/${id}`);
  }

  async create(data: CreateNoteRequest): Promise<Note> {
    return apiClient.post<Note>('/notes', data);
  }

  async update(id: string, data: UpdateNoteRequest): Promise<Note> {
    return apiClient.patch<Note>(`/notes/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/notes/${id}`);
  }

  async search(params: SearchNotesQuery): Promise<Note[]> {
    return apiClient.get<Note[]>('/notes/search', { params });
  }

  async processForRAG(id: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/notes/${id}/process-rag`);
  }
}

export const noteService = new NoteService();
