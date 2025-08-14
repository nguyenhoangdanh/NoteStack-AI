import type { Workspace } from './workspace.type';

// Base Note type
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  workspaceId: string;
  ownerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  workspace: {
    id: string;
    name: string;
  };
}

// Request types
export interface CreateNoteRequest {
  title: string;
  content: string;
  tags: string[];
  workspaceId: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  tags?: string[];
  workspaceId?: string;
}

// Query parameters
export interface GetNotesQuery {
  workspaceId?: string;
  limit?: number;
}

export interface SearchNotesQuery {
  q: string;
  limit?: number;
}

// API response types
export type GetNotesResponse = Note[];
export type GetNoteResponse = Note;
export type CreateNoteResponse = Note;
export type UpdateNoteResponse = Note;
export type SearchNotesResponse = Note[];

// Form types
export interface CreateNoteFormData {
  title: string;
  content: string;
  tags: string;
  workspaceId: string;
}

export interface UpdateNoteFormData {
  title: string;
  content: string;
  tags: string;
  workspaceId: string;
}
