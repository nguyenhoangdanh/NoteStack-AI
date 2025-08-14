import { ApiResponse } from ".";

// Base types
export interface UserActivity {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'SEARCH';
  noteId?: string;
  metadata?: any;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  note?: {
    id: string;
    title: string;
  };
}

export interface ActivityStats {
  totalActivities: number;
  recentActivities: {
    last7Days: number;
    last30Days: number;
  };
  byAction: Record<string, number>;
  mostActiveNotes: Array<{
    noteId: string;
    title: string;
    activityCount: number;
  }>;
}

export interface TrendingData {
  notes: Array<{
    noteId: string;
    title: string;
    score: number;
    actions: Record<string, number>;
  }>;
  actions: Array<{
    action: string;
    count: number;
  }>;
}

// Request types
export interface GetUserActivitiesParams {
  limit?: number;
}

export interface GetNoteActivitiesParams {
  limit?: number;
}

export interface TrackActivityRequest {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'SEARCH';
  noteId?: string;
  metadata?: any;
}

export interface GetTrendingParams {
  window?: '24h' | '7d' | '30d';
  limit?: number;
}

export interface QueueAnalyticsRequest {
  windowDays?: number;
  priority?: number;
}

// API response types
export interface GetUserActivitiesResponse extends ApiResponse {
  activities: UserActivity[];
  count: number;
}

export interface GetNoteActivitiesResponse extends ApiResponse {
  noteId: string;
  activities: UserActivity[];
  count: number;
}

export interface TrackActivityResponse extends ApiResponse {
  activity: UserActivity;
}

export interface GetActivityStatsResponse extends ApiResponse {
  stats: ActivityStats;
}

export interface GetTrendingResponse extends ApiResponse {
  trending: TrendingData;
}

export interface QueueAnalyticsResponse extends ApiResponse {
  jobId: string;
}

// Form types
export interface TrackActivityFormData {
  action: string;
  noteId: string;
  metadata: any;
}
