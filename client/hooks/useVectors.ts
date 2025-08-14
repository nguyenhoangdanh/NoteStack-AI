import { useMutation } from '@tanstack/react-query';
import { vectorService } from '@/services';
import type {
  SemanticSearchRequest,
  VectorSearchResult
} from '@/types';

// Query Keys
const QUERY_KEYS = {
  vectors: {
    semanticSearch: (params: SemanticSearchRequest) =>
      ['vectors', 'semantic-search', params] as const,
  },
} as const;

// Semantic Search
export function useSemanticSearch() {
  return useMutation({
    mutationFn: (data: SemanticSearchRequest): Promise<VectorSearchResult[]> =>
      vectorService.semanticSearch(data),
  });
}
