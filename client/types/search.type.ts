import { ApiResponse } from ".";

// Base types
export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  filters?: any;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  filters?: any;
  resultCount: number;
  searchedAt: string;
}

export interface SearchSuggestion {
  text: string;
  type: 'history' | 'tag' | 'content';
}

export interface PopularQuery {
  query: string;
  count: number;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  score: number;
  highlights: string[];
  reasons: string[];
  workspace: {
    id: string;
    name: string;
  };
  tags: string[];
  categories: Array<{
    name: string;
    color?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  hasAttachments: boolean;
}

export interface SearchFacets {
  workspaces: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  tags: Array<{
    name: string;
    count: number;
  }>;
  categories: Array<{
    name: string;
    color?: string;
    count: number;
  }>;
  dateRanges: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
    older: number;
  };
  total: number;
}

// Request types
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

export interface QuickSearchRequest {
  query: string;
  limit?: number;
}

export interface SaveSearchRequest {
  name: string;
  query: string;
  filters?: any;
}

// API response types
export interface AdvancedSearchResponse extends ApiResponse {
  query: string;
  results: SearchResult[];
  total: number;
  facets: SearchFacets;
}

export interface QuickSearchResponse extends ApiResponse {
  query: string;
  results: SearchResult[];
  total: number;
}

export interface SearchHistoryResponse extends ApiResponse {
  history: SearchHistory[];
  count: number;
}

export interface PopularQueriesResponse extends ApiResponse {
  searches: PopularQuery[];
}

export interface SearchSuggestionsResponse extends ApiResponse {
  suggestions: SearchSuggestion[];
  query: string;
}

export interface SavedSearchesResponse extends ApiResponse {
  savedSearches: SavedSearch[];
  count: number;
}

export interface SaveSearchResponse extends ApiResponse {
  savedSearch: SavedSearch;
}

export interface SearchAnalyticsResponse extends ApiResponse {
  analytics: {
    totalSearches: number;
    uniqueQueries: number;
    avgResultsPerSearch: number;
    totalSavedSearches: number;
    searchesByDay: Record<string, number>;
    topQueries: PopularQuery[];
    searchTrends: {
      last7Days: number;
      last30Days: number;
    };
  };
}

// Form types
export interface AdvancedSearchFormData {
  query: string;
  workspaceId: string;
  tags: string[];
  dateFrom: string;
  dateTo: string;
  hasAttachments: boolean;
  minWordCount: number;
  maxWordCount: number;
  categories: string[];
  lastModifiedDays: number;
  sortBy: string;
  sortOrder: string;
  limit: number;
}

export interface SaveSearchFormData {
  name: string;
  query: string;
  filters: any;
}
