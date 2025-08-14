import { ApiResponse } from ".";

// Base types
export interface NoteVersion {
  id: string;
  noteId?: string;
  version: number;
  title: string;
  content?: string;
  changeLog: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  note?: {
    id: string;
    currentTitle?: string;
  };
  statistics?: {
    wordCount: number;
    characterCount: number;
    lineCount: number;
  };
  wordCount?: number;
  characterCount?: number;
  isLatest?: boolean;
  timeFromPrevious?: string;
  position?: number;
  type?: string;
}

export interface VersionComparison {
  oldVersion: {
    version: number;
    title: string;
    content: string;
    createdAt: string;
  };
  newVersion: {
    version: number;
    title: string;
    content: string;
    createdAt: string;
  };
  differences: {
    titleChanged: boolean;
    contentDiffs: Array<{
      type: 'added' | 'removed' | 'modified';
      lineNumber: number;
      oldText?: string;
      newText?: string;
      context: string;
    }>;
    statistics: {
      linesAdded: number;
      linesRemoved: number;
      linesModified: number;
      wordsAdded: number;
      wordsRemoved: number;
    };
  };
}

export interface VersionTimeline {
  id: string;
  version: number;
  title: string;
  changeLog: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  wordCount: number;
  characterCount: number;
  isLatest: boolean;
  timeFromPrevious?: string;
  position: number;
  type: string;
}

// Request types
export interface CreateVersionRequest {
  changeLog?: string;
  changeType?: string;
  isAutomatic?: boolean;
}

export interface GetVersionHistoryParams {
  limit?: number;
}

export interface CompareVersionsParams {
  from: number;
  to: number;
}

// API response types
export interface GetVersionHistoryResponse extends ApiResponse {
  noteId: string;
  versions: NoteVersion[];
  count: number;
}

export interface GetVersionResponse extends ApiResponse {
  version: NoteVersion;
}

export interface CreateVersionResponse extends ApiResponse {
  created: boolean;
  version?: NoteVersion;
  existingVersion?: number;
}

export interface CompareVersionsResponse extends ApiResponse {
  comparison: VersionComparison;
}

export interface RestoreVersionResponse extends ApiResponse {
  restoredNote: {
    id: string;
    title: string;
    content: string;
    workspace: {
      id: string;
      name: string;
    };
  };
  restoredFrom: {
    version: number;
    createdAt: string;
  };
}

export interface VersionStatisticsResponse extends ApiResponse {
  noteId: string;
  statistics: {
    totalVersions: number;
    versionsPerDay: number;
    firstVersion: {
      version: number;
      createdAt: string;
    };
    latestVersion: {
      version: number;
      createdAt: string;
      changeLog: string;
    };
    contributorStats: Array<{
      userId: string;
      versionCount: number;
    }>;
  };
}

export interface RecentVersionsResponse extends ApiResponse {
  versions: Array<{
    id: string;
    version: number;
    noteId: string;
    noteTitle: string;
    versionTitle: string;
    changeLog: string;
    createdAt: string;
    createdBy: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
  count: number;
}

export interface VersionTimelineResponse extends ApiResponse {
  noteId: string;
  timeline: VersionTimeline[];
  summary: {
    totalVersions: number;
    oldestVersion: string;
    newestVersion: string;
    averageTimeBetweenVersions?: string;
  };
}

// Form types
export interface CreateVersionFormData {
  changeLog: string;
  changeType: string;
  isAutomatic: boolean;
}
