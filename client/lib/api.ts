import {
  User,
  AuthResponse,
  AuthVerificationResponse,
  RegisterDto,
  LoginDto,
  Note,
  CreateNoteDto,
  UpdateNoteDto,
  SearchNotesDto,
  Workspace,
  CreateWorkspaceDto,
  Settings,
  UpdateSettingsDto,
  Usage,
  ChatQueryDto,
  ChatResponse,
  Citation,
  UpdateProfileDto,
  SemanticSearchResult,
  SemanticSearchDto,
} from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        );
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null as T;
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, error);
    }
  }

  // Auth endpoints - matching AuthController exactly
  auth = {
    register: (data: RegisterDto): Promise<AuthResponse> =>
      this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: LoginDto): Promise<AuthResponse> =>
      this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data), // Fix: Add missing body
      }),

    verify: (): Promise<AuthVerificationResponse> =>
      this.request<AuthVerificationResponse>('/auth/verify'),

    me: (): Promise<User> =>
      this.request<User>('/auth/me'),

    googleAuth: (): void => {
      window.location.href = `${this.baseURL}/auth/google`;
    },
  };

  // Users endpoints - matching UsersController exactly
  users = {
    me: (): Promise<User> =>
      this.request<User>('/users/me'),

    updateProfile: (data: UpdateProfileDto): Promise<User> =>
      this.request<User>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  };

  // Notes endpoints - matching NotesController exactly
  notes = {
    list: (workspaceId?: string, limit?: number): Promise<Note[]> => {
      const params = new URLSearchParams();
      if (workspaceId) params.append('workspaceId', workspaceId);
      if (limit) params.append('limit', limit.toString());
      
      const query = params.toString();
      return this.request<Note[]>(`/notes${query ? `?${query}` : ''}`);
    },

    get: (id: string): Promise<Note> =>
      this.request<Note>(`/notes/${id}`),

    create: (data: CreateNoteDto): Promise<Note> =>
      this.request<Note>('/notes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateNoteDto): Promise<Note> =>
      this.request<Note>(`/notes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<void> =>
      this.request<void>(`/notes/${id}`, {
        method: 'DELETE',
      }),

    search: (params: SearchNotesDto): Promise<Note[]> => {
      const searchParams = new URLSearchParams({ q: params.q });
      if (params.limit) searchParams.append('limit', params.limit.toString());
      
      return this.request<Note[]>(`/notes/search?${searchParams.toString()}`);
    },

    processForRAG: (id: string): Promise<{ message: string }> =>
      this.request<{ message: string }>(`/notes/${id}/process-rag`, {
        method: 'POST',
      }),
  };

  // Workspaces endpoints - matching WorkspacesController exactly
  workspaces = {
    list: (): Promise<Workspace[]> =>
      this.request<Workspace[]>('/workspaces'),

    getDefault: (): Promise<Workspace> =>
      this.request<Workspace>('/workspaces/default'),

    create: (data: CreateWorkspaceDto): Promise<Workspace> =>
      this.request<Workspace>('/workspaces', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // Settings endpoints - matching SettingsController exactly
  settings = {
    get: (): Promise<Settings> =>
      this.request<Settings>('/settings'),

    update: (data: UpdateSettingsDto): Promise<Settings> =>
      this.request<Settings>('/settings', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    getUsage: (days?: number): Promise<Usage[]> => {
      const params = new URLSearchParams();
      if (days) params.append('days', days.toString());
      
      return this.request<Usage[]>(`/settings/usage${params.toString() ? `?${params.toString()}` : ''}`);
    },
  };

  // Chat endpoints - matching ChatController exactly
  chat = {
    stream: async (query: string): Promise<{ stream: ReadableStream; citations: Citation[] }> => {
      const response = await fetch(`${this.baseURL}/chat/stream`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ query } as ChatQueryDto),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || 'Failed to start chat stream',
          response.status,
          errorData
        );
      }

      const citationsHeader = response.headers.get('X-Citations');
      const citations = citationsHeader ? JSON.parse(citationsHeader) as Citation[] : [];

      return {
        stream: response.body!,
        citations,
      };
    },

    complete: (query: string): Promise<ChatResponse> =>
      this.request<ChatResponse>('/chat/complete', {
        method: 'POST',
        body: JSON.stringify({ query } as ChatQueryDto),
      }),

    generateSuggestion: (data: {
      content: string;
      selectedText?: string;
      suggestionType: string;
      targetLanguage?: string;
    }) => this.request<{
      originalText: string;
      suggestion: string;
      type: string;
      hasSelection: boolean;
    }>('/chat/suggest', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    applySuggestion: (data: {
      noteId: string;
      originalContent: string;
      suggestion: string;
      selectedText?: string;
      applyType: 'replace' | 'append' | 'insert';
      position?: number;
    }) => this.request<{
      newContent: string;
      applied: boolean;
      type: string;
    }>('/chat/apply-suggestion', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  };

  // Vectors endpoints - matching VectorsController exactly
  vectors = {
    semanticSearch: (data: SemanticSearchDto): Promise<SemanticSearchResult[]> =>
      this.request<SemanticSearchResult[]>('/vectors/semantic-search', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };
}

export const apiClient = new ApiClient(API_BASE_URL);
