import { ApiResponse, Note } from ".";

// Base types
export interface DuplicateDetection {
  originalNoteId: string;
  duplicateNoteId: string;
  similarity: number;
  type: 'CONTENT' | 'TITLE' | 'SEMANTIC';
  suggestedAction: 'MERGE' | 'REVIEW' | 'KEEP_SEPARATE';
}

export interface DuplicateReport {
  id: string;
  originalNoteId: string;
  duplicateNoteId: string;
  similarity: number;
  type: 'CONTENT' | 'TITLE' | 'SEMANTIC';
  status: 'PENDING' | 'CONFIRMED' | 'DISMISSED' | 'MERGED';
  ownerId: string;
  createdAt: string;
  resolvedAt?: string;
  originalNote: {
    id: string;
    title: string;
    content?: string;
  };
  duplicateNote: {
    id: string;
    title: string;
    content?: string;
  };
}

// Request types
export interface DetectDuplicatesParams {
  noteId?: string;
  threshold?: number;
  type?: 'CONTENT' | 'TITLE' | 'SEMANTIC' | 'ALL';
}

export interface GetDuplicateReportsParams {
  status?: 'PENDING' | 'CONFIRMED' | 'DISMISSED' | 'MERGED';
  type?: string;
  limit?: number;
}

export interface CreateDuplicateReportRequest {
  originalNoteId: string;
  duplicateNoteId: string;
  similarity: number;
  type: 'CONTENT' | 'TITLE' | 'SEMANTIC';
}

export interface UpdateDuplicateReportRequest {
  status: 'CONFIRMED' | 'DISMISSED' | 'MERGED';
}

export interface MergeNotesRequest {
  originalNoteId: string;
  duplicateNoteId: string;
}

// API response types
export interface DuplicateDetectionResponse extends ApiResponse {
  count: number;
  duplicates: DuplicateDetection[];
}

export interface DuplicateReportsResponse extends ApiResponse {
  count: number;
  reports: DuplicateReport[];
  statusFilter?: string;
}

export interface MergeNotesResponse extends ApiResponse {
  mergedNote: Note;
  deletedNoteId: string;
}

export interface DuplicateStatsResponse extends ApiResponse {
  stats: {
    totalReports: number;
    pendingReports: number;
    mergedReports: number;
    resolvedReports: number;
  };
}
