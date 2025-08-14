import { apiClient } from '@/lib/apiClient';
import type {
  Collaboration,
  InviteCollaboratorRequest
} from '@/types';

class CollaborationService {
  async invite(noteId: string, data: InviteCollaboratorRequest): Promise<Collaboration> {
    return apiClient.post<Collaboration>(`/collaboration/notes/${noteId}/invite`, data);
  }

  async getCollaborators(noteId: string): Promise<Collaboration[]> {
    return apiClient.get<Collaboration[]>(`/collaboration/notes/${noteId}/collaborators`);
  }

  async updatePermission(collaborationId: string, data: {
    permission: 'READ' | 'WRITE' | 'ADMIN';
  }): Promise<Collaboration> {
    return apiClient.patch<Collaboration>(`/collaboration/${collaborationId}/permission`, data);
  }

  async remove(collaborationId: string): Promise<void> {
    return apiClient.delete<void>(`/collaboration/${collaborationId}`);
  }

  async getMyCollaborations(params?: {
    permission?: string;
    limit?: number;
  }): Promise<Collaboration[]> {
    return apiClient.get<Collaboration[]>('/collaboration/my-collaborations', { params });
  }
}

export const collaborationService = new CollaborationService();
