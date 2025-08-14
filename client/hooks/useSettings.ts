import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services';
import type {
  UpdateSettingsRequest,
  Settings,
  Usage
} from '@/types';

// Query Keys
const QUERY_KEYS = {
  settings: {
    all: ['settings'] as const,
    detail: ['settings', 'detail'] as const,
    usage: (days: number) => ['settings', 'usage', days] as const,
  },
} as const;

// Get Settings
export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.settings.detail,
    queryFn: () => settingsService.get(),
  });
}

// Update Settings
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsRequest): Promise<Settings> => 
      settingsService.update(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(QUERY_KEYS.settings.detail, updatedSettings);
    },
  });
}

// Get Usage Statistics
export function useUsage(days: number = 30) {
  return useQuery({
    queryKey: QUERY_KEYS.settings.usage(days),
    queryFn: () => settingsService.getUsage(days),
  });
}
