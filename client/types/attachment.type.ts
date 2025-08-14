import { ApiResponse } from ".";

// Base types
export interface Attachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
  category: 'image' | 'document' | 'audio' | 'video' | 'archive';
  ocrText?: string;
  ocrConfidence?: number;
}

export interface AttachmentAnalytics {
  totalAttachments: number;
  totalStorageUsed: number;
  averageFileSize: number;
  typeDistribution: Array<{
    fileType: string;
    count: number;
    category: string;
  }>;
  recentUploads: Array<{
    id: string;
    filename: string;
    note: {
      id: string;
      title: string;
    };
  }>;
  totalRecentUploads: number;
}

export interface SupportedFileTypes {
  [category: string]: {
    mimeTypes: string[];
    maxSize: string;
    description: string;
  };
}

export interface AttachmentSearchResult {
  id: string;
  filename: string;
  fileType: string;
  fileUrl: string;
  note: {
    id: string;
    title: string;
  };
  ocrText?: string;
  relevance: number;
}

// Request types
export interface UploadAttachmentRequest {
  file: File;
  noteId: string;
}

export interface GetAttachmentsParams {
  noteId: string;
}

export interface SearchAttachmentsParams {
  query: string;
  limit?: number;
}

export interface GetAnalyticsParams {
  days?: number;
}

// API response types
export interface UploadAttachmentResponse extends ApiResponse {
  attachment: Attachment;
}

export interface GetAttachmentsResponse extends ApiResponse {
  attachments: Attachment[];
  count: number;
}

export interface DownloadAttachmentResponse {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
}

export interface SearchAttachmentsResponse extends ApiResponse {
  results: AttachmentSearchResult[];
  count: number;
  query: string;
}

export interface GetAnalyticsResponse extends ApiResponse {
  analytics: AttachmentAnalytics;
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

export interface RequestOCRResponse extends ApiResponse {
  attachmentId: string;
}

export interface GetSupportedTypesResponse extends ApiResponse {
  supportedTypes: SupportedFileTypes;
  totalTypes: number;
}

// Form types
export interface UploadAttachmentFormData {
  file: File | null;
  noteId: string;
}
