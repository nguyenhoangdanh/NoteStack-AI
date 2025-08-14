import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { duplicateService } from '@/services';
import type {
  DuplicateDetectionResponse,
  DuplicateReportsResponse,
  MergeNotesRequest,
  MergeNotesResponse
} from '@/types';

// Query Keys
const QUERY_KEYS = {
  duplicates: {
    all: ['duplicates'] as const,
    detection: (params?: {
      noteId?: string;
      threshold?: number;
      type?: 'CONTENT' | 'TITLE' | 'SEMANTIC' | 'ALL';
    }) => ['duplicates', 'detection', params] as const,
    reports: (params?: {
      status?: 'PENDING' | 'CONFIRMED' | 'DISMISSED' | 'MERGED';
      type?: string;
      limit?: number;
    }) => ['duplicates', 'reports', params] as const,
  },
} as const;

// Detect Duplicates
export function useDuplicateDetection() {
  return useMutation({
    mutationFn: (params?: {
      noteId?: string;
      threshold?: number;
      type?: 'CONTENT' | 'TITLE' | 'SEMANTIC' | 'ALL';
    }): Promise<DuplicateDetectionResponse> =>
      duplicateService.detect(params),
  });
}

// Get Duplicate Reports
export function useDuplicateReports(params?: {
  status?: 'PENDING' | 'CONFIRMED' | 'DISMISSED' | 'MERGED';
  type?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.duplicates.reports(params),
    queryFn: () => duplicateService.getReports(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Create Duplicate Report
export function useCreateDuplicateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      originalNoteId: string;
      duplicateNoteId: string;
      similarity: number;
      type: 'CONTENT' | 'TITLE' | 'SEMANTIC';
    }) => duplicateService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.duplicates.all });
    },
  });
}

// Update Duplicate Report
export function useUpdateDuplicateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: {
      id: string;
      data: { status: 'CONFIRMED' | 'DISMISSED' | 'MERGED' };
    }) => duplicateService.updateReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.duplicates.all });
    },
  });
}

// Merge Notes
export function useMergeNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MergeNotesRequest): Promise<MergeNotesResponse> =>
      duplicateService.merge(data),
    onSuccess: (result) => {
      // Invalidate notes queries
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      // Invalidate duplicate queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.duplicates.all });
      // Remove deleted note from cache
      queryClient.removeQueries({
        queryKey: ['notes', 'detail', result.deletedNoteId],
      });
    },
  });
}
