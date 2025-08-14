import { apiClient } from '@/lib/apiClient';
import type {
  CreateWorkspaceRequest,
  Workspace
} from '@/types';

class WorkspaceService {
  async getAll(): Promise<Workspace[]> {
    return apiClient.get<Workspace[]>('/workspaces');
  }

  async getDefault(): Promise<Workspace | null> {
    return apiClient.get<Workspace | null>('/workspaces/default');
  }

  async create(data: CreateWorkspaceRequest): Promise<Workspace> {
    return apiClient.post<Workspace>('/workspaces', data);
  }
}

export const workspaceService = new WorkspaceService();
