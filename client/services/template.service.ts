import { apiClient } from '@/lib/apiClient';
import type {
  Template,
  CreateTemplateRequest
} from '@/types';

class TemplateService {
  async getAll(isPublic?: boolean): Promise<Template[]> {
    return apiClient.get<Template[]>('/templates', {
      params: isPublic !== undefined ? { isPublic } : undefined
    });
  }

  async getById(id: string): Promise<Template> {
    return apiClient.get<Template>(`/templates/${id}`);
  }

  async create(data: CreateTemplateRequest): Promise<Template> {
    return apiClient.post<Template>('/templates', data);
  }

  async update(id: string, data: Partial<CreateTemplateRequest>): Promise<Template> {
    return apiClient.patch<Template>(`/templates/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/templates/${id}`);
  }

  async process(templateId: string, variables: Record<string, any>) {
    return apiClient.post(`/templates/${templateId}/process`, { variables });
  }

  async duplicate(templateId: string, newName?: string) {
    return apiClient.post(`/templates/${templateId}/duplicate`, 
      newName ? { newName } : undefined
    );
  }
}

export const templateService = new TemplateService();
