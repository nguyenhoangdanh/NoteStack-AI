// Vector search result type
export interface VectorSearchResult {
  id: string;
  noteId: string;
  chunkId: string;
  chunkContent: string;
  chunkIndex: number;
  heading: string | null;
  embedding: number[];
  ownerId: string;
  createdAt: string;
  noteTitle: string;
  similarity: number;
}

// Request types
export interface SemanticSearchRequest {
  query: string;
  limit?: number;
}

// API response types
export type SemanticSearchResponse = VectorSearchResult[];
