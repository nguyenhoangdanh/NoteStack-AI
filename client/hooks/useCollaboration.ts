import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collaborationService } from '@/services';
import type { Collaboration, InviteCollaboratorRequest } from '@/types';

// Query Keys
const QUERY_KEYS = {
  collaboration: {
    all: ['collaboration'] as const,
    noteCollaborators: (noteId: string) => ['collaboration', 'note', noteId] as const,
    myCollaborations: (params?: {
      permission?: string;
      limit?: number;
    }) => ['collaboration', 'my', params] as const,
  },
} as const;

// Invite Collaborator
export function useInviteCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: {
      noteId: string;
      data: InviteCollaboratorRequest;
    }): Promise<Collaboration> =>
      collaborationService.invite(noteId, data),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.collaboration.noteCollaborators(noteId),
      });
    },
  });
}

// Get Note Collaborators
export function useNoteCollaborators(noteId: string | null) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.collaboration.noteCollaborators(noteId) : ['collaboration', 'none'],
    queryFn: () => noteId ? collaborationService.getCollaborators(noteId) : [],
    enabled: !!noteId,
  });
}

// Update Collaborator Permission
export function useUpdateCollaboratorPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collaborationId, data }: {
      collaborationId: string;
      data: { permission: 'READ' | 'WRITE' | 'ADMIN' };
    }) => collaborationService.updatePermission(collaborationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collaboration.all });
    },
  });
}

// Remove Collaborator
export function useRemoveCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collaborationId: string) => collaborationService.remove(collaborationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collaboration.all });
    },
  });
}

// Get My Collaborations
export function useMyCollaborations(params?: {
  permission?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.collaboration.myCollaborations(params),
    queryFn: () => collaborationService.getMyCollaborations(params),
  });
}
