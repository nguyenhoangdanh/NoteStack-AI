// Citation type
export interface Citation {
  title: string;
  heading: string | null;
}

// Request types
export interface ChatRequest {
  query: string;
  model?: string;
  maxTokens?: number;
}

export interface SuggestRequest {
  content: string;
  selectedText?: string;
  suggestionType: 'improve' | 'expand' | 'summarize' | 'restructure' | 'examples' | 'grammar' | 'translate';
  targetLanguage?: string;
}

export interface ApplySuggestionRequest {
  noteId: string;
  originalContent: string;
  suggestion: string;
  selectedText?: string;
  applyType: 'replace' | 'append' | 'insert';
  position?: number;
}

// Response types
export interface ChatCompleteResponse {
  response: string;
  citations: Citation[];
}

export interface SuggestResponse {
  originalText: string;
  suggestion: string;
  type: string;
  hasSelection: boolean;
}

export interface ApplySuggestionResponse {
  newContent: string;
  applied: boolean;
  type: string;
}
