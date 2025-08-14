import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { summaryService } from '@/services';
import type { AutoSummary, GenerateSummaryRequest } from '@/types';

// Query Keys
const QUERY_KEYS = {
  summaries: {
    all: ['summaries'] as const,
    note: (noteId: string) => ['summaries', 'note', noteId] as const,
    stats: ['summaries', 'stats'] as const,
  },
} as const;

// Get Summary for Note
export function useNoteSummary(noteId: string | null) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.summaries.note(noteId) : ['summaries', 'none'],
    queryFn: () => noteId ? summaryService.get(noteId) : null,
    enabled: !!noteId,
  });
}

// Generate Summary
export function useGenerateSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: {
      noteId: string;
      data?: GenerateSummaryRequest;
    }): Promise<AutoSummary> =>
      summaryService.generate(noteId, data),
    onSuccess: (summary, { noteId }) => {
      queryClient.setQueryData(
        QUERY_KEYS.summaries.note(noteId),
        summary
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summaries.stats });
    },
  });
}

// Delete Summary
export function useDeleteSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => summaryService.delete(noteId),
    onSuccess: (_, noteId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.summaries.note(noteId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summaries.stats });
    },
  });
}

// Batch Generate Summaries
export function useBatchGenerateSummaries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      noteIds: string[];
      model?: string;
      skipExisting?: boolean;
    }) => summaryService.batchGenerate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.summaries.all });
    },
  });
}

// Queue Summary Generation
export function useQueueSummaryGeneration() {
  return useMutation({
    mutationFn: (noteId: string) => summaryService.queue(noteId),
  });
}

// Get Summary Stats
export function useSummaryStats() {
  return useQuery({
    queryKey: QUERY_KEYS.summaries.stats,
    queryFn: () => summaryService.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
