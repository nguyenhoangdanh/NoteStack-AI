import { ApiResponse } from ".";

// Base types
export interface Tag {
  id: string;
  name: string;
  color?: string;
  description?: string;
  noteCount?: number;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TagAnalytics {
  totalTags: number;
  mostUsedTags: Array<{
    name: string;
    count: number;
    color?: string;
  }>;
  recentlyUsed: Array<{
    name: string;
    lastUsed: string;
  }>;
  tagGrowth: Array<{
    date: string;
    count: number;
  }>;
  colorDistribution: Array<{
    color: string;
    count: number;
  }>;
  relationshipMap: Array<{
    tag1: string;
    tag2: string;
    coOccurrences: number;
  }>;
}

export interface TagSuggestion {
  name: string;
  confidence: number;
  reason: 'content_based' | 'history_based' | 'popular';
  relatedTags: string[];
}

export interface TagHierarchy {
  id: string;
  name: string;
  color?: string;
  description?: string;
  noteCount: number;
  children: TagHierarchy[];
}

// Request types
export interface CreateTagRequest {
  name: string;
  color?: string;
  description?: string;
  parentId?: string;
}

export interface UpdateTagRequest extends Partial<CreateTagRequest> {}

export interface SuggestTagsRequest {
  content: string;
}

export interface BulkTagOperationRequest {
  type: 'assign' | 'remove' | 'replace';
  noteIds: string[];
  tagIds: string[];
  replacementTagId?: string;
}

export interface GetTagAnalyticsParams {
  days?: number;
}

export interface GetTagSuggestionsHistoryParams {
  limit?: number;
}

export interface ExportTagsParams {
  format?: 'json' | 'csv';
}

export interface ImportTagsRequest {
  tags: Array<{
    name: string;
    color?: string;
    description?: string;
  }>;
  mergeStrategy: 'merge' | 'replace';
}

// API response types
export interface GetTagsResponse extends ApiResponse {
  tags: Tag[];
  count: number;
}

export interface CreateTagResponse extends Tag {}

export interface UpdateTagResponse extends Tag {}

export interface GetTagHierarchyResponse extends ApiResponse {
  hierarchy: TagHierarchy[];
}

export interface GetTagAnalyticsResponse extends ApiResponse {
  analytics: TagAnalytics;
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

export interface SuggestTagsResponse extends ApiResponse {
  suggestions: TagSuggestion[];
  count: number;
}

export interface BulkTagOperationResponse extends ApiResponse {
  processedCount: number;
  totalRequested: number;
  errors: string[];
}

export interface GetTagSuggestionsHistoryResponse extends ApiResponse {
  history: Array<{
    id: string;
    suggestedTag: string;
    confidence: number;
    appliedAt: string;
    noteId: string;
  }>;
  count: number;
}

export interface ExportTagsResponse extends ApiResponse {
  data: string | Tag[];
  format: string;
  count: number;
}

export interface ImportTagsResponse extends ApiResponse {
  imported: number;
  skipped: number;
  errors: string[];
}

// Form types
export interface CreateTagFormData {
  name: string;
  color: string;
  description: string;
  parentId: string;
}

export interface UpdateTagFormData extends Partial<CreateTagFormData> {}

export interface BulkTagOperationFormData {
  type: string;
  noteIds: string[];
  tagIds: string[];
  replacementTagId: string;
}

export interface ImportTagsFormData {
  tags: string; // JSON string
  mergeStrategy: string;
}
