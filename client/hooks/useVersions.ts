import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { versionService } from '@/services';
import type { NoteVersion, VersionTimelineResponse } from '@/types';

// Query Keys
const QUERY_KEYS = {
  versions: {
    all: ['versions'] as const,
    noteVersions: (noteId: string, limit?: number) =>
      ['versions', 'note', noteId, { limit }] as const,
    version: (versionId: string) => ['versions', 'detail', versionId] as const,
    timeline: (noteId: string) => ['versions', 'timeline', noteId] as const,
    userStats: ['versions', 'user-stats'] as const,
  },
} as const;

// Get Note Versions
export function useNoteVersions(noteId: string | null, limit?: number) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.versions.noteVersions(noteId, limit) : ['versions', 'none'],
    queryFn: () => noteId ? versionService.getVersions(noteId, limit) : [],
    enabled: !!noteId,
  });
}

// Get Single Version
export function useVersion(versionId: string | null) {
  return useQuery({
    queryKey: versionId ? QUERY_KEYS.versions.version(versionId) : ['versions', 'detail', 'none'],
    queryFn: () => versionId ? versionService.getVersion(versionId) : null,
    enabled: !!versionId,
  });
}

// Create Version
export function useCreateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: {
      noteId: string;
      data?: { changeLog?: string };
    }) => versionService.create(noteId, data),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.versions.noteVersions(noteId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.versions.timeline(noteId),
      });
    },
  });
}

// Restore Version
export function useRestoreVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (versionId: string) => versionService.restore(versionId),
    onSuccess: () => {
      // Invalidate notes and versions
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions.all });
    },
  });
}

// Compare Versions
export function useCompareVersions() {
  return useMutation({
    mutationFn: ({ versionId, compareVersionId }: {
      versionId: string;
      compareVersionId: string;
    }) => versionService.compare(versionId, compareVersionId),
  });
}

// Get Version Timeline
export function useVersionTimeline(noteId: string | null) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.versions.timeline(noteId) : ['versions', 'timeline', 'none'],
    queryFn: () => noteId ? versionService.getTimeline(noteId) : null,
    enabled: !!noteId,
  });
}

// Get User Version Stats
export function useUserVersionStats() {
  return useQuery({
    queryKey: QUERY_KEYS.versions.userStats,
    queryFn: () => versionService.getUserStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
