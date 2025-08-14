import { ApiResponse } from ".";

// Base types
export interface AutoSummary {
  id: string;
  noteId: string;
  summary: string;
  keyPoints: string[];
  wordCount: number;
  model: string;
  ownerId: string;
  createdAt: string;
  note?: {
    title: string;
    updatedAt: string;
  };
  readingTime: number;
  isStale: boolean;
}

export interface SummaryTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface SummaryVersion {
  id: string;
  version: number;
  summary: string;
  keyPoints: string[];
  wordCount: number;
  model: string;
  createdAt: string;
  isCurrent: boolean;
}

// Request types
export interface GenerateSummaryRequest {
  minWords?: number;
  maxSummaryLength?: number;
  includeKeyPoints?: boolean;
  model?: string;
}

export interface BatchGenerateSummariesRequest {
  noteIds: string[];
  minWords?: number;
  skipExisting?: boolean;
}

export interface QueueSummaryGenerationRequest extends GenerateSummaryRequest {}

// API response types
export interface GetSummaryResponse extends ApiResponse {
  noteId: string;
  summary: AutoSummary | null;
}

export interface GenerateSummaryResponse extends ApiResponse {
  noteId: string;
  summary: {
    summary: string;
    keyPoints: string[];
    wordCount: number;
    readingTime: number;
    model: string;
  };
}

export interface BatchGenerateSummariesResponse extends ApiResponse {
  total: number;
  successful: number;
  failed: number;
  results?: Array<{
    noteId: string;
    success: boolean;
    summary?: {
      wordCount: number;
      model: string;
    };
  }>;
  jobId?: string;
  invalidNotes?: string[];
}

export interface QueueSummaryGenerationResponse extends ApiResponse {
  jobId: string;
  noteId: string;
  userId: string;
}

export interface SummaryStatsResponse extends ApiResponse {
  stats: {
    totalSummaries: number;
    recentSummaries: number;
    averageWordCount: number;
    summariesByModel: Record<string, number>;
  };
}

export interface SummaryVersionsResponse extends ApiResponse {
  noteId: string;
  versions: SummaryVersion[];
  count: number;
}

export interface SummaryTemplatesResponse extends ApiResponse {
  templates: SummaryTemplate[];
}

export interface GenerateTemplateSummaryResponse extends ApiResponse {
  noteId: string;
  templateId: string;
  summary: {
    summary: string;
    keyPoints: string[];
    wordCount: number;
    readingTime: number;
    model: string;
  };
}

export interface GetSummaryTemplatesResponse extends ApiResponse {
  templates: SummaryTemplate[];
}

// Form types
export interface GenerateSummaryFormData {
  minWords: number;
  maxSummaryLength: number;
  includeKeyPoints: boolean;
  model: string;
}

export interface BatchSummaryFormData {
  noteIds: string[];
  minWords: number;
  skipExisting: boolean;
}

export namespace SummaryTypes {
  export interface GetTemplatesResponse extends ApiResponse {
    templates: SummaryTemplate[];
  }
  
  export interface GenerateTemplateSummaryResponse extends ApiResponse {
    noteId: string;
    templateId: string;
    summary: {
      summary: string;
      keyPoints: string[];
      wordCount: number;
      readingTime: number;
      model: string;
    };
  }
}
