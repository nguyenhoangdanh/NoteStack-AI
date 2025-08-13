import React from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { useConvexAuth, useQuery as useConvexQuery, useMutation as useConvexMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

// Initialize Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "");

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
    },
  },
});

// Combined provider
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ConvexProvider>
  );
}

// Custom hooks that combine Convex with React Query patterns

export function useAuth() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useConvexQuery(api.users.current);
  
  return {
    user,
    isLoading,
    isAuthenticated,
  };
}

export function useNotes(workspaceId?: Id<"workspaces">) {
  return useConvexQuery(api.notes.list, workspaceId ? { workspaceId } : {});
}

export function useNote(noteId: Id<"notes"> | null) {
  return useConvexQuery(api.notes.get, noteId ? { id: noteId } : "skip");
}

export function useWorkspaces() {
  return useConvexQuery(api.workspaces.list);
}

export function useDefaultWorkspace() {
  return useConvexQuery(api.workspaces.getDefault);
}

export function useSettings() {
  return useConvexQuery(api.settings.get);
}

export function useUsage(days?: number) {
  return useConvexQuery(api.settings.getUsage, { days });
}

export function useSearchNotes(query: string) {
  return useConvexQuery(
    api.notes.search, 
    query.trim() ? { query } : "skip"
  );
}

// Mutations
export function useCreateNote() {
  const queryClient = useQueryClient();
  const createNote = useConvexMutation(api.notes.create);
  
  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      tags: string[];
      workspaceId: Id<"workspaces">;
    }) => {
      return await createNote(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const updateNote = useConvexMutation(api.notes.update);
  
  return useMutation({
    mutationFn: async (data: {
      id: Id<"notes">;
      title?: string;
      content?: string;
      tags?: string[];
    }) => {
      return await updateNote(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const deleteNote = useConvexMutation(api.notes.remove);
  
  return useMutation({
    mutationFn: async (noteId: Id<"notes">) => {
      return await deleteNote({ id: noteId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useProcessNoteForRAG() {
  const processNote = useConvexMutation(api.vectors.processNoteForRAG);
  
  return useMutation({
    mutationFn: async (noteId: Id<"notes">) => {
      return await processNote({ noteId });
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const updateSettings = useConvexMutation(api.settings.update);
  
  return useMutation({
    mutationFn: async (data: {
      model?: string;
      maxTokens?: number;
      autoReembed?: boolean;
    }) => {
      return await updateSettings(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const createWorkspace = useConvexMutation(api.workspaces.create);
  
  return useMutation({
    mutationFn: async (name: string) => {
      return await createWorkspace({ name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
}

export { convex, queryClient };
