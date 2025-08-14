import { ApiResponse } from ".";

// Base types
export interface RelatedNote {
  id?: string;
  noteId: string;
  title: string;
  relevance: number;
  type: 'SEMANTIC' | 'CONTEXTUAL' | 'TEMPORAL' | 'REFERENCE';
  excerpt: string;
  reasons: string[];
  sourceNoteId?: string;
  targetNoteId?: string;
  createdAt?: string;
}

export interface RelationGraphNode {
  id: string;
  title: string;
  depth: number;
  createdAt: string;
}

export interface RelationGraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'SEMANTIC' | 'CONTEXTUAL' | 'TEMPORAL' | 'REFERENCE';
  relevance: number;
}

// Request types
export interface GetRelatedNotesParams {
  limit?: number;
  minRelevance?: number;
  types?: string[];
}

export interface GetStoredRelationsParams {
  type?: string;
  limit?: number;
}

export interface CreateRelationRequest {
  targetNoteId: string;
  type: 'SEMANTIC' | 'CONTEXTUAL' | 'TEMPORAL' | 'REFERENCE';
  relevance?: number;
  description?: string;
}

export interface AnalyzeRelationsRequest {
  includeTypes?: string[];
  minRelevance?: number;
  maxRelations?: number;
}

export interface GetRelationsGraphParams {
  depth?: number;
  minRelevance?: number;
  maxNodes?: number;
}

// API response types
export interface RelatedNotesResponse extends ApiResponse {
  noteId: string;
  count: number;
  relatedNotes: RelatedNote[];
}

export interface StoredRelationsResponse extends ApiResponse {
  noteId: string;
  count: number;
  relations: RelatedNote[];
}

export interface CreateRelationResponse extends ApiResponse {
  relation: RelatedNote;
}

export interface AnalyzeRelationsResponse extends ApiResponse {
  jobId: string;
  estimatedTime: string;
  noteTitle: string;
}

export interface RelationsGraphResponse extends ApiResponse {
  noteId: string;
  depth: number;
  nodes: RelationGraphNode[];
  edges: RelationGraphEdge[];
  totalNodes: number;
  totalEdges: number;
}

export interface RelationStatsResponse extends ApiResponse {
  stats: {
    totalRelations: number;
    relationsByType: Record<string, number>;
    topConnectedNotes: Array<{
      noteId: string;
      connectionCount: number;
    }>;
  };
}
