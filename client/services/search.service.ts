import { apiClient } from '@/lib/apiClient';
import type {
  AdvancedSearchRequest,
  AdvancedSearchResponse,
  SavedSearch
} from '@/types';

class SearchService {
  async advanced(data: AdvancedSearchRequest): Promise<AdvancedSearchResponse> {
    return apiClient.post<AdvancedSearchResponse>('/search/advanced', data);
  }

  async getHistory(limit?: number) {
    return apiClient.get('/search/history', { params: { limit } });
  }

  async getPopular(limit?: number) {
    return apiClient.get('/search/popular', { params: { limit } });
  }

  async getSuggestions(q: string, limit?: number) {
    return apiClient.get('/search/suggestions', { params: { q, limit } });
  }

  async save(data: {
    name: string;
    query: string;
    filters?: any;
  }): Promise<SavedSearch> {
    return apiClient.post<SavedSearch>('/search/save', data);
  }

  async getSaved(): Promise<SavedSearch[]> {
    return apiClient.get<SavedSearch[]>('/search/saved');
  }

  async deleteSaved(id: string): Promise<void> {
    return apiClient.delete<void>(`/search/saved/${id}`);
  }
}

export const searchService = new SearchService();
