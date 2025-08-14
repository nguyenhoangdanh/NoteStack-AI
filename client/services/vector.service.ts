import { apiClient } from '@/lib/apiClient';
import type {
  SemanticSearchRequest,
  VectorSearchResult
} from '@/types';

class VectorService {
  async semanticSearch(data: SemanticSearchRequest): Promise<VectorSearchResult[]> {
    return apiClient.post<VectorSearchResult[]>('/vectors/semantic-search', data);
  }
}

export const vectorService = new VectorService();
