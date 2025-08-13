// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string | null;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  };
}

// Note types
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
  workspace?: {
    id: string;
    name: string;
  };
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tags: string[];
  workspaceId: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tags?: string[];
  workspaceId?: string;
}

// Workspace types
export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
}

// Settings types
export interface Settings {
  id: string;
  ownerId: string;
  model: string;
  maxTokens: number;
  autoReembed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsDto {
  model?: string;
  maxTokens?: number;
  autoReembed?: boolean;
}

// Usage types
export interface Usage {
  id: string;
  ownerId: string;
  date: string;
  embeddingTokens: number;
  chatTokens: number;
  createdAt: string;
  updatedAt: string;
}

// Chat types
export interface ChatQueryDto {
  query: string;
  model?: string;
  maxTokens?: number;
}

export interface ChatResponse {
  response: string;
  citations: Citation[];
}

export interface Citation {
  title: string;
  heading?: string;
}

// Vector types
export interface SemanticSearchResult {
  id: string;
  noteId: string;        // This is the note's ID
  chunkId: string;
  chunkContent: string;
  chunkIndex: number;
  heading: string | null;
  embedding: number[];
  ownerId: string;
  createdAt: string;
  noteTitle: string;     // This is populated by the backend
  similarity: number;    // This is calculated similarity score
}

export interface SemanticSearchDto {
  query: string;
  limit?: number;
}

// Profile update
export interface UpdateProfileDto {
  name?: string;
  image?: string;
}

// Auth DTOs
export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

// Search DTOs
export interface SearchNotesDto {
  q: string;
  limit?: number;
}

// Common message interface for chat
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: number;
}

// API Error type
export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

// Google OAuth user
export interface GoogleOAuthUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

// JWT payload
export interface JwtPayload {
  email: string;
  sub: string;
  iat?: number;
  exp?: number;
}

// Auth verification response
export interface AuthVerificationResponse {
  valid: boolean;
  user: User;
}
