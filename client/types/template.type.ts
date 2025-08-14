import { ApiResponse } from ".";

// Base types
export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  metadata?: any;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  usage?: {
    totalUses: number;
  };
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'textarea' | 'date' | 'time' | 'number' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ProcessedTemplate {
  id: string;
  processedContent: string;
  variables?: TemplateVariable[];
}

// Request types
export interface CreateTemplateRequest {
  name: string;
  description: string;
  content: string;
  tags: string[];
  isPublic?: boolean;
  metadata?: any;
}

export interface UpdateTemplateRequest extends Partial<CreateTemplateRequest> {}

export interface ProcessTemplateRequest {
  variables: Record<string, any>;
}

export interface DuplicateTemplateRequest {
  newName?: string;
}

export interface GetTemplatesParams {
  category?: string;
  tags?: string;
  difficulty?: string;
  search?: string;
  limit?: number;
  includePublic?: boolean;
}

export interface GetPublicTemplatesParams {
  category?: string;
  tags?: string;
  difficulty?: string;
  search?: string;
  limit?: number;
}

// API response types
export interface GetTemplatesResponse extends ApiResponse {
  templates: Template[];
  count: number;
  filters?: any;
}

export namespace TemplateTypes {
  export interface GetTemplatesResponse extends ApiResponse {
    templates: Template[];
    count: number;
    filters?: any;
  }
}

// Hoặc đổi tên để tránh conflict
export interface GetTemplatesListResponse extends ApiResponse {
  templates: Template[];
  count: number;
  filters?: any;
}

export interface GetTemplateResponse extends ApiResponse {
  template: Template | null;
}

export interface CreateTemplateResponse extends ApiResponse {
  template: Template;
}

export interface UpdateTemplateResponse extends ApiResponse {
  template: Template;
}

export interface ProcessTemplateResponse extends ApiResponse {
  processed: ProcessedTemplate;
}

export interface DuplicateTemplateResponse extends ApiResponse {
  template: Template;
}

export interface GetTemplateCategoriesResponse extends ApiResponse {
  categories: Array<{
    name: string;
    count: number;
  }>;
}

export interface GetTemplateRecommendationsResponse extends ApiResponse {
  recommendations: Template[];
  count: number;
}

export interface SearchTemplatesResponse extends ApiResponse {
  templates: Template[];
  count: number;
  query: string;
}

export interface GetTemplateStatsResponse extends ApiResponse {
  stats: {
    totalUses: number;
    uniqueUsers: number;
    averageRating: number;
    usageByCategory: any;
    popularVariables: Array<{
      name: string;
      frequency: number;
    }>;
    timeToComplete: number;
  };
}

export interface GetTemplatePreviewResponse extends ApiResponse {
  preview: ProcessedTemplate;
}

// Form types
export interface CreateTemplateFormData {
  name: string;
  description: string;
  content: string;
  tags: string;
  isPublic: boolean;
  metadata: any;
}

export interface UpdateTemplateFormData extends Partial<CreateTemplateFormData> {}

export interface ProcessTemplateFormData {
  variables: Record<string, any>;
}
