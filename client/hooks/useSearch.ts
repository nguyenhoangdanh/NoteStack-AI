import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchService } from '@/services';
import type {
  AdvancedSearchRequest,
  AdvancedSearchResponse,
  SavedSearch
} from '@/types';

// Query Keys
const QUERY_KEYS = {
  search: {
    all: ['search'] as const,
    advanced: (data: AdvancedSearchRequest) => ['search', 'advanced', data] as const,
    history: (limit?: number) => ['search', 'history', { limit }] as const,
    popular: (limit?: number) => ['search', 'popular', { limit }] as const,
    suggestions: (q: string, limit?: number) => ['search', 'suggestions', { q, limit }] as const,
    saved: ['search', 'saved'] as const,
    analytics: ['search', 'analytics'] as const,
  },
} as const;

// Advanced Search
export function useAdvancedSearch() {
  return useMutation({
    mutationFn: (data: AdvancedSearchRequest): Promise<AdvancedSearchResponse> =>
      searchService.advanced(data),
  });
}

// Search History
export function useSearchHistory(limit?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.search.history(limit),
    queryFn: () => searchService.getHistory(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Popular Queries
export function usePopularQueries(limit?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.search.popular(limit),
    queryFn: () => searchService.getPopular(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Search Suggestions
export function useSearchSuggestions(q: string, limit?: number, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.search.suggestions(q, limit),
    queryFn: () => searchService.getSuggestions(q, limit),
    enabled: enabled && q.length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Save Search
export function useSaveSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      query: string;
      filters?: any;
    }): Promise<SavedSearch> =>
      searchService.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.search.saved });
    },
  });
}

// Get Saved Searches
export function useSavedSearches() {
  return useQuery({
    queryKey: QUERY_KEYS.search.saved,
    queryFn: () => searchService.getSaved(),
  });
}

// Delete Saved Search
export function useDeleteSavedSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => searchService.deleteSaved(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.search.saved });
    },
  });
}
