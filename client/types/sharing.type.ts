import { ApiResponse } from ".";

// Base types
export interface ShareLink {
  id: string;
  noteId: string;
  token: string;
  url?: string;
  isPublic: boolean;
  expiresAt?: string;
  allowComments: boolean;
  requireAuth: boolean;
  maxViews?: number;
  passwordHash?: string;
  settings?: any;
  createdAt: string;
  updatedAt: string;
  shareViews?: ShareView[];
  _count?: {
    shareViews: number;
  };
}

export interface ShareView {
  id: string;
  shareLinkId: string;
  viewerIp: string;
  viewerAgent: string;
  referrer?: string;
  viewerId?: string;
  isUnique: boolean;
  metadata?: any;
  viewedAt: string;
}

export interface SharedNote {
  note: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
  shareInfo: {
    id: string;
    allowComments: boolean;
    settings?: any;
  };
  author: {
    id: string;
    name: string;
    image?: string;
  };
}

// Request types
export interface CreateShareLinkRequest {
  isPublic?: boolean;
  expiresAt?: string;
  allowComments?: boolean;
  requireAuth?: boolean;
  maxViews?: number;
  password?: string;
}

export interface UpdateShareLinkRequest extends Partial<CreateShareLinkRequest> {}

export interface AccessSharedNoteParams {
  password?: string;
}

// API response types
export interface CreateShareLinkResponse extends ApiResponse {
  shareLink: {
    id: string;
    token: string;
    url: string;
    isPublic: boolean;
    expiresAt?: string;
    settings: {
      allowComments: boolean;
      requireAuth: boolean;
      maxViews?: number;
      hasPassword: boolean;
    };
  };
}

export interface UpdateShareLinkResponse extends ApiResponse {
  shareLink: {
    id: string;
    token: string;
    url: string;
    isPublic: boolean;
    expiresAt?: string;
    updatedAt: string;
  };
}

export interface GetShareLinksResponse extends ApiResponse {
  shareLinks: ShareLink[];
}

export interface AccessSharedNoteResponse extends SharedNote {}

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

export interface UserShareStatsResponse extends ApiResponse {
  stats: {
    totalShares: number;
    activeShares: number;
    inactiveShares: number;
    totalViews: number;
    recentViews: number;
  };
}

// Form types
export interface CreateShareLinkFormData {
  isPublic: boolean;
  expiresAt: string;
  allowComments: boolean;
  requireAuth: boolean;
  maxViews: number;
  password: string;
}

export interface UpdateShareLinkFormData extends Partial<CreateShareLinkFormData> {}
