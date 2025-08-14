import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '@/services';
import type { UserActivity } from '@/types';

// Query Keys
const QUERY_KEYS = {
  activities: {
    all: ['activities'] as const,
    list: (params?: {
      noteId?: string;
      action?: string;
      limit?: number;
    }) => ['activities', 'list', params] as const,
    stats: ['activities', 'stats'] as const,
    trending: (params?: {
      window?: string;
      limit?: number;
    }) => ['activities', 'trending', params] as const,
  },
} as const;

// Get User Activities
export function useUserActivities(params?: {
  noteId?: string;
  action?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.activities.list(params),
    queryFn: () => activityService.getAll(params),
  });
}

// Track Activity
export function useTrackActivity() {
  return useMutation({
    mutationFn: (data: {
      action: string;
      noteId?: string;
      metadata?: any;
    }) => activityService.track(data),
  });
}

// Get Activity Stats
export function useActivityStats() {
  return useQuery({
    queryKey: QUERY_KEYS.activities.stats,
    queryFn: () => activityService.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get Trending Activities
export function useTrendingActivities(params?: {
  window?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.activities.trending(params),
    queryFn: () => activityService.getTrending(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
