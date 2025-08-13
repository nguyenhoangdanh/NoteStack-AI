import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import {
  Note,
  CreateNoteDto,
  UpdateNoteDto,
  SearchNotesDto,
  Workspace,
  CreateWorkspaceDto,
  Settings,
  UpdateSettingsDto,
  Usage,
  User,
  UpdateProfileDto,
  SemanticSearchResult,
  SemanticSearchDto,
} from '../types/api.types';

// Query Keys - matching exact backend structure
export const queryKeys = {
  // Auth queries
  auth: {
    me: ['auth', 'me'] as const,
    verify: ['auth', 'verify'] as const,
  },
  // User queries
  users: {
    me: ['users', 'me'] as const,
  },
  // Notes queries
  notes: {
    all: ['notes'] as const,
    list: (workspaceId?: string, limit?: number) =>
      ['notes', 'list', { workspaceId, limit }] as const,
    detail: (id: string) => ['notes', 'detail', id] as const,
    search: (params: SearchNotesDto) => ['notes', 'search', params] as const,
  },
  // Workspaces queries
  workspaces: {
    all: ['workspaces'] as const,
    list: ['workspaces', 'list'] as const,
    default: ['workspaces', 'default'] as const,
  },
  // Settings queries
  settings: {
    all: ['settings'] as const,
    detail: ['settings', 'detail'] as const,
    usage: (days: number) => ['settings', 'usage', days] as const,
  },
  // Vectors queries
  vectors: {
    semanticSearch: (params: SemanticSearchDto) =>
      ['vectors', 'semantic-search', params] as const,
  },
} as const;

// Auth hooks
export function useAuthMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: apiClient.auth.me,
    retry: false,
  });
}

export function useAuthVerify() {
  return useQuery({
    queryKey: queryKeys.auth.verify,
    queryFn: apiClient.auth.verify,
    retry: false,
  });
}

// User hooks - matching UsersController
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: apiClient.users.me,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => apiClient.users.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.users.me, updatedUser);
      queryClient.setQueryData(queryKeys.auth.me, updatedUser);
    },
  });
}

// Notes hooks - matching NotesController exactly
export function useNotes(workspaceId?: string, limit?: number) {
  return useQuery({
    queryKey: queryKeys.notes.list(workspaceId, limit),
    queryFn: () => apiClient.notes.list(workspaceId, limit),
  });
}

export function useNote(noteId: string | null) {
  return useQuery({
    queryKey: noteId ? queryKeys.notes.detail(noteId) : ['notes', 'none'],
    queryFn: () => apiClient.notes.get(noteId!),
    enabled: !!noteId,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteDto) => apiClient.notes.create(data),
    onSuccess: (newNote) => {
      // Invalidate all notes queries
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      // Update specific workspace query
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.list(newNote.workspaceId),
      });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateNoteDto) =>
      apiClient.notes.update(id, data),
    onSuccess: (updatedNote) => {
      // Update specific note in cache
      queryClient.setQueryData(
        queryKeys.notes.detail(updatedNote.id),
        updatedNote
      );
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notes.list(updatedNote.workspaceId),
      });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => apiClient.notes.delete(noteId),
    onSuccess: (_, noteId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.notes.detail(noteId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
    },
  });
}

export function useSearchNotes(params: SearchNotesDto, enabled = true) {
  return useQuery({
    queryKey: queryKeys.notes.search(params),
    queryFn: () => apiClient.notes.search(params),
    enabled: enabled && params.q.trim().length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Workspaces hooks - matching WorkspacesController exactly
export function useWorkspaces() {
  return useQuery({
    queryKey: queryKeys.workspaces.list,
    queryFn: apiClient.workspaces.list,
  });
}

export function useDefaultWorkspace() {
  return useQuery({
    queryKey: queryKeys.workspaces.default,
    queryFn: apiClient.workspaces.getDefault,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceDto) => apiClient.workspaces.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
    },
  });
}

// Settings hooks - matching SettingsController exactly
export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.detail,
    queryFn: apiClient.settings.get,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsDto) => apiClient.settings.update(data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(queryKeys.settings.detail, updatedSettings);
    },
  });
}

export function useUsage(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.settings.usage(days),
    queryFn: () => apiClient.settings.getUsage(days),
  });
}

// Chat hooks - matching ChatController exactly
export function useChatStream() {
  return useMutation({
    mutationFn: (query: string) => apiClient.chat.stream(query),
  });
}

export function useChatComplete() {
  return useMutation({
    mutationFn: (query: string) => apiClient.chat.complete(query),
  });
}

// Vectors hooks - matching VectorsController exactly
export function useSemanticSearch() {
  return useMutation({
    mutationFn: (data: SemanticSearchDto) => apiClient.vectors.semanticSearch(data),
  });
}

// Process note for RAG
export function useProcessNoteForRAG() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (noteId: string) => apiClient.notes.processForRAG(noteId),
    onSuccess: () => {
      // Optionally invalidate related queries
      console.log('Note processed for RAG successfully');
    },
  });
}

// AI Suggestions hooks
export function useGenerateSuggestion() {
  return useMutation({
    mutationFn: (data: {
      content: string;
      selectedText?: string;
      suggestionType: string;
      targetLanguage?: string;
    }) => apiClient.chat.generateSuggestion(data),
  });
}

export function useApplySuggestion() {
  return useMutation({
    mutationFn: (data: {
      noteId: string;
      originalContent: string;
      suggestion: string;
      selectedText?: string;
      applyType: 'replace' | 'append' | 'insert';
      position?: number;
    }) => apiClient.chat.applySuggestion(data),
  });
}
