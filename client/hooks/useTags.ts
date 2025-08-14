import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/services';
import type { Tag, CreateTagRequest } from '@/types';

// Query Keys
const QUERY_KEYS = {
  tags: {
    all: ['tags'] as const,
    analytics: (days?: number) => ['tags', 'analytics', { days }] as const,
  },
} as const;

// Get All Tags
export function useTags() {
  return useQuery({
    queryKey: QUERY_KEYS.tags.all,
    queryFn: () => tagService.getAll(),
  });
}

// Create Tag
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagRequest) => tagService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags.all });
    },
  });
}

// Update Tag
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<CreateTagRequest>) =>
      tagService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags.all });
    },
  });
}

// Delete Tag
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags.all });
    },
  });
}

// Get Tag Analytics
export function useTagAnalytics(days?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.tags.analytics(days),
    queryFn: () => tagService.getAnalytics(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Tag Suggestions
export function useTagSuggestions() {
  return useMutation({
    mutationFn: ({ noteId, content }: { noteId: string; content: string }) =>
      tagService.suggest(noteId, content),
  });
}

// Bulk Tag Operations
export function useBulkTagOperation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      type: string;
      noteIds: string[];
      tagIds: string[];
      replacementTagId?: string;
    }) => tagService.bulkOperation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags.all });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
