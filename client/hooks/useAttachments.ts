import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attachmentService } from '@/services';
import type { Attachment } from '@/types';

// Query Keys
const QUERY_KEYS = {
  attachments: {
    all: ['attachments'] as const,
    note: (noteId: string) => ['attachments', 'note', noteId] as const,
    analytics: (days?: number) => ['attachments', 'analytics', { days }] as const,
  },
} as const;

// Get Note Attachments
export function useNoteAttachments(noteId: string | null) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.attachments.note(noteId) : ['attachments', 'none'],
    queryFn: () => noteId ? attachmentService.getByNote(noteId) : [],
    enabled: !!noteId,
  });
}

// Upload Attachment
export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, file }: { noteId: string; file: File }): Promise<Attachment> =>
      attachmentService.upload(noteId, file),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.attachments.note(noteId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attachments.analytics() });
    },
  });
}

// Delete Attachment
export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => attachmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attachments.all });
    },
  });
}

// Search Attachments
export function useSearchAttachments() {
  return useMutation({
    mutationFn: ({ query, limit }: { query: string; limit?: number }) =>
      attachmentService.search(query, limit),
  });
}

// Get Attachment Analytics
export function useAttachmentAnalytics(days?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.attachments.analytics(days),
    queryFn: () => attachmentService.getAnalytics(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
