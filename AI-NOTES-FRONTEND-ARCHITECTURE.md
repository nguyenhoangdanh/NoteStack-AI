
```markdown
# AI Notes Frontend Architecture & API Guide

Complete documentation for AI Notes frontend development with types, services, hooks, and API endpoints.

## 📋 System Overview

AI Notes is a comprehensive note-taking application with AI-powered features including:
- **Core Features**: Authentication, Notes CRUD, Workspaces, AI Chat
- **Phase 2A Smart Features**: Categories, Duplicates Detection, Relations, Summaries, Advanced Search  
- **Phase 2B Collaboration**: Sharing, Versions, Templates, Tags, Attachments, Notifications, Activities

## 🏗️ Frontend Architecture

### Layer Structure
```
├── types/           # TypeScript interfaces and types
├── services/        # API client and service layer
├── hooks/           # React Query hooks for state management
├── lib/             # Utilities and configurations
└── contexts/        # React context providers
```

### Core Technologies
- **TypeScript**: Full type safety
- **React Query**: Server state management
- **Custom API Client**: Centralized HTTP client
- **JWT Authentication**: Token-based auth

## 🔧 API Client (lib/apiClient.ts)

### Core Features
```typescript
export class ApiClient {
  // Base configuration
  private baseURL: string = '/api';
  private defaultTimeout: number = 30000;
  private authToken: string | null = null;

  // HTTP Methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T>
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>
  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T>

  // Specialized methods
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T>
  async stream(endpoint: string, data?: any, config?: RequestConfig): Promise<StreamResponse>
  async publicGet<T>(endpoint: string, config?: RequestConfig): Promise<T>
  async publicPost<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>

  // Token management
  setAuthToken(token: string): void
  getAuthToken(): string | null
  removeAuthToken(): void
  isAuthenticated(): boolean
}
```

### Error Handling
```typescript
export class ApiClientError extends Error {
  public statusCode: number;
  public details?: any;

  // Helper methods
  isUnauthorized(): boolean   // 401
  isForbidden(): boolean      // 403
  isNotFound(): boolean       // 404
  isServerError(): boolean    // >= 500
  isTimeout(): boolean        // 408
}
```

## 📡 Service Layer

### Authentication Service (services/auth.service.ts)
```typescript
class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse>
  async login(data: LoginRequest): Promise<AuthResponse>
  async verify(): Promise<AuthVerifyResponse>
  async getMe(): Promise<User>
  
  // Token management
  setToken(token: string): void
  getToken(): string | null
  removeToken(): void
  isAuthenticated(): boolean
  logout(): void
  
  // OAuth
  getGoogleAuthUrl(): string
}
```

### Core Services
```typescript
// User Service
class UserService {
  async getProfile(): Promise<User>
  async updateProfile(data: UpdateUserRequest): Promise<User>
}

// Workspace Service  
class WorkspaceService {
  async getAll(): Promise<Workspace[]>
  async getDefault(): Promise<Workspace | null>
  async create(data: CreateWorkspaceRequest): Promise<Workspace>
}

// Note Service
class NoteService {
  async getAll(params?: GetNotesQuery): Promise<Note[]>
  async getById(id: string): Promise<Note>
  async create(data: CreateNoteRequest): Promise<Note>
  async update(id: string, data: UpdateNoteRequest): Promise<Note>
  async delete(id: string): Promise<void>
  async search(params: SearchNotesQuery): Promise<Note[]>
  async processForRAG(id: string): Promise<{ message: string }>
}

// Vector Service
class VectorService {
  async semanticSearch(data: SemanticSearchRequest): Promise<VectorSearchResult[]>
}

// Chat Service
class ChatService {
  async stream(data: ChatRequest): Promise<StreamResponse>
  async complete(data: ChatRequest): Promise<ChatCompleteResponse>
  async suggest(data: SuggestRequest): Promise<SuggestResponse>
  async applySuggestion(data: ApplySuggestionRequest): Promise<ApplySuggestionResponse>
}

// Settings Service
class SettingsService {
  async get(): Promise<Settings>
  async update(data: UpdateSettingsRequest): Promise<Settings>
  async getUsage(days: number = 30): Promise<Usage[]>
}
```

### Phase 2A Smart Feature Services
```typescript
// Category Service
class CategoryService {
  async getAll(includeAuto: boolean = true): Promise<Category[]>
  async getById(id: string): Promise<Category>
  async create(data: CreateCategoryRequest): Promise<Category>
  async update(id: string, data: Partial<CreateCategoryRequest>): Promise<Category>
  async delete(id: string): Promise<void>
  async suggest(content: string): Promise<CategorySuggestion[]>
  async autoCategorizeNote(noteId: string, data?: AutoCategorizeRequest): Promise<CategorySuggestion[]>
  async getNoteCategories(noteId: string): Promise<CategoryAssignment[]>
  async assignToNote(noteId: string, categoryId: string): Promise<CategoryAssignmentResponse>
  async removeFromNote(noteId: string, categoryId: string): Promise<void>
}

// Duplicate Service
class DuplicateService {
  async detect(params?: DuplicateDetectionParams): Promise<DuplicateDetectionResponse>
  async getReports(params?: DuplicateReportsParams): Promise<DuplicateReportsResponse>
  async createReport(data: CreateDuplicateReportRequest): Promise<{ report: DuplicateReport }>
  async updateReport(id: string, data: UpdateDuplicateReportRequest): Promise<{ report: Partial<DuplicateReport>; message: string }>
  async merge(data: MergeNotesRequest): Promise<MergeNotesResponse>
}

// Relation Service
class RelationService {
  async getRelated(noteId: string, params?: RelatedNotesParams): Promise<RelatedNotesResponse>
  async getStored(noteId: string, params?: StoredRelationsParams): Promise<StoredRelationsResponse>
  async create(noteId: string, data: CreateRelationRequest): Promise<{ relation: RelatedNote; message: string }>
  async analyze(noteId: string, data?: AnalyzeRelationsRequest): Promise<{ jobId: string; estimatedTime: string; noteTitle: string }>
  async getGraph(noteId: string, params?: RelationGraphParams): Promise<RelationGraphResponse>
}

// Summary Service
class SummaryService {
  async get(noteId: string): Promise<AutoSummary>
  async generate(noteId: string, data?: GenerateSummaryRequest): Promise<AutoSummary>
  async delete(noteId: string): Promise<void>
  async batchGenerate(data: BatchGenerateRequest): Promise<BatchGenerateResponse>
  async queue(noteId: string): Promise<QueueSummaryResponse>
  async getStats(): Promise<SummaryStatsResponse>
}

// Search Service
class SearchService {
  async advanced(data: AdvancedSearchRequest): Promise<AdvancedSearchResponse>
  async getHistory(limit?: number): Promise<SearchHistoryResponse>
  async getPopular(limit?: number): Promise<PopularQueriesResponse>
  async getSuggestions(q: string, limit?: number): Promise<SearchSuggestionsResponse>
  async save(data: SaveSearchRequest): Promise<SavedSearch>
  async getSaved(): Promise<SavedSearch[]>
  async deleteSaved(id: string): Promise<void>
}
```

### Phase 2B Collaboration Services
```typescript
// Collaboration Service
class CollaborationService {
  async invite(noteId: string, data: InviteCollaboratorRequest): Promise<Collaboration>
  async getCollaborators(noteId: string): Promise<Collaboration[]>
  async updatePermission(collaborationId: string, data: UpdatePermissionRequest): Promise<Collaboration>
  async remove(collaborationId: string): Promise<void>
  async getMyCollaborations(params?: MyCollaborationsParams): Promise<Collaboration[]>
}

// Share Service
class ShareService {
  async createLink(noteId: string, data?: CreateShareLinkRequest): Promise<ShareLink>
  async getLinks(noteId: string): Promise<ShareLink[]>
  async updateLink(shareId: string, data: Partial<CreateShareLinkRequest>): Promise<ShareLink>
  async deleteLink(shareId: string): Promise<void>
  async accessShared(token: string, password?: string): Promise<SharedNoteResponse>
  async getAnalytics(shareId: string): Promise<ShareLinkAnalyticsResponse>
  async getUserStats(): Promise<UserStatsResponse>
}

// Version Service
class VersionService {
  async getVersions(noteId: string, limit?: number): Promise<NoteVersion[]>
  async getVersion(versionId: string): Promise<NoteVersion>
  async create(noteId: string, data?: { changeLog?: string }): Promise<NoteVersionResponse>
  async restore(versionId: string): Promise<RestoreVersionResponse>
  async compare(versionId: string, compareVersionId: string): Promise<CompareVersionsResponse>
  async getTimeline(noteId: string): Promise<VersionTimelineResponse>
  async getUserStats(): Promise<UserVersionStatsResponse>
}

// Template Service
class TemplateService {
  async getAll(isPublic?: boolean): Promise<Template[]>
  async getById(id: string): Promise<Template>
  async create(data: CreateTemplateRequest): Promise<Template>
  async update(id: string, data: Partial<CreateTemplateRequest>): Promise<Template>
  async delete(id: string): Promise<void>
  async process(templateId: string, variables: Record<string, any>): Promise<ProcessTemplateResponse>
  async duplicate(templateId: string, newName?: string): Promise<Template>
}

// Additional Services
class TagService {
  async getAll(): Promise<Tag[]>
  async create(data: CreateTagRequest): Promise<Tag>
  async update(id: string, data: Partial<CreateTagRequest>): Promise<Tag>
  async delete(id: string): Promise<void>
  async getAnalytics(days?: number): Promise<TagAnalyticsResponse>
  async suggest(noteId: string, content: string): Promise<TagSuggestionResponse>
  async bulkOperation(data: BulkTagOperationRequest): Promise<BulkTagOperationResponse>
}

class AttachmentService {
  async upload(noteId: string, file: File): Promise<Attachment>
  async getByNote(noteId: string): Promise<Attachment[]>
  async delete(id: string): Promise<void>
  async download(attachmentId: string): Promise<DownloadResponse>
  async search(query: string, limit?: number): Promise<AttachmentSearchResponse>
  async getAnalytics(days?: number): Promise<AttachmentAnalyticsResponse>
  async requestOCR(attachmentId: string): Promise<OCRResponse>
  async getSupportedTypes(): Promise<SupportedTypesResponse>
}

class NotificationService {
  async getAll(isRead?: boolean): Promise<Notification[]>
  async markRead(id: string): Promise<void>
  async markAllRead(): Promise<void>
  async delete(id: string): Promise<void>
}

class ActivityService {
  async getAll(params?: ActivityParams): Promise<UserActivity[]>
  async track(data: TrackActivityRequest): Promise<TrackActivityResponse>
  async getStats(): Promise<ActivityStatsResponse>
  async getTrending(params?: TrendingParams): Promise<TrendingResponse>
}
```

## 🎣 React Query Hooks

### Authentication Hooks
```typescript
// Auth hooks
export function useAuthUser(): UseQueryResult<User>           // Get current user
export function useVerifyToken(): UseQueryResult<AuthVerifyResponse>
export function useRegister(): UseMutationResult<AuthResponse, Error, RegisterRequest>
export function useLogin(): UseMutationResult<AuthResponse, Error, LoginRequest>
export function useLogout(): UseMutationResult<boolean, Error, void>
export function useAuthToken(): TokenUtilities
export function useGoogleAuth(): GoogleAuthUtilities
export function useAuthStatus(): AuthStatus

// User hooks
export function useUserProfile(): UseQueryResult<User>
export function useUpdateProfile(): UseMutationResult<User, Error, UpdateUserRequest>
```

### Core Hooks
```typescript
// Workspace hooks
export function useWorkspaces(): UseQueryResult<Workspace[]>
export function useDefaultWorkspace(): UseQueryResult<Workspace | null>
export function useCreateWorkspace(): UseMutationResult<Workspace, Error, CreateWorkspaceRequest>

// Note hooks
export function useNotes(params?: GetNotesQuery): UseQueryResult<Note[]>
export function useNote(noteId: string | null): UseQueryResult<Note | null>
export function useCreateNote(): UseMutationResult<Note, Error, CreateNoteRequest>
export function useUpdateNote(): UseMutationResult<Note, Error, { id: string } & UpdateNoteRequest>
export function useDeleteNote(): UseMutationResult<void, Error, string>
export function useSearchNotes(params: SearchNotesQuery, enabled?: boolean): UseQueryResult<Note[]>
export function useProcessNoteForRAG(): UseMutationResult<{ message: string }, Error, string>

// Vector hooks
export function useSemanticSearch(): UseMutationResult<VectorSearchResult[], Error, SemanticSearchRequest>

// Chat hooks
export function useChatStream(): UseMutationResult<StreamResponse, Error, ChatRequest>
export function useChatComplete(): UseMutationResult<ChatCompleteResponse, Error, ChatRequest>
export function useGenerateSuggestion(): UseMutationResult<SuggestResponse, Error, SuggestRequest>
export function useApplySuggestion(): UseMutationResult<ApplySuggestionResponse, Error, ApplySuggestionRequest>
export function useChat(): CompositeChatHook  // Combines all chat operations

// Settings hooks
export function useSettings(): UseQueryResult<Settings>
export function useUpdateSettings(): UseMutationResult<Settings, Error, UpdateSettingsRequest>
export function useUsage(days?: number): UseQueryResult<Usage[]>
```

### Phase 2A Smart Feature Hooks
```typescript
// Category hooks
export function useCategories(includeAuto?: boolean): UseQueryResult<Category[]>
export function useCategory(id: string | null): UseQueryResult<Category | null>
export function useCreateCategory(): UseMutationResult<Category, Error, CreateCategoryRequest>
export function useUpdateCategory(): UseMutationResult<Category, Error, { id: string } & Partial<CreateCategoryRequest>>
export function useDeleteCategory(): UseMutationResult<void, Error, string>
export function useCategorySuggestions(): UseMutationResult<CategorySuggestion[], Error, string>
export function useAutoCategorizeNote(): UseMutationResult<CategorySuggestion[], Error, { noteId: string; data?: AutoCategorizeRequest }>
export function useNoteCategories(noteId: string | null): UseQueryResult<CategoryAssignment[]>
export function useAssignCategoryToNote(): UseMutationResult<CategoryAssignmentResponse, Error, { noteId: string; categoryId: string }>
export function useRemoveCategoryFromNote(): UseMutationResult<void, Error, { noteId: string; categoryId: string }>

// Duplicate hooks
export function useDuplicateDetection(): UseMutationResult<DuplicateDetectionResponse, Error, DuplicateDetectionParams>
export function useDuplicateReports(params?: DuplicateReportsParams): UseQueryResult<DuplicateReportsResponse>
export function useCreateDuplicateReport(): UseMutationResult<{ report: DuplicateReport }, Error, CreateDuplicateReportRequest>
export function useUpdateDuplicateReport(): UseMutationResult<{ report: Partial<DuplicateReport>; message: string }, Error, { id: string; data: UpdateDuplicateReportRequest }>
export function useMergeNotes(): UseMutationResult<MergeNotesResponse, Error, MergeNotesRequest>

// Relation hooks
export function useRelatedNotes(noteId: string | null, params?: RelatedNotesParams): UseQueryResult<RelatedNotesResponse>
export function useStoredRelations(noteId: string | null, params?: StoredRelationsParams): UseQueryResult<StoredRelationsResponse>
export function useCreateRelation(): UseMutationResult<{ relation: RelatedNote; message: string }, Error, { noteId: string; data: CreateRelationRequest }>
export function useAnalyzeRelations(): UseMutationResult<{ jobId: string; estimatedTime: string; noteTitle: string }, Error, { noteId: string; data?: AnalyzeRelationsRequest }>
export function useRelationsGraph(noteId: string | null, params?: RelationGraphParams): UseQueryResult<RelationGraphResponse>

// Summary hooks
export function useNoteSummary(noteId: string | null): UseQueryResult<AutoSummary | null>
export function useGenerateSummary(): UseMutationResult<AutoSummary, Error, { noteId: string; data?: GenerateSummaryRequest }>
export function useDeleteSummary(): UseMutationResult<void, Error, string>
export function useBatchGenerateSummaries(): UseMutationResult<BatchGenerateResponse, Error, BatchGenerateRequest>
export function useQueueSummaryGeneration(): UseMutationResult<QueueSummaryResponse, Error, string>
export function useSummaryStats(): UseQueryResult<SummaryStatsResponse>

// Search hooks
export function useAdvancedSearch(): UseMutationResult<AdvancedSearchResponse, Error, AdvancedSearchRequest>
export function useSearchHistory(limit?: number): UseQueryResult<SearchHistoryResponse>
export function usePopularQueries(limit?: number): UseQueryResult<PopularQueriesResponse>
export function useSearchSuggestions(q: string, limit?: number, enabled?: boolean): UseQueryResult<SearchSuggestionsResponse>
export function useSaveSearch(): UseMutationResult<SavedSearch, Error, SaveSearchRequest>
export function useSavedSearches(): UseQueryResult<SavedSearch[]>
export function useDeleteSavedSearch(): UseMutationResult<void, Error, string>
```

### Phase 2B Collaboration Hooks
```typescript
// Collaboration hooks
export function useInviteCollaborator(): UseMutationResult<Collaboration, Error, { noteId: string; data: InviteCollaboratorRequest }>
export function useNoteCollaborators(noteId: string | null): UseQueryResult<Collaboration[]>
export function useUpdateCollaboratorPermission(): UseMutationResult<Collaboration, Error, { collaborationId: string; data: UpdatePermissionRequest }>
export function useRemoveCollaborator(): UseMutationResult<void, Error, string>
export function useMyCollaborations(params?: MyCollaborationsParams): UseQueryResult<Collaboration[]>

// Sharing hooks
export function useCreateShareLink(): UseMutationResult<ShareLink, Error, { noteId: string; data?: CreateShareLinkRequest }>
export function useNoteShareLinks(noteId: string | null): UseQueryResult<ShareLink[]>
export function useUpdateShareLink(): UseMutationResult<ShareLink, Error, { shareId: string; data: Partial<CreateShareLinkRequest> }>
export function useDeleteShareLink(): UseMutationResult<void, Error, string>
export function useAccessSharedNote(): UseMutationResult<SharedNoteResponse, Error, { token: string; password?: string }>
export function useShareLinkAnalytics(shareId: string | null): UseQueryResult<ShareLinkAnalyticsResponse>
export function useUserShareStats(): UseQueryResult<UserStatsResponse>

// Version hooks
export function useNoteVersions(noteId: string | null, limit?: number): UseQueryResult<NoteVersion[]>
export function useVersion(versionId: string | null): UseQueryResult<NoteVersion | null>
export function useCreateVersion(): UseMutationResult<NoteVersionResponse, Error, { noteId: string; data?: { changeLog?: string } }>
export function useRestoreVersion(): UseMutationResult<RestoreVersionResponse, Error, string>
export function useCompareVersions(): UseMutationResult<CompareVersionsResponse, Error, { versionId: string; compareVersionId: string }>
export function useVersionTimeline(noteId: string | null): UseQueryResult<VersionTimelineResponse>
export function useUserVersionStats(): UseQueryResult<UserVersionStatsResponse>

// Template hooks
export function useTemplates(isPublic?: boolean): UseQueryResult<Template[]>
export function useTemplate(id: string | null): UseQueryResult<Template | null>
export function useCreateTemplate(): UseMutationResult<Template, Error, CreateTemplateRequest>
export function useUpdateTemplate(): UseMutationResult<Template, Error, { id: string } & Partial<CreateTemplateRequest>>
export function useDeleteTemplate(): UseMutationResult<void, Error, string>

// Additional hooks
export function useTags(): UseQueryResult<Tag[]>
export function useCreateTag(): UseMutationResult<Tag, Error, CreateTagRequest>
export function useUpdateTag(): UseMutationResult<Tag, Error, { id: string } & Partial<CreateTagRequest>>
export function useDeleteTag(): UseMutationResult<void, Error, string>
export function useTagAnalytics(days?: number): UseQueryResult<TagAnalyticsResponse>
export function useTagSuggestions(): UseMutationResult<TagSuggestionResponse, Error, { noteId: string; content: string }>
export function useBulkTagOperation(): UseMutationResult<BulkTagOperationResponse, Error, BulkTagOperationRequest>

export function useNoteAttachments(noteId: string | null): UseQueryResult<Attachment[]>
export function useUploadAttachment(): UseMutationResult<Attachment, Error, { noteId: string; file: File }>
export function useDeleteAttachment(): UseMutationResult<void, Error, string>
export function useSearchAttachments(): UseMutationResult<AttachmentSearchResponse, Error, { query: string; limit?: number }>
export function useAttachmentAnalytics(days?: number): UseQueryResult<AttachmentAnalyticsResponse>

export function useNotifications(isRead?: boolean): UseQueryResult<Notification[]>
export function useMarkNotificationRead(): UseMutationResult<void, Error, string>
export function useMarkAllNotificationsRead(): UseMutationResult<void, Error, void>
export function useDeleteNotification(): UseMutationResult<void, Error, string>

export function useUserActivities(params?: ActivityParams): UseQueryResult<UserActivity[]>
export function useTrackActivity(): UseMutationResult<TrackActivityResponse, Error, TrackActivityRequest>
export function useActivityStats(): UseQueryResult<ActivityStatsResponse>
export function useTrendingActivities(params?: TrendingParams): UseQueryResult<TrendingResponse>
```

### Utility Hooks
```typescript
// UI utility hooks
export function useIsMobile(): boolean
export function useMediaQuery(query: string): boolean
export function useToast(): ToastUtilities
export function useKeyboardShortcuts(): void
```

## 📦 TypeScript Types & Interfaces

### Core Types
```typescript
// Common response wrapper
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

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
  details?: any;
}

// Stream response for chat
export interface Citation {
  title: string;
  heading: string | null;
}

export interface StreamResponse {
  stream: ReadableStream<Uint8Array>;
  citations: Citation[];
}
```

### Authentication Types
```typescript
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthVerifyResponse {
  valid: boolean;
  user: User;
}

export interface UpdateUserRequest {
  name?: string;
  image?: string;
}
```

### Core Entity Types
```typescript
export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
}

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
  workspace?: Workspace;
}

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

export interface GetNotesQuery {
  workspaceId?: string;
  limit?: number;
}

export interface SearchNotesQuery {
  q: string;
  limit?: number;
}

export interface VectorSearchResult {
  id: string;
  noteId: string;
  chunkId: string;
  chunkContent: string;
  chunkIndex: number;
  heading: string | null;
  embedding: number[];
  ownerId: string;
  createdAt: string;
  noteTitle: string;
  similarity: number;
}

export interface SemanticSearchRequest {
  query: string;
  limit?: number;
}
```

### AI & Chat Types
```typescript
export interface ChatRequest {
  query: string;
  model?: string;
  maxTokens?: number;
}

export interface ChatCompleteResponse {
  response: string;
  citations: Citation[];
}

export interface SuggestRequest {
  content: string;
  selectedText?: string;
  suggestionType: 'improve' | 'expand' | 'summarize' | 'restructure' | 'examples' | 'grammar' | 'translate';
  targetLanguage?: string;
}

export interface SuggestResponse {
  originalText: string;
  suggestion: string;
  type: string;
  hasSelection: boolean;
}

export interface ApplySuggestionRequest {
  noteId: string;
  originalContent: string;
  suggestion: string;
  selectedText?: string;
  applyType: 'replace' | 'append' | 'insert';
  position?: number;
}

export interface ApplySuggestionResponse {
  newContent: string;
  applied: boolean;
  type: string;
}

export interface Settings {
  id: string;
  ownerId: string;
  model: AIModel;
  maxTokens: number;
  autoReembed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AIModel = 'gemini-1.5-flash' | 'llama3-8b-8192' | 'mixtral-8x7b-32768' | 'gemma-7b-it' | 'gpt-3.5-turbo' | 'gpt-4';

export interface UpdateSettingsRequest {
  model?: AIModel;
  maxTokens?: number;
  autoReembed?: boolean;
}

export interface Usage {
  id: string;
  ownerId: string;
  date: string;
  embeddingTokens: number;
  chatTokens: number;
  createdAt: string;
  updatedAt: string;
}
```

### Phase 2A Smart Features Types
```typescript
// Categories
export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  keywords: string[];
  ownerId: string;
  isAuto: boolean;
  confidence?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  keywords: string[];
  isAuto?: boolean;
}

export interface CategorySuggestion {
  name: string;
  confidence: number;
  matchingKeywords: string[];
  exists: boolean;
  existingCategoryId?: string;
}

export interface AutoCategorizeRequest {
  threshold?: number;
}

export interface CategoryAssignmentResponse {
  noteId: string;
  categoryId: string;
  confidence?: number;
  isAuto: boolean;
  createdAt: string;
  category: Category;
}

// Duplicates
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
  originalNote: Note;
  duplicateNote: Note;
}

export interface DuplicateDetectionResponse extends ApiResponse {
  count: number;
  duplicates: DuplicateDetection[];
}

export interface DuplicateReportsResponse extends ApiResponse {
  count: number;
  reports: DuplicateReport[];
  statusFilter?: string;
}

export interface MergeNotesRequest {
  originalNoteId: string;
  duplicateNoteId: string;
}

export interface MergeNotesResponse extends ApiResponse {
  mergedNote: Note;
  deletedNoteId: string;
}

// Relations
export interface RelatedNote {
  noteId: string;
  title: string;
  relevance: number;
  type: 'SEMANTIC' | 'CONTEXTUAL' | 'TEMPORAL' | 'REFERENCE';
  excerpt: string;
  reasons: string[];
}

export interface RelatedNotesResponse extends ApiResponse {
  noteId: string;
  count: number;
  relatedNotes: RelatedNote[];
}

// Summaries
export interface AutoSummary {
  id: string;
  noteId: string;
  summary: string;
  keyPoints: string[];
  wordCount: number;
  readingTime: number;
  model: string;
  ownerId: string;
  createdAt: string;
  note?: {
    title: string;
    updatedAt: string;
  };
  isStale?: boolean;
}

export interface GenerateSummaryRequest {
  minWords?: number;
  maxSummaryLength?: number;
  includeKeyPoints?: boolean;
  model?: string;
}

// Search
export interface AdvancedSearchRequest {
  query: string;
  workspaceId?: string;
  tags?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  hasAttachments?: boolean;
  wordCountRange?: {
    min: number;
    max: number;
  };
  categories?: string[];
  lastModifiedDays?: number;
  sortBy?: 'relevance' | 'created' | 'updated' | 'title' | 'size';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface AdvancedSearchResponse extends ApiResponse {
  results: SearchResult[];
  total: number;
  facets: SearchFacets;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  score: number;
  highlights: string[];
  reasons: string[];
  workspace: Workspace;
  tags: string[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  hasAttachments: boolean;
}

export interface SearchFacets {
  workspaces: Array<{ id: string; name: string; count: number }>;
  tags: Array<{ name: string; count: number }>;
  categories: Array<{ name: string; color: string; count: number }>;
  dateRanges: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
    older: number;
  };
  total: number;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  filters: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Phase 2B Collaboration Types
```typescript
// Collaboration
export interface Collaboration {
  id: string;
  noteId: string;
  userId: string;
  permission: 'READ' | 'WRITE' | 'ADMIN';
  createdAt: string;
  user: User;
  note?: Note;
}

export interface InviteCollaboratorRequest {
  email: string;
  permission: 'read' | 'write' | 'admin';
}

// Sharing
export interface ShareLink {
  id: string;
  noteId: string;
  token: string;
  isPublic: boolean;
  expiresAt?: string;
  allowComments: boolean;
  requireAuth: boolean;
  maxViews?: number;
  passwordHash?: string;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShareLinkRequest {
  isPublic?: boolean;
  expiresAt?: string;
  allowComments?: boolean;
  requireAuth?: boolean;
  maxViews?: number;
  password?: string;
}

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

// Versions
export interface NoteVersion {
  id: string;
  noteId: string;
  version: number;
  title: string;
  content: string;
  changeLog: string;
  createdAt: string;
  createdBy: User;
  wordCount: number;
  characterCount: number;
  isLatest: boolean;
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

// Templates
export interface Template {
  id: string;
  name: string;
  description?: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  ownerId: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  content: string;
  tags: string[];
  isPublic?: boolean;
  metadata?: Record<string, any>;
}

// Tags
export interface Tag {
  id: string;
  name: string;
  color?: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
  description?: string;
}

// Attachments
export interface Attachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  noteId: string;
  uploadedAt: string;
  category: 'image' | 'document' | 'audio' | 'video' | 'archive';
  ocrText?: string;
  ocrConfidence?: number;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'collaboration' | 'sharing' | 'system' | 'mention';
  isRead: boolean;
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

// Activities
export interface UserActivity {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'SEARCH';
  noteId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  note?: Note;
  user?: User;
}
```

## 🛠️ Context Providers

### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
  clearError: () => void;
  refetch: () => Promise<void>;
}

export function useAuth(): AuthContextType;
export function useRequireAuth(): { isAuthenticated: boolean; isLoading: boolean };
export function useGuestOnly(): { isAuthenticated: boolean; isLoading: boolean };
```

## 🚀 API Endpoints Reference

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/verify` - Verify JWT token
- `GET /auth/me` - Get current user

### Core Endpoints
- `GET /users/me` - Get user profile
- `PATCH /users/me` - Update user profile
- `GET /workspaces` - Get all workspaces
- `GET /workspaces/default` - Get default workspace
- `POST /workspaces` - Create workspace
- `GET /notes` - Get all notes
- `POST /notes` - Create note
- `GET /notes/search` - Search notes
- `GET /notes/:id` - Get note by ID
- `PATCH /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `POST /notes/:id/process-rag` - Process note for RAG
- `POST /vectors/semantic-search` - Semantic search
- `POST /chat/stream` - Stream chat
- `POST /chat/complete` - Complete chat
- `POST /chat/suggest` - Generate suggestions
- `POST /chat/apply-suggestion` - Apply suggestion
- `GET /settings` - Get settings
- `PATCH /settings` - Update settings
- `GET /settings/usage` - Get usage stats

### Phase 2A Smart Features Endpoints
- **Categories**: `/categories/*` - Full CRUD and AI features
- **Duplicates**: `/duplicates/*` - Detection, reports, and merging
- **Relations**: `/relations/*` - Note relationships and graph
- **Summaries**: `/summaries/*` - AI-powered summaries
- **Search**: `/search/*` - Advanced search and analytics

### Phase 2B Collaboration Endpoints
- **Collaboration**: `/collaboration/*` - User invitations and permissions
- **Sharing**: `/share/*` - Public sharing and analytics
- **Versions**: `/versions/*` - Version control and comparison
- **Templates**: `/templates/*` - Template system
- **Tags**: `/tags/*` - Tag management and analytics
- **Attachments**: `/attachments/*` - File management and OCR
- **Notifications**: `/notifications/*` - User notifications
- **Activities**: `/activities/*` - Activity tracking and analytics

## ⚡ Query Client Configuration

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
```

## 🎯 Key Implementation Guidelines

### Error Handling
1. All services use `ApiClientError` for consistent error handling
2. Hooks automatically handle loading states and error states
3. Authentication errors (401/403) don't retry automatically
4. Network errors fall back gracefully with user feedback

### Cache Management
1. Query keys follow consistent patterns: `['entity', 'operation', params]`
2. Mutations automatically invalidate related queries
3. Optimistic updates for better UX where appropriate
4. Background refetching keeps data fresh

### Type Safety
1. All API calls are fully typed with generics
2. Request/response interfaces match backend exactly
3. Validation errors include field-specific messages
4. Optional vs required fields clearly defined

### Performance Optimization
1. Pagination and infinite scroll support where applicable
2. Debounced search inputs prevent excessive API calls
3. Selective query enabling prevents unnecessary requests
4. Proper dependency arrays in hooks

### Security
1. JWT tokens stored securely with automatic refresh
2. All authenticated requests include Bearer token
3. Public endpoints clearly separated from protected ones
4. User data scoped to authenticated user automatically

---

This comprehensive guide provides everything needed to build the AI Notes frontend with full type safety, proper error handling, and optimal user experience. All APIs, types, and patterns are documented for consistent implementation across the entire application.
```
