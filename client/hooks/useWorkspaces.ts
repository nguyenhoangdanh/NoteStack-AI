import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceService } from '@/services';
import type { CreateWorkspaceRequest, Workspace } from '@/types';

// Query Keys
const QUERY_KEYS = {
  workspaces: {
    all: ['workspaces'] as const,
    list: ['workspaces', 'list'] as const,
    default: ['workspaces', 'default'] as const,
  },
} as const;

// Get All Workspaces
export function useWorkspaces() {
  return useQuery({
    queryKey: QUERY_KEYS.workspaces.list,
    queryFn: () => workspaceService.getAll(),
  });
}

// Get Default Workspace
export function useDefaultWorkspace() {
  return useQuery({
    queryKey: QUERY_KEYS.workspaces.default,
    queryFn: () => workspaceService.getDefault(),
  });
}

// Create Workspace
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest): Promise<Workspace> => 
      workspaceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces.all });
    },
  });
}
