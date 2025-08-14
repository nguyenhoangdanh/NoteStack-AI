import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shareService } from '@/services';
import type {
  ShareLink,
  CreateShareLinkRequest,
  ShareLinkAnalyticsResponse,
  UserStatsResponse
} from '@/types';

// Query Keys
const QUERY_KEYS = {
  sharing: {
    all: ['sharing'] as const,
    noteLinks: (noteId: string) => ['sharing', 'note', noteId] as const,
    analytics: (shareId: string) => ['sharing', 'analytics', shareId] as const,
    userStats: ['sharing', 'user-stats'] as const,
  },
} as const;

// Create Share Link
export function useCreateShareLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: {
      noteId: string;
      data?: CreateShareLinkRequest;
    }): Promise<ShareLink> =>
      shareService.createLink(noteId, data),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.sharing.noteLinks(noteId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sharing.userStats });
    },
  });
}

// Get Share Links for Note
export function useNoteShareLinks(noteId: string | null) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.sharing.noteLinks(noteId) : ['sharing', 'none'],
    queryFn: () => noteId ? shareService.getLinks(noteId) : [],
    enabled: !!noteId,
  });
}

// Update Share Link
export function useUpdateShareLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shareId, data }: {
      shareId: string;
      data: Partial<CreateShareLinkRequest>;
    }) => shareService.updateLink(shareId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sharing.all });
    },
  });
}

// Delete Share Link
export function useDeleteShareLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shareId: string) => shareService.deleteLink(shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sharing.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sharing.userStats });
    },
  });
}

// Access Shared Note (public)
export function useAccessSharedNote() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password?: string }) =>
      shareService.accessShared(token, password),
  });
}

// Get Share Link Analytics
export function useShareLinkAnalytics(shareId: string | null) {
  return useQuery({
    queryKey: shareId ? QUERY_KEYS.sharing.analytics(shareId) : ['sharing', 'analytics', 'none'],
    queryFn: () => shareId ? shareService.getAnalytics(shareId) : null,
    enabled: !!shareId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get User Share Stats
export function useUserShareStats() {
  return useQuery({
    queryKey: QUERY_KEYS.sharing.userStats,
    queryFn: () => shareService.getUserStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
