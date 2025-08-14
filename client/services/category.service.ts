import { apiClient } from '@/lib/apiClient';
import type {
  Category,
  CreateCategoryRequest,
  CategorySuggestion,
  AutoCategorizeRequest,
  CategoryAssignmentResponse
} from '@/types';

class CategoryService {
  async getAll(includeAuto: boolean = true): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories', { params: { includeAuto } });
  }

  async getById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
  }

  async create(data: CreateCategoryRequest): Promise<Category> {
    return apiClient.post<Category>('/categories', data);
  }

  async update(id: string, data: Partial<CreateCategoryRequest>): Promise<Category> {
    return apiClient.patch<Category>(`/categories/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/categories/${id}`);
  }

  async suggest(content: string): Promise<CategorySuggestion[]> {
    return apiClient.post<CategorySuggestion[]>('/categories/suggest', { content });
  }

  async autoCategorizeNote(noteId: string, data?: AutoCategorizeRequest): Promise<CategorySuggestion[]> {
    return apiClient.post<CategorySuggestion[]>(`/categories/auto-categorize/${noteId}`, data);
  }

  async getNoteCategories(noteId: string) {
    return apiClient.get(`/categories/notes/${noteId}`);
  }

  async assignToNote(noteId: string, categoryId: string): Promise<CategoryAssignmentResponse> {
    return apiClient.post<CategoryAssignmentResponse>(`/categories/notes/${noteId}/assign/${categoryId}`);
  }

  async removeFromNote(noteId: string, categoryId: string): Promise<void> {
    return apiClient.delete<void>(`/categories/notes/${noteId}/assign/${categoryId}`);
  }
}

export const categoryService = new CategoryService();
