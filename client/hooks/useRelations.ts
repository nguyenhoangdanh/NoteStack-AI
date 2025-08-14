import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { relationService } from '@/services';
import type { RelatedNotesResponse, RelatedNote } from '@/types';

// Query Keys
const QUERY_KEYS = {
  relations: {
    all: ['relations'] as const,
    related: (noteId: string, params?: {
      limit?: number;
      minRelevance?: number;
      types?: string[];
    }) => ['relations', 'related', noteId, params] as const,
    stored: (noteId: string, params?: {
      type?: string;
      limit?: number;
    }) => ['relations', 'stored', noteId, params] as const,
    graph: (noteId: string, params?: {
      depth?: number;
      minRelevance?: number;
      maxNodes?: number;
    }) => ['relations', 'graph', noteId, params] as const,
  },
} as const;

// Get Related Notes
export function useRelatedNotes(noteId: string | null, params?: {
  limit?: number;
  minRelevance?: number;
  types?: string[];
}) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.relations.related(noteId, params) : ['relations', 'none'],
    queryFn: () => noteId ? relationService.getRelated(noteId, params) : null,
    enabled: !!noteId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get Stored Relations
export function useStoredRelations(noteId: string | null, params?: {
  type?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.relations.stored(noteId, params) : ['relations', 'stored', 'none'],
    queryFn: () => noteId ? relationService.getStored(noteId, params) : null,
    enabled: !!noteId,
  });
}

// Create Relation
export function useCreateRelation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: {
      noteId: string;
      data: {
        targetNoteId: string;
        type: 'SEMANTIC' | 'CONTEXTUAL' | 'TEMPORAL' | 'REFERENCE';
        relevance?: number;
        description?: string;
      };
    }) => relationService.create(noteId, data),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.relations.stored(noteId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.relations.all });
    },
  });
}

// Analyze Relations
export function useAnalyzeRelations() {
  return useMutation({
    mutationFn: ({ noteId, data }: {
      noteId: string;
      data?: {
        includeTypes?: string[];
        minRelevance?: number;
        maxRelations?: number;
      };
    }) => relationService.analyze(noteId, data),
  });
}

// Get Relations Graph
export function useRelationsGraph(noteId: string | null, params?: {
  depth?: number;
  minRelevance?: number;
  maxNodes?: number;
}) {
  return useQuery({
    queryKey: noteId ? QUERY_KEYS.relations.graph(noteId, params) : ['relations', 'graph', 'none'],
    queryFn: () => noteId ? relationService.getGraph(noteId, params) : null,
    enabled: !!noteId,
    staleTime: 1000 * 60 * 10, // 10 minutes - graphs are expensive to compute
  });
}
