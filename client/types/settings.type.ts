// Settings type
export interface Settings {
  id: string;
  ownerId: string;
  model: string;
  maxTokens: number;
  autoReembed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Usage tracking type
export interface Usage {
  id: string;
  ownerId: string;
  date: string;
  embeddingTokens: number;
  chatTokens: number;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface UpdateSettingsRequest {
  model?: string;
  maxTokens?: number;
  autoReembed?: boolean;
}

// Query parameters
export interface GetUsageQuery {
  days?: string;
}

// API response types
export type GetSettingsResponse = Settings | null;
export type UpdateSettingsResponse = Settings;
export type GetUsageResponse = Usage[];

// Form types
export interface SettingsFormData {
  model: string;
  maxTokens: number;
  autoReembed: boolean;
}

// Available AI models
export const AI_MODELS = [
  'gemini-1.5-flash',
  'llama3-8b-8192',
  'mixtral-8x7b-32768',
  'gemma-7b-it',
  'gpt-3.5-turbo',
  'gpt-4'
] as const;

export type AIModel = typeof AI_MODELS[number];
