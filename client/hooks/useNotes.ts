import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '@/services';
import type {
  CreateNoteRequest,
  UpdateNoteRequest,
  GetNotesQuery,
  SearchNotesQuery,
  Note
} from '@/types';

// Query Keys
const QUERY_KEYS = {
  notes: {
    all: ['notes'] as const,
    list: (params?: GetNotesQuery) => ['notes', 'list', params] as const,
    detail: (id: string) => ['notes', 'detail', id] as const,
    search: (params: SearchNotesQuery) => ['notes', 'search', params] as const,
  },
} as const;

// Get Notes List
export function useNotes(params?: GetNotesQuery) {
  return useQuery({
    queryKey: QUERY_KEYS.notes.list(params),
    queryFn: () => noteService.getAll(params),
  });
}

// Get Single Note
export function useNote(noteId: string | null) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.notes.detail(noteId) : ['notes', 'none'],
    queryFn: () => noteId ? noteService.getById(noteId) : null,
    enabled: !!noteId,
  });
}

// Create Note
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest): Promise<Note> => 
      noteService.create(data),
    onSuccess: (newNote) => {
      // Invalidate all notes queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes.all });
      // Update specific workspace query
      const workspaceParams = { workspaceId: newNote.workspaceId };
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notes.list(workspaceParams),
      });
    },
  });
}

// Update Note
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateNoteRequest): Promise<Note> =>
      noteService.update(id, data),
    onSuccess: (updatedNote) => {
      // Update specific note in cache
      queryClient.setQueryData(
        QUERY_KEYS.notes.detail(updatedNote.id),
        updatedNote
      );
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes.all });
    },
  });
}

// Delete Note
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => noteService.delete(noteId),
    onSuccess: (_, noteId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.notes.detail(noteId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notes.all });
    },
  });
}

// Search Notes
export function useSearchNotes(params: SearchNotesQuery, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.notes.search(params),
    queryFn: () => noteService.search(params),
    enabled: enabled && params.q.trim().length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Process Note for RAG
export function useProcessNoteForRAG() {
  return useMutation({
    mutationFn: (noteId: string) => noteService.processForRAG(noteId),
    onSuccess: () => {
      console.log('Note processed for RAG successfully');
    },
  });
}
