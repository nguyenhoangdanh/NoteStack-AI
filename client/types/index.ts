// ===== API ERROR TYPE =====
export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
  details?: any;
}

// ===== RESPONSE WRAPPER TYPES =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  count: number;
  total?: number;
  page?: number;
  limit?: number;
}

// ===== STREAM RESPONSE TYPE =====
export interface Citation {
  title: string;
  heading: string | null;
}

export interface StreamResponse {
  stream: ReadableStream<Uint8Array>;
  citations: Citation[];
}

// ===== PHASE 1 TYPES EXPORTS =====
export * from './auth.type';
export * from './user.type';
export * from './workspace.type';
export * from './note.type';
export * from './vector.type';
export * from './chat.type';
export * from './settings.type';

// ===== PHASE 2A SMART FEATURES TYPES =====
export * from './category.type';
export * from './duplicate.type';
export * from './relation.type';
export * from './summary.type';
export * from './search.type';

// ===== PHASE 2B COLLABORATION FEATURES TYPES =====
export * from './collaboration.type';
export * from './sharing.type';
export * from './version.type';
export * from './template.type';
export * from './tag.type';
export * from './attachment.type';
export * from './notification.type';
export * from './activity.type';

// ===== ADDITIONAL RESPONSE TYPES =====
// These are defined here to avoid circular imports and be available for api.ts

// Auth response types
export interface AuthResponse {
  access_token: string;
  user: import('./auth.type').User;
}

export interface AuthVerifyResponse {
  valid: boolean;
  user: import('./auth.type').User;
}

// Phase 2A specific response types
export interface DuplicateDetectionResponse extends ApiResponse {
  count: number;
  duplicates: import('./duplicate.type').DuplicateDetection[];
}

export interface DuplicateReportsResponse extends ApiResponse {
  count: number;
  reports: import('./duplicate.type').DuplicateReport[];
  statusFilter?: string;
}

export interface MergeNotesResponse extends ApiResponse {
  mergedNote: import('./note.type').Note;
  deletedNoteId: string;
}

export interface RelatedNotesResponse extends ApiResponse {
  noteId: string;
  count: number;
  relatedNotes: import('./relation.type').RelatedNote[];
}

export interface CategoryAssignmentResponse {
  noteId: string;
  categoryId: string;
  confidence?: number;
  isAuto: boolean;
  createdAt: string;
  category: import('./category.type').Category;
}

// Phase 2B specific response types
export interface ShareLinkAnalyticsResponse extends ApiResponse {
  shareLink: {
    id: string;
    token: string;
    createdAt: string;
  };
  analytics: {
    totalViews: number;
    uniqueViews: number;
    recentViews: number;
    viewsByDay: Array<{
      date: string;
      views: number;
      uniqueViews: number;
    }>;
    topReferrers: Array<{
      referrer: string;
      count: number;
    }>;
    geographicData: Array<{
      country: string;
      count: number;
    }>;
  };
}

export interface UserStatsResponse extends ApiResponse {
  stats: {
    totalShares: number;
    activeShares: number;
    inactiveShares: number;
    totalViews: number;
    recentViews: number;
  };
}

export interface VersionTimelineResponse extends ApiResponse {
  noteId: string;
  timeline: Array<{
    id: string;
    version: number;
    title: string;
    changeLog: string;
    createdAt: string;
    createdBy: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
    wordCount: number;
    characterCount: number;
    isLatest: boolean;
    timeFromPrevious: string | null;
    position: number;
    type: string;
  }>;
  summary: {
    totalVersions: number;
    oldestVersion: string;
    newestVersion: string;
    averageTimeBetweenVersions: string | null;
  };
}